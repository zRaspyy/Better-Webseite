"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackgroundGlow from "@/components/BackgroundGlow";
import { Wrench, Download, Sparkles, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";

export default function BetterTweaksPage() {
  const [downloads, setDownloads] = useState(0);

  useEffect(() => {
    const downloadsRef = ref(db, 'settings/better-downloads');
    const unsub = onValue(downloadsRef, (snap) => {
      setDownloads(snap.val() || 0);
    });
    return () => unsub();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-black">
      <Header />
      <BackgroundGlow />
      <main className="flex-1 flex flex-col items-center justify-start w-full pt-[110px] pb-40 relative z-10">
        <div className="max-w-3xl w-full mx-auto px-4">
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Wrench className="w-10 h-10 text-green-400 animate-spin-slow" />
              <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-gradient-to-r from-green-400 to-green-700 bg-clip-text tracking-tight">
                Better Tweaks Utility
              </h1>
            </div>
            <span className="mt-2 px-4 py-1 rounded-full bg-green-900/60 text-green-300 text-xs font-bold border border-green-600/30 shadow">
              PC Optimierung & Gaming Boost
            </span>
          </div>
          <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/80 border-l-4 border-green-600 rounded-xl p-6 mb-10 flex items-start gap-4 shadow-lg">
            <Info className="w-8 h-8 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <div className="font-bold text-green-400 text-lg mb-1 uppercase tracking-wider">
                Was ist Better Tweaks?
              </div>
              <div className="text-zinc-200 text-base mb-2">
                <b>Better Tweaks Utility</b> ist unser neues PC-Optimierungstool für Gamer, Streamer und Power-User. Mit nur wenigen Klicks holst du das Maximum aus deinem System heraus – mehr FPS, weniger Lags, bessere Stabilität!
              </div>
              <div className="text-zinc-300 text-base">
                <b>Features:</b>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Automatische Windows-Optimierung für Gaming</li>
                  <li>RAM & CPU Tweaks</li>
                  <li>Netzwerk-Boost für niedrigen Ping</li>
                  <li>One-Click Cleanup & Performance-Check</li>
                  <li>Dark Mode & modernes UI</li>
                  <li>100% kostenlos & werbefrei</li>
                </ul>
              </div>
            </div>
          </div>
          {/* Download Card */}
          <div className="relative flex flex-col border border-green-700 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 bg-[#18181b]/80 items-center mb-10">
            <span className="absolute inset-x-0 -top-4 mx-auto flex w-fit items-center rounded-full px-4 py-1 text-xs font-semibold shadow-lg bg-gradient-to-r from-green-600 via-green-400 to-green-600 text-white">
              Better Tweaks Utility <Sparkles className="ml-2 w-4 h-4" />
            </span>
            <div className="font-bold text-2xl flex items-center gap-2 mb-2 text-green-400">
              Download & Status
            </div>
            <span className="my-3 block text-3xl font-extrabold text-green-400 text-center">
              Cooming Soon!
            </span>
            <div className="text-base text-gray-400 mb-2 text-center">
              Die Utility wird aktuell entwickelt und steht bald zum Download bereit.<br />
              Bleib dran für Updates und Release!
            </div>
            <div className="w-full flex flex-col items-center mb-4">
              <div className="w-full h-3 rounded-full bg-[#232323] overflow-hidden mb-2">
                <div className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-700 animate-pulse" style={{ width: "72%" }} />
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Download className="w-4 h-4" />
                Downloads: {downloads.toLocaleString("de-DE")}
              </div>
            </div>
            <button
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-green-600 via-green-400 to-green-600 text-white font-bold text-base shadow-md opacity-60 cursor-not-allowed"
              disabled
            >
              Download (Cooming Soon)
            </button>
          </div>
          {/* Hilfetexte & Kontakt */}
          <div className="mt-8 text-center text-sm text-gray-400">
            <div className="mb-2">
              <b>Du hast Fragen oder Ideen?</b> Schreibe uns an <a href="mailto:betterwarzoneaudio@gmail.com" className="text-green-400 underline">betterwarzoneaudio@gmail.com</a>
            </div>
            <div>
              Folge uns für Updates auf <a href="#" className="text-green-400 underline">Discord</a> & <a href="#" className="text-green-400 underline">Instagram</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
