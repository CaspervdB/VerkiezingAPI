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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const election_1 = require("./controllers/election");
const party_1 = require("./controllers/party");
const participations_1 = require("./controllers/participations");
const jsonschema_1 = require("jsonschema");
const fs = __importStar(require("fs"));
const mongodb_1 = require("mongodb");
const xmlparser = require("express-xml-bodyparser");
const port = 3000;
const app = (0, express_1.default)();
const validator = new jsonschema_1.Validator();
// Load the schema file
const electionSchema = JSON.parse(fs.readFileSync(__dirname + '\\schemes\\json\\election.json', "utf8"));
const allowlist = ['http://localhost:3001'];
var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
    }
    else {
        corsOptions = { origin: false }; // disable CORS for this request
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
};
// Create a middleware to validate the request against the schema
function validateSchema(schema) {
    return (req, res, next) => {
        let obj = JSON.parse(req.body);
        if (!obj.id) {
            obj.id = new mongodb_1.ObjectId().toString();
        }
        const body = JSON.stringify(obj);
        const validationResult = validator.validate(obj, schema);
        if (!validationResult.valid) {
            return res.status(400).json({ error: validationResult.errors });
        }
        req.body = body;
        next();
    };
}
app.use((0, cors_1.default)(corsOptionsDelegate));
app.use(body_parser_1.default.raw({
    type: ["application/json", "application/xml"],
}));
app.use((req, res, next) => {
    switch (req.headers["content-type"]) {
        case "application/json":
        case "application/xml":
            next();
            return;
        default:
            res.status(400).send("No content type specified.");
            break;
    }
});
app.get("/elections", election_1.getElections);
app.get("/elections/:id", election_1.getElection);
app.post("/elections", validateSchema(electionSchema), election_1.createElection);
app.put("/elections", validateSchema(electionSchema), election_1.updateElection);
app.delete("/elections/:id", election_1.deleteElection);
// Routes for party.
app.get("/partys", party_1.getPartys);
app.get("/partys/:id", party_1.getParty);
app.post("/partys", party_1.createParty);
app.put("/partys", party_1.updateParty);
app.delete("/partys/:id", party_1.deleteParty);
// Routes for participations.
app.get("/participations", participations_1.getParticipations);
app.get("/participations/:id", participations_1.getParticipations);
app.get("/participations/election/:id", participations_1.getParticipationByElectionId);
app.post("/participations", participations_1.createParticipation);
app.put("/participations", participations_1.updateParticipation);
app.delete("/participations/:id", participations_1.deleteParticipation);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
