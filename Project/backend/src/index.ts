import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import {
  createElection,
  deleteElection,
  getElection,
  getElections,
  updateElection,
} from "./controllers/election";
import {
  createParty,
  deleteParty,
  getParty,
  getPartys,
  updateParty,
} from "./controllers/party";
import {
  createParticipation,
  deleteParticipation,
  getParticipationByElectionId,
  getParticipations,
  updateParticipation,
} from "./controllers/participations";
import path from 'path';
import { Validator } from "jsonschema";
import * as fs from 'fs';
import { ObjectId } from "mongodb";

const xmlparser = require("express-xml-bodyparser");
const port = 3000;
const app = express();


const validator = new Validator();
// Load the schema file
const electionSchema = JSON.parse(fs.readFileSync(__dirname + '\\schemes\\json\\election.json', "utf8"));

const allowlist = ['http://localhost:3001']

var corsOptionsDelegate = function (req: any, callback: any) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

// Create a middleware to validate the request against the schema
function validateSchema(schema: any) {
  return (req: any, res: any, next: any) => {
    let obj = JSON.parse(req.body);

    if(!obj.id)
    {
      obj.id = new ObjectId().toString();
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


app.use(cors(corsOptionsDelegate));
app.use(
  bodyParser.raw({
    type: ["application/json", "application/xml"],
  })
);
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

app.get("/elections", getElections);
app.get("/elections/:id", getElection);
app.post("/elections", validateSchema(electionSchema) , createElection);
app.put("/elections", validateSchema(electionSchema), updateElection);
app.delete("/elections/:id", deleteElection);

// Routes for party.
app.get("/partys", getPartys);
app.get("/partys/:id", getParty);
app.post("/partys", createParty);
app.put("/partys", updateParty);
app.delete("/partys/:id", deleteParty);

// Routes for participations.
app.get("/participations", getParticipations);
app.get("/participations/:id", getParticipations);
app.get("/participations/election/:id", getParticipationByElectionId);
app.post("/participations", createParticipation);
app.put("/participations", updateParticipation);
app.delete("/participations/:id", deleteParticipation);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
