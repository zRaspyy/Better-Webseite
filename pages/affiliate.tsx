import React, { useEffect, useMemo, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, set, get } from 'firebase/database';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundGlow from '../components/BackgroundGlow';
import AffiliateDashboard from '../components/AffiliateDashboard';

export default function AffiliatePage() {
  const [uid, setUid] = useState<string | null>(null);
  const [access, setAccess] = useState<boolean | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (!u) {
        setUid(null);
        setAccess(null);
        setData(null);
        setLoading(false);
        return;
      }
      setUid(u.uid);
      const accessRef = ref(db, 'users/' + u.uid + '/affiliateAccess');
      onValue(accessRef, s => {
        setAccess(s.val() === true);
      });
      const dashRef = ref(db, 'affiliates/' + u.uid);
      onValue(dashRef, s => {
        if (!s.exists()) return;
        setData(s.val());
      });
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const link = useMemo(() => {
    if (!uid) return '';
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    return url + '/?ref=' + uid;
  }, [uid]);

  const doGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  useEffect(() => {
    if (!uid) return;
    const init = async () => {
      const dashRef = ref(db, 'affiliates/' + uid);
      const snapshot = await get(dashRef);
      if (!snapshot.exists()) {
        await set(dashRef, {
          link,
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
        });
      }
    };
    init();
  }, [uid, link]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      <Header />
      <BackgroundGlow />
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-12 w-full">
        <div className="max-w-6xl w-full mx-auto flex flex-col gap-8">
          {loading && (
            <div className="flex items-center justify-center min-h-[40vh] text-lg">Laden…</div>
          )}
          {!uid && !loading && (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6">
              <div className="text-lg">Bitte mit Google anmelden, um dein Affiliate-Dashboard zu sehen.</div>
              <button
                onClick={doGoogleLogin}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white font-bold shadow hover:bg-[#a78bfa]/80"
              >
                Google Login
              </button>
            </div>
          )}
          {uid && access !== true && !loading && (
            <div className="flex items-center justify-center min-h-[40vh] text-center text-lg">
              Kein Zugriff. Bitte den Admin um Freischaltung für das Affiliate-Programm.
            </div>
          )}
          {uid && access === true && !data && !loading && (
            <div className="flex items-center justify-center min-h-[40vh] text-center text-lg">
              Kein Affiliate-Datensatz gefunden. Bitte den Admin um Freischaltung.
            </div>
          )}
          {uid && access === true && data && (
            <AffiliateDashboard data={data} link={link} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
