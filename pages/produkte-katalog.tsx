"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackgroundGlow from "@/components/BackgroundGlow";
import { Check, Sparkles, Star, ShieldCheck, Info, Download } from "lucide-react";

const produkte = [
  {
    id: 'lifetime-key',
    name: 'Lifetime Key',
    price: 70,
    description: 'Einmal zahlen, für immer nutzen! Die Premium-Lizenz für alle Features und Updates.',
    features: [
      { text: 'Alle Premium Features der App', included: true },
      { text: 'Zugang zum Community Discord', included: true },
      { text: 'Premium Support per E-Mail', included: true },
      { text: 'Regelmäßige Updates & neue Audio-Presets', included: true },
      { text: 'Lifetime Lizenz für alle Updates', included: true },
      { text: 'Eigene Audio-Templates', included: true },
      { text: 'Alle Audio Tunes & Presets', included: true },
      { text: 'Erweiterte Einstellungen', included: true },
      { text: 'Lizenz Key Verwaltung', included: true },
      { text: 'Sofortige Aktivierung', included: true },
      { text: 'Kein Abo, keine automatische Verlängerung', included: true },
    ],
    badge: 'Lifetime',
    accent: 'red',
    highlight: 'Beste Wahl für Teams & Pros',
  },
  {
    id: 'license-1m',
    name: '1 Monat License Key',
    price: 10,
    description: '1 Monat voller Zugang zu allen Premium-Features, Community Discord und exklusiven Updates. Perfekt zum Ausprobieren oder für kurze Events.',
    features: [
      { text: 'Alle Premium Features der App', included: true },
      { text: 'Zugang zum Community Discord', included: true },
      { text: 'Premium Support per E-Mail', included: true },
      { text: 'Regelmäßige Updates & neue Audio-Presets', included: true },
      { text: 'Lizenz für 1 Monat', included: true },
      { text: 'Eigene Audio-Templates', included: true },
      { text: 'Alle Audio Tunes & Presets', included: true },
      { text: 'Erweiterte Einstellungen', included: true },
      { text: 'Lizenz Key Verwaltung', included: true },
      { text: 'Sofortige Aktivierung nach Kauf', included: true },
      { text: 'Upgrade jederzeit möglich', included: true },
      { text: 'Kein Abo, keine automatische Verlängerung', included: true },
    ],
    badge: '1 Monat',
    accent: 'red',
    highlight: 'Flexibel & günstig',
  },
  {
    id: 'license-3m',
    name: '3 Monate License Key',
    price: 30,
    description: '3 Monate Premium-Zugang für Vielspieler und Sparfüchse. Alle Features, Community und Support inklusive.',
    features: [
      { text: 'Alle Premium Features der App', included: true },
      { text: 'Zugang zum Community Discord', included: true },
      { text: 'Premium Support per E-Mail', included: true },
      { text: 'Regelmäßige Updates & neue Audio-Presets', included: true },
      { text: 'Lizenz für 3 Monate', included: true },
      { text: 'Eigene Audio-Templates', included: true },
      { text: 'Alle Audio Tunes & Presets', included: true },
      { text: 'Erweiterte Einstellungen', included: true },
      { text: 'Lizenz Key Verwaltung', included: true },
      { text: 'Sofortige Aktivierung nach Kauf', included: true },
      { text: 'Upgrade jederzeit möglich', included: true },
      { text: 'Kein Abo, keine automatische Verlängerung', included: true },
    ],
    badge: '3 Monate',
    accent: 'red',
    highlight: 'Beliebt bei Gamern',
  },
  {
    id: 'license-6m',
    name: '6 Monate License Key',
    price: 60,
    description: '6 Monate voller Premium-Zugang, alle Features, Community Discord und Support. Für alle, die langfristig profitieren wollen.',
    features: [
      { text: 'Alle Premium Features der App', included: true },
      { text: 'Zugang zum Community Discord', included: true },
      { text: 'Premium Support per E-Mail', included: true },
      { text: 'Regelmäßige Updates & neue Audio-Presets', included: true },
      { text: 'Lizenz für 6 Monate', included: true },
      { text: 'Eigene Audio-Templates', included: true },
      { text: 'Alle Audio Tunes & Presets', included: true },
      { text: 'Erweiterte Einstellungen', included: true },
      { text: 'Lizenz Key Verwaltung', included: true },
      { text: 'Sofortige Aktivierung nach Kauf', included: true },
      { text: 'Upgrade jederzeit möglich', included: true },
      { text: 'Kein Abo, keine automatische Verlängerung', included: true },
    ],
    badge: '6 Monate',
    accent: 'red',
    highlight: 'Maximaler Vorteil',
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
      { text: 'Schnelle Umsetzung (ca. 30-45 Min)', included: true },
      { text: 'Vorher/Nachher Vergleich', included: true },
      { text: 'Support für Gaming-Fragen', included: true },
    ],
    badge: 'Service',
    accent: 'green',
    highlight: 'Empfohlen für Gamer & Streamer',
    details: 'Ideal für alle, die ihren Gaming-PC ohne großen Aufwand auf ein neues Level bringen wollen. Persönliche Beratung inklusive.',
  },
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
      { text: 'Remote-Session & Support', included: true },
      { text: 'Individuelle Gaming-Profile', included: true },
      { text: 'Discord & Voice-Optimierung', included: true },
      { text: 'Komplette Dokumentation', included: true },
    ],
    badge: 'Full Service',
    accent: 'green',
    highlight: 'Maximale Power für Pros',
    details: 'Das Rundum-sorglos-Paket für Streamer, Pros und Teams. Alles wird individuell auf dich abgestimmt und dokumentiert.',
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
      { text: 'Tipps für Streaming-Qualität', included: true },
    ],
    badge: 'Streaming',
    accent: 'green',
    highlight: 'Für Streamer & Creator',
    details: 'Perfekt für alle, die ihren Stream technisch und klanglich auf das nächste Level bringen wollen. Auch für Einsteiger geeignet.',
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
      { text: 'Testaufnahme & Feintuning', included: true },
    ],
    badge: 'Audio Service',
    accent: 'green',
    highlight: 'Für perfekte Sprachqualität',
    details: 'Dein Mikrofon und Interface werden optimal eingestellt – für Streaming, Discord und Gaming. Inklusive Testaufnahme.',
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
      { text: 'Speedtest & Optimierung', included: true },
    ],
    badge: 'Netzwerk',
    accent: 'green',
    highlight: 'Für niedrigen Ping & stabile Verbindung',
    details: 'Ideal für alle, die beim Online-Gaming das Maximum aus ihrer Leitung holen wollen. Inklusive Ping-Test und Empfehlungen.',
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
      { text: 'Sicherheits-Check', included: true },
    ],
    badge: 'Setup',
    accent: 'green',
    highlight: 'Sauber & schnell',
    details: 'Dein System wird komplett neu und sauber aufgesetzt. Inklusive Tipps für Backups und Sicherheit.',
  },
];

