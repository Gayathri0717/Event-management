import type { NextApiRequest, NextApiResponse } from "next";
import admin from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { idToken } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return res.status(200).json({ message: "OTP verified", user: decodedToken });
  } catch (err) {
    return res.status(401).json({ message: "Invalid OTP", error: err });
  }
}
