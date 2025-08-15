import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";

export default function DiscordTab({ user }: { user: any }) {
  const [discord, setDiscord] = useState<any>(null);
  const [uidInput, setUidInput] = useState("");
  const [assignStatus, setAssignStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    const discordRef = ref(db, `users/${user.uid}/discord`);
    const unsub = onValue(discordRef, (snap) => {
      setDiscord(snap.val() || null);
    });
    return () => unsub();
  }, [user?.uid]);

  // Funktion zum Rolle abholen
  async function handleAssignRole() {
    setAssignStatus(null);
    if (!uidInput.trim()) {
      setAssignStatus("Bitte UID eingeben.");
      return;
    }
    setAssignStatus("Wird verarbeitet...");
    try {
      const res = await fetch("/api/discord/assign-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: uidInput.trim(),
          discordId: discord?.id,
          roleId: "1356395637410889858"
        })
      });
      const data = await res.json();
      if (data.success) {
        setAssignStatus("Rolle erfolgreich zugewiesen!");
      } else {
        setAssignStatus(data.error || "Fehler beim Zuweisen der Rolle.");
      }
    } catch (e) {
      setAssignStatus("Fehler beim Zuweisen der Rolle.");
    }
  }

  return (
    <div className="w-full max-w-[600px] mx-auto p-8 flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-[#7289da]" />
        Discord Account
      </h3>
      {discord ? (
        <div className="flex flex-col gap-4 items-center w-full">
          <div className="flex flex-row items-center gap-4 mb-1">
            {discord.avatar ? (
              <img
                src={`https://cdn.discordapp.com/avatars/${discord.id}/${discord.avatar}.png`}
                alt="Discord Avatar"
                className="w-16 h-16 rounded-full border-2 border-[#7289da] bg-[#18181b]"
              />
            ) : (
              <Sparkles className="w-16 h-16 text-[#7289da]" />
            )}
            <div className="flex flex-col gap-1">
              <div className="font-bold text-lg text-white mt-2 break-all text-center">
                {discord.username}
                {discord.discriminator && discord.discriminator !== "0" && (
                  <span className="text-gray-400">#{discord.discriminator}</span>
                )}
              </div>
              <div className="text-base text-gray-400 break-all text-center">{discord.email}</div>
            </div>
          </div>
          <table className="w-full text-left text-base mb-2">
            <tbody>
              <tr>
                <td className="py-1 pr-2 text-gray-400">Discord-ID:</td>
                <td className="py-1 pl-2 font-mono text-white">{discord.id}</td>
              </tr>
              <tr>
                <td className="py-1 pr-2 text-gray-400">Verifiziert:</td>
                <td className="py-1 pl-2 text-white">{discord.verified ? "Ja" : "Nein"}</td>
              </tr>
              <tr>
                <td className="py-1 pr-2 text-gray-400">Premium:</td>
                <td className="py-1 pl-2 text-white">{discord.premium_type ? "Ja" : "Nein"}</td>
              </tr>
            </tbody>
          </table>
          <div className="flex flex-col gap-2 mt-6 w-full bg-[#18181b] rounded-xl p-5 border border-[#7289da]">
            <h4 className="text-base font-bold text-white mb-1">Customer-Rolle abholen</h4>
            <label className="text-sm text-gray-300 mb-1">Deine UID aus dem Lizenz-Key:</label>
            <input
              type="text"
              value={uidInput}
              onChange={e => setUidInput(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#23232a] border border-[#444] text-white font-mono"
              placeholder="Deine UID eingeben"
            />
            <button
              type="button"
              className="w-full mt-2 rounded-lg bg-gradient-to-r from-[#7289da] to-[#99aab5] px-3 py-2 text-base font-bold text-white transition-all duration-300"
              onClick={handleAssignRole}
              disabled={!discord?.id || !uidInput.trim()}
            >
              Rolle abholen
            </button>
            {assignStatus && (
              <div className="mt-2 text-center text-sm text-white bg-[#23232a] rounded-lg px-3 py-2">
                {assignStatus}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-gray-400 text-center py-6">
          Kein Discord-Account verknüpft.<br />
          Bitte im Warenkorb mit Discord anmelden!
        </div>
      )}
    </div>
  );
}
