import { Receipt, FileText, KeyRound, Copy, BadgeDollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";

type Order = {
  licenseKey: string;
  email: string;
  created: number;
  product: string;
  stripeSession: string;
  amount?: number;
};

export default function OrdersTab({ user }: { user: any }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    const ordersRef = ref(db, `users/${user.uid}/orders`);
    const unsubOrders = onValue(ordersRef, (snap) => {
      const val = snap.val() || {};
      const arr: Order[] = Object.values(val);
      arr.sort((a, b) => b.created - a.created);
      setOrders(arr);
      setLoadingOrders(false);
    });
    return () => unsubOrders();
  }, [user?.uid]);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="w-full max-w-[700px] mx-auto h-full flex flex-col">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Receipt className="w-5 h-5 text-gray-300" />
        Deine Rechnungen & Bestellungen
      </h3>
      {loadingOrders ? (
        <div className="text-gray-400 text-center py-6">Lade Bestellungen...</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-400 text-center py-6">Keine Bestellungen gefunden.</div>
      ) : (
        <div className="flex-1 overflow-y-auto flex flex-col gap-6 pb-4" style={{ maxHeight: "calc(100vh - 180px)" }}>
          {orders.map((order, idx) => (
            <div
              key={order.stripeSession + idx}
              className="bg-[#23232a] border border-[#ff3c3c] rounded-2xl p-6 flex flex-col gap-3 shadow-lg relative"
              style={{
                minWidth: 0,
                boxShadow: "0 8px 32px 0 rgba(255,60,60,0.09)",
                overflowWrap: "anywhere",
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-[#ff3c3c]" />
                <span className="font-bold text-lg text-white">{order.product}</span>
                <span className="ml-auto px-3 py-1 rounded-full bg-[#ff3c3c] text-white text-xs font-bold">
                  {order.amount ? `${order.amount} €` : "Unbezahlt"}
                </span>
              </div>
              {/* Invoice Table */}
              <table className="w-full text-left text-base mb-1">
                <tbody>
                  <tr>
                    <td className="py-1 pr-2 text-gray-400">Kaufdatum:</td>
                    <td className="py-1 pl-2 text-white">
                      {order.created
                        ? new Date(order.created).toLocaleString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-2 text-gray-400">Stripe-ID:</td>
                    <td className="py-1 pl-2 text-white break-all">{order.stripeSession}</td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-2 text-gray-400">E-Mail:</td>
                    <td className="py-1 pl-2 text-white break-all">{order.email}</td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-2 text-gray-400">Lizenz-Key:</td>
                    <td className="py-1 pl-2 font-mono text-white bg-[#18181b] px-2 py-1 rounded border border-[#ff3c3c] break-all flex items-center gap-2">
                      {order.licenseKey}
                      <button
                        className="ml-2 px-2 py-1 rounded bg-[#ff3c3c] text-white text-xs font-bold hover:bg-[#ff7b7b] transition flex items-center gap-1"
                        onClick={() => handleCopy(order.licenseKey)}
                        title="Lizenz-Key kopieren"
                      >
                        <Copy className="w-4 h-4" />
                        {copiedKey === order.licenseKey ? "Kopiert!" : "Kopieren"}
                      </button>
                    </td>
                  </tr>
                  {order.amount && (
                    <tr>
                      <td className="py-1 pr-2 text-gray-400">Betrag:</td>
                      <td className="py-1 pl-2 text-white">{order.amount} €</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Footer */}
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">
                  Rechnung & Lizenz für Better Warzone Audio
                </span>
                <span className="text-xs text-gray-400">
                  {order.created
                    ? new Date(order.created).toLocaleDateString("de-DE")
                    : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
