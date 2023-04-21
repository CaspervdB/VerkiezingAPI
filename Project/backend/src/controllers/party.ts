import { Request, Response } from "express";

import { Validator } from "../validators/validator";
import { xmlValidator } from "../validators/xml-validator";
import { jsonValidator } from "../validators/json-validator";
import { dbCreateParty, dbDeleteParty, dbGetParty, dbGetPartys, dbUpdateParty } from "../service/party";

const validators: { [id: string]: Validator } = {
    "application/json": jsonValidator,
    "application/xml": xmlValidator
}

export const getParty = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).send("No id specified.");
    const party = await dbGetParty(id);
    if (!party)
        return res.status(404).send("Party not found.");
    res.send(party);
}

export const getPartys = async (req: Request, res: Response) => {
    res.send(await dbGetPartys());
}

export const createParty = async (req: Request, res: Response) => {
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
    var party = await validator.validateParty(rawBody);
    if (!party)
        return res.status(400).send("Invalid data structure.");

    party = await dbCreateParty(party);

    res.send(party);
}

export const updateParty = async (req: Request, res: Response) => {
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
    var party = await validator.validateParty(rawBody);
    if (!party)
        return res.status(400).send("Invalid data structure.");

    party = await dbUpdateParty(party);

    res.send(party);
}

export const deleteParty = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).send("No id specified.");
    const wasDeleted = await dbDeleteParty(id);
    if (!wasDeleted)
        return res.status(404).send("Party not found.");
    res.send("Party has been deleted.");
}
