import { Receipt, KeyRound, Users, CheckCircle2, XCircle, CreditCard, BadgeDollarSign, Archive } from 'lucide-react';
import { useState } from 'react';

export default function DataTab({ users, invoices }: { users: any[], invoices: any[] }) {
  // Orders werden weiterhin aus den Usern extrahiert
  const orders = users.flatMap(user => Object.values(user.orders || {}).map((order: any) => ({ ...order, uid: user.uid })));

  // State für "Mehr anzeigen" je Card
  const [showAllInvoices, setShowAllInvoices] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);

  const visibleInvoices = showAllInvoices ? invoices : invoices.slice(0, 10);
  const visibleOrders = showAllOrders ? orders : orders.slice(0, 10);
  const visibleUsers = showAllUsers ? users : users.slice(0, 10);

  return (
    <div className="w-full flex flex-col items-center px-2">
      <div className="w-full flex flex-col gap-6">
        {/* Rechnungen (Stripe-Invoices) */}
        <div className="w-full flex flex-col gap-2 mb-4">
          <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
            <Receipt className="w-5 h-5 text-[#ff3c3c]" />
            <span>Stripe-Rechnungen <span className="ml-2">💸🧾</span></span>
          </h4>
          <div className="overflow-x-auto w-full">
            {/* Suchfunktion */}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Suche nach UID, Invoice-ID oder E-Mail"
                className="px-3 py-2 rounded bg-[#18181b] border border-[#444] text-white font-mono w-64"
                // ...hier ggf. State für Suche einbauen...
              />
            </div>
            <table className="min-w-full bg-[#23232a] text-base rounded-none">
              <thead>
                <tr className="text-left text-gray-400 font-bold">
                  <th className="py-2 px-4 min-w-[120px]">Status <span>🔄</span></th>
                  <th className="py-2 px-4 min-w-[180px]">Invoice-ID <span>🧾</span></th>
                  <th className="py-2 px-4 min-w-[220px]">E-Mail <span>📧</span></th>
                  <th className="py-2 px-4 min-w-[180px]">Produkt <span>🎮</span></th>
                  <th className="py-2 px-4 min-w-[100px]">Preis <span>💶</span></th>
                  <th className="py-2 px-4 min-w-[100px]">Paid <span>✅</span></th>
                  <th className="py-2 px-4 min-w-[160px]">Payment Method <span>💳</span></th>
                  <th className="py-2 px-4 min-w-[180px]">Erstellt <span>📅</span></th>
                  <th className="py-2 px-4 min-w-[180px]">Abgeschlossen <span>🏁</span></th>
                  <th className="py-2 px-4 min-w-[80px]"></th>
                </tr>
              </thead>
              <tbody>
                {visibleInvoices.map((inv, idx) => (
                  <tr key={inv.id + idx} className="border-b border-[#444] text-white">
                    <td className="py-2 px-4">
                      {inv.status === 'completed' || inv.paid
                        ? <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-700 text-white text-xs font-bold"><CheckCircle2 className="w-4 h-4" /> Completed</span>
                        : inv.status === 'expired'
                          ? <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-xs font-bold"><XCircle className="w-4 h-4" /> Expired</span>
                          : <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-700 text-white text-xs font-bold"><CreditCard className="w-4 h-4" /> Pending</span>
                      }
                    </td>
                    <td className="py-2 px-4 font-mono">{inv.id}</td>
                    <td className="py-2 px-4">{inv.email}</td>
                    <td className="py-2 px-4">{inv.product}</td>
                    <td className="py-2 px-4">{inv.price} €</td>
                    <td className="py-2 px-4">
                      {inv.paid
                        ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-800 text-green-300 text-xs font-bold">+{inv.price} €</span>
                        : <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-800 text-gray-400 text-xs font-bold">-</span>
                      }
                    </td>
                    <td className="py-2 px-4">
                      {inv.paymentMethod === 'Stripe'
                        ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#635bff] text-white text-xs font-bold"><CreditCard className="w-4 h-4" /> Stripe</span>
                        : inv.paymentMethod?.toLowerCase().includes('paypal')
                          ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#009cde] text-white text-xs font-bold"><BadgeDollarSign className="w-4 h-4" /> PayPal</span>
                          : <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-700 text-white text-xs font-bold"><CreditCard className="w-4 h-4" /> {inv.paymentMethod}</span>
                      }
                    </td>
                    <td className="py-2 px-4">{inv.created ? new Date(inv.created).toLocaleString('de-DE') : '-'}</td>
                    <td className="py-2 px-4">{inv.completed ? new Date(inv.completed).toLocaleString('de-DE') : '-'}</td>
                    <td className="py-2 px-4">
                      <a href="#" className="text-blue-400 hover:underline flex items-center gap-1"><Archive className="w-4 h-4" /> Archive</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {invoices.length > 10 && (
              <div className="w-full flex justify-center mt-4">
                <button
                  className="px-6 py-2 rounded bg-[#23232a] text-gray-300 font-bold border border-[#ff3c3c] hover:bg-[#2d0101] transition"
                  onClick={() => setShowAllInvoices(v => !v)}
                >
                  {showAllInvoices ? 'Weniger anzeigen' : 'Mehr anzeigen'}
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Orders */}
        <div className="w-full flex flex-col gap-2 mb-4">
          <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
            <KeyRound className="w-5 h-5 text-[#ff3c3c]" />
            <span>Orders <span className="ml-2">🔑🛒</span></span>
          </h4>
          <div className="overflow-x-auto w-full">
            <table className="min-w-full bg-[#23232a] rounded-xl text-base">
              <thead>
                <tr className="text-left text-gray-400 font-bold">
                  <th className="py-2 px-4 min-w-[180px]">UID <span>🆔</span></th>
                  <th className="py-2 px-4 min-w-[220px]">Lizenz-Key <span>🔑</span></th>
                  <th className="py-2 px-4 min-w-[180px]">Produkt <span>🎮</span></th>
                  <th className="py-2 px-4 min-w-[220px]">E-Mail <span>📧</span></th>
                  <th className="py-2 px-4 min-w-[180px]">Erstellt <span>📅</span></th>
                  <th className="py-2 px-4 min-w-[120px]">Status <span>🔄</span></th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders.map((order, idx) => (
                  <tr key={order.uid + idx} className="border-b border-[#444] text-white">
                    <td className="py-2 px-4 font-mono">{order.uid}</td>
                    <td className="py-2 px-4 font-mono">{order.licenseKey ?? '-'}</td>
                    <td className="py-2 px-4">{order.product}</td>
                    <td className="py-2 px-4">{order.email}</td>
                    <td className="py-2 px-4">{order.created ? new Date(order.created).toLocaleString('de-DE') : '-'}</td>
                    <td className="py-2 px-4">
                      {order.status === 'completed' || order.paid
                        ? <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-700 text-white text-xs font-bold">Gekauft</span>
                        : <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-700 text-white text-xs font-bold">Nicht bezahlt</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length > 10 && (
              <div className="w-full flex justify-center mt-4">
                <button
                  className="px-6 py-2 rounded bg-[#23232a] text-gray-300 font-bold border border-[#ff3c3c] hover:bg-[#2d0101] transition"
                  onClick={() => setShowAllOrders(v => !v)}
                >
                  {showAllOrders ? 'Weniger anzeigen' : 'Mehr anzeigen'}
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Users */}
        <div className="w-full flex flex-col gap-2 mb-4">
          <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-[#ff3c3c]" />
            <span>Kunden <span className="ml-2">👤🧑‍💻</span></span>
          </h4>
          <div className="overflow-x-auto w-full">
            <table className="min-w-full bg-[#23232a] text-base">
              <thead>
                <tr className="text-left text-gray-400 font-bold">
                  <th className="py-2 px-4 min-w-[180px]">UID <span>🆔</span></th>
                  <th className="py-2 px-4 min-w-[220px]">E-Mail <span>📧</span></th>
                  <th className="py-2 px-4 min-w-[140px]">Mitglied seit <span>📅</span></th>
                  <th className="py-2 px-4 min-w-[120px]">Bestellungen <span>🛒</span></th>
                </tr>
              </thead>
              <tbody>
                {visibleUsers.map((user, idx) => (
                  <tr key={user.uid + idx} className="border-b border-[#444] text-white">
                    <td className="py-2 px-4 font-mono">{user.uid}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.created ? new Date(user.created).toLocaleDateString("de-DE") : "-"}</td>
                    <td className="py-2 px-4">{user.orders ? Object.keys(user.orders).length : 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length > 10 && (
              <div className="w-full flex justify-center mt-4">
                <button
                  className="px-6 py-2 rounded bg-[#23232a] text-gray-300 font-bold border border-[#ff3c3c] hover:bg-[#2d0101] transition"
                  onClick={() => setShowAllUsers(v => !v)}
                >
                  {showAllUsers ? 'Weniger anzeigen' : 'Mehr anzeigen'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
