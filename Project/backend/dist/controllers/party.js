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
exports.deleteParty = exports.updateParty = exports.createParty = exports.getPartys = exports.getParty = void 0;
const xml_validator_1 = require("../validators/xml-validator");
const json_validator_1 = require("../validators/json-validator");
const party_1 = require("../service/party");
const validators = {
    "application/json": json_validator_1.jsonValidator,
    "application/xml": xml_validator_1.xmlValidator
};
const getParty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id)
        return res.status(400).send("No id specified.");
    const party = yield (0, party_1.dbGetParty)(id);
    if (!party)
        return res.status(404).send("Party not found.");
    res.send(party);
});
exports.getParty = getParty;
const getPartys = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, party_1.dbGetPartys)());
});
exports.getPartys = getPartys;
const createParty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    var party = yield validator.validateParty(rawBody);
    if (!party)
        return res.status(400).send("Invalid data structure.");
    party = yield (0, party_1.dbCreateParty)(party);
    res.send(party);
});
exports.createParty = createParty;
const updateParty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    var party = yield validator.validateParty(rawBody);
    if (!party)
        return res.status(400).send("Invalid data structure.");
    party = yield (0, party_1.dbUpdateParty)(party);
    res.send(party);
});
exports.updateParty = updateParty;
const deleteParty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id)
        return res.status(400).send("No id specified.");
    const wasDeleted = yield (0, party_1.dbDeleteParty)(id);
    if (!wasDeleted)
        return res.status(404).send("Party not found.");
    res.send("Party has been deleted.");
});
exports.deleteParty = deleteParty;
