import { MongoClient } from "mongodb";
import { Party } from "../models/party";

const dbName = "mydb";
const url = "mongodb://root:example@localhost:27017/?authSource=admin";

export const dbGetPartys = async (): Promise<Party[]> => {
  const client = new MongoClient(url);
  await client.connect();

  const db = client.db(dbName);
  const collection = db.collection<Party>("partys");

  const partys = await collection.find().toArray();

  await client.close();

  return partys;
};

export const dbGetParty = async (id: string): Promise<Party | null> => {
  const client = new MongoClient(url);
  await client.connect();

  const db = client.db(dbName);
  const collection = db.collection<Party>("partys");

  const party = await collection.findOne({ id });

  await client.close();

  return party;
};

export const dbCreateParty = async (party: Party): Promise<Party> => {
  const client = new MongoClient(url);
  await client.connect();

  const db = client.db(dbName);
  const collection = db.collection<Party>("partys");

  await collection.insertOne({ ...party });

  await client.close();

  return party;
};

export const dbUpdateParty = async (party: Party): Promise<Party> => {
  const client = new MongoClient(url);
  await client.connect();

  const db = client.db(dbName);
  const collection = db.collection<Party>("partys");

  console.log(1);
  await collection.updateMany({ id: party.id }, { $set: { ...party } });
  console.log(2);

  await client.close();

  return party;
};

export const dbDeleteParty = async (id: string): Promise<boolean> => {
  const client = new MongoClient(url);
  await client.connect();

  const db = client.db(dbName);
  const collection = db.collection<Party>("partys");

  const res = await collection.deleteOne({ id });

  await client.close();

  return res.deletedCount > 0;
};
