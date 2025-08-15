import React, { useState, useEffect } from 'react';
import { Users, Eye, EyeOff } from 'lucide-react';
import { ref, set } from 'firebase/database';
import { db } from '../../firebaseConfig';

export default function DiscordTab({ discordConfig = {} }: { discordConfig?: any }) {
  const [clientId, setClientId] = useState(discordConfig?.clientId ?? '');
  const [clientSecret, setClientSecret] = useState(discordConfig?.clientSecret ?? '');
  const [botToken, setBotToken] = useState(discordConfig?.botToken ?? '');
  const [guildId, setGuildId] = useState(discordConfig?.guildId ?? '');
  const [status, setStatus] = useState<string | null>(null);

  // Sichtbarkeit für Secret/Token toggeln
  const [showSecret, setShowSecret] = useState(false);
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    setClientId(discordConfig?.clientId ?? '');
    setClientSecret(discordConfig?.clientSecret ?? '');
    setBotToken(discordConfig?.botToken ?? '');
    setGuildId(discordConfig?.guildId ?? '');
  }, [discordConfig]);

  const handleSave = async () => {
    setStatus(null);
    try {
      await set(ref(db, 'settings/discord'), {
        clientId,
        clientSecret,
        botToken,
        guildId,
      });
      setStatus('Discord-Konfiguration gespeichert!');
    } catch (err: any) {
      setStatus('Fehler beim Speichern: ' + (err.message || 'Unbekannt'));
    }
  };

  const getInviteLink = () => {
    if (!clientId) return '';
    return `https://discord.com/oauth2/authorize?client_id=${clientId}&scope=bot&permissions=8`;
  };

  return (
    <div className="w-full flex flex-col items-center px-2">
      <div className="w-full max-w-[1200px] flex flex-row gap-8 items-start">
        {/* Linke Card: Eingabefelder */}
        <div className="flex flex-col gap-6 bg-[#23232a] rounded-xl p-8 shadow border border-[#23232a] flex-1 min-w-[350px] max-w-[500px]">
          <label className="text-base font-semibold text-white mb-1">Discord Client ID</label>
          <input
            type="text"
            value={clientId}
            onChange={e => setClientId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#18181b] border border-[#23232a] text-white font-mono"
            placeholder="Discord Client ID"
          />
          <label className="text-base font-semibold text-white mb-1">Discord Client Secret</label>
          <div className="relative w-full">
            <input
              type={showSecret ? "text" : "password"}
              value={clientSecret}
              onChange={e => setClientSecret(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#18181b] border border-[#23232a] text-white font-mono pr-12"
              placeholder="***********************"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              tabIndex={-1}
              onClick={() => setShowSecret(v => !v)}
            >
              {showSecret ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </button>
          </div>
          <label className="text-base font-semibold text-white mb-1">Discord Bot Token</label>
          <div className="relative w-full">
            <input
              type={showToken ? "text" : "password"}
              value={botToken}
              onChange={e => setBotToken(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#18181b] border border-[#23232a] text-white font-mono pr-12"
              placeholder="*******************************"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              tabIndex={-1}
              onClick={() => setShowToken(v => !v)}
            >
              {showToken ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </button>
          </div>
          <label className="text-base font-semibold text-white mb-1">Guild ID</label>
          <input
            type="text"
            value={guildId}
            onChange={e => setGuildId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#18181b] border border-[#23232a] text-white font-mono"
            placeholder="Guild ID"
          />
          <button
            type="button"
            onClick={handleSave}
            className="w-full rounded-lg bg-gradient-to-r from-[#7289da] to-[#99aab5] px-4 py-3 text-base font-bold text-white transition-all duration-300 mt-2"
          >
            Speichern
          </button>
          {status && (
            <div className="mt-2 text-center text-sm text-white bg-[#23232a] rounded-lg px-4 py-2">
              {status}
            </div>
          )}
          <button
            type="button"
            className="w-full mt-4 rounded-lg bg-[#7289da] px-4 py-3 text-base font-bold text-white text-center transition-all duration-300"
            onClick={() => window.open(getInviteLink(), "_blank")}
            disabled={!clientId}
          >
            + Bot einladen
          </button>
        </div>
        {/* Rechte Card: Hinweise */}
        <div className="flex-1 min-w-[350px] max-w-[600px] bg-[#23232a] rounded-xl p-8 shadow border border-[#23232a]">
          <ol className="list-decimal list-inside text-gray-300 text-base space-y-2">
            <li>
              Öffne das <a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer" className="text-[#7289da] underline">Discord Developer Portal</a>.
            </li>
            <li>Klicke auf "New Application".</li>
            <li>Gib einen Namen für deine Anwendung ein und klicke auf "Create".</li>
            <li>Klicke im linken Menü auf den Tab "OAuth2".</li>
            <li>
              Klicke auf "Add Redirect" und gib folgende URL ein <span className="font-mono text-xs bg-[#18181b] px-2 py-1 rounded">https://betterwarzone-audio.ct.ws/api/auth/discord-callback</span>.
            </li>
            <li>Klicke auf "Save Changes".</li>
            <li>Kopiere die "Client ID" und das "Client Secret".</li>
            <li>Füge die Werte links ein und klicke auf "Speichern".</li>
            <li>Klicke auf "+ Bot einladen", um den Bot auf deinen Server einzuladen.</li>
            <li>Stelle sicher, dass der Bot die Berechtigung "Manage Roles" hat und die Bot-Rolle über den Rollen liegt, die du zuweisen möchtest.</li>
            <li>Optional kannst du die Discord-Authentifizierung erzwingen, indem du das Kontrollkästchen "Require Discord Login" aktivierst.</li>
            <li>
              <b>Hinweis:</b> Falls die Server oder Rollen nicht erscheinen, prüfe ob der Bot auf deinem Server ist, warte bis zu 5 Minuten, aktualisiere und versuche es erneut.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
