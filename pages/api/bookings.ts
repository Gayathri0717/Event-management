import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const client = await clientPromise;
  const db = client.db("Event-proj");

  if (req.method === "GET") {
    try {
          const { userEmail } = req.query;  
      const bookings = await db.collection("bookingevents").find({userEmail}).toArray();

  // if (!userEmail || typeof userEmail !== "string") {
  //     return res.status(400).json({ message: "Missing or invalid userEmail" });
  //   }
      // Map _id to id and rename createdAt to date
      const mapped = bookings.map((r) => ({
        id: r._id.toString(),
        title:r.title,
        quantity:r.quantity,
        price:r.price,
        userEmail:r.userEmail,
       userName:r.userName
        
      }));

      return res.status(200).json(mapped);
    } catch (err) {
      return res.status(500).json({ message: "Failed to fetch bookings" });
    }
  }

   // ✅ Add this for POST (Save Booking)
  if (req.method === "POST") {
    try {
        const { items,userEmail,userName } = req.body;
console.log(items)
console.log(userName)
console.log(userEmail)
      if (!items || !Array.isArray(items)|| !userEmail || !userName) {
        return res.status(400).json({ message: "Invalid items data" });
      }
const itemsWithEmail = items.map(item => ({
  ...item,
  userEmail,
  userName
}));

      const result = await db.collection("bookingevents").insertMany(itemsWithEmail);
console.log(itemsWithEmail)
      return res.status(200).json({ message: "Bookings saved successfully", insertedIds: result.insertedIds });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to save bookings" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
