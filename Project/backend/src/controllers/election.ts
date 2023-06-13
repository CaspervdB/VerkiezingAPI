import { Request, Response } from "express";

import { Validator } from "../validators/validator";
import { xmlValidator } from "../validators/xml-validator";
import { jsonValidator } from "../validators/json-validator";
import { dbCreateElection, dbDeleteElection, dbGetElection, dbGetElections, dbUpdateElection } from "../service/election";
import { json2xml } from 'xml-js';
import { ErrorResult } from "../models/error";
import { Election } from "../models/election";

const validators: { [id: string]: Validator } = {
    "application/json": jsonValidator,
    "application/xml": xmlValidator
}

const contentTypeIsJson = (req: Request) : boolean => {
    return req.headers['content-type'] === 'application/json';
}

export const getElection = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).send("No id specified.");
    const election = await dbGetElection(id);
    if (!election)
        return res.status(404).send("Election not found.");
    
    if(contentTypeIsJson(req))
    {
        res.send(election);
        return;
    }
    res.send(json2xml(JSON.stringify({ election: election }), { compact: true, spaces: 1}))
}

export const getElections = async (req: Request, res: Response) => {
    const allElections = await dbGetElections();
    if(contentTypeIsJson(req))
    {
        res.send(allElections);
        return;
    }
    
    res.send(json2xml(JSON.stringify({ elections: allElections }), { compact: true, spaces: 1}))
}

export const createElection = async (req: Request, res: Response) => {
    // // Check if the content type is specified.  
    // const contentType = req.headers["content-type"];
    // if (!contentType)
    //     return res.status(400).send("No content type specified.");

    // // Check if the content type is supported.
    // const rawBody = req.body
    // const validator = validators[contentType];
    // if (!validator)  
    //     return res.status(400).send("Unsupported content type.");
    
    // // Check if the data structure is valid.
    // var election = await validator.validateElection(rawBody);
    // // res.send(rawBody).status(200);
    // if (!election)
    //     return res.status(400).send("Invalid data structure.");
    let election = JSON.parse(req.body);
    election = await dbCreateElection(election);
    if(contentTypeIsJson(req))
    {
        res.send(election);
        return;
    }
    res.send(json2xml(JSON.stringify({ election: election }), { compact: true, spaces: 1}))
}

export const updateElection = async (req: Request, res: Response) => {
    // Check if the content type is specified.
    let election = JSON.parse(req.body);
    election = await dbUpdateElection(election);
    if(contentTypeIsJson(req))
    {
        res.send(election);
        return;
    }
    res.send(json2xml(JSON.stringify({ election: election }), { compact: true, spaces: 1}))
}

export const deleteElection = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).send("No id specified.");
    const wasDeleted = await dbDeleteElection(id);
    if (!wasDeleted)
        return res.status(404).send("Election not found.");
    
    const result = {
        message: "Election deleted"
    }
    if(contentTypeIsJson(req))
    {
        res.send(result);
        return;
    }
    res.send(json2xml(JSON.stringify({ result: result }), { compact: true, spaces: 1}))
}
