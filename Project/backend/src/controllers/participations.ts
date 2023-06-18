import { Request, Response } from "express";
import { Validator } from "../validators/validator";
import { xmlValidator } from "../validators/xml-validator";
import { jsonValidator } from "../validators/json-validator";
import {
  dbCreateParticipation,
  dbDeleteParticipation,
  dbGetParticipation,
  dbGetParticipations,
  dbGetParticipationsByElectionId,
  dbUpdateParticipation,
} from "../service/participations";
import { json2xml } from "xml-js";

const validators: { [id: string]: Validator } = {
  "application/json": jsonValidator,
  "application/xml": xmlValidator,
};

const contentTypeIsJson = (req: Request): boolean => {
  return req.headers["content-type"] === "application/json";
};

const contentTypeHandler = (
  req: Request,
  res: Response,
  participation: any
) => {
  if (contentTypeIsJson(req)) {
    res.send(participation);
    return;
  }
  res.send(
    json2xml(JSON.stringify({ participation: participation }), {
      compact: true,
      spaces: 1,
    })
  );
};

export const getParticipation = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) return res.status(400).send("No id specified.");
  const participation = await dbGetParticipation(id);
  if (!participation) return res.status(404).send("Participation not found.");
  contentTypeHandler(req, res, participation);
};
export const getParticipationByElectionId = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  if (!id) return res.status(400).send("No id specified.");
  const participation = await dbGetParticipationsByElectionId(id);
  if (!participation) return res.status(404).send("Participation not found.");
  contentTypeHandler(req, res, participation);
};

export const getParticipations = async (req: Request, res: Response) => {
  const allParticipations = await dbGetParticipations();
  if (contentTypeIsJson(req)) {
    res.send(allParticipations);
    return;
  }
  res.send(
    json2xml(JSON.stringify({ participation: allParticipations }), {
      compact: true,
      spaces: 1,
    })
  );
};

const validateParticipation = async (req: Request, res: Response) => {
  // Check if the content type is specified.
  const contentType = req.headers["content-type"];
  if (!contentType) return res.status(400).send("No content type specified.");

  // Check if the content type is supported.
  const rawBody = req.body.toString();
  const validator = validators[contentType];
  if (!validator) return res.status(400).send("Unsupported content type.");

  // Check if the data structure is valid.
  let participation = await validator.validateParticipation(rawBody);
  if (!participation) return res.status(400).send("Invalid data structure.");
  return participation;
};

const baseFunction = (fun: Function) => {
  return async (req: Request, res: Response) => {
    let participation = validateParticipation(req, res);
    participation = await fun(participation);
    res.send(participation);
  };
};

export const createParticipation = baseFunction(dbCreateParticipation);

export const updateParticipation = baseFunction(dbUpdateParticipation);

export const deleteParticipation = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) return res.status(400).send("No id specified.");
  const wasDeleted = await dbDeleteParticipation(id);
  if (!wasDeleted) return res.status(404).send("Participation not found.");
  res.send("Participation has been deleted.");
};
