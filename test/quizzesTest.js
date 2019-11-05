const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const { MongoClient } = require("mongodb");

const _ = require("lodash");

let server, mongod, url, db, connection, collection, validID;

describe('Quizzes', () => {
    before(async () => {
        try {
            mongod = new MongoMemoryServer({
                instance: {
                    port: 27017,
                    dbPath: "./test/database",
                    dbName: "quizdb" // by default generate random dbName
                }
            });
            url = await mongod.getConnectionString();
            connection = await MongoClient.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            db = connection.db(await mongod.getDbName());
            collection = db.collection("quizzes");
            // Must wait for DB setup to complete BEFORE starting the API server
            server = require("../bin/www");
           // console.log(server)
        } catch (error) {
            console.log(error);
        }
    });

    after(async () => {
        try {
            await connection.close();
            await mongod.stop();
            await server.close()
        } catch (error) {
            console.log(error);
        }
    });

    beforeEach(async () => {
        try {
            await collection.deleteMany({});
            await collection.insertOne({
                "title": "Web Quiz3",
                "creator": "D",
                "date": "2019-10-26",
                "times": 0,
                "questions": [{
                    "id": 1,
                    "types": 0,
                    "question": "Do you like this website?",
                    "answer": ["yes","no","no idea"],
                    "qtext":""
                },
                    {
                        "id": 2,
                        "types": 0,
                        "question": "Do you like this website?",
                        "answer": ["yes","no","no idea"],
                        "qtext":""
                    }]
            });
            await collection.insertOne({
                "title": "Web Quiz4",
                "creator": "D",
                "date": "2019-10-26",
                "times": 0,
                "questions": [{
                    "id": 1,
                    "types": 0,
                    "question": "Do you like this website?",
                    "answer": ["yes","no","no idea"],
                    "qtext":""
                },
                    {
                        "id": 2,
                        "types": 0,
                        "question": "Do you like this website?",
                        "answer": ["yes","no","no idea"],
                        "qtext":""
                    }]
            });
            const quiz = await collection.findOne({ title: "Web Quiz3" });
            validID = quiz._id;
        } catch (error) {
            console.log(error);
        }
    });


    describe("GET /quizzes", () =>{
        it('should return all quizzes', done =>  {
            request(server)
                .get("/quizzes")
                .set("Accept","application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err,res) =>{
                    expect(res.body).to.be.a("array");
                    expect(res.body.length).to.equal(2);
                    const result = _.map(res.body, quiz => {
                        return { title: quiz.title};
                    });
                    expect(result).to.deep.include({ title: "Web Quiz3"});
                    expect(result).to.deep.include({ title: "Web Quiz4"});
                    done(err);
                })
        });
    });

    describe("GET /quizzes/:id",()=>{
        describe("if id is vaild",()=>{
            it('should return the matching quiz', done => {
                request(server)
                    .get(`/quizzes/${validID}`)
                    .set("Accept","application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err,res) =>{
                        expect(res.body).to.have.property("title" , 'Web Quiz3');
                        done(err);
                    })
            });
        })
        describe("if id is invaild",()=>{
            it('should return a wrong message', done=> {
                request(server)
                    .get('/quizzes/adsfsaf')
                    .set("Accept","application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err,res) =>{
                        expect(res.body.message).equals("Not found");
                        done(err);
                    })
            });
        })
    });


    






});