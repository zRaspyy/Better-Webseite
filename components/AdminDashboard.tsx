import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { ref, onValue, set, get } from 'firebase/database';
import { LayoutDashboard, BarChart2, Receipt, KeyRound, Users, Settings, Sparkles, LogOut, X, CheckCircle2, XCircle, Clock, CreditCard, BadgeDollarSign, Archive, RefreshCcw, FileText, Database, Sun, User, Bell, Gift } from 'lucide-react';
import { useUser } from '../context/UserContext';

// Importiere die ausgelagerten Tabs korrekt (Pfad beachten!)
import AnalyticsTab from './admin-tabs/AnalyticsTab';
import SettingsTab from './admin-tabs/SettingsTab';
import DiscordTab from './admin-tabs/DiscordTab';
import SocialsTab from './admin-tabs/SocialsTab';
import DataTab from './admin-tabs/DataTab';
import UpdatesTab from './admin-tabs/UpdatesTab';
// Affiliate Tab importieren
import AdminAffiliateTab from './admin-tabs/AdminAffiliateTab';
import CouponsTab from './admin-tabs/CouponsTab';
import NotificationsTab from './admin-tabs/NotificationsTab';

enum AdminTab {
  Analytics = 'analytics',
  Data = 'data',
  Settings = 'settings',
  Discord = 'discord',
  Socials = 'socials',
  Updates = 'updates',
  Affiliate = 'affiliate', // hinzugefügt
  Coupons = 'coupons', // hinzugefügt
  Notifications = 'notifications', // hinzugefügt
}

