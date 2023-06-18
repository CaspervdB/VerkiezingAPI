"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToParty = exports.mapPartyToDb = void 0;
const mapToParty = (model) => {
    return !model
        ? null
        : {
            name: model.name,
            id: model._id.toString(),
        };
};
exports.mapToParty = mapToParty;
const mapPartyToDb = (model) => {
    return !model
        ? null
        : {
            name: model.name,
            _id: model.id.toString(),
        };
};
exports.mapPartyToDb = mapPartyToDb;
