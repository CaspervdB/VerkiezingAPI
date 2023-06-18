import { Request, Response } from "express";

import { Validator } from "../validators/validator";
import { xmlValidator } from "../validators/xml-validator";
import { jsonValidator } from "../validators/json-validator";
import {
  dbCreateParty,
  dbDeleteParty,
  dbGetParty,
  dbGetPartys,
  dbUpdateParty,
} from "../service/party";
import { json2xml } from "xml-js";

const validators: { [id: string]: Validator } = {
  "application/json": jsonValidator,
  "application/xml": xmlValidator,
};

const contentTypeIsJson = (req: Request): boolean => {
  return req.headers["content-type"] === "application/json";
};

const contentTypeHandler = (req: Request, res: Response, party: any) => {
  if (contentTypeIsJson(req)) {
    res.send(party);
    return;
  }
  res.send(
    json2xml(JSON.stringify({ party: party }), {
      compact: true,
      spaces: 1,
    })
  );
};

export const getParty = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) return res.status(400).send("No id specified.");
  const party = await dbGetParty(id);
  if (!party) return res.status(404).send("Party not found.");
  contentTypeHandler(req, res, party);
};

export const getPartys = async (req: Request, res: Response) => {
  res.send(await dbGetPartys());
};

const validateParty = async (req: Request, res: Response) => {
  const contentType = req.headers["content-type"];
  if (!contentType) return res.status(400).send("No content type specified.");

  // Check if the content type is supported.
  const rawBody = req.body.toString();
  const validator = validators[contentType];
  if (!validator) return res.status(400).send("Unsupported content type.");

  // Check if the data structure is valid.
  let party = await validator.validateParty(rawBody);
  if (!party) return res.status(400).send("Invalid data structure.");
  return party;
};

const baseFunction = (fun: Function) => {
  return async (req: Request, res: Response) => {
    let party = validateParty(req, res);
    party = await fun(party);
    res.send(party);
  };
};

export const createParty = baseFunction(dbCreateParty);

export const updateParty = baseFunction(dbUpdateParty);

export const deleteParty = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) return res.status(400).send("No id specified.");
  const wasDeleted = await dbDeleteParty(id);
  if (!wasDeleted) return res.status(404).send("Party not found.");
  res.send("Party has been deleted.");
};
