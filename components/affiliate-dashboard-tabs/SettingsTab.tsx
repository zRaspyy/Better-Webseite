import React from 'react';
import { Settings } from 'lucide-react';

export default function SettingsTab({ data }: { data: any }) {
  return (
    <div>
      <div className="font-bold text-lg text-white mb-3 flex items-center gap-2">
        <Settings className="w-5 h-5 text-[#ff3c3c]" />
        Einstellungen & Hinweise
      </div>
      <div className="text-sm text-gray-300 mb-2">
        <ul className="list-disc ml-4">
          <li>Dein Tier: <b>{data.tier ?? 'Bronze'}</b></li>
          <li>Provision: <b>{data.commissionRate ?? 20}%</b></li>
          <li>Ab €10 Guthaben kannst du eine Auszahlung beantragen (Support kontaktieren).</li>
          <li>Missbrauch, Spam oder Fake-Käufe führen zum Ausschluss.</li>
          <li>Für Fragen oder Hilfe kontaktiere uns per Discord oder E-Mail.</li>
        </ul>
      </div>
    </div>
  );
}
