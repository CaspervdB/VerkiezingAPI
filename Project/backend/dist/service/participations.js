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
exports.dbDeleteParticipation = exports.dbUpdateParticipation = exports.dbCreateParticipation = exports.dbGetParticipation = exports.dbGetParticipations = void 0;
const mongodb_1 = require("mongodb");
const dbName = "mydb";
const url = "mongodb://root:example@localhost:27017/";
const dbGetParticipations = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(url);
    yield client.connect();
    const db = client.db(dbName);
    const collection = db.collection("participations");
    const participations = yield collection.find().toArray();
    yield client.close();
    return participations;
});
exports.dbGetParticipations = dbGetParticipations;
const dbGetParticipation = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(url);
    yield client.connect();
    const db = client.db(dbName);
    const collection = db.collection("participations");
    const participation = yield collection.findOne({ id });
    yield client.close();
    return participation;
});
exports.dbGetParticipation = dbGetParticipation;
const dbCreateParticipation = (participation) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(url);
    yield client.connect();
    const db = client.db(dbName);
    const collection = db.collection("participations");
    yield collection.insertOne(Object.assign({}, participation));
    yield client.close();
    return participation;
});
exports.dbCreateParticipation = dbCreateParticipation;
const dbUpdateParticipation = (participation) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(url);
    yield client.connect();
    const db = client.db(dbName);
    const collection = db.collection("participations");
    console.log(1);
    yield collection.updateMany({ id: participation.id }, { $set: Object.assign({}, participation) });
    console.log(2);
    yield client.close();
    return participation;
});
exports.dbUpdateParticipation = dbUpdateParticipation;
const dbDeleteParticipation = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(url);
    yield client.connect();
    const db = client.db(dbName);
    const collection = db.collection("participations");
    const res = yield collection.deleteOne({ id });
    yield client.close();
    return res.deletedCount > 0;
});
exports.dbDeleteParticipation = dbDeleteParticipation;
