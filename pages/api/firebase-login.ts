import { getAuth } from "firebase-admin/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "cookies-next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;

  try {
    const decoded = await getAuth().verifyIdToken(token);

    // Optional: set your own cookie for session
    setCookie("user", JSON.stringify({ email: decoded.email }), { req, res });

    res.status(200).json({ message: "Session set" });
  } catch (error) {
    res.status(401).json({ message: "Invalid Firebase token" });
  }
}
