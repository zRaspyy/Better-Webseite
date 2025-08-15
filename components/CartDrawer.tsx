import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { X, Trash2, ChevronDown, CreditCard, Gift, ShoppingCart, ArrowLeft, Info } from 'lucide-react';
import UserDashboard from './user-dashboard/UserDashboard';
import { ref, set, onValue, get } from 'firebase/database';
import { db } from '../firebaseConfig';
import { FaDiscord, FaPaypal } from 'react-icons/fa';

type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  iconName?: string;
  quantity?: number;
  variant?: string;
  variants?: string[];
};

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const TAX_RATE = 0.19; // 19% MwSt

const PAYMENT_OPTIONS = [
  { id: 'stripe', label: 'Stripe', icon: <CreditCard className="w-5 h-5 mr-2" /> },
  { id: 'paypal', label: 'PayPal (coming soon)', icon: <FaPaypal className="w-5 h-5 mr-2" />, disabled: true },
];

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { items, removeFromCart, clearCart, updateCartItem } = useCart() ?? {
    items: [] as CartItem[],
    removeFromCart: () => {},
    clearCart: () => {},
    updateCartItem: () => {},
  };
  const cartItems = items as CartItem[];
  const { user } = useUser() ?? {};
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [discordAuthenticated, setDiscordAuthenticated] = useState(false);
  const [discordData, setDiscordData] = useState<any>(null);
  const [discordLoading, setDiscordLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [continueShopping, setContinueShopping] = useState(false);
  const [couponsDb, setCouponsDb] = useState<{ [code: string]: { discount: number } }>({});
  const [testkaufEnabled, setTestkaufEnabled] = useState(true);

  // Rabattcode prüfen (aus Datenbank)
  const aff = (() => {
    try {
      const rid = typeof document !== 'undefined' ? document.cookie.split('; ').find(r=>r.startsWith('aff_ref=')) : null
      const disc = typeof document !== 'undefined' ? document.cookie.split('; ').find(r=>r.startsWith('aff_disc=')) : null
      const aid = rid ? decodeURIComponent(rid.split('=')[1]) : null
      const d = disc ? parseFloat(decodeURIComponent(disc.split('=')[1])) : 0.05
      return { aid, d: isNaN(d) ? 0.05 : d }
    } catch { return { aid: null, d: 0.05 } }
  })();

  // Responsive
  useEffect(() => {
    if (open || showSuccess) {
      // Nur scrollen, wenn nicht oben
      if (window.scrollY > 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, showSuccess]);

  // Discord-Auth
  useEffect(() => {
    if (user?.uid) {
      const discordRef = ref(db, `users/${user.uid}/discord`);
      const unsub = onValue(discordRef, (snap) => {
        const val = snap.val();
        if (val) {
          setDiscordAuthenticated(true);
          setDiscordData(val);
        }
      });
      return () => unsub();
    }
  }, [user?.uid, open]);

  useEffect(() => {
    function handleDiscordAuth(event: MessageEvent) {
      if (event.data?.type === 'discord-auth-success') {
        setDiscordAuthenticated(true);
        setDiscordData(event.data.discord);
        if (user?.uid && event.data.discord) {
          set(ref(db, `users/${user.uid}/discord`), event.data.discord);
        }
        setDiscordLoading(false);
      }
    }
    window.addEventListener('message', handleDiscordAuth);
    return () => window.removeEventListener('message', handleDiscordAuth);
  }, [user?.uid]);

  useEffect(() => {
    const couponsRef = ref(db, 'settings/coupons');
    const unsub = onValue(couponsRef, snap => {
      setCouponsDb(snap.val() || {});
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const testkaufRef = ref(db, 'settings/testkaufEnabled');
    const unsubTestkauf = onValue(testkaufRef, snap => {
      setTestkaufEnabled(snap.val() !== false);
    });
    return () => {
      unsubTestkauf();
    };
  }, []);

  // Preisberechnung
  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * (item.quantity ?? 1), 0);
  const discount = couponApplied ? couponApplied.discount : 0;
  const total = Math.round((subtotal - discount) * 100) / 100;

  // Versand/Lizenzinfos
  const licenseInfo = "Dein Key wird nach erfolgreicher Zahlung sofort im User Dashboard angezeigt und per E-Mail versendet.";

  // Rabattcode prüfen (aus Datenbank)
  const handleApplyCoupon = () => {
    setCouponError('');
    if (!coupon) return;
    const code = coupon.trim().toUpperCase();
    if (couponsDb[code]) {
      setCouponApplied({ code, discount: couponsDb[code].discount });
      setCoupon('');
    } else {
      setCouponError('Ungültiger Rabattcode.');
    }
  };

  // Mengenänderung
  const handleQuantityChange = (id: string, quantity: number) => {
    updateCartItem(id, { quantity });
  };

  // Variantenwechsel
  const handleVariantChange = (id: string, variant: string) => {
    updateCartItem(id, { variant });
  };

  // Discord Login
  const handleDiscordLogin = async () => {
    setDiscordLoading(true);
    window.open(
      `/auth/discord`,
      'DiscordLogin',
      'width=500,height=700'
    );
  };

  // Checkout
  const handleCheckout = async () => {
    if (!user || loading || !discordAuthenticated || paymentMethod !== 'stripe') return;
    setLoading(true);
    // Hole die aktuelle Origin (auch mit Affiliate-Parametern)
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const successUrl = origin + '/success';
    const cancelUrl = origin + '/cart?cancelled=true';
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartItems,
        userId: user.uid,
        userEmail: user.email,
        coupon: couponApplied?.code,
        successUrl,
        cancelUrl,
      }),
    });
    const data = await res.json();
    if (data.url) {
      window.open(data.url, '_blank');
    }
    setTimeout(() => {
      setShowSuccess(true);
      setLoading(false);
      clearCart();
    }, 2000);
  };

  // Testkauf
  const handleTestCheckout = async () => {
    if (!user || loading || !discordAuthenticated) return;
    setLoading(true);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartItems,
        userId: user.uid,
        userEmail: user.email,
        test: true,
        coupon: couponApplied?.code,
      }),
    });
    await res.json();
    setTimeout(() => {
      setShowSuccess(true);
      setLoading(false);
      clearCart();
    }, 2000);
  };

  // Weiter einkaufen
  const handleContinueShopping = () => {
    setContinueShopping(true);
    onClose();
    setTimeout(() => setContinueShopping(false), 500);
  };

  // Zahlungsoptionen
  const renderPaymentOptions = () => (
    <div className="flex flex-row gap-3 mt-2 mb-4">
      {PAYMENT_OPTIONS.map(opt => (
        <button
          key={opt.id}
          className={`flex items-center px-4 py-2 rounded-lg font-bold text-base transition shadow border border-white/10 ${
            paymentMethod === opt.id ? 'bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] text-white' : 'bg-[#18181b] text-gray-300 hover:bg-[#23232a]'
          } ${opt.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !opt.disabled && setPaymentMethod(opt.id)}
          disabled={!!opt.disabled}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );

  // Checkout-Button
  const renderCheckoutButton = () => {
    if (!discordAuthenticated) {
      return (
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#7289da] text-white font-bold text-base transition-all duration-300"
          onClick={handleDiscordLogin}
          disabled={discordLoading}
        >
          <FaDiscord className="w-6 h-6" />
          Mit Discord anmelden & verknüpfen
        </button>
      );
    }
    return (
      <>
        <button
          className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 via-green-400 to-green-600 text-white font-bold text-base shadow-md hover:bg-green-700 transition-all mb-2"
          onClick={handleCheckout}
          disabled={!user || loading || paymentMethod !== 'stripe' || cartItems.length === 0}
        >
          {loading ? 'Wird geladen...' : 'Mit Stripe bezahlen'}
        </button>
        {testkaufEnabled && (
          <button
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 text-white font-bold text-base shadow-md hover:bg-blue-700 transition-all mb-2"
            onClick={handleTestCheckout}
            disabled={!user || loading}
          >
            {loading ? 'Wird geladen...' : 'Testkauf durchführen'}
          </button>
        )}
      </>
    );
  };

  // Produkt-Auswahlmenü
  const renderCartItems = () => (
    <ul className="w-full mb-6">
      {cartItems.map((item) => (
        <li
          key={item.id}
          className="flex flex-col md:flex-row items-center justify-between py-4 border-b border-white/10 gap-4 md:gap-0"
        >
          <div className="flex items-center gap-4 w-full md:w-auto">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shadow" />
            ) : (
              <ShoppingCart className="w-12 h-12 text-[#ff3c3c] bg-[#23232a] rounded-xl p-2" />
            )}
            <div>
              <span className="font-bold text-white text-lg">{item.name}</span>
              <div className="text-xs text-gray-400">{item.description}</div>
              {item.variants && (
                <div className="mt-2">
                  <label className="text-xs text-gray-300 mr-2">Variante:</label>
                  <select
                    className="bg-[#18181b] text-white px-2 py-1 rounded border border-white/10"
                    value={item.variant ?? item.variants[0]}
                    onChange={e => handleVariantChange(item.id, e.target.value)}
                  >
                    {item.variants.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-300 font-bold text-lg">{item.price} €</span>
            <div className="flex items-center gap-1">
              <label className="text-xs text-gray-400 mr-1">Menge:</label>
              <select
                className="bg-[#18181b] text-white px-2 py-1 rounded border border-white/10"
                value={item.quantity ?? 1}
                onChange={e => handleQuantityChange(item.id, Number(e.target.value))}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            <button
              className="ml-2 text-red-400 hover:text-red-600 text-sm p-2 rounded transition-all"
              onClick={() => removeFromCart(item.id)}
              aria-label="Entfernen"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );

  if (!open && !showSuccess) return null;

  return (
    <>
      <div className="fixed inset-0 z-[200]">
        {/* Overlay: leichter Blur, Seite bleibt sichtbar */}
        <div
          className="absolute inset-0 pointer-events-auto bg-black/30 backdrop-blur-md transition-all duration-300"
          onClick={() => {
            if (showSuccess) return;
            onClose();
          }}
          style={showSuccess ? { pointerEvents: 'none' } : {}}
        />
        {/* Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-full max-w-xl bg-[#18181b] border-l border-white/10 shadow-2xl z-10 flex flex-col transition-transform duration-300 pointer-events-auto ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            borderRadius: '32px 0 0 32px',
            boxShadow: '0 8px 32px 0 #000',
            overflow: 'hidden',
          }}
        >
          <div className="flex items-center justify-between px-8 py-7 border-b border-white/10 bg-gradient-to-r from-[#23232a] to-[#18181b]">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Warenkorb</h2>
            <button
              className="text-gray-400 hover:text-white text-xl p-2 rounded transition"
              onClick={onClose}
              aria-label="Schließen"
            >
              <X />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {/* Produktliste */}
            {cartItems.length === 0 ? (
              <div className="text-gray-400 mt-8 text-center text-lg">Dein Warenkorb ist leer.</div>
            ) : (
              <>
                {renderCartItems()}
              </>
            )}
            {/* Rabattcode & Lizenzinfo & Zahlungsoptionen & Preisübersicht & Buttons immer anzeigen */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                {/* Affiliate Hinweis */}
                {aff.aid && (
                  <div className="mb-2 text-green-400 text-sm font-bold">
                    Affiliate-Rabatt aktiv: -{Math.round(aff.d*100)}% durch Empfehlung!
                  </div>
                )}
                <label className="text-sm text-gray-300 font-semibold mb-2 flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  Rabattcode
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#23232a] border border-white/10 text-white font-mono"
                    placeholder="Code eingeben"
                    disabled={!!couponApplied}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className={`px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] text-white transition-all duration-300 ${couponApplied ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!!couponApplied}
                  >
                    Einlösen
                  </button>
                </div>
                {couponError && <div className="text-red-400 text-xs mt-1">{couponError}</div>}
                {couponApplied && (
                  <div className="text-green-400 text-xs mt-1">
                    Rabattcode <b>{couponApplied.code}</b> angewendet: -{couponApplied.discount} €
                    <button className="ml-2 text-gray-400 underline" onClick={() => setCouponApplied(null)}>Entfernen</button>
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm text-gray-300 font-semibold mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Lizenz & Lieferung
                </label>
                <div className="bg-[#23232a] rounded-lg p-3 text-xs text-gray-300">
                  {licenseInfo}
                </div>
              </div>
            </div>
            <div className="mb-6">
              <label className="text-sm text-gray-300 font-semibold mb-2">Zahlungsoptionen</label>
              {renderPaymentOptions()}
            </div>
            <div className="mb-6">
              <div className="bg-[#23232a] rounded-xl p-6 shadow flex flex-col gap-2">
                <div className="flex justify-between items-center text-base">
                  <span className="text-gray-300">Zwischensumme</span>
                  <span className="font-bold text-white">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center text-base">
                  <span className="text-gray-300">Rabatt</span>
                  <span className="font-bold text-green-400">-{discount.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center text-base">
                  <span className="text-gray-300">Versand</span>
                  <span className="font-bold text-white">0,00 €</span>
                </div>
                <div className="flex justify-between items-center text-lg mt-2">
                  <span className="font-bold text-white">Endsumme</span>
                  <span className="font-extrabold text-[#ff3c3c] text-2xl">{total.toFixed(2)} €</span>
                </div>
              </div>
            </div>
            {renderCheckoutButton()}
            <div className="flex flex-row gap-2 mt-6">
              <button
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#23232a] to-[#18181b] text-white font-bold border border-white/10 hover:bg-[#23232a] transition"
                onClick={handleContinueShopping}
                disabled={false}
              >
                <ArrowLeft className="w-5 h-5 mr-2 inline" />
                Weiter einkaufen
              </button>
              <button
                className="flex-1 py-2 rounded-xl border border-red-400 text-red-400 font-bold hover:bg-red-900/20 transition-all"
                onClick={clearCart}
                disabled={false}
              >
                <Trash2 className="w-5 h-5 mr-2 inline" />
                Warenkorb leeren
              </button>
            </div>
          </div>
        </div>
        {/* Erfolgsmeldung Modal */}
        {showSuccess && (
          <div className="fixed inset-0 z-[201] flex items-center justify-center pointer-events-auto">
            <div className="bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-xs flex flex-col items-center">
              <h2 className="text-2xl font-bold text-white mb-2 text-center">Erfolgreich gekauft!</h2>
              <p className="mb-4 text-gray-300 text-center text-sm">
                Vielen Dank für deinen Einkauf.<br />
                Du erhältst gleich eine Bestätigung per E-Mail mit deinem Lifetime Key.<br />
                <span className="font-semibold text-[#ff3c3c]">Deinen Key findest du jederzeit im <span className="underline cursor-pointer" onClick={() => setShowDashboard(true)}>User Dashboard</span> unter <b>Bestellungen</b>.</span><br />
                Du kannst ihn dort kopieren und solltest ihn sicher aufbewahren.<br />
                <span className="text-xs text-gray-400">Ohne Key ist die Nutzung der App nicht möglich!</span>
              </p>
              <button
                className="w-full mb-2 px-6 py-2 rounded-xl bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] text-white font-bold"
                onClick={() => {
                  setShowSuccess(false);
                  onClose();
                }}
              >
                Schließen
              </button>
              <button
                className="w-full px-6 py-2 rounded-xl bg-[#23232a] text-[#ff3c3c] font-bold border border-[#ff3c3c] hover:bg-[#2d0101] transition"
                onClick={() => {
                  setShowSuccess(false);
                  setShowDashboard(true);
                }}
              >
                Zum User Dashboard (Bestellungen)
              </button>
            </div>
          </div>
        )}
      </div>
      {/* User Dashboard Modal */}
      {showDashboard && (
        <UserDashboard onClose={() => setShowDashboard(false)} initialTab="orders" />
      )}
    </>
  );
};

export default CartDrawer;
