// @ts-ignore
import xsd from "libxmljs2-xsd";
import fs from "fs";
import * as xsd2 from "libxmljs";
import xml2js from "xml2js";
import { Validator } from "./validator";
import path from "path";
import { Election } from "../models/election";
import { v4 as uuid } from "uuid";
import { Party } from "../models/party";
import { Participation } from "../models/participation";
import { ObjectId } from "mongodb";

import xsdValidator from "xsd-schema-validator";
import { DOMParser } from "xmldom";

const schemesPath = path.join(__dirname, "..", "schemes", "xml");

const parse = async (raw: string): Promise<any | null> => {
  const parser = new xml2js.Parser();
  return new Promise((resolve, reject) => {
    parser.parseString(raw, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

function xmlDoc2json(node: any): any {
    const result: any = {};
  
    if (node.attrs().length > 0) {
      result['@attributes'] = {};
  
      for (const attr of node.attrs()) {
        result['@attributes'][attr.name()] = attr.value();
      }
    }
  
    if (node.childNodes().length === 0) {
      result['@value'] = node.text();
    } else {
      for (const childNode of node.childNodes()) {
        if (childNode.type() === 'element') {
          if (!result[childNode.name()]) {
            result[childNode.name()] = [];
          }
          result[childNode.name()].push(xmlDoc2json(childNode));
        }
      }
    }
  
    return result;
  }
const xsdGetter = (path: string): string => {
  return fs.readFileSync(path, "utf-8");
};

export const xmlValidator: Validator = {
  validateElection: async (raw: string) => {
    try {
      // let scheme = xsd.parseXml();
      // let xml = xsd.parseXml(raw);
      // let errors = scheme.validate(raw);
    
      const scheme = xsd2.parseXml(xsdGetter(schemesPath + "/election.xsd"));
      const xml = xsd2.parseXml(raw);
      const errors = scheme.validate(xml);
      if(errors) 
         return null;

      const obj = xmlDoc2json(xml);
      if (!obj)
          return null;

      let id = obj["Election"]["id"]
      if (!id)
          obj.id = new ObjectId();
      else
          id = id[0];

      return null;
      // const election: Election = {
      //     id: id,
      //     name: obj["Election"]["ElectionName"][0],
      //     municipality: obj["Election"]["Municipality"][0],
      //     date: obj["Election"]["Date"][0],
      //     votes: obj["Election"]["Votes"][0]
      // }

      // return election;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  validateParty: async (raw: string) => {
    try {
      let scheme = xsd.parseFile(schemesPath + "/party.xsd");
      let errors = scheme.validate(raw);
      if (errors) return null;

      const obj = await parse(raw);
      if (!obj) return null;

      let id = obj["Party"]["Id"];
      if (!id) id = uuid();
      else id = id[0];
      const election: Party = {
        id: id,
        name: obj["Party"]["PartyName"][0],
      };

      return election;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  validateParticipation: async (raw: string) => {
    try {
      let scheme = xsd.parseFile(schemesPath + "/participation.xsd");
      let errors = scheme.validate(raw);
      if (errors) return null;

      const obj = await parse(raw);
      if (!obj) return null;

      let id = obj["Participation"]["Id"];
      if (!id) id = uuid();
      else id = id[0];
      const election: Participation = {
        id: id,
        electionId: obj["Participation"]["ElectionId"][0],
        partyId: obj["Participation"]["PartyId"][0],
        votes: obj["Participation"]["Votes"][0],
      };

      return election;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};
