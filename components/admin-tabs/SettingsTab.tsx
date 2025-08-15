import { useState, useEffect } from 'react';
import { ref, set, get, onValue, remove } from 'firebase/database';
import { db } from '../../firebaseConfig';
import { Download as DownloadIcon, Info, KeyRound, Mail, Tag, Settings, Shield, Zap } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Switch } from '@headlessui/react';

export default function SettingsTab(props) {
  // Alle Hooks am Anfang!
  const [loading, setLoading] = useState(true);

  // States initialisieren mit Fallback
  const [downloadLink, setDownloadLink] = useState('');
  const [appVersion, setAppVersion] = useState('');
  const [betterDownloads, setBetterDownloads] = useState(0);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [targetInput, setTargetInput] = useState('');
  const [licenseStatus, setLicenseStatus] = useState<string | null>(null);
  const [confirmOverwrite, setConfirmOverwrite] = useState<null | { uid: string, existingKey: string }>(null);

  const [maintenance, setMaintenance] = useState(false);
  const [testkaufEnabled, setTestkaufEnabled] = useState(true);
  const [turboMode, setTurboMode] = useState(false);
  const [productAvailability, setProductAvailability] = useState<{ [id: string]: { available: boolean } }>({});
  const [pages, setPages] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Settings aus DB laden
    const maintenanceRef = ref(db, 'settings/maintenance');
    const testkaufRef = ref(db, 'settings/testkaufEnabled');
    const turboRef = ref(db, 'settings/turboMode');
    const productsRef = ref(db, 'settings/products');
    const pagesRef = ref(db, 'settings/pages');
    const downloadRef = ref(db, 'settings/download-link');
    const appVersionRef = ref(db, 'settings/app-version');
    const betterDownloadsRef = ref(db, 'settings/better-downloads');

    let loaded = 0;
    const total = 8;

    function markLoaded() {
      loaded++;
      if (loaded === total) setLoading(false);
    }

    const unsubMaintenance = onValue(maintenanceRef, snap => { setMaintenance(!!snap.val()); markLoaded(); });
    const unsubTestkauf = onValue(testkaufRef, snap => { setTestkaufEnabled(snap.val() !== false); markLoaded(); });
    const unsubTurbo = onValue(turboRef, snap => { setTurboMode(!!snap.val()); markLoaded(); });
    const unsubProducts = onValue(productsRef, snap => { setProductAvailability(snap.val() || {}); markLoaded(); });
    const unsubPages = onValue(pagesRef, snap => { setPages(snap.val() || {}); markLoaded(); });
    const unsubDownload = onValue(downloadRef, snap => { setDownloadLink(snap.val() || ''); markLoaded(); });
    const unsubAppVersion = onValue(appVersionRef, snap => { setAppVersion(snap.val() || ''); markLoaded(); });
    const unsubBetterDownloads = onValue(betterDownloadsRef, snap => { setBetterDownloads(snap.val() || 0); markLoaded(); });

    return () => {
      unsubMaintenance();
      unsubTestkauf();
      unsubTurbo();
      unsubProducts();
      unsubPages();
      unsubDownload();
      unsubAppVersion();
      unsubBetterDownloads();
    };
  }, []);

  // Ladeanzeige erst NACH den Hooks!
  if (loading) return (
    <div className="w-full flex flex-col items-center px-2">
      <div className="w-full max-w-[1100px] flex flex-col gap-8 items-center">
        <div className="w-full bg-[#23232a] rounded-2xl shadow-lg border border-[#444] p-8 flex flex-col gap-6">
          <div className="text-center text-gray-400 text-lg">Laden…</div>
        </div>
      </div>
    </div>
  );

  const handleSaveDownloadLink = async () => {
    await set(ref(db, 'settings/download-link'), downloadLink);
    setStatusMsg('Download-Link gespeichert!');
    setTimeout(() => setStatusMsg(null), 2000);
  };

  const handleSaveAppVersion = async () => {
    await set(ref(db, 'settings/app-version'), appVersion);
    setStatusMsg('App-Version gespeichert!');
    setTimeout(() => setStatusMsg(null), 2000);
  };

  const handleSaveBetterDownloads = async () => {
    await set(ref(db, 'settings/better-downloads'), betterDownloads);
    setStatusMsg('Better-Downloads gespeichert!');
    setTimeout(() => setStatusMsg(null), 2000);
  };

  const handleToggleMaintenance = async () => {
    await set(ref(db, 'settings/maintenance'), !maintenance);
    setMaintenance(!maintenance);
  };

  const handleToggleTestkauf = async () => {
    await set(ref(db, 'settings/testkaufEnabled'), !testkaufEnabled);
    setTestkaufEnabled(!testkaufEnabled);
  };

  const handleToggleTurbo = async () => {
    await set(ref(db, 'settings/turboMode'), !turboMode);
    setTurboMode(!turboMode);
  };

  const handleToggleProduct = async (id: string) => {
    const current = productAvailability[id]?.available ?? false;
    await set(ref(db, `settings/products/${id}/available`), !current);
    setProductAvailability(prev => ({
      ...prev,
      [id]: { available: !current }
    }));
  };

  const handleTogglePage = async (key: string) => {
    await set(ref(db, `settings/pages/${key}`), !pages[key]);
    setPages(prev => ({ ...prev, [key]: !prev[key] }));
  };

  function generateLicenseKey() {
    return (
      Math.random().toString(36).substring(2, 8).toUpperCase() +
      '-' +
      Math.random().toString(36).substring(2, 8).toUpperCase() +
      '-' +
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
  }

  const handleSendLicense = async () => {
    setLicenseStatus(null);
    let targetUid = targetInput.trim();
    if (!targetUid) {
      setLicenseStatus("Bitte UID oder E-Mail eingeben.");
      return;
    }
    // Falls E-Mail eingegeben wurde, suche die UID
    if (!/^[A-Za-z0-9]{28}$/.test(targetUid)) {
      const usersRef = ref(db, 'users');
      let foundUid = '';
      const usersSnap = await get(usersRef);
      const val = usersSnap.val() || {};
      for (const [uid, data] of Object.entries(val)) {
        if ((data as any).email === targetUid) {
          foundUid = uid;
          break;
        }
      }
      if (!foundUid) {
        setLicenseStatus("Kein Nutzer mit dieser E-Mail gefunden.");
        return;
      }
      targetUid = foundUid;
    }
    // Prüfe ob bereits ein Lizenzkey existiert
    const userSnap = await get(ref(db, `users/${targetUid}`));
    const existingKey = userSnap.val()?.licenseKey;
    if (existingKey) {
      setConfirmOverwrite({ uid: targetUid, existingKey });
      return;
    }
    await actuallySendLicense(targetUid);
  };

  const actuallySendLicense = async (targetUid: string) => {
    const key = generateLicenseKey();
    const orderId = uuidv4();
    const orderData = {
      licenseKey: key,
      email: "", // wird unten gesetzt
      created: Date.now(),
      product: "lifetime-key",
      stripeSession: "admin-" + orderId,
      amount: 0,
    };
    try {
      const userSnap = await get(ref(db, `users/${targetUid}`));
      orderData.email = userSnap.val()?.email || "";
      await set(ref(db, `users/${targetUid}/orders/${orderId}`), orderData);
      await set(ref(db, `users/${targetUid}/licenseKey`), key);
      setLicenseStatus(`Lizenz-Key erfolgreich zugewiesen: ${key}`);
    } catch (err: any) {
      setLicenseStatus("Fehler beim Speichern des Lizenz-Keys: " + (err.message || "Unbekannter Fehler"));
    }
    setConfirmOverwrite(null);
  };

  return (
    <div className="w-full flex flex-col items-center px-2">
      <div className="w-full max-w-[1100px] flex flex-col gap-8 items-center">
        {/* Settings Card */}
        <div className="w-full bg-[#23232a] rounded-2xl shadow-lg border border-[#444] p-8 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-7 h-7 text-[#ff3c3c]" />
            <span className="text-2xl font-bold text-white">App Einstellungen</span>
          </div>
          {/* Download-Link */}
          <div className="flex flex-col gap-2 mb-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <DownloadIcon className="w-5 h-5 text-[#ff3c3c]" />
              Download-Link ändern
            </h4>
            <input
              type="text"
              value={downloadLink}
              onChange={e => setDownloadLink(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#18181b] border border-[#444] text-white font-mono"
              placeholder="Neuer Download-Link"
            />
            <button
              type="button"
              onClick={handleSaveDownloadLink}
              className="w-full rounded-lg bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] px-3 py-2 text-base font-bold text-white transition-all duration-300"
            >
              Speichern
            </button>
          </div>
          {/* App-Version */}
          <div className="flex flex-col gap-2 mb-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-[#ff3c3c]" />
              App-Version ändern
            </h4>
            <input
              type="text"
              value={appVersion}
              onChange={e => setAppVersion(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#18181b] border border-[#444] text-white font-mono"
              placeholder="Neue Version z.B. 5.3"
            />
            <button
              type="button"
              onClick={handleSaveAppVersion}
              className="w-full rounded-lg bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] px-3 py-2 text-base font-bold text-white transition-all duration-300"
            >
              Speichern
            </button>
          </div>
          {/* Better-Downloads */}
          <div className="flex flex-col gap-2 mb-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <DownloadIcon className="w-5 h-5 text-[#ff3c3c]" />
              Better-Downloads Wert setzen
            </h4>
            <input
              type="number"
              value={betterDownloads}
              onChange={e => setBetterDownloads(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-[#18181b] border border-[#444] text-white font-mono"
              placeholder="Neuer Wert"
            />
            <button
              type="button"
              onClick={handleSaveBetterDownloads}
              className="w-full rounded-lg bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] px-3 py-2 text-base font-bold text-white transition-all duration-300"
            >
              Speichern
            </button>
            {statusMsg && (
              <div className="mt-2 text-center text-sm text-white bg-[#18181b] rounded-lg px-3 py-2">
                {statusMsg}
              </div>
            )}
          </div>
        </div>
        {/* Wartung/Testkauf/Turbo als eine Card */}
        <div className="w-full bg-[#23232a] rounded-2xl shadow-lg border border-[#444] p-8 flex flex-row gap-8 items-stretch justify-between">
          {/* Wartungsmodus */}
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-6 h-6 text-[#ff3c3c]" />
              <span className="text-lg font-bold text-white">Wartungsmodus</span>
            </div>
            <Switch
              checked={maintenance}
              onChange={handleToggleMaintenance}
              className={`${maintenance ? 'bg-[#ff3c3c]' : 'bg-[#444]'} relative inline-flex h-7 w-14 items-center rounded-full transition-colors`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${maintenance ? 'translate-x-7' : 'translate-x-1'}`}
              />
            </Switch>
            <div className="mt-2 text-xs text-gray-400 text-center max-w-[180px]">
              Wenn aktiv, sehen alle Nutzer den Wartungsbildschirm.
            </div>
          </div>
          {/* Testkauf */}
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-6 h-6 text-green-400" />
              <span className="text-lg font-bold text-white">Testkauf</span>
            </div>
            <Switch
              checked={testkaufEnabled}
              onChange={handleToggleTestkauf}
              className={`${testkaufEnabled ? 'bg-green-600' : 'bg-[#444]'} relative inline-flex h-7 w-14 items-center rounded-full transition-colors`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${testkaufEnabled ? 'translate-x-7' : 'translate-x-1'}`}
              />
            </Switch>
            <div className="mt-2 text-xs text-gray-400 text-center max-w-[180px]">
              Steuert, ob der Testkauf-Button im Warenkorb angezeigt wird.
            </div>
          </div>
          {/* Turbo-Modus */}
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⚡</span>
              <span className="text-lg font-bold text-white">Turbo-Modus</span>
            </div>
            <Switch
              checked={turboMode}
              onChange={handleToggleTurbo}
              className={`${turboMode ? 'bg-[#ff3c3c]' : 'bg-[#444]'} relative inline-flex h-7 w-14 items-center rounded-full transition-colors`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${turboMode ? 'translate-x-7' : 'translate-x-1'}`}
              />
            </Switch>
            <div className="mt-2 text-xs text-gray-400 text-center max-w-[180px]">
              Wenn aktiv, wird die Webseite im Turbo-Modus geladen und ein Banner angezeigt.
            </div>
          </div>
        </div>
        {/* Produkt-Verfügbarkeit Card */}
        <div className="w-full bg-[#23232a] rounded-2xl shadow-lg border border-[#444] p-8 flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
            <Tag className="w-6 h-6 text-[#ff3c3c]" />
            <span className="text-xl font-bold text-white">Produkte verfügbar/unverfügbar schalten</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'license-1m', name: '1 Monat License Key' },
              { id: 'license-3m', name: '3 Monate License Key' },
              { id: 'license-6m', name: '6 Monate License Key' },
              { id: 'lifetime-key', name: 'Premium Lifetime Key' },
              { id: 'pc-standard', name: 'PC Optimierung Standard' },
              { id: 'pc-full', name: 'Full Optimierung' },
              { id: 'obs-settings', name: 'OBS Settings inkl. Sound Routing' },
              { id: 'audio-interface', name: 'Audio Interface (GOXLR, RODECAST o.ä.) einstellen' },
              { id: 'netzwerk', name: 'Netzwerk Optimierung' },
              { id: 'windows-reset', name: 'Windows neu aufsetzen' },
            ].map(prod => (
              <div key={prod.id} className="flex items-center gap-4 bg-[#18181b] rounded-lg p-4 border border-[#444]">
                <span className="font-bold text-white">{prod.name}</span>
                <Switch
                  checked={!!productAvailability[prod.id]?.available}
                  onChange={() => handleToggleProduct(prod.id)}
                  className={`${productAvailability[prod.id]?.available ? 'bg-[#ff3c3c]' : 'bg-[#444]'} relative inline-flex h-7 w-14 items-center rounded-full transition-colors`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${productAvailability[prod.id]?.available ? 'translate-x-7' : 'translate-x-1'}`}
                  />
                </Switch>
                {/* Status-Indikator */}
                <span className="flex items-center gap-2 ml-2">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${productAvailability[prod.id]?.available ? 'bg-green-500' : 'bg-gray-500'}`}
                  />
                  <span className={`text-xs font-bold ${productAvailability[prod.id]?.available ? 'text-green-400' : 'text-gray-400'}`}>
                    {productAvailability[prod.id]?.available ? 'Verfügbar' : 'Nicht verfügbar'}
                  </span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Hier kannst du die Produkte für den Shop aktivieren oder deaktivieren.
          </div>
        </div>
        {/* Seiten-Toggles Card */}
        <div className="w-full bg-[#23232a] rounded-2xl shadow-lg border border-[#444] p-8 flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-6 h-6 text-[#ff3c3c]" />
            <span className="text-xl font-bold text-white">Seiten anzeigen/verstecken</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'affiliate', label: 'Affiliate' },
              { key: 'download', label: 'Download' },
              { key: 'reviews', label: 'Bewertungen' },
              { key: 'better-tweaks', label: 'Better Tweaks' },
              { key: 'produkte-katalog', label: 'Katalog' },
            ].map(page => (
              <div key={page.key} className="flex items-center gap-4 bg-[#18181b] rounded-lg p-4 border border-[#444]">
                <span className="font-bold text-white">{page.label}</span>
                <Switch
                  checked={!!pages[page.key]}
                  onChange={() => handleTogglePage(page.key)}
                  className={`${pages[page.key] ? 'bg-[#ff3c3c]' : 'bg-[#444]'} relative inline-flex h-7 w-14 items-center rounded-full transition-colors`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${pages[page.key] ? 'translate-x-7' : 'translate-x-1'}`}
                  />
                </Switch>
                <span className={`text-xs font-bold ${pages[page.key] ? 'text-green-400' : 'text-gray-400'}`}>
                  {pages[page.key] ? 'Sichtbar' : 'Versteckt'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Hier kannst du einzelne Seiten im Header anzeigen oder verstecken.
          </div>
        </div>
        {/* Lizenz-Key Card */}
        <div className="w-full bg-[#23232a] rounded-2xl shadow-lg border border-[#444] p-8 flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
            <KeyRound className="w-6 h-6 text-[#ff3c3c]" />
            <span className="text-xl font-bold text-white">Lizenz-Key zuweisen</span>
          </div>
          <label className="text-base font-semibold text-white mb-1 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#ff3c3c]" />
            UID <span className="text-gray-400">oder</span> E-Mail des Nutzers:
          </label>
          <input
            type="text"
            value={targetInput}
            onChange={e => setTargetInput(e.target.value)}
            placeholder="UID oder E-Mail eingeben"
            className="w-full px-3 py-2 rounded-lg bg-[#18181b] border border-[#444] text-white font-mono"
          />
          <button
            type="button"
            onClick={handleSendLicense}
            className="w-full mt-2 rounded-lg bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] px-3 py-2 text-base font-bold text-white transition-all duration-300 flex items-center justify-center gap-2"
          >
            <KeyRound className="w-5 h-5" />
            Lizenz-Key generieren & zuweisen
          </button>
          {licenseStatus && (
            <div className="mt-2 text-center text-sm text-white bg-[#18181b] rounded-lg px-3 py-2">
              {licenseStatus}
            </div>
          )}
          {confirmOverwrite && (
            <div className="mt-4 bg-[#18181b] border border-[#ff3c3c] rounded-lg p-4 text-center flex flex-col items-center gap-4">
              <div className="text-white font-bold text-lg mb-2">
                Der Nutzer hat bereits einen Lizenz-Key:
              </div>
              <div className="font-mono text-[#ff3c3c] text-base bg-[#23232a] px-3 py-2 rounded-lg border border-[#444]">
                {confirmOverwrite.existingKey}
              </div>
              <div className="text-gray-300 mb-2">
                Möchtest du trotzdem einen weiteren Lizenz-Key zuweisen?
              </div>
              <div className="flex gap-4 mt-2">
                <button
                  className="px-5 py-2 rounded-lg bg-[#ff3c3c] text-white font-bold hover:bg-[#d32d2f] transition"
                  onClick={() => actuallySendLicense(confirmOverwrite.uid)}
                >
                  Ja, weiteren Key senden
                </button>
                <button
                  className="px-5 py-2 rounded-lg bg-[#23232a] text-gray-300 font-bold hover:bg-[#444] transition"
                  onClick={() => setConfirmOverwrite(null)}
                >
                  Nein, abbrechen
                </button>
              </div>
            </div>
          )}
          <div className="mt-4 text-xs text-gray-400 text-center">
            Der Lizenz-Key wird dem Nutzer zugewiesen und per E-Mail versendet.<br />
            Die UID findest du im User Dashboard des jeweiligen Nutzers.
          </div>
        </div>
      </div>
    </div>
  );
}
