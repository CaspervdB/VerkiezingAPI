"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToElection = exports.mapToDb = void 0;
const mongodb_1 = require("mongodb");
const mapToElection = (model) => {
    return !model
        ? null
        : {
            name: model.name,
            municipality: model.municipality,
            date: model.date,
            votes: model.votes,
            id: model._id.toString(),
        };
};
exports.mapToElection = mapToElection;
const mapToDb = (model) => {
    return !model
        ? null
        : {
            name: model.name,
            municipality: model.municipality,
            date: model.date,
            votes: model.votes,
            _id: new mongodb_1.ObjectId(model.id),
        };
};
exports.mapToDb = mapToDb;
