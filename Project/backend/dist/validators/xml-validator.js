"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
// @ts-ignore
const libxmljs2_xsd_1 = __importDefault(require("libxmljs2-xsd"));
const fs_1 = __importDefault(require("fs"));
const xsd2 = __importStar(require("libxmljs"));
const xml2js_1 = __importDefault(require("xml2js"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const mongodb_1 = require("mongodb");
const schemesPath = path_1.default.join(__dirname, "..", "schemes", "xml");
const parse = (raw) => __awaiter(void 0, void 0, void 0, function* () {
    const parser = new xml2js_1.default.Parser();
    return new Promise((resolve, reject) => {
        parser.parseString(raw, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
});
function xmlDoc2json(node) {
    const result = {};
    if (node.attrs().length > 0) {
        result['@attributes'] = {};
        for (const attr of node.attrs()) {
            result['@attributes'][attr.name()] = attr.value();
        }
    }
    if (node.childNodes().length === 0) {
        result['@value'] = node.text();
    }
    else {
        for (const childNode of node.childNodes()) {
            if (childNode.type() === 'element') {
                if (!result[childNode.name()]) {
                    result[childNode.name()] = [];
                }
                result[childNode.name()].push(xmlDoc2json(childNode));
            }
        }
    }
    return result;
}
const xsdGetter = (path) => {
    return fs_1.default.readFileSync(path, "utf-8");
};
exports.xmlValidator = {
    validateElection: (raw) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // let scheme = xsd.parseXml();
            // let xml = xsd.parseXml(raw);
            // let errors = scheme.validate(raw);
            const scheme = xsd2.parseXml(xsdGetter(schemesPath + "/election.xsd"));
            const xml = xsd2.parseXml(raw);
            const errors = scheme.validate(xml);
            if (errors)
                return null;
            const obj = xmlDoc2json(xml);
            if (!obj)
                return null;
            let id = obj["Election"]["id"];
            if (!id)
                obj.id = new mongodb_1.ObjectId();
            else
                id = id[0];
            return null;
            // const election: Election = {
            //     id: id,
            //     name: obj["Election"]["ElectionName"][0],
            //     municipality: obj["Election"]["Municipality"][0],
            //     date: obj["Election"]["Date"][0],
            //     votes: obj["Election"]["Votes"][0]
            // }
            // return election;
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
            };
            return election;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }),
};
