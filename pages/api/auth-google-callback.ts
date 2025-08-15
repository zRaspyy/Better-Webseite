import type { NextApiRequest, NextApiResponse } from 'next';
import { sendWelcomeMail } from '../../utils/sendWelcomeMail';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, name } = req.body;
  if (!email || !name) return res.status(400).json({ error: 'Missing email or name' });

  try {
    await sendWelcomeMail(email, name);
    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Mail error' });
  }
}
