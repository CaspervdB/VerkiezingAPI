import { Request, Response } from "express";

import { Validator } from "../validators/validator";
import { xmlValidator } from "../validators/xml-validator";
import { jsonValidator } from "../validators/json-validator";
import { dbCreateElection, dbDeleteElection, dbGetElection, dbGetElections, dbUpdateElection } from "../service/election";

const validators: { [id: string]: Validator } = {
    "application/json": jsonValidator,
    "application/xml": xmlValidator
}

export const getElection = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).send("No id specified.");
    const election = await dbGetElection(id);
    if (!election)
        return res.status(404).send("Election not found.");
    res.send(election);
}

export const getElections = async (req: Request, res: Response) => {
    res.send(await dbGetElections());
}

export const createElection = async (req: Request, res: Response) => {
    // Check if the content type is specified.
    const contentType = req.headers["content-type"];
    if (!contentType)
        return res.status(400).send("No content type specified.");

    // Check if the content type is supported.
    const rawBody = req.body.toString();
    const validator = validators[contentType];
    if (!validator)
        return res.status(400).send("Unsupported content type.");

    // Check if the data structure is valid.
    var election = await validator.validateElection(rawBody);
    if (!election)
        return res.status(400).send("Invalid data structure.");

    election = await dbCreateElection(election);

    res.send(election);
}

export const updateElection = async (req: Request, res: Response) => {
    // Check if the content type is specified.
    const contentType = req.headers["content-type"];
    if (!contentType)
        return res.status(400).send("No content type specified.");

    // Check if the content type is supported.
    const rawBody = req.body.toString();
    const validator = validators[contentType];
    if (!validator)
        return res.status(400).send("Unsupported content type.");

    // Check if the data structure is valid.
    var election = await validator.validateElection(rawBody);
    if (!election)
        return res.status(400).send("Invalid data structure.");

    election = await dbUpdateElection(election);

    res.send(election);
}

export const deleteElection = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).send("No id specified.");
    const wasDeleted = await dbDeleteElection(id);
    if (!wasDeleted)
        return res.status(404).send("Election not found.");
    res.send("Election has been deleted.");
}
