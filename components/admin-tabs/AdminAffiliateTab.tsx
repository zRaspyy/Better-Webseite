import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';
import { ref, onValue, update, set } from 'firebase/database';
import { Sparkles, Info } from 'lucide-react';
import { Switch } from '@headlessui/react';

export default function AdminAffiliateTab() {
  // Alle Hooks am Anfang!
  const [affiliates, setAffiliates] = useState<{ [uid: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const [uidInput, setUidInput] = useState('');
  const [msg, setMsg] = useState<string>('');
  const [enabled, setEnabled] = useState(false);
  const [percentage, setPercentage] = useState(5);
  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    const affiliatesRef = ref(db, 'affiliates');
    const unsub = onValue(affiliatesRef, snap => {
      setAffiliates(snap.val() || {});
      setLoading(false);
    });
    const settingsRef = ref(db, 'settings/affiliate');
    const unsubSettings = onValue(settingsRef, snap => {
      const val = snap.val() || {};
      setEnabled(!!val.enabled);
      setPercentage(val.percentage ?? 5);
      setSettingsLoading(false);
    });
    return () => {
      unsub();
      unsubSettings();
    };
  }, []);

  async function grantAffiliate(uid: string) {
    if (!uid) return;
    try {
      await update(ref(db, 'users/' + uid), { affiliateAccess: true });
      setMsg('Affiliate-Zugriff für UID ' + uid + ' gesetzt.');
      setUidInput('');
    } catch (e) {
      setMsg('Fehler: ' + String(e));
    }
  }

  async function saveSettings() {
    setSettingsLoading(true);
    await set(ref(db, 'settings/affiliate'), { enabled, percentage });
    setSettingsLoading(false);
  }

  // Ladeanzeige erst NACH den Hooks!
  if (loading || settingsLoading) return (
    <div className="w-full flex flex-col items-center px-2">
      <div className="w-full max-w-[1100px] flex flex-col gap-8 items-center">
        <div className="w-full bg-[#23232a] rounded-2xl shadow-lg border border-[#444] p-8 flex flex-col gap-6">
          <div className="text-center text-gray-400 text-lg">Laden…</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Affiliate Settings Card */}
      <div className="bg-[#18181b] rounded-xl border border-[#23232a] shadow-lg p-8 mb-4 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-[#ff3c3c]" />
          <span className="text-2xl font-bold text-white">Affiliate Programm <span className="bg-[#ff3c3c] text-white text-xs px-2 py-1 rounded ml-2">BETA</span></span>
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex flex-col gap-2 flex-1">
            <label className="font-bold text-white mb-1">Affiliate Programm aktivieren</label>
            <Switch
              checked={enabled}
              onChange={setEnabled}
              className={`${enabled ? 'bg-[#ff3c3c]' : 'bg-[#444]'} relative inline-flex h-7 w-14 items-center rounded-full transition-colors`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-7' : 'translate-x-1'}`}
              />
            </Switch>
            <span className="text-xs text-gray-400 mt-1">
              Wenn aktiviert, können Nutzer durch Empfehlungen Guthaben verdienen.
            </span>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label className="font-bold text-white mb-1">Affiliate-Provision (%)</label>
            <input
              type="number"
              value={percentage}
              onChange={e => setPercentage(Number(e.target.value))}
              className="px-3 py-2 rounded-lg bg-[#23232a] border border-[#ff3c3c] text-white font-mono w-32"
              min={1}
              max={100}
            />
            <span className="text-xs text-gray-400 mt-1">
              Prozentsatz des Rechnungsbetrags, der als Provision ausgezahlt wird.
            </span>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label className="font-bold text-white mb-1">User UID freischalten</label>
            <form
              onSubmit={e => {
                e.preventDefault();
                grantAffiliate(uidInput.trim());
              }}
              className="flex gap-2 items-center"
            >
              <input
                type="text"
                value={uidInput}
                onChange={e => setUidInput(e.target.value)}
                placeholder="User UID eintragen…"
                className="px-3 py-2 rounded-lg bg-[#23232a] border border-[#ff3c3c] text-white font-mono w-48"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] text-white font-bold shadow hover:bg-[#ff3c3c]/80 transition"
              >
                Freischalten
              </button>
            </form>
            {msg && <div className="mt-2 text-sm text-[#ff3c3c]">{msg}</div>}
            <span className="text-xs text-gray-400 mt-1">
              Trage hier die UID eines Nutzers ein, um ihn für das Affiliate Programm freizuschalten.
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={saveSettings}
          className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] text-white font-bold shadow hover:bg-[#ff3c3c]/80 transition w-full max-w-xs"
        >
          Einstellungen speichern
        </button>
        <div className="mt-6 bg-[#23232a] rounded-lg p-4 flex items-start gap-3">
          <Info className="w-6 h-6 text-[#ff3c3c] mt-1" />
          <div className="text-sm text-gray-300">
            <b>Wie funktioniert das Affiliate Programm?</b><br />
            <ul className="list-disc ml-4 mt-2">
              <li>Shop aktiviert das Affiliate Programm und legt die Provision fest.</li>
              <li>Kunde X teilt seinen Affiliate-Link mit Kunde Y.</li>
              <li>Kunde Y klickt auf den Link und kauft ein Produkt.</li>
              <li>Kunde X erhält eine Provision auf sein Guthaben, basierend auf dem Rechnungsbetrag.</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Übersicht */}
      <table style={{width:'100%',background:'#18181b',borderRadius:12,overflow:'hidden',border:'1px solid #23232a'}}>
        <thead>
          <tr style={{background:'#23232a',color:'#ff3c3c'}}>
            <th style={{padding:8}}>UID</th>
            <th style={{padding:8}}>Link</th>
            <th style={{padding:8}}>Balance</th>
            <th style={{padding:8}}>Sales</th>
            <th style={{padding:8}}>Clicks</th>
            <th style={{padding:8}}>Tier</th>
            <th style={{padding:8}}>Commission</th>
            <th style={{padding:8}}>Total Earned</th>
            <th style={{padding:8}}>Total Generated</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(affiliates).map(([uid, data]) => (
            <tr key={uid} style={{borderBottom:'1px solid #23232a',color:'#eaeaea'}}>
              <td style={{padding:8,fontSize:12}}>{uid}</td>
              <td style={{padding:8,fontSize:12}}>
                <a href={data.link} target="_blank" rel="noopener noreferrer" style={{color:'#6d28d9'}}>{data.link}</a>
              </td>
              <td style={{padding:8}}>{'€'+(data.balance??0).toFixed(2)}</td>
              <td style={{padding:8}}>{data.sales??0}</td>
              <td style={{padding:8}}>{data.clicks??0}</td>
              <td style={{padding:8}}>{data.tier??'Bronze'}</td>
              <td style={{padding:8}}>{data.commissionRate??percentage}%</td>
              <td style={{padding:8}}>{'€'+(data.totalEarned??0).toFixed(2)}</td>
              <td style={{padding:8}}>{'€'+(data.totalGenerated??0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
