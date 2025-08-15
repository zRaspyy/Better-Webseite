import Image from 'next/image';
import { ArrowRight, Download } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { db } from '../firebaseConfig';
import { ref, onValue, runTransaction } from 'firebase/database';
import Link from 'next/link';

export default function Hero() {
  const imgRef = useRef<HTMLDivElement>(null);
  const [downloads, setDownloads] = useState<number>(0);

  useEffect(() => {
    const downloadsRef = ref(db, 'settings/downloads');
    const unsub = onValue(downloadsRef, (snap) => {
      setDownloads(snap.val() || 0);
    });
    return () => unsub();
  }, []);

  // Nur horizontale Bewegung des Bildes
  useEffect(() => {
    let frame = 0;
    let raf: number;
    const animate = () => {
      if (imgRef.current) {
        const x = Math.sin(frame / 60) * 16; // nur horizontal
        imgRef.current.style.transform = `translateX(${x}px)`;
      }
      frame++;
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleScrollToProdukte = () => {
    const el = document.getElementById('produkte-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative flex items-center justify-center min-h-screen px-2 md:px-0 overflow-hidden">
      <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-16">
        {/* Left: Text */}
        <div className="flex-1 flex flex-col items-start justify-center max-w-2xl w-full">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6 text-left md:text-left">
            <span className="bg-gradient-to-br from-[#ff3c3c] to-[#ff7b7b] bg-clip-text text-transparent">
              Better Warzone Audio<br />
              Dein Sound.<br />
              Dein Vorteil.
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-3 text-left">
            Die App für präzises Gaming-Audio, kristallklare Kommunikation und immersive Soundqualität.
          </p>
          <p className="text-lg sm:text-xl font-semibold text-[#ff3c3c] mb-10 text-left">
            Für Warzone & Black Ops 6!
          </p>
          <div className="flex gap-6 mb-8">
            <Link
              href="/download"
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold text-lg shadow hover:bg-gray-100 transition"
            >
              Download <Download className="w-6 h-6" />
            </Link>
            <button
              onClick={handleScrollToProdukte}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-[#d32d2f] hover:bg-[#ff3c3c] text-white font-bold text-lg shadow transition"
            >
              Jetzt starten <ArrowRight className="w-6 h-6" />
            </button>
          </div>
          <div className="flex gap-8 flex-wrap">
            <span className="bg-[#2d0101] text-[#ff3c3c] px-4 py-1.5 rounded-full text-sm font-semibold">
              {downloads.toLocaleString('de-DE')} Downloads
            </span>
            <span className="text-sm text-white/80">100% kostenlos & werbefrei</span>
          </div>
        </div>
        {/* Right: App Screenshot */}
        <div className="flex-1 flex justify-center w-full">
          <div
            ref={imgRef}
            className="w-[700px] max-w-full drop-shadow-2xl transition-transform duration-500"
            style={{ willChange: 'transform' }}
          >
            <Image
              src="/assets/hero-app.png"
              alt="App Screenshot"
              width={1200}
              height={700}
              className="rounded-2xl shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
