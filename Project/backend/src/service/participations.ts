import { MongoClient } from "mongodb";
import { Participation } from "../models/participation";

const dbName = "mydb";
const url = "mongodb://root:example@localhost:27017/";

export const dbGetParticipations = async (): Promise<Participation[]> => {
    const client = new MongoClient(url);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection<Participation>("participations");

    const participations = await collection.find().toArray();

    await client.close();

    return participations;    
}

export const dbGetParticipation = async (id: string): Promise<Participation|null> => {
    const client = new MongoClient(url);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection<Participation>("participations");

    const participation = await collection.findOne({ id });

    await client.close();

    return participation;    
}

export const dbCreateParticipation = async (participation: Participation): Promise<Participation> => {
    const client = new MongoClient(url);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection<Participation>("participations");

    await collection.insertOne({ ...participation });

    await client.close();

    return participation;
}

export const dbUpdateParticipation = async (participation: Participation): Promise<Participation> => {
    const client = new MongoClient(url);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection<Participation>("participations");

    console.log(1);
    await collection.updateMany({ id: participation.id }, { $set: { ...participation }});
    console.log(2);

    await client.close();

    return participation;
}

export const dbDeleteParticipation = async (id: string): Promise<boolean> => {
    const client = new MongoClient(url);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection<Participation>("participations");

    const res = await collection.deleteOne({ id });

    await client.close();

    return res.deletedCount > 0;
}
