import React from 'react';
import { Euro } from 'lucide-react';

export default function CashoutsTab({ cashouts }: { cashouts: any[] }) {
  return (
    <div>
      <div className="font-bold text-lg text-white mb-3 flex items-center gap-2">
        <Euro className="w-5 h-5 text-[#ff3c3c]" />
        Letzte Auszahlungen
      </div>
      {cashouts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Euro className="w-10 h-10 mb-2 text-[#ff3c3c]" />
          Keine Auszahlungen vorhanden.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {cashouts.map((it, idx) => (
            <div key={idx} className="flex justify-between text-sm text-white border-b border-[#23232a] py-2 last:border-b-0">
              <span>{it.date ? new Date(it.date).toLocaleString('de-DE') : '-'}</span>
              <span>{it.amount ? '€' + Number(it.amount).toFixed(2) : '-'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
