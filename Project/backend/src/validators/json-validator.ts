import jsonschema from "jsonschema";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";

import { Validator } from "./validator";

const schemesPath = path.join(__dirname, "..", "..", "resources", "schemes", "json")

export const jsonValidator: Validator = {

    validateElection: async (raw: string) => {
        const v = new jsonschema.Validator();
        const obj = JSON.parse(raw);
        if (!obj.id)
            obj.id = uuid();
        const scheme = JSON.parse(fs.readFileSync(schemesPath + "/election.json", "utf8"))
        const isValid = v.validate(obj, scheme).valid;
        if (!isValid)
            return null;

        return obj;
    },

    validateParty: async (raw: string) => {
        const v = new jsonschema.Validator();
        const obj = JSON.parse(raw);
        if (!obj.id)
            obj.id = uuid();
        const scheme = JSON.parse(fs.readFileSync(schemesPath + "/party.json", "utf8"))
        const isValid = v.validate(obj, scheme).valid;
        if (!isValid)
            return null;

        return obj;
    },

    validateParticipation: async (raw: string) => {
        const v = new jsonschema.Validator();
        const obj = JSON.parse(raw);
        if (!obj.id)
            obj.id = uuid();
        const scheme = JSON.parse(fs.readFileSync(schemesPath + "/participation.json", "utf8"))
        const isValid = v.validate(obj, scheme).valid;
        if (!isValid)
            return null;

        return obj;
    }
}
