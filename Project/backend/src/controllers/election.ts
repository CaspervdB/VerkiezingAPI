import { Request, Response } from "express";
import { Validator } from "../validators/validator";
import { xmlValidator } from "../validators/xml-validator";
import { jsonValidator } from "../validators/json-validator";
import {
  dbCreateElection,
  dbDeleteElection,
  dbGetElection,
  dbGetElections,
  dbUpdateElection,
} from "../service/election";
import { toXML } from "jstoxml";

const validators: { [id: string]: Validator } = {
  "application/json": jsonValidator,
  "application/xml": xmlValidator,
};

const contentTypeIsJson = (req: Request): boolean => {
  return req.headers["content-type"] === "application/json";
};

const contentTypeHandler = (req: Request, res: Response, election: any) => {
  if (contentTypeIsJson(req)) {
    res.send(election);
    return;
  }
  res.send(
    toXML(election, {
      indent: "  ",
    })
  );
};

export const getElection = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) return res.status(400).send("No id specified.");
  const election = await dbGetElection(id);
  if (!election) return res.status(404).send("Election not found.");
  contentTypeHandler(req, res, election);
};

export const getElections = async (req: Request, res: Response) => {
  const allElections = await dbGetElections();
  if (contentTypeIsJson(req)) {
    res.send(allElections);
    return;
  }

  res.send(
    toXML(
      {
        ...allElections,
      },
      {
        indent: "  ",
      }
    )
  );
};

const validateElection = async (req: Request, res: Response) => {
  // Check if the content type is specified.
  const contentType = req.headers["content-type"];
  if (!contentType) return res.status(400).send("No content type specified.");

  // Check if the content type is supported.
  const rawBody = req.body.toString();
  const validator = validators[contentType];
  if (!validator) return res.status(400).send("Unsupported content type.");

  // Check if the data structure is valid.
  let election = await validator.validateElection(rawBody);
  if (!election) return res.status(400).send("Invalid data structure.");
  return election;
};

export const baseFunction = (fun: Function) => {
  return async (req: Request, res: Response) => {
    let election = validateElection(req, res);
    election = await fun(election);

    res.send(election);
  };
};

export const createElection = baseFunction(dbCreateElection);

export const updateElection = baseFunction(dbUpdateElection);

export const deleteElection = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) return res.status(400).send("No id specified.");
  const wasDeleted = await dbDeleteElection(id);
  if (!wasDeleted) return res.status(404).send("Election not found.");

  const result = {
    message: "Election deleted",
  };
  if (contentTypeIsJson(req)) {
    res.send(result);
    return;
  }
  res.send(
    toXML(
      {
        ...result,
      },
      {
        indent: "  ",
      }
    )
  );
};
