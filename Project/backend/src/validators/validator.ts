import { Election } from "../models/election";
import { Participation } from "../models/participation";
import { Party } from "../models/party";

export interface Validator {
  validateElection: (raw: string) => Promise<Election | null>;
  validateParty: (raw: string) => Promise<Party | null>;
  validateParticipation: (raw: string) => Promise<Participation | null>;
}
