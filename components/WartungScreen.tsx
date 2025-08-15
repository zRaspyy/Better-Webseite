'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Code, Star, ExternalLink, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { Particles } from '@/components/ui/particles';
import { Spotlight } from '@/components/ui/spotlight';
import { useTheme } from 'next-themes';
import { Bricolage_Grotesque } from 'next/font/google';
import { cn } from '@/lib/utils';

const brico = Bricolage_Grotesque({
  subsets: ['latin'],
});

const users = [
  { imgUrl: 'https://avatars.githubusercontent.com/u/111780029' },
  { imgUrl: 'https://avatars.githubusercontent.com/u/123104247' },
  { imgUrl: 'https://avatars.githubusercontent.com/u/115650165' },
  { imgUrl: 'https://avatars.githubusercontent.com/u/71373838' },
];

const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN;

type WartungScreenProps = {
  active?: boolean;
  onUnlock?: () => void;
};

export default function WartungScreen({ active = true, onUnlock }: WartungScreenProps) {
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState('#ffffff');

  useEffect(() => {
    setColor(resolvedTheme === 'dark' ? '#ffffff' : '#e60a64');
  }, [resolvedTheme]);

  if (!active) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ADMIN_PIN && pin === ADMIN_PIN) {
      setError('');
      setShowPin(false);
      if (onUnlock) onUnlock();
    } else {
      setError('Falscher PIN. Zugang verweigert.');
    }
  };

  return (
    <main className="fixed inset-0 z-[9999] flex min-h-screen w-full items-center justify-center overflow-hidden xl:h-screen bg-black">
      <Spotlight />
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        refresh
        color={color}
      />
      {/* Unsichtbares PIN-Icon oben rechts */}
      <button
        className="absolute top-8 right-8 opacity-0 hover:opacity-30 transition-opacity"
        style={{ zIndex: 10000 }}
        onClick={() => setShowPin(true)}
        aria-label="Admin-PIN eingeben"
      >
        <KeyRound className="w-7 h-7 text-white" />
      </button>
      <div className="relative z-[100] mx-auto max-w-2xl px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-primary/10 from-primary/15 to-primary/5 mb-8 inline-flex items-center gap-2 rounded-full border bg-gradient-to-r px-4 py-2 backdrop-blur-sm"
        >
          <img
            src="https://i.postimg.cc/vHnf0qZF/logo.webp"
            alt="logo"
            className="spin h-6 w-6"
          />
          <span className="text-sm font-medium">Better Warzone Audio</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <ArrowRight className="h-4 w-4" />
          </motion.div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className={cn(
            'from-white via-gray-200 to-gray-400 mb-4 cursor-crosshair bg-gradient-to-b bg-clip-text text-4xl font-extrabold text-transparent sm:text-7xl drop-shadow-lg',
            brico.className,
          )}
        >
          Wartungsmodus
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-2 mb-12 sm:text-lg text-white"
        >
          Unsere Webseite wird gerade für dich verbessert!<br />
          <span className="text-[#ff3c3c] font-bold">Der Zugang ist vorübergehend deaktiviert.</span><br />
          <span className="text-xs text-gray-300 block mt-2">
            Wir arbeiten an neuen Features, besserem Design und mehr Performance.<br />
            <span className="text-gray-400">Schau bald wieder vorbei – das Warten lohnt sich!</span>
          </span>
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-12 grid grid-cols-2 gap-6 sm:grid-cols-3"
        >
            <div className="border-primary/10 flex flex-col items-center justify-center rounded-xl border bg-white/5 p-4 backdrop-blur-md">
            <Sparkles className="text-primary mb-2 h-5 w-5" />
            <span className="text-xl font-bold text-white">Live Audio Boost</span>
            <span className="text-gray-300 text-xs">Direkt im Spiel</span>
            </div>
            <div className="border-primary/10 flex flex-col items-center justify-center rounded-xl border bg-white/5 p-4 backdrop-blur-md">
            <Code className="text-primary mb-2 h-5 w-5" />
            <span className="text-xl font-bold text-white">Custom Sound Presets</span>
            <span className="text-gray-300 text-xs">Für jede Map</span>
            </div>
            <div className="border-primary/10 flex flex-col items-center justify-center rounded-xl border bg-white/5 p-4 backdrop-blur-md">
            <Star className="text-primary mb-2 h-5 w-5" />
            <span className="text-xl font-bold text-white">Community Voting</span>
            <span className="text-gray-300 text-xs">Beste Einstellungen</span>
            </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-10 flex items-center justify-center gap-1"
        >
          <div className="flex -space-x-3">
            {users.map((user, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: -10 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1 + i * 0.2 }}
                className="border-background from-primary size-10 rounded-full border-2 bg-gradient-to-r to-rose-500 p-[2px]"
              >
                <div className="overflow-hidden rounded-full">
                  <img
                    src={user.imgUrl}
                    alt="Avatar"
                    className="rounded-full transition-all duration-300 hover:scale-110 hover:rotate-6"
                    width={40}
                    height={40}
                  />
                </div>
              </motion.div>
            ))}
          </div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="ml-2 text-white"
          >
            <span className="text-primary font-semibold">100+</span> Nutzer warten schon!
          </motion.span>
        </motion.div>
        {/* PIN-Dialog */}
        {showPin && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60">
            <form
              onSubmit={handleSubmit}
              className="bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-xs flex flex-col items-center"
            >
              <h2 className="text-xl font-bold text-white mb-2 text-center">Admin-PIN</h2>
              <input
                type="password"
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="PIN eingeben"
                className="w-full px-4 py-2 rounded bg-[#232323] text-white text-lg text-center mb-4"
                maxLength={16}
              />
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] text-white font-bold"
              >
                Zugang prüfen
              </button>
              <button
                type="button"
                className="mt-2 text-gray-400 hover:text-white text-sm"
                onClick={() => setShowPin(false)}
              >
                Abbrechen
              </button>
              {error && <div className="mt-3 text-red-400 text-center">{error}</div>}
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
