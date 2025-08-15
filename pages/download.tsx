"use client";

import { useState, useEffect, useRef } from "react";
import { Download, CheckCircle, X, Hash, BarChart, Database } from "lucide-react";
import Link from "next/link";
import { db } from "../firebaseConfig";
import { ref, onValue, runTransaction, set } from "firebase/database";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackgroundGlow from "@/components/BackgroundGlow";

export default function DownloadPage() {
  const [downloads, setDownloads] = useState<number>(0);
  const [appVersion, setAppVersion] = useState<string>("...");
  const [downloadLink, setDownloadLink] = useState<string>(""); // jetzt aus DB
  const [popup, setPopup] = useState<null | "preparing" | "started">(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const [appSize, setAppSize] = useState<string>("~ 207 MB");
  const [features, setFeatures] = useState<string[]>([
    "Optimiert für Warzone & Black Ops 6",
    "Kristallklarer Sound",
    "Einfache Installation",
    "Community Support",
    "100% kostenlos & werbefrei",
  ]);

  useEffect(() => {
    const settingsRef = ref(db, "settings");
    const unsub = onValue(settingsRef, (snap) => {
      const val = snap.val() || {};
      setDownloads(val.downloads || 0);
      setAppVersion(val["app-version"] ? String(val["app-version"]) : "...");
      if (val["app-size"]) setAppSize(val["app-size"]);
      setDownloadLink(val["download-link"] || ""); // Download-Link aus DB
    });

    // Reset daily-downloads einmal pro Tag (Client-seitig)
    const today = new Date().toLocaleDateString("de-DE");
    const lastReset = localStorage.getItem("dailyDownloadsReset");
    if (lastReset !== today) {
      set(ref(db, "settings/daily-downloads"), 0);
      localStorage.setItem("dailyDownloadsReset", today);
    }

    return () => unsub();
  }, []);

  useEffect(() => {
    let frame = 0;
    let raf: number;
    const animate = () => {
      if (videoRef.current) {
        const x = Math.sin(frame / 60) * 12;
        videoRef.current.style.transform = `translateX(${x}px)`;
      }
      frame++;
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleDownload = async () => {
    setPopup("preparing");
    setTimeout(() => {
      setPopup("started");
      runTransaction(ref(db, "settings/downloads"), (current) => (current || 0) + 1);
      runTransaction(ref(db, "settings/daily-downloads"), (current) => (current || 0) + 1); // NEU: daily-downloads erhöhen
      // Download im Hintergrund, kein neuer Tab
      const link = document.createElement('a');
      link.href = downloadLink;
      link.download = "BetterWarzoneAudio.msi";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);
  };

  const detailClass = "flex items-center gap-2 text-base font-bold text-[#ff3c3c] mb-1";

  const PopupPreparing = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: "radial-gradient(circle at 50% 50%, rgba(30,30,30,0.98) 0%, rgba(0,0,0,0.98) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[260px] rounded-2xl bg-gradient-to-br from-[#fff]/30 to-[#ff3c3c]/10 blur-2xl opacity-40"></div>
      </div>
      <div className="relative flex flex-col items-center z-10">
        <div className="mb-6 flex flex-col items-center">
          <div className="bg-[#23232a] border border-white/20 rounded-full p-5 mb-3 shadow-2xl">
            <Download className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-1 drop-shadow-lg">Preparing Download...</h2>
        </div>
        <div className="bg-[#18181b] border border-white/20 rounded-xl shadow-2xl px-7 py-6 flex flex-col items-center w-[320px] max-w-full">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-4 h-4 rounded-full bg-blue-400 flex items-center justify-center shadow">
              <Download className="w-3 h-3 text-white" />
            </span>
            <span className="text-white font-bold text-base">Dein Download wird vorbereitet...</span>
          </div>
          <div className="text-gray-300 text-sm mb-4 text-center">
            Falls der Download nicht automatisch startet, klicke unten:
          </div>
          <a
            href={downloadLink}
            style={{ display: 'none' }} // versteckt, nur für Fallback
            download="BetterWarzoneAudio.msi"
            id="manual-download-link"
          >
            Download
          </a>
          <a
            href={downloadLink}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition text-base shadow"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="w-5 h-5" />
            Jetzt manuell downloaden
          </a>
        </div>
      </div>
    </div>
  );

  const PopupStarted = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: "radial-gradient(circle at 50% 50%, rgba(30,30,30,0.98) 0%, rgba(0,0,0,0.98) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[260px] rounded-2xl bg-gradient-to-br from-[#fff]/30 to-[#ff3c3c]/10 blur-2xl opacity-40"></div>
      </div>
      <div className="relative flex flex-col items-center z-10">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white bg-[#23232a] rounded-full p-2 shadow"
          onClick={() => setPopup(null)}
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="mb-6 flex flex-col items-center">
          <div className="bg-[#23232a] border border-white/20 rounded-full p-5 mb-3 shadow-2xl">
            <Download className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-1 drop-shadow-lg">Download Started!</h2>
        </div>
        <div className="bg-[#18181b] border border-white/20 rounded-xl shadow-2xl px-7 py-6 flex flex-col items-center w-[320px] max-w-full">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-4 h-4 rounded-full bg-green-400 flex items-center justify-center shadow">
              <CheckCircle className="w-3 h-3 text-white" />
            </span>
            <span className="text-white font-bold text-base">Download erfolgreich gestartet!</span>
          </div>
          <div className="text-gray-300 text-sm mb-4 text-center">
            BetterWarzoneAudio.msi wird heruntergeladen.<br />Prüfe deinen Download-Ordner.
          </div>
          <a
            href={downloadLink}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition text-base shadow"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="w-5 h-5" />
            Erneut downloaden
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      <Header />
      <BackgroundGlow />
      <main className="flex flex-col items-center justify-center flex-1 px-0 pt-24 pb-12 w-full">
        <div className="flex flex-row items-center justify-center gap-20 w-full max-w-7xl mx-auto">
          {/* Video mittig, groß */}
          <div className="flex-1 flex justify-end items-center">
            <div
              ref={videoRef}
              className="w-full max-w-3xl drop-shadow-2xl transition-transform duration-500 flex justify-center"
              style={{ willChange: "transform" }}
            >
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-[#ff0000] bg-black relative flex items-center justify-center w-full" style={{ minWidth: 600, minHeight: 400 }}>
                <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
                  <svg width="32" height="32" viewBox="0 0 32 32" className="text-[#ff0000]">
                    <rect width="32" height="32" rx="8" fill="#ff0000" />
                    <polygon points="12,10 24,16 12,22" fill="#fff" />
                  </svg>
                  <span className="text-white font-bold text-lg">YouTube</span>
                </div>
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/RUdI3mianxI?start=226"
                  title="Better Warzone Audio App Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  style={{ minHeight: 420, borderRadius: 18, border: 0 }}
                />
              </div>
            </div>
          </div>
          {/* Card rechts, kompakt, vertikale Socials */}
          <div className="flex-1 flex flex-col items-start">
            <div
              className="card flex flex-col gap-3 p-7 w-[370px] bg-[#18181b] rounded-2xl shadow-2xl border border-[#23232a]"
              style={{
                background: "linear-gradient(0deg, #18181b 60%, #2d0101 120%)",
                boxShadow: "0 8px 32px 0 rgba(0,0,0,0.45)",
              }}
            >
              <div className="image_container relative overflow-hidden w-full h-28 bg-[#23232a] rounded-lg flex items-center justify-center">
                <Download className="image w-12 h-12 text-[#ff3c3c]" />
              </div>
              <div className="title text-2xl font-extrabold text-[#fff] text-center mt-2 mb-2">
                BetterWarzoneAudio.msi
              </div>
              {/* Details mit Icons */}
              <div className="flex flex-col gap-2 mt-2 mb-2">
                <div className={detailClass}>
                  <Hash className="w-5 h-5 text-[#ff3c3c]" />
                  <span className="text-[#ff3c3c]">Version:</span>
                  <span className="text-white">{appVersion}</span>
                </div>
                <div className={detailClass}>
                  <Database className="w-5 h-5 text-[#ff3c3c]" />
                  <span className="text-[#ff3c3c]">Größe:</span>
                  <span className="text-white">{appSize}</span>
                </div>
                <div className={detailClass}>
                  <BarChart className="w-5 h-5 text-[#ff3c3c]" />
                  <span className="text-[#ff3c3c]">Downloads:</span>
                  <span className="text-white">{downloads.toLocaleString("de-DE")}</span>
                </div>
              </div>
              {/* Features mit Icon */}
              <ul className="list-size flex flex-col gap-2 mt-2 mb-2">
                {features.map((f, i) => (
                  <li key={i} className="item-list text-base text-[#fff] flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#ff3c3c]"></span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="action mt-6">
                <button
                  type="button"
                  className="download-button relative w-full h-12 flex items-center justify-center bg-gradient-to-r from-[#ff0000] to-[#2d0101] border-2 border-[#ff3c3c]/50 rounded-lg overflow-hidden transition-all duration-300 ease-in-out group"
                  onClick={handleDownload}
                  disabled={popup !== null}
                >
                  <span className="button-text text-[#fff] font-bold text-base transition-all duration-300">
                    Download starten
                  </span>
                  <span className="button-icon absolute h-full w-12 flex items-center justify-center bg-[#23232a] right-[-3rem] transition-all duration-300">
                    <Download className="download-svg w-6 h-6 text-[#ff3c3c]" />
                  </span>
                </button>
              </div>
              {/* Info/Discord */}
              <div className="mt-4 flex flex-col items-end gap-2">
                <span className="text-gray-400 text-xs">Fragen oder Probleme? Join Discord:</span>
                <Link
                  href="https://discord.gg/8vDRCg2vAf"
                  target="_blank"
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#ff3c3c] text-white font-bold hover:bg-[#d32d2f] transition text-sm"
                >
                  Discord beitreten
                </Link>
                <Link
                  href="/download/falsepositives"
                  className="flex items-center justify-center gap-2 px-3 py-1 rounded bg-[#23232a] text-gray-400 text-xs hover:text-white hover:bg-[#18181b] transition"
                >
                  Über False-Positive-Erkennungen
                </Link>
              </div>
            </div>
          </div>
        </div>
        {popup === "preparing" && <PopupPreparing />}
        {popup === "started" && <PopupStarted />}
      </main>
      <Footer />
    </div>
  );
}
