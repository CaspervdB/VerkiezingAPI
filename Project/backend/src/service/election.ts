import { MongoClient } from "mongodb";
import { Election } from "../models/election";

const dbName = "mydb";
const url = "mongodb://root:example@localhost:27017/";

export const dbGetElections = async (): Promise<Election[]> => {
    const client = new MongoClient(url);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection<Election>("elections");

    const elections = await collection.find().toArray();

    await client.close();

    return elections;    
}

export const dbGetElection = async (id: string): Promise<Election|null> => {
    const client = new MongoClient(url);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection<Election>("elections");

    const election = await collection.findOne({ id });

    await client.close();

    return election;    
}

export const dbCreateElection = async (election: Election): Promise<Election> => {
    const client = new MongoClient(url);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection<Election>("elections");

    await collection.insertOne({ ...election });

    await client.close();

    return election;
}

export const dbUpdateElection = async (election: Election): Promise<Election> => {
    const client = new MongoClient(url);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection<Election>("elections");

    console.log(1);
    await collection.updateMany({ id: election.id }, { $set: { ...election }});
    console.log(2);

    await client.close();

    return election;
}

export const dbDeleteElection = async (id: string): Promise<boolean> => {
    const client = new MongoClient(url);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection<Election>("elections");

    const res = await collection.deleteOne({ id });

    await client.close();

    return res.deletedCount > 0;
}
