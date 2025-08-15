import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../firebaseConfig'
import { ref, get, update, set } from 'firebase/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { affiliateId, type, itemId, name, price, discount } = req.body
  if (!affiliateId) return res.status(400).json({ error: 'Missing affiliateId' })

  const affRef = ref(db, 'affiliates/' + affiliateId)
  const snap = await get(affRef)
  let data = snap.exists() ? snap.val() : null

  if (!data) {
    await set(affRef, {
      link: `https://www.betterwarzoneaudio.com/premium?ref=${affiliateId}`,
      balance: 0,
      totalEarned: 0,
      clicks: 0,
      sales: 0,
      tier: 'Bronze',
      commissionRate: 20,
      progress: 0,
      totalGenerated: 0,
      recentSales: [],
      recentCashouts: []
    })
    data = {
      link: `https://www.betterwarzoneaudio.com/premium?ref=${affiliateId}`,
      balance: 0,
      totalEarned: 0,
      clicks: 0,
      sales: 0,
      commissionRate: 20,
      totalGenerated: 0,
      recentSales: [],
      recentCashouts: []
    }
  }

  if (type === 'click') {
    await update(affRef, { clicks: (data.clicks ?? 0) + 1 })
    return res.json({ success: true })
  }

  if (type === 'sale') {
    const commission = Math.round((price * (data.commissionRate ?? 20) / 100) * 100) / 100
    await update(affRef, {
      sales: (data.sales ?? 0) + 1,
      totalEarned: (data.totalEarned ?? 0) + commission,
      balance: (data.balance ?? 0) + commission,
      totalGenerated: (data.totalGenerated ?? 0) + price,
      recentSales: [
        ...(data.recentSales ?? []),
        { date: new Date().toISOString(), amount: price, commission, itemId, name }
      ].slice(-20)
    })
    return res.json({ success: true })
  }

  return res.status(400).json({ error: 'Unknown type' })
}
