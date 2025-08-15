"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Info } from "lucide-react";

export default function ImpressumPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-black font-sans">
      <Header />
      {/* Hintergrund-Glow wie Hero */}
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
          <h1 className="text-5xl md:text-6xl font-extrabold mb-10 text-white tracking-tight font-sans">
            Impressum
          </h1>
          <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/80 border-l-4 border-red-600 rounded-xl p-6 mb-10 flex items-start gap-4 shadow-lg font-sans">
            <Info className="w-8 h-8 text-red-400 mt-1 flex-shrink-0" />
            <div>
              <div className="font-bold text-red-400 text-lg mb-1 uppercase tracking-wider font-sans">
                Angaben gemäß § 5 TMG
              </div>
              <div className="text-zinc-200 text-base mb-2 font-sans">
                <b>
                  Slowlyy Entertaiment
                  <br />
                  Nico Huck
                  <br />
                  c/o IP-Management #5527
                  <br />
                  Ludwig-Erhard-Str. 18
                  <br />
                  20459 Hamburg
                </b>
              </div>
              <div className="text-zinc-300 text-base mb-2 font-sans">
                <b>Vertreten durch:</b>
                <br />
                Slowlyy Entertaiment
              </div>
              <div className="text-zinc-300 text-base mb-2 font-sans">
                <b>Kontakt:</b>
                <br />
                E-Mail:{" "}
                <a
                  href="mailto:betterwarzoneaudio@gmail.com"
                  className="text-blue-400 underline"
                >
                  betterwarzoneaudio@gmail.com
                </a>
              </div>
              <div className="text-zinc-300 text-base font-sans">
                <b>Kleinunternehmerregelung:</b>
                <br />
                Gemäß § 19 Abs. 1 UStG wird keine Umsatzsteuer berechnet.
              </div>
            </div>
          </div>

          {/* Haftung, Urheberrecht, Links, Streitschlichtung */}
          <section className="mb-10 font-sans">
            <h2 className="text-2xl font-bold text-white mb-3 font-sans">
              Haftungsausschluss
            </h2>
            <p className="text-zinc-300 mb-2 font-sans">
              Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt.
              Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
              können wir jedoch keine Gewähr übernehmen.
            </p>
            <p className="text-zinc-300 mb-2 font-sans">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene
              Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
              verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
              jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die
              auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p className="text-zinc-300 mb-2 font-sans">
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
              Informationen nach den allgemeinen Gesetzen bleiben hiervon
              unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
              Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.
              Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir
              diese Inhalte umgehend entfernen.
            </p>
          </section>

          <section className="mb-10 font-sans">
            <h2 className="text-2xl font-bold text-white mb-3 font-sans">
              Haftung für Links
            </h2>
            <p className="text-zinc-300 mb-2 font-sans">
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf
              deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
              diese fremden Inhalte auch keine Gewähr übernehmen. Für die
              Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              oder Betreiber der Seiten verantwortlich.
            </p>
            <p className="text-zinc-300 mb-2 font-sans">
              Downloads und Kopien dieser Seite sind nur für den privaten,
              nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf
              dieser Seite nicht vom Betreiber erstellt wurden, werden die
              Urheberrechte Dritter beachtet. Insbesondere werden Inhalte
              Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine
              Urheberrechtsverletzung aufmerksam werden, bitten wir um einen
              entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
              werden wir derartige Inhalte umgehend entfernen.
            </p>
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
