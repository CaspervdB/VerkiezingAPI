"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbDeleteElection = exports.dbUpdateElection = exports.dbCreateElection = exports.dbGetElection = exports.dbGetElections = void 0;
const mongodb_1 = require("mongodb");
const dbName = "mydb";
const url = "mongodb://root:example@localhost:27017/?authSource=admin";
const dbGetElections = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(url);
    yield client.connect();
    const db = client.db(dbName);
    const collection = db.collection("elections");
    const elections = yield collection.find().toArray();
    yield client.close();
    return elections;
});
exports.dbGetElections = dbGetElections;
const dbGetElection = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(url);
    yield client.connect();
    const db = client.db(dbName);
    const collection = db.collection("elections");
    const election = yield collection.findOne({ id });
    yield client.close();
    return election;
});
exports.dbGetElection = dbGetElection;
const dbCreateElection = (election) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(url);
    yield client.connect();
    const db = client.db(dbName);
    const collection = db.collection("elections");
    yield collection.insertOne(Object.assign({}, election));
    yield client.close();
    return election;
});
exports.dbCreateElection = dbCreateElection;
const dbUpdateElection = (election) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(url);
    yield client.connect();
    const db = client.db(dbName);
    const collection = db.collection("elections");
    console.log(1);
    yield collection.updateMany({ id: election.id }, { $set: Object.assign({}, election) });
    console.log(2);
    yield client.close();
    return election;
});
exports.dbUpdateElection = dbUpdateElection;
const dbDeleteElection = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(url);
    yield client.connect();
    const db = client.db(dbName);
    const collection = db.collection("elections");
    const res = yield collection.deleteOne({ id });
    yield client.close();
    return res.deletedCount > 0;
});
exports.dbDeleteElection = dbDeleteElection;
