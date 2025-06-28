import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const { email, name, items } = req.body;

  const eventList = items.map((item: any) => `- ${item.title} x ${item.quantity}`).join("\n");

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // your Gmail or SMTP
      pass: process.env.EMAIL_PASS,  // app password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Event Booking Confirmation 🎉',
    text: `Hello ${name},\n\nThank you for booking with us!\n\nYour Events:\n${eventList}\n\nEnjoy your events!\n\n- Event Management Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true })
  } catch (error: any) {
    console.error('Mail send error:', error)
    res.status(500).json({ error: 'Failed to send email' })
  }
}
