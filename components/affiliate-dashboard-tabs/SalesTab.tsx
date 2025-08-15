import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function SalesTab({ sales }: { sales: any[] }) {
  return (
    <div>
      <div className="font-bold text-lg text-white mb-3 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-[#ff3c3c]" />
        Letzte Verkäufe
      </div>
      {sales.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <TrendingUp className="w-10 h-10 mb-2 text-[#ff3c3c]" />
          Keine Verkäufe vorhanden.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {sales.map((it, idx) => (
            <div key={idx} className="flex justify-between text-sm text-white border-b border-[#23232a] py-2 last:border-b-0">
              <span>{it.date ? new Date(it.date).toLocaleString('de-DE') : '-'}</span>
              <span>{it.amount ? '€' + Number(it.amount).toFixed(2) : '-'}</span>
              <span>{it.name || '-'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
