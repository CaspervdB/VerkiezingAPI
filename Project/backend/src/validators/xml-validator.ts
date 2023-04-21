// @ts-ignore
import xsd from "libxmljs2-xsd";
import xml2js from "xml2js";
import { Validator } from "./validator";
import path from "path";
import { Election } from "../models/election";
import { v4 as uuid } from "uuid";
import { Party } from "../models/party";
import { Participation } from "../models/participation";

const schemesPath = path.join(__dirname, "..", "..", "resources", "schemes", "xml")

const parse = async (raw: string): Promise<any|null> => {
    const parser = new xml2js.Parser();
    return new Promise((resolve, reject) => {
        parser.parseString(raw, (err, result) => {
            if (err) {
                reject(null);
            } else {
                resolve(result);
            }
        });
    });
}

export const xmlValidator: Validator = {

    validateElection: async (raw: string) => {

        try {
            var scheme = xsd.parseFile(schemesPath + "/election.xsd");
            var errors = scheme.validate(raw);
            if (errors)
                return null;

            const obj = await parse(raw);
            if (!obj)
                return null;

            let id = obj["Election"]["Id"];
            if (!id)
                id = uuid();
            else
                id = id[0];
            const election: Election = {
                id: id,
                name: obj["Election"]["ElectionName"][0],
                municipality: obj["Election"]["Municipality"][0],
                date: obj["Election"]["Date"][0],
                votes: obj["Election"]["Votes"][0]
            }
            
            return election;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    validateParty: async (raw: string) => {

        try {
            var scheme = xsd.parseFile(schemesPath + "/party.xsd");
            var errors = scheme.validate(raw);
            if (errors)
                return null;

            const obj = await parse(raw);
            if (!obj)
                return null;

            let id = obj["Party"]["Id"];
            if (!id)
                id = uuid();
            else
                id = id[0];
            const election: Party = {
                id: id,
                name: obj["Party"]["PartyName"][0]
            }
            
            return election;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    validateParticipation: async (raw: string) => {

        try {
            var scheme = xsd.parseFile(schemesPath + "/participation.xsd");
            var errors = scheme.validate(raw);
            if (errors)
                return null;

            const obj = await parse(raw);
            if (!obj)
                return null;

            let id = obj["Participation"]["Id"];
            if (!id)
                id = uuid();
            else
                id = id[0];
            const election: Participation = {
                id: id,
                electionId: obj["Participation"]["ElectionId"][0],
                partyId: obj["Participation"]["PartyId"][0],
                votes: obj["Participation"]["Votes"][0]
            }
            
            return election;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
