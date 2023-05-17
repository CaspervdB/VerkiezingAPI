"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const election_1 = require("./controllers/election");
const party_1 = require("./controllers/party");
const participations_1 = require("./controllers/participations");
const port = 3000;
const app = (0, express_1.default)();
app.use(body_parser_1.default.raw({
    type: "application/*",
}));
// Routes for election.
app.get("/elections", election_1.getElections);
app.get("/elections/:id", election_1.getElection);
app.post("/elections", election_1.createElection);
app.put("/elections", election_1.updateElection);
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
app.post("/participations", participations_1.createParticipation);
app.put("/participations", participations_1.updateParticipation);
app.delete("/participations/:id", participations_1.deleteParticipation);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});