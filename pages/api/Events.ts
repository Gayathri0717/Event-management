import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {



  const client = await clientPromise;
  const db = client.db("Event-proj");

  if (req.method === "GET") {
    try {
      const events = await db.collection("events").find().toArray();

      // Map _id to id and rename createdAt to date
      const mapped = events.map((r) => ({
        id: r._id.toString(),
        title: r.title,
        user: r.user,
        date: r.date,
        location: r.location,
        price:r.price,
        description:r.description,
       category:r.category,
        latitude:r.latitude,
  longtitude:r.longtitude
      }));

      return res.status(200).json(mapped);
    } catch (err) {
      return res.status(500).json({ message: "Failed to fetch events" });
    }
  }

 

  return res.status(405).json({ message: "Method not allowed" });
}
