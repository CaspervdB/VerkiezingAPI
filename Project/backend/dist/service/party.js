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
exports.dbDeleteParty = exports.dbUpdateParty = exports.dbCreateParty = exports.dbGetParty = exports.dbGetPartys = void 0;
const mongodb_1 = require("mongodb");
const dbName = "mydb";
const url = "mongodb://root:example@localhost:27017/?authSource=admin";
const dbGetPartys = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(url);
    yield client.connect();
    const db = client.db(dbName);
    const collection = db.collection("partys");
    const partys = yield collection.find().toArray();
    yield client.close();
    return partys;
});
exports.dbGetPartys = dbGetPartys;
const dbGetParty = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(url);
    yield client.connect();
    const db = client.db(dbName);
    const collection = db.collection("partys");
    const party = yield collection.findOne({ id });
    yield client.close();
    return party;
});
exports.dbGetParty = dbGetParty;
const dbCreateParty = (party) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(url);
    yield client.connect();
    const db = client.db(dbName);
    const collection = db.collection("partys");
    yield collection.insertOne(Object.assign({}, party));
    yield client.close();
    return party;
});
exports.dbCreateParty = dbCreateParty;
const dbUpdateParty = (party) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(url);
    yield client.connect();
    const db = client.db(dbName);
    const collection = db.collection("partys");
    console.log(1);
    yield collection.updateMany({ id: party.id }, { $set: Object.assign({}, party) });
    console.log(2);
    yield client.close();
    return party;
});
exports.dbUpdateParty = dbUpdateParty;
const dbDeleteParty = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(url);
    yield client.connect();
    const db = client.db(dbName);
    const collection = db.collection("partys");
    const res = yield collection.deleteOne({ id });
    yield client.close();
    return res.deletedCount > 0;
});
exports.dbDeleteParty = dbDeleteParty;
