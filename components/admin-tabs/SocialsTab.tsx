import { Users } from 'lucide-react';
import { useState } from 'react';
import { ref, set } from 'firebase/database';
import { db } from '../../firebaseConfig';

export default function SocialsTab({ socials }: { socials: any }) {
  const [links, setLinks] = useState({
    discord: socials.discord || '',
    youtube: socials.youtube || '',
    telegram: socials.telegram || '',
    tiktok: socials.tiktok || '',
    instagram: socials.instagram || '',
    mail: socials.mail || '',
  });
  const [status, setStatus] = useState<string | null>(null);

  const handleSave = async () => {
    setStatus(null);
    try {
      await set(ref(db, 'settings/socials'), links);
      setStatus('Social Links gespeichert!');
    } catch (err: any) {
      setStatus('Fehler beim Speichern: ' + (err.message || 'Unbekannt'));
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-2">
      <div className="w-full max-w-[900px] flex flex-col items-stretch gap-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-[#ff3c3c]" />
          Socials bearbeiten
        </h3>
        <label className="text-base font-semibold text-white mb-1">Discord Server URL</label>
        <input
          type="text"
          value={links.discord}
          onChange={e => setLinks(s => ({ ...s, discord: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg bg-[#18181b] border border-[#23232a] text-white font-mono"
          placeholder="https://discord.gg/..."
        />
        <label className="text-base font-semibold text-white mb-1">YouTube Channel URL</label>
        <input
          type="text"
          value={links.youtube}
          onChange={e => setLinks(s => ({ ...s, youtube: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg bg-[#18181b] border border-[#23232a] text-white font-mono"
          placeholder="https://youtube.com/..."
        />
        <label className="text-base font-semibold text-white mb-1">Telegram Channel URL</label>
        <input
          type="text"
          value={links.telegram}
          onChange={e => setLinks(s => ({ ...s, telegram: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg bg-[#18181b] border border-[#23232a] text-white font-mono"
          placeholder="https://t.me/..."
        />
        <label className="text-base font-semibold text-white mb-1">TikTok Profile URL</label>
        <input
          type="text"
          value={links.tiktok}
          onChange={e => setLinks(s => ({ ...s, tiktok: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg bg-[#18181b] border border-[#23232a] text-white font-mono"
          placeholder="https://tiktok.com/..."
        />
        <label className="text-base font-semibold text-white mb-1">Instagram Profile URL</label>
        <input
          type="text"
          value={links.instagram}
          onChange={e => setLinks(s => ({ ...s, instagram: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg bg-[#18181b] border border-[#23232a] text-white font-mono"
          placeholder="https://instagram.com/..."
        />
        <label className="text-base font-semibold text-white mb-1">Mail Adresse</label>
        <input
          type="text"
          value={links.mail}
          onChange={e => setLinks(s => ({ ...s, mail: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg bg-[#18181b] border border-[#23232a] text-white font-mono"
          placeholder="mail@domain.de"
        />
        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-lg bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] px-3 py-2 text-base font-bold text-white transition-all duration-300 mt-2"
        >
          Speichern
        </button>
        {status && (
          <div className="mt-2 text-center text-sm text-white bg-[#23232a] rounded-lg px-3 py-2">
            {status}
          </div>
        )}
        <div className="mt-4 text-xs text-gray-400 text-center">
          Hier kannst du alle Social-Media-Links für den Footer und die Webseite bearbeiten.<br />
          Die Änderungen werden sofort übernommen.
        </div>
      </div>
    </div>
  );
}
