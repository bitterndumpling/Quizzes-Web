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
                "times": 11,
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


    describe("POST /quizzes",()=>{
            it('should return a successful message', () => {
                const quiz = {
                    "title": "Web Quiz5",
                    "creator": "D",
                    "date": "2019-10-26",
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
                };
                return request(server)
                    .post("/quizzes")
                    .send(quiz)
                    .expect(200)
                    .then(res => {
                      expect(res.body.message).equals("Added successfully");
                      validID = res.body.data._id;
                    });
            });
            after(() => {
                return request(server)
                    .get(`/quizzes/${validID}`)
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property("title", "Web Quiz5");
                        expect(res.body).to.have.property("times", 0);
                    });
            });

    });

    


    describe("PUT /test/:id", () => {
        describe("when the id is valid", () => {
            it("should return a message and the times add 1", () => {
                return request(server)
                    .put(`/test/${validID}`)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.include({
                            message: "Someone finished testing"
                        });
                        expect(resp.body.data).to.have.property("times", 12);
                    });
            });
            after(() => {
                return request(server)
                    .get(`/quizzes/${validID}`)
                    .set("Accept", "application/json")
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.have.property("times", 12);
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return a 404", () => {
                return request(server)
                    .put("/test/sadjfasjl")
                    .expect(404);
            });
        });
    });









});