import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackgroundGlow from "@/components/BackgroundGlow";
import { Ghost, ArrowLeft } from "lucide-react";

export default function Custom404() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <BackgroundGlow />
      <main className="flex flex-col items-center justify-center flex-1 px-4 pt-24 pb-12 w-full">
        <div className="max-w-xl w-full mx-auto flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4">
            <Ghost className="w-20 h-20 text-[#ff3c3c] animate-bounce" />
            <h1 className="text-6xl font-extrabold bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] bg-clip-text text-transparent mb-2">
              404
            </h1>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Seite nicht gefunden
            </h2>
            <p className="text-lg text-gray-300 text-center mb-2">
              Die angeforderte Seite existiert nicht oder wurde verschoben.<br />
              Vielleicht hast du dich vertippt oder der Link ist veraltet.
            </p>
            <Link
              href="/"
              className="mt-4 px-6 py-3 rounded-xl bg-[#ff3c3c] hover:bg-[#d32d2f] text-white font-bold text-lg shadow flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Zurück zur Startseite
            </Link>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            <span>
              Falls du Hilfe brauchst, schreibe uns an{" "}
              <a
                href="mailto:betterwarzoneaudio@gmail.com"
                className="text-[#ff3c3c] underline"
              >
                betterwarzoneaudio@gmail.com
              </a>{" "}
              oder besuche unseren{" "}
              <a
                href="https://discord.gg/8vDRCg2vAf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ff3c3c] underline"
              >
                Discord
              </a>
              .
            </span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
