import { MongoClient, ObjectId } from "mongodb";
import {
  Election,
  ElectionDbModel,
  mapToDb,
  mapToElection,
} from "../models/election";

const dbName = "mydb";
const url = "mongodb://root:example@localhost:27017/?authSource=admin";

export const dbGetElections = async (): Promise<Election[]> => {
  const client = new MongoClient(url);
  await client.connect();

  const db = client.db(dbName);
  const collection = db.collection<ElectionDbModel>("elections");

  const elections = await collection.find().toArray();

  await client.close();

  return elections.map((x) => mapToElection(x)!);
};

export const dbGetElection = async (id: string): Promise<Election | null> => {
  const client = new MongoClient(url);
  await client.connect();

  const db = client.db(dbName);
  const collection = db.collection<ElectionDbModel>("elections");

  const objectId = new ObjectId(id);
  const election = await collection.findOne({ _id: objectId });
  let dbModel: ElectionDbModel | null = !election ? null : { ...election };
  await client.close();

  return mapToElection(dbModel);
};

export const dbCreateElection = async (
  election: Election
): Promise<Election> => {
  const client = new MongoClient(url);
  await client.connect();

  const db = client.db(dbName);
  const collection = db.collection<ElectionDbModel>("elections");

  await collection.insertOne(mapToDb(election)!);

  await client.close();

  return election;
};

export const dbUpdateElection = async (
  election: Election
): Promise<Election> => {
  const client = new MongoClient(url);
  await client.connect();

  const db = client.db(dbName);
  const collection = db.collection<ElectionDbModel>("elections");

  console.log(1);
  await collection.updateMany(
    { _id: new ObjectId(election.id) },
    { $set: { ...mapToDb(election)! } }
  );
  console.log(2);

  await client.close();

  return election;
};

export const dbDeleteElection = async (id: string): Promise<boolean> => {
  const client = new MongoClient(url);
  await client.connect();

  const db = client.db(dbName);
  const collection = db.collection<ElectionDbModel>("elections");

  const res = await collection.deleteOne({ _id: new ObjectId(id) });

  await client.close();

  return res.deletedCount > 0;
};
