import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { eventId } = req.query;

  if (typeof eventId !== "string") {
    return res.status(400).json({ message: "Invalid eventId" });
  }

  const client = await clientPromise;
  const db = client.db("Event-proj");

  if (req.method === "GET") {
    try {
      const reviews = await db.collection("reviews").find({ eventId }).toArray();

      // Map _id to id and rename createdAt to date
      const mapped = reviews.map((r) => ({
        id: r._id.toString(),
        eventId: r.eventId,
        EventName:r.EventName,
        user: r.user,
        rating: r.rating,
        comment: r.comment,
        date: r.createdAt,
      }));

      return res.status(200).json(mapped);
    } catch (err) {
      return res.status(500).json({ message: "Failed to fetch reviews" });
    }
  }

  if (req.method === "POST") {
    const { user, rating, comment ,EventName} = req.body;

    if (!user || !rating || !comment || !EventName) {
      return res.status(400).json({ message: "Missing review fields" });
    }

    try {
      const newReview = {
        eventId,
        user,
     EventName,
        rating,
        comment,
        createdAt: new Date(),
      };

      const result = await db.collection("reviews").insertOne(newReview);

      return res.status(201).json({
        id: result.insertedId.toString(),
        ...newReview,
        date: newReview.createdAt, // match frontend model
      });
    } catch (err) {
      return res.status(500).json({ message: "Failed to post review" });
    }
  }


  return res.status(405).json({ message: "Method not allowed" });
}
