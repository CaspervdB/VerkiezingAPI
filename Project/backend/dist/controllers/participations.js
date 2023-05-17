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
exports.deleteParticipation = exports.updateParticipation = exports.createParticipation = exports.getParticipations = exports.getParticipation = void 0;
const xml_validator_1 = require("../validators/xml-validator");
const json_validator_1 = require("../validators/json-validator");
const participations_1 = require("../service/participations");
const validators = {
    "application/json": json_validator_1.jsonValidator,
    "application/xml": xml_validator_1.xmlValidator
};
const getParticipation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id)
        return res.status(400).send("No id specified.");
    const participation = yield (0, participations_1.dbGetParticipation)(id);
    if (!participation)
        return res.status(404).send("Participation not found.");
    res.send(participation);
});
exports.getParticipation = getParticipation;
const getParticipations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, participations_1.dbGetParticipations)());
});
exports.getParticipations = getParticipations;
const createParticipation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the content type is specified.
    const contentType = req.headers["content-type"];
    if (!contentType)
        return res.status(400).send("No content type specified.");
    // Check if the content type is supported.
    const rawBody = req.body.toString();
    const validator = validators[contentType];
    if (!validator)
        return res.status(400).send("Unsupported content type.");
    // Check if the data structure is valid.
    var participation = yield validator.validateParticipation(rawBody);
    if (!participation)
        return res.status(400).send("Invalid data structure.");
    participation = yield (0, participations_1.dbCreateParticipation)(participation);
    res.send(participation);
});
exports.createParticipation = createParticipation;
const updateParticipation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the content type is specified.
    const contentType = req.headers["content-type"];
    if (!contentType)
        return res.status(400).send("No content type specified.");
    // Check if the content type is supported.
    const rawBody = req.body.toString();
    const validator = validators[contentType];
    if (!validator)
        return res.status(400).send("Unsupported content type.");
    // Check if the data structure is valid.
    var participation = yield validator.validateParticipation(rawBody);
    if (!participation)
        return res.status(400).send("Invalid data structure.");
    participation = yield (0, participations_1.dbUpdateParticipation)(participation);
    res.send(participation);
});
exports.updateParticipation = updateParticipation;
const deleteParticipation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id)
        return res.status(400).send("No id specified.");
    const wasDeleted = yield (0, participations_1.dbDeleteParticipation)(id);
    if (!wasDeleted)
        return res.status(404).send("Participation not found.");
    res.send("Participation has been deleted.");
});
exports.deleteParticipation = deleteParticipation;
