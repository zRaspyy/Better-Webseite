"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShieldCheck, Info, Lock, UserCheck, Globe2 } from "lucide-react";

export default function DatenschutzPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-black font-sans">
      <Header />
      {/* Hintergrund-Glow wie im Impressum */}
      <div
        className="pointer-events-none fixed left-[10%] top-[10%] z-0"
        style={{
          width: 600,
          height: 400,
          filter: "blur(120px)",
          background: "radial-gradient(circle, #ff0000 0%, transparent 70%)",
          opacity: 0.13,
        }}
      />
      <div
        className="pointer-events-none fixed right-[5%] top-[40%] z-0"
        style={{
          width: 400,
          height: 320,
          filter: "blur(100px)",
          background: "radial-gradient(circle, #fff 0%, transparent 70%)",
          opacity: 0.08,
        }}
      />
      <div
        className="pointer-events-none fixed left-1/2 top-0 -translate-x-1/2 z-0"
        style={{
          width: 900,
          height: 400,
          filter: "blur(120px)",
          background: "radial-gradient(circle, #fff 0%, transparent 70%)",
          opacity: 0.1,
        }}
      />

      <main className="flex-1 flex flex-col items-center justify-start w-full pt-[110px] pb-40 relative z-10 font-sans">
        <div className="max-w-3xl w-full mx-auto px-4 font-sans">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-10 text-white tracking-tight flex items-center gap-4 font-sans">
            <ShieldCheck className="w-12 h-12 text-green-400" />
            Datenschutz
            <span className="ml-4 px-4 py-1 rounded-full bg-green-900/60 text-green-300 text-xs font-bold border border-green-600/30 shadow font-sans">
              DSGVO-konform
            </span>
          </h1>

          <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/80 border-l-4 border-green-600 rounded-xl p-6 mb-10 flex items-start gap-4 shadow-lg font-sans">
            <Lock className="w-8 h-8 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <div className="font-bold text-green-400 text-lg mb-1 uppercase tracking-wider font-sans">
                Deine Daten sind sicher!
              </div>
              <div className="text-zinc-200 text-base mb-2 font-sans">
                Wir nehmen den Schutz deiner persönlichen Daten sehr ernst. Deine
                Daten werden im Rahmen der gesetzlichen Vorschriften
                (insbesondere DSGVO) behandelt und niemals ohne deine Zustimmung
                weitergegeben.
              </div>
              <div className="text-zinc-300 text-base font-sans">
                <b>Kontakt für Datenschutz-Anfragen:</b>
                <br />
                E-Mail:{" "}
                <a
                  href="mailto:betterwarzoneaudio@gmail.com"
                  className="text-blue-400 underline font-sans"
                >
                  betterwarzoneaudio@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Datenschutz-Abschnitte */}
          <section className="mb-10 font-sans">
            <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2 font-sans">
              <Info className="w-6 h-6 text-blue-400" /> Allgemeine Hinweise
            </h2>
            <p className="text-zinc-300 mb-2 font-sans">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was
              mit deinen personenbezogenen Daten passiert, wenn du unsere Website
              besuchst. Personenbezogene Daten sind alle Daten, mit denen du
              persönlich identifiziert werden kannst.
            </p>
            <div className="flex flex-wrap gap-2 mt-2 font-sans">
              <span className="bg-green-900/60 text-green-300 px-3 py-1 rounded-full text-xs font-semibold border border-green-600/30 font-sans">
                Keine Weitergabe an Dritte
              </span>
              <span className="bg-blue-900/60 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold border border-blue-600/30 font-sans">
                SSL-Verschlüsselung
              </span>
              <span className="bg-zinc-800/60 text-zinc-200 px-3 py-1 rounded-full text-xs font-semibold border border-zinc-700/30 font-sans">
                Server in Deutschland
              </span>
            </div>
          </section>

          <section className="mb-10 font-sans">
            <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2 font-sans">
              <UserCheck className="w-6 h-6 text-green-400" /> Deine Rechte
            </h2>
            <ul className="list-disc pl-6 text-zinc-300 space-y-2 font-sans">
              <li>Auskunft über deine gespeicherten Daten</li>
              <li>Berichtigung unrichtiger Daten</li>
              <li>Löschung deiner Daten (Recht auf Vergessenwerden)</li>
              <li>Einschränkung der Verarbeitung</li>
              <li>Widerspruch gegen die Verarbeitung</li>
              <li>Datenübertragbarkeit</li>
            </ul>
            <p className="text-zinc-400 text-xs mt-2 font-sans">
              Du kannst dich jederzeit unter der oben angegebenen Adresse an uns
              wenden.
            </p>
          </section>

          <section className="mb-10 font-sans">
            <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2 font-sans">
              <Globe2 className="w-6 h-6 text-yellow-400" /> Datenerfassung auf
              unserer Website
            </h2>
            <p className="text-zinc-300 mb-2 font-sans">
              Deine Daten werden zum einen dadurch erhoben, dass du uns diese
              mitteilst (z.B. durch Eingabe in ein Formular). Andere Daten werden
              automatisch beim Besuch der Website durch unsere IT-Systeme erfasst
              (z.B. Internetbrowser, Betriebssystem, Uhrzeit des Seitenaufrufs).
            </p>
            <ul className="list-disc pl-6 text-zinc-300 space-y-2 font-sans">
              <li>Cookies werden nur für technische Zwecke verwendet</li>
              <li>Keine Tracking- oder Werbe-Cookies</li>
              <li>Keine Weitergabe an Dritte</li>
            </ul>
          </section>

          <section className="mb-10 font-sans">
            <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2 font-sans">
              <Lock className="w-6 h-6 text-green-400" /> Sicherheit deiner Daten
            </h2>
            <p className="text-zinc-300 mb-2 font-sans">
              Wir schützen deine Daten durch technische und organisatorische
              Maßnahmen gegen Verlust, Zerstörung, Zugriff, Veränderung oder
              Verbreitung durch unbefugte Personen.
            </p>
            <div className="flex flex-wrap gap-2 mt-2 font-sans">
              <span className="bg-green-900/60 text-green-300 px-3 py-1 rounded-full text-xs font-semibold border border-green-600/30 font-sans">
                SSL/TLS-Verschlüsselung
              </span>
              <span className="bg-zinc-800/60 text-zinc-200 px-3 py-1 rounded-full text-xs font-semibold border border-zinc-700/30 font-sans">
                Regelmäßige Backups
              </span>
            </div>
          </section>

          <section className="mb-10 font-sans">
            <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2 font-sans">
              <Info className="w-6 h-6 text-blue-400" /> Analyse-Tools und Tools
              von Drittanbietern
            </h2>
            <p className="text-zinc-300 mb-2 font-sans">
              Beim Besuch dieser Website kann dein Surf-Verhalten statistisch
              ausgewertet werden. Das geschieht vor allem mit Cookies und mit
              sogenannten Analyseprogrammen. Die Analyse deines Surf-Verhaltens
              erfolgt anonym; das Surf-Verhalten kann nicht zu dir zurückverfolgt
              werden.
            </p>
          </section>

          <section className="mb-10 font-sans">
            <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2 font-sans">
              <Info className="w-6 h-6 text-blue-400" /> Weitere Informationen
            </h2>
            <p className="text-zinc-300 mb-2 font-sans">
              Weitere Details findest du in unserer vollständigen
              Datenschutzerklärung oder auf Anfrage per E-Mail.
            </p>
            <div className="flex flex-wrap gap-2 mt-2 font-sans">
              <span className="bg-zinc-900/60 text-zinc-200 px-3 py-1 rounded-full text-xs font-semibold border border-zinc-700/30 font-sans">
                Stand:{" "}
                {new Date().toLocaleDateString("de-DE")}
              </span>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <style jsx global>{`
        body {
          background: #000 !important;
        }
        footer {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 40;
        }
        @media (max-width: 1024px) {
          footer {
            position: static;
          }
        }
      `}</style>
    </div>
  );
}