export default function AdminDashboard({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<AdminTab>(AdminTab.Analytics);
  const { user, avatar, logout } = useUser(); // avatar aus Context holen

  // Alle Daten aus der Datenbank
  const [analytics, setAnalytics] = useState<any>({});
  const [settings, setSettings] = useState<any>({});
  const [discordConfig, setDiscordConfig] = useState<any>({});
  const [socials, setSocials] = useState<any>({});
  const [data, setData] = useState<{ invoices: any[], users: any[], orders: any[] }>({ invoices: [], users: [], orders: [] });
  const [updates, setUpdates] = useState<{ [id: string]: any }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lade Settings
    const settingsRef = ref(db, 'settings');
    const unsubSettings = onValue(settingsRef, snap => {
      setSettings(snap.val() || {});
    });

    // Lade Discord Config
    const discordRef = ref(db, 'settings/discord');
    const unsubDiscord = onValue(discordRef, snap => {
      setDiscordConfig(snap.val() || {});
    });

    // Lade Socials
    const socialsRef = ref(db, 'settings/socials');
    const unsubSocials = onValue(socialsRef, snap => {
      setSocials(snap.val() || {});
    });

    // Lade Analytics (aus Settings und ggf. Invoices)
    const analyticsRef = ref(db, 'settings');
    const unsubAnalytics = onValue(analyticsRef, snap => {
      const val = snap.val() || {};
      setAnalytics({
        totalDownloads: val.downloads || 0,
        todayDownloads: val.downloads_today || 0,
        dailyDownloads: val['daily-downloads'] || 0,
        totalSales: val.totalSales || 0,
        totalRevenue: val.totalRevenue || 0,
        todaySales: val.todaySales || 0,
        todayRevenue: val.todayRevenue || 0,
      });
    });

    // Lade alle User, Invoices, Orders
    const usersRef = ref(db, 'users');
    const invoicesRef = ref(db, 'invoices');
    let unsubUsers = () => {};
    let unsubInvoices = () => {};
    unsubUsers = onValue(usersRef, snap => {
      const users = Object.entries(snap.val() || {}).map(([uid, data]: [string, any]) => ({ uid, ...data }));
      setData(d => ({ ...d, users }));
      setLoading(false);
    });
    unsubInvoices = onValue(invoicesRef, snap => {
      const invoices = Object.values(snap.val() || {});
      setData(d => ({ ...d, invoices }));
      setLoading(false);
    });

    // Lade Updates
    const updatesRef = ref(db, 'settings/updates');
    const unsubUpdates = onValue(updatesRef, snap => {
      setUpdates(snap.val() || {});
    });

    // Orders aus allen Usern extrahieren
    // (Wird im DataTab aus users extrahiert)

    return () => {
      unsubSettings();
      unsubDiscord();
      unsubSocials();
      unsubAnalytics();
      unsubUsers();
      unsubInvoices();
      unsubUpdates();
    };
  }, []);

  useEffect(() => {
    // Automatisch nach oben scrollen und Body-Scroll sperren
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Sidebar
  function renderSidebar() {
    return (
      <aside className="flex flex-col h-full w-64 bg-[#18181b] border-r border-[#23232a] py-8 px-4 justify-between">
        {/* Logo und Name */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#ff3c3c] rounded-xl p-2 flex items-center justify-center">
              <LayoutDashboard className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg text-white">Better Warzone Audio</div>
              <div className="text-xs text-gray-400">Admin Panel</div>
            </div>
          </div>
          {/* Navigation */}
          <nav className="mt-8">
            <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">Navigation</div>
            <ul className="flex flex-col gap-1">
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-base transition ${tab === 'analytics' ? 'bg-[#23232a] text-[#ff3c3c]' : 'text-gray-300 hover:bg-[#23232a]'}`}
                  onClick={() => setTab(AdminTab.Analytics)}
                >
                  <BarChart2 className="w-5 h-5" />
                  Analytics
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-base transition ${tab === 'data' ? 'bg-[#23232a] text-[#ff3c3c]' : 'text-gray-300 hover:bg-[#23232a]'}`}
                  onClick={() => setTab(AdminTab.Data)}
                >
                  <Database className="w-5 h-5" />
                  Datenbank
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-base transition ${tab === 'settings' ? 'bg-[#23232a] text-[#ff3c3c]' : 'text-gray-300 hover:bg-[#23232a]'}`}
                  onClick={() => setTab(AdminTab.Settings)}
                >
                  <Settings className="w-5 h-5" />
                  Einstellungen
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-base transition ${tab === 'discord' ? 'bg-[#23232a] text-[#ff3c3c]' : 'text-gray-300 hover:bg-[#23232a]'}`}
                  onClick={() => setTab(AdminTab.Discord)}
                >
                  <Users className="w-5 h-5" />
                  Discord
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-base transition ${tab === 'socials' ? 'bg-[#23232a] text-[#ff3c3c]' : 'text-gray-300 hover:bg-[#23232a]'}`}
                  onClick={() => setTab(AdminTab.Socials)}
                >
                  <FileText className="w-5 h-5" />
                  Socials
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-base transition ${tab === 'updates' ? 'bg-[#23232a] text-[#ff3c3c]' : 'text-gray-300 hover:bg-[#23232a]'}`}
                  onClick={() => setTab(AdminTab.Updates)}
                >
                  <Bell className="w-5 h-5" />
                  Updates
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-base transition ${tab === 'affiliate' ? 'bg-[#23232a] text-[#ff3c3c]' : 'text-gray-300 hover:bg-[#23232a]'}`}
                  onClick={() => setTab(AdminTab.Affiliate)}
                >
                  <Sparkles className="w-5 h-5" />
                  Affiliate
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-base transition ${tab === 'coupons' ? 'bg-[#23232a] text-[#ff3c3c]' : 'text-gray-300 hover:bg-[#23232a]'}`}
                  onClick={() => setTab(AdminTab.Coupons)}
                >
                  <Gift className="w-5 h-5" />
                  Coupons
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-base transition ${tab === 'notifications' ? 'bg-[#23232a] text-[#ff3c3c]' : 'text-gray-300 hover:bg-[#23232a]'}`}
                  onClick={() => setTab(AdminTab.Notifications)}
                >
                  <Bell className="w-5 h-5" />
                  Benachrichtigungen
                </button>
              </li>
            </ul>
            <div className="border-t border-[#23232a] my-4" />
            <ul className="flex flex-col gap-1">
              <li>
                <button
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-base text-gray-400 hover:bg-[#23232a] transition"
                  disabled
                >
                  <Sun className="w-5 h-5" />
                  Light Mode
                </button>
              </li>
              <li>
                <button
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-base text-gray-400 hover:bg-[#23232a] transition"
                  disabled
                >
                  <User className="w-5 h-5" />
                  Admin Profile
                </button>
              </li>
            </ul>
          </nav>
        </div>
        {/* Logout und Schließen unten */}
        <div className="flex flex-col gap-2 mt-8">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-base bg-[#23232a] text-gray-300 hover:bg-[#18181b] shadow"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
            Schließen
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-base bg-[#23232a] text-gray-300 hover:bg-[#18181b] shadow"
            onClick={async () => {
              await logout();
              onClose();
            }}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    );
  }

  // Kundenübersicht aus Invoices statt Users
  function renderCustomersList() {
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [highlightedUid, setHighlightedUid] = useState<string | null>(null);

    // Filter und Highlight
    const filtered = search
      ? data.invoices.filter(inv => inv.id?.includes(search) || inv.email?.includes(search) || inv.userId?.includes(search))
      : data.invoices;

    const visibleRows = expanded ? filtered : filtered.slice(0, 10);

    return (
      <div className="w-full bg-[#23232a] border border-[#444] shadow-lg p-8 flex flex-col items-center mt-10 rounded-none">
        <div className="w-full flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <h4 className="text-xl font-bold text-white flex items-center gap-2 flex-1">
            Kundenübersicht (Stripe-Käufe)
          </h4>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 rounded bg-[#18181b] border border-[#444] text-white font-mono w-full md:w-64"
            placeholder="Suche nach UID, Invoice-ID oder E-Mail"
          />
        </div>
        <div className="overflow-x-auto w-full" style={{maxHeight: expanded ? 'none' : '600px'}}>
          <table className="min-w-full bg-[#23232a] text-base rounded-none">
            <thead>
              <tr className="text-left text-gray-400 font-bold">
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Invoice-ID</th>
                <th className="py-2 px-4">Produkt</th>
                <th className="py-2 px-4">Preis</th>
                <th className="py-2 px-4">Paid</th>
                <th className="py-2 px-4">Payment Method</th>
                <th className="py-2 px-4">E-Mail</th>
                <th className="py-2 px-4">UID</th>
                <th className="py-2 px-4">Created At</th>
                <th className="py-2 px-4">Completed At</th>
                <th className="py-2 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((inv, idx) => (
                <tr
                  key={inv.id + idx}
                  className={`border-b border-[#444] text-white ${highlightedUid && (inv.userId === highlightedUid) ? 'bg-[#ff3c3c]/30' : ''}`}
                  ref={el => {
                    if (highlightedUid && inv.userId === highlightedUid && el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                >
                  <td className="py-2 px-4">
                    {inv.status === 'completed' || inv.paid
                      ? <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-700 text-white text-xs font-bold"><CheckCircle2 className="w-4 h-4" /> Completed</span>
                      : inv.status === 'expired'
                        ? <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-xs font-bold"><XCircle className="w-4 h-4" /> Expired</span>
                        : inv.status === 'manual'
                          ? <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-700 text-white text-xs font-bold"><RefreshCcw className="w-4 h-4" /> Manually Completed</span>
                          : <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-700 text-white text-xs font-bold"><Clock className="w-4 h-4" /> Pending</span>
                    }
                  </td>
                  <td className="py-2 px-4 font-mono">{inv.id}</td>
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
                  <td className="py-2 px-4">{inv.email}</td>
                  <td className="py-2 px-4 font-mono">{inv.userId ?? '-'}</td>
                  <td className="py-2 px-4">{inv.created ? new Date(inv.created).toLocaleString('de-DE') : '-'}</td>
                  <td className="py-2 px-4">{inv.completed ? new Date(inv.completed).toLocaleString('de-DE') : '-'}</td>
                  <td className="py-2 px-4">
                    <a href="#" className="text-blue-400 hover:underline flex items-center gap-1"><Archive className="w-4 h-4" /> Archive</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length > 10 && (
            <div className="w-full flex justify-center mt-4">
              <button
                className="px-6 py-2 rounded bg-[#23232a] text-gray-300 font-bold border border-[#ff3c3c] hover:bg-[#2d0101] transition"
                onClick={() => setExpanded(e => !e)}
              >
                {expanded ? 'Weniger anzeigen' : 'Mehr anzeigen'}
              </button>
            </div>
          )}
        </div>
        {filtered.length === 0 && <div className="text-gray-400 mt-4">Keine Stripe-Käufe gefunden.</div>}
        {/* UID Suche Button */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="UID suchen…"
            value={highlightedUid ?? ''}
            onChange={e => setHighlightedUid(e.target.value)}
            className="px-3 py-2 rounded bg-[#18181b] border border-[#444] text-white font-mono"
          />
          <button
            className="px-4 py-2 rounded bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] text-white font-bold"
            onClick={() => setHighlightedUid(highlightedUid)}
          >
            UID suchen
          </button>
        </div>
      </div>
    );
  }

  // Bestellungen für AnalyticsTab
  const latestOrders = data.invoices
    .filter((inv: any) => inv.paid || inv.status === "completed")
    .sort((a: any, b: any) => (b.completed || b.created) - (a.completed || a.created))
    .slice(0, 10)
    .map((inv: any) => ({
      id: inv.id,
      product: inv.product,
      price: inv.price,
      paymentMethod: inv.paymentMethod,
      email: inv.email,
      time: inv.completed ? new Date(inv.completed).toLocaleString("de-DE") : (inv.created ? new Date(inv.created).toLocaleString("de-DE") : "-"),
    }));

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      style={{ overscrollBehavior: 'contain' }}
    >
      <div
        className="relative bg-[#18181b] border border-[#23232a] rounded-2xl shadow-2xl p-0 w-full h-full mx-auto flex flex-row min-h-[1000px]"
        style={{ boxShadow: '0 0 80px 0 #000', overflow: 'hidden', maxWidth: '100vw', minWidth: '0' }}
      >
        {renderSidebar()}
        <div
          key={tab}
          className="flex-1 flex flex-col gap-8 p-10 overflow-y-auto relative"
          style={{ height: '100%', overscrollBehavior: 'contain', minWidth: 0 }}
        >
          {tab === AdminTab.Analytics && (
            <>
              <AnalyticsTab analytics={analytics} updates={updates} latestOrders={latestOrders} />
              {renderCustomersList()}
            </>
          )}
          {tab === AdminTab.Data && (
            <>
              <DataTab users={data.users} invoices={data.invoices} />
              {renderCustomersList()}
            </>
          )}
          {tab === AdminTab.Settings && (
            <SettingsTab settings={settings} />
          )}
          {tab === AdminTab.Discord && (
            <DiscordTab discordConfig={discordConfig || {}} />
          )}
          {tab === AdminTab.Socials && (
            <SocialsTab socials={socials} />
          )}
          {tab === AdminTab.Updates && (
            <UpdatesTab updates={updates} />
          )}
          {tab === AdminTab.Affiliate && (
            <AdminAffiliateTab />
          )}
          {tab === AdminTab.Coupons && (
            <CouponsTab />
          )}
          {tab === AdminTab.Notifications && (
            <NotificationsTab />
          )}
        </div>
      </div>
    </div>
  );
}
