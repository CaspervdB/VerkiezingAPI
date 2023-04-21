"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const election_1 = require("./controllers/election");
const port = 3000;
const app = (0, express_1.default)();
// Routes for election.
app.get("/election", election_1.getElection);
app.post("/election", election_1.createElection);
app.put("/election", election_1.updateElection);
app.delete("/election", election_1.deleteElection);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
