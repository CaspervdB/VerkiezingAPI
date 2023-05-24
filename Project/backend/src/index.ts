import express, { Request, Response } from "express";
import bodyParser from "body-parser";

import {createElection, deleteElection, getElection, getElections, updateElection} from "./controllers/election";
import { createParty, deleteParty, getParty, getPartys, updateParty } from "./controllers/party";
import { createParticipation, deleteParticipation, getParticipations, updateParticipation } from "./controllers/participations";
const xmlparser = require('express-xml-bodyparser');
const port = 3000;
const app = express();

// app.use(express.json());
// app.use(xmlparser());
app.use(bodyParser.raw({
    type: ["application/json", "application/xml"], 
}));
app.use((req, res, next) => {
    switch(req.headers['content-type'])
    {
        case "application/json":
        case "application/xml":
            next();
            return;
        default:
            res.status(400).send("No content type specified.");
            break;
    }
})
// Routes for election.
app.get("/elections", getElections);
app.get("/elections/:id", getElection);
app.post("/elections", createElection);
app.put("/elections", updateElection);
app.delete("/elections/:id", deleteElection)

// Routes for party.
app.get("/partys", getPartys);
app.get("/partys/:id", getParty);
app.post("/partys", createParty);
app.put("/partys", updateParty);
app.delete("/partys/:id", deleteParty)

// Routes for participations.
app.get("/participations", getParticipations);
app.get("/participations/:id", getParticipations);
app.post("/participations", createParticipation);
app.put("/participations", updateParticipation);
app.delete("/participations/:id", deleteParticipation)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
