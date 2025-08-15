
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../firebaseConfig'
import { ref, runTransaction } from 'firebase/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { ref: rid } = req.query
    if (!rid || typeof rid !== 'string') return res.status(400).json({ ok: false })
    const clicksRef = ref(db, 'affiliates/' + rid + '/clicks')
    await runTransaction(clicksRef, (v) => (typeof v === 'number' ? v + 1 : 1))
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ ok: false })
  }
}
