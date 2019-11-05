const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const { MongoClient } = require("mongodb");

const _ = require("lodash");

let server, mongod, url, db, connection, collection, validID,validName;

describe('Users', () => {
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
            collection = db.collection("users");
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
            await collection.insertOne({"email": "1dasfsaf891@gmail.com", "user": "abc", "password": 123456});
            await collection.insertOne({"email": "abdfsafsad1@gmail.com", "user": "tof", "password": 123456});
            const user = await collection.findOne({user: "abc"});
            validID = user._id;
            validName = user.user;
        } catch (error) {
            console.log(error);
        }
    });



    describe("GET /users", () =>{
        it('should return all users', done =>  {
            request(server)
                .get("/users")
                .set("Accept","application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err,res) =>{
                    expect(res.body).to.be.a("array");
                    expect(res.body.length).to.equal(2);
                    const result = _.map(res.body, user => {
                        return { user: user.user};
                    });
                    expect(result).to.deep.include({ user: "abc"});
                    expect(result).to.deep.include({ user: "tof"});
                    done(err);
                })
        });
    });




    describe("GET /users/:name",()=>{
            it('should return the matching user', done=> {
                request(server)
                    .get(`/users/${validName}`)
                    .set("Accept","application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err,res) =>{
                        expect(res.body).to.have.property("user" , 'abc');
                        done();
                    })
            });

    });




    describe("DELETE users/:name",() =>{
        describe("when the name is vaild",()=>{
            it('should return a message and delete the user', () => {
                return request(server)
                    .delete(`/users/${validName}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(res =>{
                        expect(res.body.message).equals("Delete successfully");
                    })
            });
            after(() => {
                return request(server)
                    .get(`/users/${validName}`)
                    .set("Accept", "application/json")
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.be.null;
                    });
            });
        });
        describe("when the id is invaild",()=>{
            it('should return a wrong message', done=> {
                request(server)
                    .delete(`/users/dafsadfsa`)
                    .expect(200)
                    .end((err,res) =>{
                        expect(res.body.message).equals("Not found");
                        done(err);
                    })
            });
        })
    });



    describe("PUT /users/pwd",()=>{
        it('should return message and change password',  ()=> {
        const pwd = {"email": "1dasfsaf891@gmail.com", "user": "abc", "password": "12345689077"}
            request(server)
                .put('/users/pwd')
                .send(pwd)
                .expect(200)
                .then(res => {
                    expect(res.body.message).equals("Update successfully");
                    validName = res.body.data.user;
                });
        });
        after(done => {
            request(server)
                .get(`/users/${validName}`)
                .set("Accept","application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err,res) =>{
                    expect(res.body).to.have.property("password" , '12345689077');
                    done();
                })
        });

    });


    describe("POST /users/register",()=>{
        describe("if message is valid",()=>{
            it('should return a message and ', done=> {
                const msg = {"email": "1634894891@gmail.com", "user": "bbb", "password": 123456};
                request(server)
                    .post(`/users/register`)
                    .send(msg)
                    .expect(200)
                    .end((err,res) =>{
                        expect(res.body.message).to.equals("register successfully");
                        validName = res.body.data.user;
                        done();
                    })
            });
            after(done=>{
                request(server)
                    .get(`/users/${validName}`)
                    .set("Accept","application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err,res) =>{
                        expect(res.body).to.have.property("user" , 'bbb');
                        done();
                    })
            })
        })

        describe("if username has been used",()=>{
            it('should return a error message', done=> {
                const msg = {"email": "1634894891@gmail.com", "user": "abc", "password": 123456};
                request(server)
                    .post(`/users/register`)
                    .send(msg)
                    .expect(200)
                    .end((err,res) =>{
                        expect(res.body.message).to.equals("Username has been register");
                        done();
                    })
            });
        })
    })


});

