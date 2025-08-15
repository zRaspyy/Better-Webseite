'use client';

import { useState, useRef, JSX, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import BackgroundGlow from './BackgroundGlow';
import { useCart } from '../context/CartContext';
import CustomToast from './CustomToast';
import { Download, Star, ShieldCheck, Headphones, Settings, Network, Monitor, Sparkles } from 'lucide-react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebaseConfig';

/**
 * Represents the context for managing the shopping cart.
 *
 * @property addToCart - Function to add an item to the cart.
 * @property items - Array of items currently in the cart.
 */
type CartCtx = {
  addToCart: (item: { id: string; name: string; price: number; priceId?: string }) => void;
  items: { id: string; name: string; price: number; priceId?: string }[];
};

type Produkt = {
  id: string;
  name: string;
  price: string | number;
  description: string;
  features: { text: string; included: boolean }[];
  buttonText: string;
  buttonAction: (() => void) | 'cart';
  badge: string | null;
  accent: 'green' | 'red';
  highlight?: string;
  priceId?: string;
};

const produkte: Produkt[] = [
  {
    id: 'pc-full',
    name: 'Full Optimierung',
    price: 120,
    description: 'Komplettpaket: PC, Netzwerk, Audio, Streaming, Windows, Treiber, BIOS, Sound, OBS, Discord und mehr. Maximale Performance für Pros.',
    features: [
      { text: 'Alle Standard-Optimierungen', included: true },
      { text: 'Netzwerk & Ping Tuning', included: true },
      { text: 'Audio & Sound Routing inkl. Presets', included: true },
      { text: 'Streaming & OBS Setup inkl. Szenen', included: true },
      { text: 'BIOS & Hardware-Check', included: true },
    ],
    badge: 'Full Service',
    accent: 'green',
    highlight: 'Maximale Power für Pros',
    buttonText: 'In den Warenkorb',
    buttonAction: 'cart',
  },
  {
    id: 'license-1m',
    name: '1 Monat License Key',
    price: 10,
    description: '1 Monat voller Zugang zu allen Premium-Features, Community Discord und exklusiven Updates. Perfekt zum Ausprobieren oder für kurze Events.',
    features: [
      { text: 'Alle Premium Features der App', included: true },
      { text: 'Zugang zum Community Discord', included: true },
      { text: 'Premium Support per Discord', included: true },
      { text: 'Regelmäßige Updates & neue Audio-Presets', included: true },
      { text: 'Lizenz für 1 Monat', included: true },
      { text: 'Exklusive Audio-Presets für Gaming & Streaming', included: true },
    ],
    badge: '1 Monat',
    accent: 'red',
    highlight: 'Flexibel & günstig',
    buttonText: 'In den Warenkorb',
    buttonAction: 'cart',
    priceId: 'price_1RvdnVL2fbcoGW3SOS9a5tQl',
  },
  {
    id: 'license-3m',
    name: '3 Monate License Key',
    price: 30,
    description: '3 Monate Premium-Zugang für Vielspieler und Sparfüchse. Alle Features, Community und Support inklusive.',
    features: [
      { text: 'Alle Premium Features der App', included: true },

      { text: 'Premium Support per Discord', included: true },
      { text: 'Regelmäßige Updates & neue Audio-Presets', included: true },
      { text: 'Lizenz für 3 Monate', included: true },
      { text: 'Exklusive Audio-Presets für Gaming & Streaming', included: true },
    ],
    badge: '3 Monate',
    accent: 'red',
    highlight: 'Beliebt bei Gamern',
    buttonText: 'In den Warenkorb',
    buttonAction: 'cart',
    priceId: 'price_1RvhBWL2fbcoGW3SMOQ233kZ',
  },
  {
    id: 'license-6m',
    name: '6 Monate License Key',
    price: 60,
    description: '6 Monate voller Premium-Zugang, alle Features, Community Discord und Support. Für alle, die langfristig profitieren wollen.',
    features: [
      { text: 'Alle Premium Features der App', included: true },
      { text: 'Zugang zum Community Discord', included: true },
      { text: 'Premium Support per Discord', included: true },
      { text: 'Regelmäßige Updates & neue Audio-Presets', included: true },
      { text: 'Lizenz für 6 Monate', included: true },
      { text: 'Exklusive Audio-Presets für Gaming & Streaming', included: true },
    ],
    badge: '6 Monate',
    accent: 'red',
    highlight: 'Maximaler Vorteil',
    buttonText: 'In den Warenkorb',
    buttonAction: 'cart',
    priceId: 'price_1RvhBdL2fbcoGW3S1hkJInCb',
  },
  {
    id: 'lifetime-key',
    name: 'Premium Lifetime Key',
    price: 70,
    description: 'Einmal zahlen, für immer nutzen! Die Premium-Lizenz für alle Features und Updates.',
    features: [
      { text: 'Alle Premium Features der App', included: true },
      { text: 'Zugang zum Community Discord', included: true },
      { text: 'Premium Support per Discord 24/7', included: true },
      { text: 'Regelmäßige Updates & neue Audio-Presets', included: true },
      { text: 'Lifetime Lizenz für alle Updates', included: true },
      { text: 'Exklusive Audio-Presets für Gaming & Streaming', included: true },
      { text: 'Priorisierter Premium-Support', included: true },
      { text: 'Zugang zu Beta-Features', included: true },
    ],
    badge: 'Lifetime',
    accent: 'red',
    highlight: 'Beste Wahl für Teams & Pros',
    buttonText: 'In den Warenkorb',
    buttonAction: 'cart',
  },
  {
    id: 'pc-standard',
    name: 'PC Optimierung Standard',
    price: 70,
    description: 'Standard-Optimierung für Gaming-PCs: Windows, Treiber, Registry, Hintergrunddienste und mehr. Für mehr FPS und Stabilität.',
    features: [
      { text: 'Windows & Treiber Tuning', included: true },
      { text: 'Registry & Hintergrunddienste optimieren', included: true },
      { text: 'Performance-Analyse & individuelle Empfehlungen', included: true },
      { text: 'Empfohlene Tools & Einstellungen', included: true },
      { text: 'Remote-Session möglich', included: true },
    ],
    badge: 'Service',
    accent: 'green',
    highlight: 'Empfohlen für Gamer & Streamer',
    buttonText: 'In den Warenkorb',
    buttonAction: 'cart',
  },
  {
    id: 'obs-settings',
    name: 'OBS Settings inkl. Sound Routing',
    price: 30,
    description: 'Optimale OBS Einstellungen für Streaming & Recording inkl. Sound Routing für Discord, Game, Musik und Alerts.',
    features: [
      { text: 'OBS Setup & Optimierung', included: true },
      { text: 'Sound Routing (Discord, Game, Musik, Alerts)', included: true },
      { text: 'Audio Presets für Streaming', included: true },
      { text: 'Remote-Session möglich', included: true },
      { text: 'Individuelle Szenen & Overlays', included: true },
    ],
    badge: 'Streaming',
    accent: 'green',
    highlight: 'Für Streamer & Creator',
    buttonText: 'In den Warenkorb',
    buttonAction: 'cart',
  },
  {
    id: 'audio-interface',
    name: 'Audio Interface (GOXLR, RODECAST o.ä.) einstellen',
    price: 40,
    description: 'Individuelle Einrichtung und Optimierung deines Audio-Interfaces für Gaming, Streaming und Voice.',
    features: [
      { text: 'GOXLR, RODECAST, Elgato, etc.', included: true },
      { text: 'Sound Presets & Routing', included: true },
      { text: 'Mic & Voice Einstellungen', included: true },
      { text: 'Remote-Session möglich', included: true },
      { text: 'EQ, Kompressor, Noise Gate', included: true },
    ],
    badge: 'Audio Service',
    accent: 'green',
    highlight: 'Für perfekte Sprachqualität',
    buttonText: 'In den Warenkorb',
    buttonAction: 'cart',
  },
  {
    id: 'netzwerk',
    name: 'Netzwerk Optimierung',
    price: 25,
    description: 'Ping, Latenz und Stabilität verbessern: Router, Windows, DNS, Firewall und mehr für bestes Online-Gaming.',
    features: [
      { text: 'Router & Windows Tuning', included: true },
      { text: 'DNS & Firewall Einstellungen', included: true },
      { text: 'Ping & Latenz Analyse', included: true },
      { text: 'Remote-Session möglich', included: true },
      { text: 'Empfohlene Gaming-Provider', included: true },
    ],
    badge: 'Netzwerk',
    accent: 'green',
    highlight: 'Für niedrigen Ping & stabile Verbindung',
    buttonText: 'In den Warenkorb',
    buttonAction: 'cart',
  },
  {
    id: 'windows-reset',
    name: 'Windows neu aufsetzen',
    price: 35,
    description: 'Komplette Neuinstallation von Windows inkl. Treiber, Updates, Basis-Optimierung und Einrichtung.',
    features: [
      { text: 'Windows Installation', included: true },
      { text: 'Treiber & Updates', included: true },
      { text: 'Basis-Optimierung', included: true },
      { text: 'Remote-Session möglich', included: true },
      { text: 'Backup & Restore Tipps', included: true },
    ],
    badge: 'Setup',
    accent: 'green',
    highlight: 'Sauber & schnell',
    buttonText: 'In den Warenkorb',
    buttonAction: 'cart',
  },
];

const ICONS: Record<string, JSX.Element> = {
  'free': <Download className="w-7 h-7 text-[#ff3c3c] mr-2" />,
  'lifetime-key': <Download className="w-7 h-7 text-[#ff3c3c] mr-2" />,
};

const PRODUCT_ICONS: Record<string, JSX.Element> = {
  'license-1m': <Star className="w-6 h-6 text-[#ff3c3c] mr-2" />,
  'license-3m': <Star className="w-6 h-6 text-[#ff3c3c] mr-2" />,
  'license-6m': <Star className="w-6 h-6 text-[#ff3c3c] mr-2" />,
  'lifetime-key': <Star className="w-6 h-6 text-[#ff3c3c] mr-2" />,
  'pc-standard': <Monitor className="w-6 h-6 text-green-400 mr-2" />,
  'pc-full': <Settings className="w-6 h-6 text-green-400 mr-2" />,
  'obs-settings': <Sparkles className="w-6 h-6 text-green-400 mr-2" />,
  'audio-interface': <Headphones className="w-6 h-6 text-green-400 mr-2" />,
  'netzwerk': <Network className="w-6 h-6 text-green-400 mr-2" />,
  'windows-reset': <ShieldCheck className="w-6 h-6 text-green-400 mr-2" />,
};

const CheckSvg = ({ checked }: { checked: boolean }) => (
  <svg className={`shrink-0 w-4 h-4 ${checked ? "text-[#ff3c3c]" : "text-gray-400"}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
  </svg>
);

const CARD_STYLE =
  "w-full max-w-lg p-8 bg-gradient-to-br from-[#23232a] to-[#18181b] border border-[#ff3c3c]/30 rounded-3xl shadow-2xl flex flex-col justify-between h-full relative transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_32px_0_rgba(255,60,60,0.25)]";

const Badge = ({ text }: { text: string }) => (
  <span className="badge">{text}</span>
);

const CardCheck = () => (
  <svg className="w-5 h-5 text-green-400 flex-shrink-0 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const Produkte = () => {
  const cart = useCart() as CartCtx;
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const toastTimeout = useRef<NodeJS.Timeout | null>(null);
  const [productAvailability, setProductAvailability] = useState<{ [id: string]: { available: boolean } }>({});

  useEffect(() => {
    const productsRef = ref(db, 'settings/products');
    const unsub = onValue(productsRef, snap => {
      setProductAvailability(snap.val() || {});
    });
    return () => unsub();
  }, []);

  // Helper: Ist das Produkt verfügbar?
  const isProductAvailable = (id: string) =>
    productAvailability[id]?.available === true;

  const handleAddToCart = (product: Produkt) => {
    if (cart && typeof cart.addToCart === 'function') {
      cart.addToCart({
        id: product.id,
        name: product.name,
        price: typeof product.price === 'number' ? product.price : 0,
        priceId: product.priceId,
      });
      setToastMsg(`${product.name} wurde zum Warenkorb hinzugefügt!`);
      setToastOpen(true);
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setToastOpen(false), 2000);
    }
  };

  return (
    <section id="produkte-section" className="w-full min-h-screen flex flex-col items-center justify-center py-20 font-sans">
      <BackgroundGlow />
      <div className="w-full flex flex-col items-center justify-center">
        {/* Überschrift und Unterüberschrift */}
        <h2 className="text-5xl font-black text-white mb-3 text-center drop-shadow-lg font-sans">
          Unsere Produkte
        </h2>
        <p className="text-lg text-gray-300 mb-12 text-center font-sans max-w-2xl">
          Wähle deinen Lizenz-Key und sichere dir alle Premium-Features, Discord-Zugang und regelmäßige Updates.<br />
          Einmal zahlen – dauerhaft profitieren!
        </p>
        {/* Lifetime-Key einzeln und zentriert */}
        <div className="flex justify-center mb-16 w-full">
          {(() => {
            const plan = produkte.find(p => p.id === 'lifetime-key');
            if (!plan) return null;
            const isDisabled = !isProductAvailable(plan.id) || plan.buttonText === 'Nicht verfügbar';
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto flex flex-col items-center font-sans group transition-all duration-300
                  ${isDisabled ? 'opacity-50 pointer-events-none grayscale' : ''}
                  hover:scale-[1.04] hover:shadow-[0_0_32px_0_rgba(255,60,60,0.35)]`}
                style={{
                  background: "linear-gradient(120deg, rgba(24,24,27,0.58) 60%, rgba(45,1,1,0.38) 120%)",
                  border: "1.5px solid #ff3c3c",
                  boxShadow: "0 8px 32px 0 rgba(255,0,0,0.13)",
                  minWidth: 340,
                  maxWidth: 400,
                  backdropFilter: "blur(60px)",
                  WebkitBackdropFilter: "blur(60px)",
                  position: "relative",
                  overflow: "visible",
                }}
              >
                {/* Badge exakt mittig an der Card-Oberkante */}
                {plan.badge && (
                  <span
                    className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-5 py-1 rounded-full shadow-lg text-xs font-bold uppercase tracking-widest z-30
                      ${plan.accent === 'green'
                        ? 'bg-gradient-to-r from-green-600 via-green-400 to-green-600 text-white'
                        : 'bg-[#ff3c3c] text-white border border-[#ff3c3c]'}
                    `}
                    style={{
                      boxShadow: "0 2px 12px 0 rgba(255,60,60,0.13)",
                      fontSize: "1rem",
                      pointerEvents: "none",
                    }}
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    {plan.badge}
                  </span>
                )}
                {/* Produktname mit Icon */}
                <div className="flex items-center justify-center text-2xl font-extrabold text-white mb-2 text-center font-sans mt-8">
                  {PRODUCT_ICONS[plan.id]}
                  {plan.name}
                </div>
                {/* Preis */}
                <div className="text-4xl font-extrabold text-white mb-2 text-center font-sans">
                  €{plan.price}
                </div>
                <div className="text-base text-gray-400 mb-4 text-center font-semibold font-sans">
                  Einmalige Zahlung
                </div>
                {/* Features mit abgesetzter Box und roter, cleaner Scrollbar */}
                <div
                  className="w-full mb-6 feature-scrollbox"
                  style={{
                    background: "rgba(24,24,27,0.42)",
                    borderRadius: "12px",
                    border: "1px solid #ff3c3c",
                    maxHeight: "220px",
                    overflowY: "auto",
                    boxShadow: "0 0 0 1px #23232a",
                  }}
                >
                  <ul className="flex flex-col gap-0 py-2 font-sans">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center text-base text-white font-medium px-4 py-3 border-b border-[#23232a] last:border-b-0 font-sans"
                        style={{
                          background: "transparent",
                          letterSpacing: "0.01em",
                        }}
                      >
                        <svg className="w-5 h-5 text-[#ff3c3c] flex-shrink-0 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="ml-1">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Custom Scrollbar global für die Feature-Box */}
                <style jsx global>{`
                  .feature-scrollbox::-webkit-scrollbar {
                    width: 7px;
                    background: transparent;
                  }
                  .feature-scrollbox::-webkit-scrollbar-thumb {
                    background: #ff3c3c;
                    border-radius: 8px;
                    border: 2px solid #23232a;
                  }
                  .feature-scrollbox::-webkit-scrollbar-track {
                    background: #18181b;
                    border-radius: 8px;
                  }
                `}</style>
                {/* Buy Button */}
                <button
                  type="button"
                  className={`w-full mt-2 mb-2 flex items-center justify-center gap-2 px-0 py-0 font-sans transition-all duration-200
                    ${isDisabled ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'group-hover:bg-[#ff3c3c] group-hover:text-white'}`}
                  disabled={isDisabled}
                  onClick={() => !isDisabled && (plan.buttonAction === 'cart' ? handleAddToCart(plan) : (typeof plan.buttonAction === 'function' && plan.buttonAction()))}
                >
                  <span className={`w-full rounded-lg ${isDisabled ? 'bg-gray-700 text-gray-400' : 'bg-[#ff0000] text-white group-hover:bg-[#ff3c3c]'} font-bold text-lg py-4 shadow-lg transition-all flex items-center justify-center font-sans`}>
                    {!isDisabled && (
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    )}
                    {plan.buttonText}
                  </span>
                </button>
                {/* Stripe Hinweis */}
                <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-400 font-sans">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-9a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2zm10-12V6a4 4 0 00-8 0v3" />
                  </svg>
                  Secure checkout via Stripe
                </div>
              </div>
            );
          })()}
        </div>
        {/* Alle anderen Produkte darunter */}
        <div className="flex flex-wrap gap-12 justify-center">
          {produkte.filter(p => p.id !== 'lifetime-key').map((plan) => {
            const isDisabled = !isProductAvailable(plan.id) || plan.buttonText === 'Nicht verfügbar';
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto flex flex-col items-center font-sans group transition-all duration-300
                  ${isDisabled ? 'opacity-50 pointer-events-none grayscale' : ''}
                  hover:scale-[1.04] hover:shadow-[0_0_32px_0_rgba(255,60,60,0.35)]`}
                style={{
                  background: "linear-gradient(120deg, rgba(24,24,27,0.58) 60%, rgba(45,1,1,0.38) 120%)",
                  border: "1.5px solid #ff3c3c",
                  boxShadow: "0 8px 32px 0 rgba(255,0,0,0.13)",
                  minWidth: 340,
                  maxWidth: 400,
                  backdropFilter: "blur(60px)",
                  WebkitBackdropFilter: "blur(60px)",
                  position: "relative",
                  overflow: "visible",
                }}
              >
                {/* Badge exakt mittig an der Card-Oberkante */}
                {plan.badge && (
                  <span
                    className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-5 py-1 rounded-full shadow-lg text-xs font-bold uppercase tracking-widest z-30
                      ${plan.accent === 'green'
                        ? 'bg-gradient-to-r from-green-600 via-green-400 to-green-600 text-white'
                        : 'bg-[#ff3c3c] text-white border border-[#ff3c3c]'}
                    `}
                    style={{
                      boxShadow: "0 2px 12px 0 rgba(255,60,60,0.13)",
                      fontSize: "1rem",
                      pointerEvents: "none",
                    }}
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    {plan.badge}
                  </span>
                )}
                {/* Produktname mit Icon */}
                <div className="flex items-center justify-center text-2xl font-extrabold text-white mb-2 text-center font-sans mt-8">
                  {PRODUCT_ICONS[plan.id]}
                  {plan.name}
                </div>
                {/* Preis */}
                <div className="text-4xl font-extrabold text-white mb-2 text-center font-sans">
                  €{plan.price}
                </div>
                <div className="text-base text-gray-400 mb-4 text-center font-semibold font-sans">
                  Einmalige Zahlung
                </div>
                {/* Features mit abgesetzter Box und roter, cleaner Scrollbar */}
                <div
                  className="w-full mb-6 feature-scrollbox"
                  style={{
                    background: "rgba(24,24,27,0.42)",
                    borderRadius: "12px",
                    border: "1px solid #ff3c3c",
                    maxHeight: "220px",
                    overflowY: "auto",
                    boxShadow: "0 0 0 1px #23232a",
                  }}
                >
                  <ul className="flex flex-col gap-0 py-2 font-sans">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center text-base text-white font-medium px-4 py-3 border-b border-[#23232a] last:border-b-0 font-sans"
                        style={{
                          background: "transparent",
                          letterSpacing: "0.01em",
                        }}
                      >
                        <svg className="w-5 h-5 text-[#ff3c3c] flex-shrink-0 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="ml-1">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Custom Scrollbar global für die Feature-Box */}
                <style jsx global>{`
                  .feature-scrollbox::-webkit-scrollbar {
                    width: 7px;
                    background: transparent;
                  }
                  .feature-scrollbox::-webkit-scrollbar-thumb {
                    background: #ff3c3c;
                    border-radius: 8px;
                    border: 2px solid #23232a;
                  }
                  .feature-scrollbox::-webkit-scrollbar-track {
                    background: #18181b;
                    border-radius: 8px;
                  }
                `}</style>
                {/* Buy Button */}
                <button
                  type="button"
                  className={`w-full mt-2 mb-2 flex items-center justify-center gap-2 px-0 py-0 font-sans transition-all duration-200
                    ${isDisabled ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'group-hover:bg-[#ff3c3c] group-hover:text-white'}`}
                  disabled={isDisabled}
                  onClick={() => !isDisabled && (plan.buttonAction === 'cart' ? handleAddToCart(plan) : (typeof plan.buttonAction === 'function' && plan.buttonAction()))}
                >
                  <span className={`w-full rounded-lg ${isDisabled ? 'bg-gray-700 text-gray-400' : 'bg-[#ff0000] text-white group-hover:bg-[#ff3c3c]'} font-bold text-lg py-4 shadow-lg transition-all flex items-center justify-center font-sans`}>
                    {!isDisabled && (
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    )}
                    {plan.buttonText}
                  </span>
                </button>
                {/* Stripe Hinweis */}
                <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-400 font-sans">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-9a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2zm10-12V6a4 4 0 00-8 0v3" />
                  </svg>
                  Secure checkout via Stripe
                </div>
              </div>
            );
          })}
        </div>
        <div className="fixed bottom-6 right-6 z-[9999]">
          {toastOpen && (
            <CustomToast
              message={toastMsg}
              onClose={() => setToastOpen(false)}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Produkte;
