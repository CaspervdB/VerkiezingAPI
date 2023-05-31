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
exports.jsonValidator = void 0;
const jsonschema_1 = __importDefault(require("jsonschema"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mongodb_1 = require("mongodb");
const schemesPath = path_1.default.join(__dirname, "..", "schemes", "json");
exports.jsonValidator = {
    validateElection: (raw) => __awaiter(void 0, void 0, void 0, function* () {
        const v = new jsonschema_1.default.Validator();
        const obj = JSON.parse(raw);
        if (!obj.id)
            obj.id = new mongodb_1.ObjectId();
        const scheme = JSON.parse(fs_1.default.readFileSync(schemesPath + "/election.json", "utf8"));
        const isValid = v.validate(obj, scheme).valid;
        if (!isValid)
            return null;
        return obj;
    }),
    validateParty: (raw) => __awaiter(void 0, void 0, void 0, function* () {
        const v = new jsonschema_1.default.Validator();
        const obj = JSON.parse(raw);
        if (!obj.id)
            obj.id = (0, uuid_1.v4)();
        const scheme = JSON.parse(fs_1.default.readFileSync(schemesPath + "/party.json", "utf8"));
        const isValid = v.validate(obj, scheme).valid;
        if (!isValid)
            return null;
        return obj;
    }),
    validateParticipation: (raw) => __awaiter(void 0, void 0, void 0, function* () {
        const v = new jsonschema_1.default.Validator();
        const obj = JSON.parse(raw);
        if (!obj.id)
            obj.id = (0, uuid_1.v4)();
        const scheme = JSON.parse(fs_1.default.readFileSync(schemesPath + "/participation.json", "utf8"));
        const isValid = v.validate(obj, scheme).valid;
        if (!isValid)
            return null;
        return obj;
    })
};