export default function ProdukteKatalogPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-black font-sans">
      <Header />
      <BackgroundGlow />
      <main className="flex-1 flex flex-col items-center justify-center w-full pt-[90px] pb-32 relative z-10 font-sans">
        <div className="max-w-7xl w-full mx-auto px-4 font-sans">
          <div className="flex flex-col items-center mb-10 font-sans">
            <div className="flex items-center gap-3 mb-2 font-sans">
              <Sparkles className="w-10 h-10 text-[#ff3c3c] animate-spin-slow" />
              <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] bg-clip-text tracking-tight font-sans">
                Produkte Katalog
              </h1>
            </div>
            <span className="mt-2 px-4 py-1 rounded-full bg-red-900/60 text-red-300 text-xs font-bold border border-red-600/30 shadow font-sans">
              Alle Better Warzone Audio Produkte im Überblick
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {produkte.slice(0, 3).map((plan) => (
              <div
                key={plan.id}
                className="relative flex flex-col items-start border border-white/10 rounded-2xl p-6 shadow-xl transition-all duration-300 bg-[#18181b]/70 backdrop-blur-md w-full min-h-[340px] hover:scale-[1.03] hover:shadow-2xl font-sans"
                style={{
                  boxShadow: "0 8px 32px 0 rgba(0,0,0,0.22)",
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <span className={`absolute right-6 top-6 flex items-center rounded-full px-4 py-1 text-xs font-semibold shadow-lg ${plan.accent === 'green'
                      ? 'bg-gradient-to-r from-green-600 via-green-400 to-green-600 text-white'
                      : 'bg-gradient-to-r from-red-600 via-red-400 to-red-600 text-white'} font-sans`}>
                    {plan.badge} {plan.accent === 'green' ? <ShieldCheck className="ml-2 w-4 h-4" /> : <Star className="ml-2 w-4 h-4" />}
                  </span>
                )}
                {/* Name & Preis */}
                <div className="flex items-center gap-2 mb-1 font-sans">
                  <span className="font-bold text-xl text-white">{plan.name}</span>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <span className="block text-lg font-extrabold text-[#ff3c3c] mb-2 font-sans">
                  {typeof plan.price === 'number' ? `${plan.price} €` : plan.price}
                </span>
                {/* Beschreibung & Hinweise */}
                <div className="text-sm text-gray-400 mb-2 font-sans">
                  {plan.description}
                  {plan.highlight && (
                    <div className="text-xs text-[#ff3c3c] font-semibold mt-2 font-sans">{plan.highlight}</div>
                  )}
                </div>
                {/* Features */}
                <ul className="space-y-1 text-sm w-full mt-2 mb-2 font-sans">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-100 font-sans">
                      {feature.included ? (
                        <Check className={plan.accent === 'green' ? "size-4 text-green-400" : "size-4 text-red-400"} />
                      ) : (
                        <span className="size-4 text-red-400 font-bold text-lg">✗</span>
                      )}
                      <span className="font-sans">{feature.text}</span>
                    </li>
                  ))}
                </ul>
                {/* Technische Hinweise */}
                <div className="mt-auto pt-2 text-xs text-gray-500 border-t border-white/10 w-full font-sans">
                  <span>
                    <Info className="inline w-4 h-4 mr-1" />
                    Produktkategorie: Lizenz-Key
                  </span>
                  <br />
                  <span>
                    <Download className="inline w-4 h-4 mr-1" />
                    Lizenz-Key nach Kauf
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {produkte.slice(3).map((plan) => (
              <div
                key={plan.id}
                className="relative flex flex-col items-start border border-white/10 rounded-2xl p-6 shadow-xl transition-all duration-300 bg-[#18181b]/70 backdrop-blur-md w-full min-h-[340px] hover:scale-[1.03] hover:shadow-2xl font-sans"
                style={{
                  boxShadow: "0 8px 32px 0 rgba(0,0,0,0.22)",
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <span className={`absolute right-6 top-6 flex items-center rounded-full px-4 py-1 text-xs font-semibold shadow-lg ${plan.accent === 'green'
                      ? 'bg-gradient-to-r from-green-600 via-green-400 to-green-600 text-white'
                      : 'bg-gradient-to-r from-red-600 via-red-400 to-red-600 text-white'} font-sans`}>
                    {plan.badge} {plan.accent === 'green' ? <ShieldCheck className="ml-2 w-4 h-4" /> : <Star className="ml-2 w-4 h-4" />}
                  </span>
                )}
                {/* Name & Preis */}
                <div className="flex items-center gap-2 mb-1 font-sans">
                  <span className="font-bold text-xl text-white">{plan.name}</span>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <span className="block text-lg font-extrabold text-[#ff3c3c] mb-2 font-sans">
                  {typeof plan.price === 'number' ? `${plan.price} €` : plan.price}
                </span>
                {/* Beschreibung & Hinweise */}
                <div className="text-sm text-gray-400 mb-2 font-sans">
                  {plan.description}
                  {plan.highlight && (
                    <div className="text-xs text-[#ff3c3c] font-semibold mt-2 font-sans">{plan.highlight}</div>
                  )}
                </div>
                {/* Features */}
                <ul className="space-y-1 text-sm w-full mt-2 mb-2 font-sans">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-100 font-sans">
                      {feature.included ? (
                        <Check className={plan.accent === 'green' ? "size-4 text-green-400" : "size-4 text-red-400"} />
                      ) : (
                        <span className="size-4 text-red-400 font-bold text-lg">✗</span>
                      )}
                      <span className="font-sans">{feature.text}</span>
                    </li>
                  ))}
                </ul>
                {/* Technische Hinweise */}
                <div className="mt-auto pt-2 text-xs text-gray-500 border-t border-white/10 w-full font-sans">
                  <span>
                    <Info className="inline w-4 h-4 mr-1" />
                    Produktkategorie: Lizenz-Key
                  </span>
                  <br />
                  <span>
                    <Download className="inline w-4 h-4 mr-1" />
                    Lizenz-Key nach Kauf
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}