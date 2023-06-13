import { Request, Response } from "express";

import { Validator } from "../validators/validator";
import { xmlValidator } from "../validators/xml-validator";
import { jsonValidator } from "../validators/json-validator";
import { dbCreateParticipation, dbDeleteParticipation, dbGetParticipation, dbGetParticipations, dbGetParticipationsByElectionId, dbUpdateParticipation } from "../service/participations";

const validators: { [id: string]: Validator } = {
    "application/json": jsonValidator,
    "application/xml": xmlValidator
}

export const getParticipation = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).send("No id specified.");
    const participation = await dbGetParticipation(id);
    if (!participation)
        return res.status(404).send("Participation not found.");
    res.send(participation);
}
export const getParticipationByElectionId = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).send("No id specified.");
    const participation = await dbGetParticipationsByElectionId(id);
    if (!participation)
        return res.status(404).send("Participation not found.");
    res.send(participation);
}

export const getParticipations = async (req: Request, res: Response) => {
    res.send(await dbGetParticipations());
}

export const createParticipation = async (req: Request, res: Response) => {
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
    var participation = await validator.validateParticipation(rawBody);
    if (!participation)
        return res.status(400).send("Invalid data structure.");

    participation = await dbCreateParticipation(participation);

    res.send(participation);
}

export const updateParticipation = async (req: Request, res: Response) => {
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
    var participation = await validator.validateParticipation(rawBody);
    if (!participation)
        return res.status(400).send("Invalid data structure.");

    participation = await dbUpdateParticipation(participation);

    res.send(participation);
}

export const deleteParticipation = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).send("No id specified.");
    const wasDeleted = await dbDeleteParticipation(id);
    if (!wasDeleted)
        return res.status(404).send("Participation not found.");
    res.send("Participation has been deleted.");
}
