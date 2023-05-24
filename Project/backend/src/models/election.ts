import { ObjectId } from "mongodb";
export interface ElectionDbModel {
  _id: ObjectId;
  name: string;
  municipality: string;
  date: string;
  votes: number;
}

export interface Election {
  id: string;
  name: string;
  municipality: string;
  date: string;
  votes: number;
}

const mapToElection = (model: ElectionDbModel | null): Election | null => {
  return !model
    ? null
    : {
        name: model.name, 
        municipality: model.municipality, 
        date: model.date, 
        votes: model.votes, 
        id: model._id.toString(),
      };
};

const mapToDb = (model: Election | null): ElectionDbModel | null => {
  return !model
    ? null
    : {
        name: model.name, 
        municipality: model.municipality, 
        date: model.date, 
        votes: model.votes, 
        _id: new ObjectId(model.id),
      };
};

export { mapToDb, mapToElection };
