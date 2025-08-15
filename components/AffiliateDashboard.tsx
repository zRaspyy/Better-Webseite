import React, { useState, useEffect } from 'react';
import { Sparkles, Euro, TrendingUp, Target, Award, Settings, ArrowRight, ArrowLeft } from 'lucide-react';
import SalesTab from './affiliate-dashboard-tabs/SalesTab';
import CashoutsTab from './affiliate-dashboard-tabs/CashoutsTab';
import SettingsTab from './affiliate-dashboard-tabs/SettingsTab';

const TABS = [
  { key: 'sales', label: 'Verkäufe', icon: <TrendingUp className="w-5 h-5 mr-2" /> },
  { key: 'cashouts', label: 'Auszahlungen', icon: <Euro className="w-5 h-5 mr-2" /> },
  { key: 'settings', label: 'Einstellungen', icon: <Settings className="w-5 h-5 mr-2" /> },
];

export default function AffiliateDashboard({ data, link }: { data: any, link: string }) {
  const [tab, setTab] = useState('sales');

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <h1 className="text-4xl font-extrabold text-center mb-2 bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] bg-clip-text text-transparent">
        Affiliate Dashboard
      </h1>
      {/* Affiliate Link Card */}
      <div className="rounded-xl bg-[#18181b] border border-[#ff3c3c] p-6 mb-2 shadow-lg">
        <div className="flex items-center gap-2 mb-2 font-bold text-lg text-white">
          <Sparkles className="w-5 h-5 text-[#ff3c3c]" />
          Dein Affiliate-Link
        </div>
        <div className="flex gap-2 items-center">
          <input
            value={link}
            readOnly
            className="flex-1 bg-[#23232a] border border-[#ff3c3c] rounded-lg px-4 py-2 text-white font-mono"
          />
          <button
            onClick={() => navigator.clipboard.writeText(link)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] text-white font-bold shadow hover:bg-[#ff3c3c]/80 transition"
          >
            Link kopieren
          </button>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Teile diesen Link und verdiene Provision für jeden Verkauf!
        </div>
      </div>
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-2">
        <StatCard
          title="Guthaben"
          value={'€' + (data.balance ?? 0).toFixed(2)}
          icon={<Euro className="w-6 h-6 text-[#ff3c3c]" />}
        />
        <StatCard
          title="Verdient"
          value={'€' + (data.totalEarned ?? 0).toFixed(2)}
          icon={<TrendingUp className="w-6 h-6 text-[#ff3c3c]" />}
        />
        <StatCard
          title="Klicks"
          value={String(data.clicks ?? 0)}
          icon={<Target className="w-6 h-6 text-[#ff3c3c]" />}
        />
        <StatCard
          title="Verkäufe"
          value={String(data.sales ?? 0)}
          icon={<Award className="w-6 h-6 text-[#ff3c3c]" />}
        />
      </div>
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`flex items-center px-5 py-2 rounded-lg font-bold text-base transition shadow border border-[#ff3c3c] ${
              tab === t.key ? 'bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] text-white' : 'bg-[#23232a] text-gray-300 hover:bg-[#18181b]'
            }`}
            onClick={() => setTab(t.key)}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="rounded-xl bg-[#18181b] border border-[#ff3c3c] p-6 shadow-lg">
        {tab === 'sales' && <SalesTab sales={data.recentSales ?? []} />}
        {tab === 'cashouts' && <CashoutsTab cashouts={data.recentCashouts ?? []} />}
        {tab === 'settings' && <SettingsTab data={data} />}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#23232a] border border-[#ff3c3c] rounded-xl p-6 flex flex-col items-center shadow-lg">
      <div className="mb-2">{icon}</div>
      <div className="text-lg font-bold text-white mb-1">{title}</div>
      <div className="text-2xl font-extrabold text-[#ff3c3c]">{value}</div>
    </div>
  );
}
