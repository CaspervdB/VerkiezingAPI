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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmlValidator = void 0;
const libxmljs2_xsd_1 = __importDefault(require("libxmljs2-xsd"));
const xml2js_1 = __importDefault(require("xml2js"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const schemesPath = path_1.default.join(__dirname, "..", "..", "resources", "schemes", "xml");
const parse = (raw) => __awaiter(void 0, void 0, void 0, function* () {
    const parser = new xml2js_1.default.Parser();
    return new Promise((resolve, reject) => {
        parser.parseString(raw, (err, result) => {
            if (err) {
                reject(null);
            }
            else {
                resolve(result);
            }
        });
    });
});
exports.xmlValidator = {
    validateElection: (raw) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let scheme = libxmljs2_xsd_1.default.parseFile(schemesPath + "/election.xsd");
            let errors = scheme.validate(raw);
            if (errors)
                return null;
            const obj = yield parse(raw);
            if (!obj)
                return null;
            let id = obj["Election"]["Id"];
            if (!id)
                id = (0, uuid_1.v4)();
            else
                id = id[0];
            const election = {
                id: id,
                name: obj["Election"]["ElectionName"][0],
                municipality: obj["Election"]["Municipality"][0],
                date: obj["Election"]["Date"][0],
                votes: obj["Election"]["Votes"][0],
            };
            return election;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }),
    validateParty: (raw) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let scheme = libxmljs2_xsd_1.default.parseFile(schemesPath + "/party.xsd");
            let errors = scheme.validate(raw);
            if (errors)
                return null;
            const obj = yield parse(raw);
            if (!obj)
                return null;
            let id = obj["Party"]["Id"];
            if (!id)
                id = (0, uuid_1.v4)();
            else
                id = id[0];
            const election = {
                id: id,
                name: obj["Party"]["PartyName"][0],
            };
            return election;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }),
    validateParticipation: (raw) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let scheme = libxmljs2_xsd_1.default.parseFile(schemesPath + "/participation.xsd");
            let errors = scheme.validate(raw);
            if (errors)
                return null;
            const obj = yield parse(raw);
            if (!obj)
                return null;
            let id = obj["Participation"]["Id"];
            if (!id)
                id = (0, uuid_1.v4)();
            else
                id = id[0];
            const election = {
                id: id,
                electionId: obj["Participation"]["ElectionId"][0],
                partyId: obj["Participation"]["PartyId"][0],
                votes: obj["Participation"]["Votes"][0],
                name: "",
            };
            return election;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }),
};
