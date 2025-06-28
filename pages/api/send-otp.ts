import type { NextApiRequest, NextApiResponse } from "next";
import admin from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { phone } = req.body;

  try {
    const session = await admin.auth().createSessionCookie(
      await admin.auth().createCustomToken(phone),
      { expiresIn: 5 * 60 * 1000 } // 5 minutes
    );

    // This is just a simulation — we aren't actually sending OTP from Firebase Admin
    // You would use Firebase client SDK to send OTP from frontend
    return res.status(200).json({ message: "OTP sent", session });
  } catch (err) {
    return res.status(500).json({ message: "Failed to send OTP", error: err });
  }
}
