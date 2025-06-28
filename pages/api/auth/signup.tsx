
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });

    const client = await clientPromise;
    const db = client.db("Event-proj"); // <-- Replace this!

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection("users").insertOne({ name, email, password: hashedPassword });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup API error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
