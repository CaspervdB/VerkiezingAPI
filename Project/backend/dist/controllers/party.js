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
exports.deleteParty = exports.updateParty = exports.createParty = exports.baseFunction = exports.validateParty = exports.getPartys = exports.getParty = void 0;
const xml_validator_1 = require("../validators/xml-validator");
const json_validator_1 = require("../validators/json-validator");
const party_1 = require("../service/party");
const xml_js_1 = require("xml-js");
const validators = {
    "application/json": json_validator_1.jsonValidator,
    "application/xml": xml_validator_1.xmlValidator,
};
const contentTypeIsJson = (req) => {
    return req.headers["content-type"] === "application/json";
};
const contentTypeHandler = (req, res, party) => {
    if (contentTypeIsJson(req)) {
        res.send(party);
        return;
    }
    res.send((0, xml_js_1.json2xml)(JSON.stringify({ party: party }), {
        compact: true,
        spaces: 1,
    }));
};
const getParty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id)
        return res.status(400).send("No id specified.");
    const party = yield (0, party_1.dbGetParty)(id);
    if (!party)
        return res.status(404).send("Party not found.");
    contentTypeHandler(req, res, party);
});
exports.getParty = getParty;
const getPartys = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, party_1.dbGetPartys)());
});
exports.getPartys = getPartys;
const validateParty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentType = req.headers["content-type"];
    if (!contentType)
        return res.status(400).send("No content type specified.");
    // Check if the content type is supported.
    const rawBody = req.body.toString();
    const validator = validators[contentType];
    if (!validator)
        return res.status(400).send("Unsupported content type.");
    // Check if the data structure is valid.
    let party = yield validator.validateParty(rawBody);
    if (!party)
        return res.status(400).send("Invalid data structure.");
    return party;
});
exports.validateParty = validateParty;
const baseFunction = (fun) => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let party = (0, exports.validateParty)(req, res);
        party = yield fun(party);
        res.send(party);
    });
};
exports.baseFunction = baseFunction;
exports.createParty = (0, exports.baseFunction)(party_1.dbCreateParty);
exports.updateParty = (0, exports.baseFunction)(party_1.dbUpdateParty);
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
