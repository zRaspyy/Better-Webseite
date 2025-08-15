"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Info } from "lucide-react";

export default function AgbPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-black font-sans">
      <Header />
      {/* Hintergrund-Glow wie Datenschutz/Impressum */}
      <div className="pointer-events-none fixed left-[10%] top-[10%] z-0" style={{
        width: 600, height: 400, filter: "blur(120px)",
        background: "radial-gradient(circle, #ff0000 0%, transparent 70%)", opacity: 0.13
      }} />
      <div className="pointer-events-none fixed right-[5%] top-[40%] z-0" style={{
        width: 400, height: 320, filter: "blur(100px)",
        background: "radial-gradient(circle, #fff 0%, transparent 70%)", opacity: 0.08
      }} />
      <div className="pointer-events-none fixed left-1/2 top-0 -translate-x-1/2 z-0" style={{
        width: 900, height: 400, filter: "blur(120px)",
        background: "radial-gradient(circle, #fff 0%, transparent 70%)", opacity: 0.10
      }} />

      <main className="flex-1 flex flex-col items-center justify-start w-full pt-[110px] pb-40 relative z-10 font-sans">
        <div className="max-w-3xl w-full mx-auto px-4 font-sans">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-10 text-white tracking-tight flex items-center gap-4 font-sans">
            <Info className="w-10 h-10 text-yellow-400" />
            Allgemeine Geschäftsbedingungen (AGB)
          </h1>
          <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/80 border-l-4 border-yellow-500 rounded-xl p-6 mb-10 flex items-start gap-4 shadow-lg font-sans">
            <Info className="w-8 h-8 text-yellow-400 mt-1 flex-shrink-0" />
            <div>
              <div className="font-bold text-yellow-400 text-lg mb-1 uppercase tracking-wider font-sans">
                Geltungsbereich
              </div>
              <div className="text-zinc-200 text-base mb-2">
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge, die über die Website <b>Better Warzone Audio</b> zwischen dem Anbieter und den Nutzern abgeschlossen werden.
              </div>
            </div>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Vertragspartner</h2>
            <p className="text-zinc-300 mb-2">
              Der Kaufvertrag kommt zustande mit:
              <br />
              <b>Slowlyy Entertaiment, Nico Huck, c/o IP-Management #5527, Ludwig-Erhard-Str. 18, 20459 Hamburg</b>
            </p>
            <p className="text-zinc-300 mb-2">
              Kontakt: <a href="mailto:betterwarzoneaudio@gmail.com" className="text-blue-400 underline">betterwarzoneaudio@gmail.com</a>
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Vertragsschluss</h2>
            <p className="text-zinc-300 mb-2">
              Die Präsentation der Produkte auf der Website stellt kein rechtlich bindendes Angebot, sondern eine unverbindliche Aufforderung zur Bestellung dar. Durch Anklicken des Buttons „Jetzt kaufen“ gibst du eine verbindliche Bestellung der im Warenkorb enthaltenen Waren ab. Die Bestätigung des Eingangs der Bestellung erfolgt zusammen mit der Annahme der Bestellung unmittelbar nach dem Absenden durch eine automatisierte E-Mail.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Lieferung & Zugang</h2>
            <p className="text-zinc-300 mb-2">
              Nach erfolgreichem Zahlungseingang wird das digitale Produkt automatisch im Nutzerkonto unter „Bestellungen“ freigeschaltet. Ein Versand von physischen Waren erfolgt nicht.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Widerrufsrecht</h2>
            <p className="text-zinc-300 mb-2">
              Für digitale Produkte erlischt das Widerrufsrecht mit Beginn der Ausführung des Vertrags, d.h. mit der Bereitstellung des Downloads oder Zugangs, sofern der Nutzer ausdrücklich zugestimmt hat.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Gewährleistung & Haftung</h2>
            <p className="text-zinc-300 mb-2">
              Es gelten die gesetzlichen Gewährleistungsrechte. Für Schäden, die durch unsachgemäße Nutzung entstehen, wird keine Haftung übernommen.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Schlussbestimmungen</h2>
            <p className="text-zinc-300 mb-2">
              Es gilt das Recht der Bundesrepublik Deutschland. Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-zinc-900/60 text-zinc-200 px-3 py-1 rounded-full text-xs font-semibold border border-zinc-700/30">
                Stand: {new Date().toLocaleDateString("de-DE")}
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
