import { useState } from "react";
import { ref, set, push, remove } from "firebase/database";
import { db } from "../../firebaseConfig";
import { Bell } from "lucide-react";

export default function UpdatesTab({ updates = {} }: { updates?: { [id: string]: any } }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleAddUpdate = async () => {
    if (!title.trim() || !text.trim()) return;
    const updatesRef = ref(db, "settings/updates");
    await push(updatesRef, {
      title: title.trim(),
      text: text.trim(),
      created: Date.now(),
    });
    setTitle("");
    setText("");
    setStatus("Update veröffentlicht!");
    setTimeout(() => setStatus(null), 2000);
  };

  const handleDeleteUpdate = async (id: string) => {
    await remove(ref(db, `settings/updates/${id}`));
  };

  return (
    <div className="w-full flex flex-col items-center px-2">
      <div className="w-full max-w-[900px] flex flex-col gap-8 items-center">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Bell className="w-6 h-6 text-[#ff3c3c]" />
          Updates & Ankündigungen verwalten
        </h3>
        <div className="w-full bg-[#23232a] rounded-2xl shadow-lg border border-[#444] p-8 flex flex-col gap-4">
          <label className="text-base font-semibold text-white mb-1">Titel</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#18181b] border border-[#444] text-white font-mono"
            placeholder="Titel des Updates"
          />
          <label className="text-base font-semibold text-white mb-1">Text</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full min-h-[80px] px-3 py-2 rounded-lg bg-[#18181b] border border-[#444] text-white font-mono"
            placeholder="Update-Text eingeben..."
          />
          <button
            type="button"
            onClick={handleAddUpdate}
            className="w-full rounded-lg bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] px-3 py-2 text-base font-bold text-white transition-all duration-300 mt-2"
          >
            Update veröffentlichen
          </button>
          {status && (
            <div className="mt-2 text-center text-sm text-white bg-[#23232a] rounded-lg px-3 py-2">
              {status}
            </div>
          )}
        </div>
        <div className="w-full mt-8">
          <h4 className="text-lg font-bold text-white mb-2">Alle Updates</h4>
          <ul className="space-y-4">
            {Object.entries(updates)
              .sort(([, a], [, b]) => b.created - a.created)
              .map(([id, update]) => (
                <li key={id} className="bg-[#18181b] border border-[#444] rounded-xl p-4 flex flex-col gap-2 relative">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#ff3c3c]" />
                    <span className="font-bold text-white text-lg">{update.title}</span>
                    <span className="ml-2 text-xs text-gray-400">{new Date(update.created).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <div className="text-base text-gray-200">{update.text}</div>
                  <button
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded bg-[#23232a] border border-[#444]"
                    onClick={() => handleDeleteUpdate(id)}
                  >
                    Löschen
                  </button>
                </li>
              ))}
            {Object.keys(updates).length === 0 && (
              <li className="text-gray-400 text-center py-4">Keine Updates vorhanden.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
