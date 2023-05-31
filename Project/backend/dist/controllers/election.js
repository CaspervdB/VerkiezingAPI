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
exports.deleteElection = exports.updateElection = exports.createElection = exports.getElections = exports.getElection = void 0;
const xml_validator_1 = require("../validators/xml-validator");
const json_validator_1 = require("../validators/json-validator");
const election_1 = require("../service/election");
const xml_js_1 = require("xml-js");
const validators = {
    "application/json": json_validator_1.jsonValidator,
    "application/xml": xml_validator_1.xmlValidator
};
const contentTypeIsJson = (req) => {
    return req.headers['content-type'] === 'application/json';
};
const getElection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id)
        return res.status(400).send("No id specified.");
    const election = yield (0, election_1.dbGetElection)(id);
    if (!election)
        return res.status(404).send("Election not found.");
    if (contentTypeIsJson(req)) {
        res.send(election);
        return;
    }
    res.send((0, xml_js_1.json2xml)(JSON.stringify({ election: election }), { compact: true, spaces: 1 }));
});
exports.getElection = getElection;
const getElections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allElections = yield (0, election_1.dbGetElections)();
    if (contentTypeIsJson(req)) {
        res.send(allElections);
        return;
    }
    res.send((0, xml_js_1.json2xml)(JSON.stringify({ elections: allElections }), { compact: true, spaces: 1 }));
});
exports.getElections = getElections;
const createElection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the content type is specified.  
    const contentType = req.headers["content-type"];
    if (!contentType)
        return res.status(400).send("No content type specified.");
    // Check if the content type is supported.
    const rawBody = req.body;
    const validator = validators[contentType];
    if (!validator)
        return res.status(400).send("Unsupported content type.");
    // Check if the data structure is valid.
    yield validator.validateElection(rawBody);
    res.send(rawBody).status(200);
    // if (!election)
    //     return res.status(400).send("Invalid data structure.");
    // election = await dbCreateElection(election);
    // if(contentTypeIsJson(req))
    // {
    //     res.send(election);
    //     return;
    // }
    // res.send(json2xml(JSON.stringify({ election: election }), { compact: true, spaces: 1}))
});
exports.createElection = createElection;
const updateElection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the content type is specified.
    const contentType = req.headers["content-type"];
    if (!contentType)
        return res.status(400).send("No content type specified.");
    // Check if the content type is supported.
    const rawBody = req.body;
    const validator = validators[contentType];
    if (!validator)
        return res.status(400).send("Unsupported content type.");
    // Check if the data structure is valid.
    let election = yield validator.validateElection(rawBody);
    if (!election)
        return res.status(400).send("Invalid data structure.");
    res.send(rawBody);
    // election = await dbUpdateElection(election);
    // if(contentTypeIsJson(req))
    // {
    //     res.send(election);
    //     return;
    // }
    // res.send(json2xml(JSON.stringify({ election: election }), { compact: true, spaces: 1}))
});
exports.updateElection = updateElection;
const deleteElection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id)
        return res.status(400).send("No id specified.");
    const wasDeleted = yield (0, election_1.dbDeleteElection)(id);
    if (!wasDeleted)
        return res.status(404).send("Election not found.");
    const result = {
        message: "Election deleted"
    };
    if (contentTypeIsJson(req)) {
        res.send(result);
        return;
    }
    res.send((0, xml_js_1.json2xml)(JSON.stringify({ result: result }), { compact: true, spaces: 1 }));
});
exports.deleteElection = deleteElection;
