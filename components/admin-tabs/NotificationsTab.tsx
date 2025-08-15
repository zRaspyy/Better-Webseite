import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';
import { ref, onValue, set } from 'firebase/database';
import { Bell, Save, Mail, MessageCircle, Globe, Info } from 'lucide-react';

const NOTIFICATIONS = [
  { key: 'orderCreated', label: 'Order Created', desc: 'Benachrichtigung bei neuer Bestellung.' },
  { key: 'orderCompleted', label: 'Order Completed', desc: 'Benachrichtigung bei abgeschlossener Bestellung.' },
  { key: 'manualPaid', label: 'Manual Order Marked As Paid', desc: 'Manuelle Bestellung als bezahlt markiert.' },
  { key: 'invoiceOutOfStock', label: 'Invoice Items Out of Stock', desc: 'Produkt nach Verkauf ausverkauft.' },
  { key: 'variantOutOfStock', label: 'Product Variant Out of Stock', desc: 'Produkt-Variante ausverkauft.' },
  { key: 'feedbackReceived', label: 'Feedback Received', desc: 'Feedback zu Produkten erhalten.' },
  { key: 'feedbackAccepted', label: 'Feedback Dispute Accepted', desc: 'Feedback-Streit akzeptiert.' },
  { key: 'feedbackRejected', label: 'Feedback Dispute Rejected', desc: 'Feedback-Streit abgelehnt.' },
  { key: 'ticketCreated', label: 'Ticket Created', desc: 'Neues Support-Ticket erstellt.' },
  { key: 'ticketMessage', label: 'Ticket Message', desc: 'Neue Nachricht im Support-Ticket.' },
  { key: 'subscriptionEnding', label: 'Shop Subscription Ending', desc: 'Shop-Abo läuft bald ab.' },
  { key: 'shopError', label: 'Shop Error', desc: 'Fehler im Shop.' },
  { key: 'productRestocked', label: 'Product Restocked', desc: 'Produkt wieder verfügbar.' },
];

const CHANNELS = [
  { key: 'email', label: 'Email', icon: <Mail className="w-5 h-5" /> },
  { key: 'discord', label: 'Discord', icon: <MessageCircle className="w-5 h-5" /> },
  { key: 'telegram', label: 'Telegram', icon: <Globe className="w-5 h-5" /> },
  { key: 'http', label: 'HTTP', icon: <Info className="w-5 h-5" /> },
];

export default function NotificationsTab() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const notifRef = ref(db, 'settings/notifications');
    const unsub = onValue(notifRef, snap => {
      setSettings(snap.val() || {});
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleToggle = (notifKey: string, channelKey: string) => {
    setSettings((prev: any) => ({
      ...prev,
      [notifKey]: {
        ...prev[notifKey],
        [channelKey]: !prev?.[notifKey]?.[channelKey],
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await set(ref(db, 'settings/notifications'), settings);
    setSaving(false);
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Bell className="w-7 h-7 text-[#ff3c3c]" />
          Benachrichtigungen
        </h2>
        <button
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] text-white font-bold shadow hover:bg-[#ff3c3c]/80 flex items-center gap-2"
          onClick={handleSave}
          disabled={saving}
        >
          <Save className="w-5 h-5" />
          Speichern
        </button>
      </div>
      <div className="bg-[#18181b] rounded-xl border border-[#ff3c3c] shadow-lg p-4">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 font-bold">
              <th className="py-2 px-4">Typ</th>
              <th className="py-2 px-4">Beschreibung</th>
              {CHANNELS.map(ch => (
                <th key={ch.key} className="py-2 px-4">{ch.icon} {ch.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {NOTIFICATIONS.map(notif => (
              <tr key={notif.key} className="border-b border-[#23232a] text-white">
                <td className="py-2 px-4 font-bold">{notif.label}</td>
                <td className="py-2 px-4 text-gray-400">{notif.desc}</td>
                {CHANNELS.map(ch => (
                  <td key={ch.key} className="py-2 px-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!settings?.[notif.key]?.[ch.key]}
                        onChange={() => handleToggle(notif.key, ch.key)}
                        className="accent-[#ff3c3c] w-5 h-5"
                      />
                      <span className="text-xs text-gray-300">{ch.label}</span>
                    </label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="text-gray-400 mt-4">Laden…</div>}
      </div>
      <div className="bg-[#23232a] rounded-xl p-4 mt-4 text-gray-300 text-sm">
        <b>Hinweis:</b> Hier kannst du einstellen, welche Benachrichtigungen für deinen Shop aktiviert sind und über welche Kanäle du sie erhalten möchtest. Änderungen werden nach Klick auf "Speichern" übernommen.
      </div>
    </div>
  );
}
