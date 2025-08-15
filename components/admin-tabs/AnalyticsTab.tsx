import { BarChart2, ShoppingCart, BadgeDollarSign, Users, CreditCard, BadgeDollarSign as PayPalIcon, Bell } from 'lucide-react';

export default function AnalyticsTab({ analytics, updates = {}, latestOrders = [], topProducts = [], topCustomers = [] }: { analytics: any, updates?: any, latestOrders?: any[], topProducts?: any[], topCustomers?: any[] }) {
  return (
    <div className="w-full flex flex-col gap-8 px-2">
      {/* Stat Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#18181b] rounded-xl p-6 shadow border border-[#23232a] flex flex-col gap-2">
          <BadgeDollarSign className="w-7 h-7 text-green-400" />
          <div className="text-3xl font-bold text-white">{analytics.totalRevenue ?? 0} €</div>
          <div className="text-sm text-gray-400 mt-1">Umsatz</div>
          <div className="text-xs text-gray-500">— 0.00%</div>
        </div>
        <div className="bg-[#18181b] rounded-xl p-6 shadow border border-[#23232a] flex flex-col gap-2">
          <ShoppingCart className="w-7 h-7 text-blue-400" />
          <div className="text-3xl font-bold text-white">{analytics.totalSales ?? 0}</div>
          <div className="text-sm text-gray-400 mt-1">Bestellungen</div>
          <div className="text-xs text-gray-500">— 0.00%</div>
        </div>
        <div className="bg-[#18181b] rounded-xl p-6 shadow border border-[#23232a] flex flex-col gap-2">
          <Users className="w-7 h-7 text-[#ff3c3c]" />
          <div className="text-3xl font-bold text-white">{analytics.totalCustomers ?? 0}</div>
          <div className="text-sm text-gray-400 mt-1">Kunden</div>
          <div className="text-xs text-gray-500">— 0.00%</div>
        </div>
      </div>
      {/* Chart Placeholder */}
      <div className="w-full bg-[#18181b] rounded-xl p-6 shadow border border-[#23232a]">
        <div className="font-bold text-white mb-2">Umsatz & Bestellungen</div>
        <div className="w-full h-[320px] flex items-center justify-center text-gray-600 bg-[#23232a] rounded-xl border border-[#23232a]">
          {/* Hier Chart.js oder ein echtes Chart einbauen, aktuell nur Platzhalter */}
          <span className="text-lg">[Chart: Umsatz & Bestellungen pro Stunde]</span>
        </div>
      </div>
      {/* Updates/Announcements */}
      <div className="w-full bg-[#23232a] rounded-xl p-6 shadow border border-[#444] mb-8">
        <div className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#ff3c3c]" />
          Updates & Ankündigungen
        </div>
        <ul className="text-sm text-gray-300 space-y-4">
          {(Object.entries(updates) as [string, { title: string; created?: number; text: string }][] )
            .sort(([, a], [, b]) => (b.created ?? 0) - (a.created ?? 0))
            .slice(0, 3)
            .map(([id, update]) => (
              <li key={id} className="bg-[#18181b] border border-[#444] rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#ff3c3c]">{update.title}</span>
                  <span className="ml-2 text-xs text-gray-400">
                    {update.created
                      ? new Date(update.created).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })
                      : ""}
                  </span>
                </div>
                <div className="text-base text-gray-200">{update.text}</div>
              </li>
            ))}
          {Object.keys(updates).length === 0 && (
            <li className="text-gray-400 text-center py-4">Keine Updates vorhanden.</li>
          )}
        </ul>
      </div>
      {/* Latest Completed Orders */}
      <div className="w-full bg-[#23232a] rounded-xl p-6 shadow border border-[#444]">
        <div className="font-bold text-white mb-4">Letzte abgeschlossene Bestellungen</div>
        <table className="min-w-full text-base">
          <thead>
            <tr className="text-left text-gray-400 font-bold">
              <th className="py-2 px-4">Produkt</th>
              <th className="py-2 px-4">Preis</th>
              <th className="py-2 px-4">Bezahlt</th>
              <th className="py-2 px-4">Zahlungsart</th>
              <th className="py-2 px-4">E-Mail</th>
              <th className="py-2 px-4">Zeitpunkt</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {(latestOrders ?? []).map((order, idx) => (
              <tr key={order.id || idx} className="border-b border-[#444] text-white">
                <td className="py-2 px-4">{order.product}</td>
                <td className="py-2 px-4">{order.price} €</td>
                <td className="py-2 px-4">
                  {order.paid
                    ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-800 text-green-300 text-xs font-bold">+{order.price} €</span>
                    : <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-700 text-gray-300 text-xs font-bold">Nicht bezahlt</span>
                  }
                </td>
                <td className="py-2 px-4">
                  {order.paymentMethod === 'Stripe'
                    ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#635bff] text-white text-xs font-bold"><CreditCard className="w-4 h-4" /> Stripe</span>
                    : order.paymentMethod?.toLowerCase().includes('paypal')
                      ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#009cde] text-white text-xs font-bold"><PayPalIcon className="w-4 h-4" /> PayPal</span>
                      : <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-700 text-white text-xs font-bold"><CreditCard className="w-4 h-4" /> {order.paymentMethod}</span>
                  }
                </td>
                <td className="py-2 px-4">{order.email}</td>
                <td className="py-2 px-4">
                  {order.time
                    ? order.time
                    : "-"}
                </td>
                <td className="py-2 px-4">
                  {order.status === 'completed' || order.paid
                    ? <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-700 text-white text-xs font-bold">Gekauft</span>
                    : <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-700 text-white text-xs font-bold">Nicht bezahlt</span>
                  }
                </td>
              </tr>
            ))}
            {(latestOrders ?? []).length === 0 && (
              <tr>
                <td colSpan={7} className="py-2 px-4 text-gray-400 text-center">Keine Bestellungen gefunden.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
