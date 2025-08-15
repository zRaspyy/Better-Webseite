
import React, { useState } from 'react';
import { db } from '../../firebaseConfig';
import { ref, set, update, get } from 'firebase/database';

export default function AdminAffiliate() {
  const [uid, setUid] = useState('');
  const [status, setStatus] = useState('');

  const grant = async () => {
    if (!uid) return
    await set(ref(db, 'users/'+uid+'/affiliateAccess'), true)
    const dashRef = ref(db, 'affiliates/'+uid)
    const snap = await get(dashRef)
    if (!snap.exists()) {
      await set(dashRef, {
        link: '',
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
    }
    setStatus('freigeschaltet')
  }

  const revoke = async () => {
    if (!uid) return
    await set(ref(db, 'users/'+uid+'/affiliateAccess'), false)
    setStatus('entzogen')
  }

  return (
    <div style={{padding:24,maxWidth:800,margin:'0 auto'}}>
      <h1 style={{fontSize:24,marginBottom:16}}>Admin • Affiliate</h1>
      <div style={{display:'flex',gap:8,marginBottom:16}}>
        <input placeholder='UID' value={uid} onChange={e=>setUid(e.target.value)} style={{flex:1,padding:'10px 12px',border:'1px solid #222',borderRadius:8}} />
        <button onClick={grant} style={{padding:'10px 12px',borderRadius:8,background:'#16a34a',color:'#fff'}}>Zugang gewähren</button>
        <button onClick={revoke} style={{padding:'10px 12px',borderRadius:8,background:'#dc2626',color:'#fff'}}>Zugang entziehen</button>
      </div>
      <div>{status}</div>
    </div>
  )
}
