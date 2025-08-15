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
      <div className="w-full max-w-[900px] bg-[#18181b] rounded-xl border border-[#23232a] shadow-lg p-8 flex flex-col gap-6">
        <div className="mb-2">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-[#ff3c3c]" />
            Socials
          </h3>
          <div className="text-sm text-gray-400 mt-1">
            Füge hier die Links zu deinen Social Media Profilen ein, um sie auf deiner Webseite anzuzeigen.
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-base font-semibold text-white mb-1 block">Discord Server URL</label>
            <input
              type="text"
              value={links.discord}
              onChange={e => setLinks(s => ({ ...s, discord: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-[#23232a] border border-[#23232a] text-white font-mono"
              placeholder="https://discord.gg/..."
            />
          </div>
          <div>
            <label className="text-base font-semibold text-white mb-1 block">YouTube Channel URL</label>
            <input
              type="text"
              value={links.youtube}
              onChange={e => setLinks(s => ({ ...s, youtube: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-[#23232a] border border-[#23232a] text-white font-mono"
              placeholder="https://youtube.com/..."
            />
          </div>
          <div>
            <label className="text-base font-semibold text-white mb-1 block">Telegram Channel URL</label>
            <input
              type="text"
              value={links.telegram}
              onChange={e => setLinks(s => ({ ...s, telegram: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-[#23232a] border border-[#23232a] text-white font-mono"
              placeholder="https://t.me/..."
            />
          </div>
          <div>
            <label className="text-base font-semibold text-white mb-1 block">TikTok Profile URL</label>
            <input
              type="text"
              value={links.tiktok}
              onChange={e => setLinks(s => ({ ...s, tiktok: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-[#23232a] border border-[#23232a] text-white font-mono"
              placeholder="https://tiktok.com/..."
            />
          </div>
          <div>
            <label className="text-base font-semibold text-white mb-1 block">Instagram Profile URL</label>
            <input
              type="text"
              value={links.instagram}
              onChange={e => setLinks(s => ({ ...s, instagram: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-[#23232a] border border-[#23232a] text-white font-mono"
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label className="text-base font-semibold text-white mb-1 block">Mail Adresse</label>
            <input
              type="text"
              value={links.mail}
              onChange={e => setLinks(s => ({ ...s, mail: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-[#23232a] border border-[#23232a] text-white font-mono"
              placeholder="mail@domain.de"
            />
          </div>
        </div>
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
          Die Social-Media-Links werden im Footer und auf der Webseite angezeigt.<br />
          Änderungen werden sofort übernommen.
        </div>
      </div>
    </div>
  );
}
