'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import {
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from 'firebase/auth';
import { ref, get, set, onValue } from 'firebase/database';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  X,
} from 'lucide-react';
import axios from 'axios';

// Hilfsfunktion: UID in DB anlegen, falls nicht vorhanden
async function ensureUserInDatabase(userCred: UserCredential) {
  if (!userCred.user?.uid) return;
  const userRef = ref(db, `users/${userCred.user.uid}`); // <-- nur /users
  const snap = await get(userRef);
  if (!snap.exists()) {
    await set(userRef, {
      created: Date.now(),
      email: userCred.user.email || '',
      avatar: userCred.user.photoURL || '',
    });
  }
}

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;

export default function LoginPopup({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // E-Mail/Passwort-Login deaktiviert
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("Login mit E-Mail/Passwort ist deaktiviert. Bitte melde dich mit Google an.");
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);
      await ensureUserInDatabase(userCred);

      // Prüfe ob Admin-Account per UID
      if (userCred.user?.uid === ADMIN_UID) {
        await set(ref(db, `users/${userCred.user.uid}/isAdmin`), true);
        setMsg('Admin-Login erfolgreich!');
        setTimeout(() => {
          setLoading(false);
          // Hier ggf. Admin-Dashboard öffnen
          onClose();
        }, 1000);
        return;
      }

      setMsg('Login erfolgreich!');
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      setMsg('Fehler: ' + (err.message || 'Google Login fehlgeschlagen'));
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex bg-[#888]/90">
        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-center items-start p-10 bg-gradient-to-br from-[#ff3c3c] to-[#ff7b7b] w-1/2 min-h-[520px]">
          <div className="mb-8 text-lg font-semibold uppercase text-white tracking-widest">
            Better Warzone Audio
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white leading-tight">
            Login für<br />deine App
          </h1>
          <p className="mb-8 text-lg text-white/80">
            Sichere dir Zugang zu allen Features und deinem persönlichen Bereich.
          </p>
          <ul className="space-y-4 text-white/90 text-base">
            <li className="flex items-center gap-3">
              <span className="bg-white/20 rounded-lg p-2"><Mail size={18} /></span>
              Anmeldung nur mit Google möglich
            </li>
            <li className="flex items-center gap-3">
              <span className="bg-white/20 rounded-lg p-2"><Lock size={18} /></span>
              Geschützte Daten & Privatsphäre
            </li>
            <li className="flex items-center gap-3">
              <span className="bg-white/20 rounded-lg p-2"><Eye size={18} /></span>
              Premium-Features freischalten
            </li>
          </ul>
        </div>
        {/* Right Side */}
        <div className="flex-1 flex flex-col justify-center p-8 bg-[#888]/90 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-700 hover:text-black"
            aria-label="Schließen"
          >
            <X size={24} />
          </button>
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold uppercase text-white">Willkommen zurück</h2>
              <p className="mt-2 text-sm text-white/80">
                Melde dich an, um fortzufahren
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium uppercase text-white"
                >
                  E-Mail-Adresse
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border border-gray-300 bg-white/80 block w-full rounded-lg py-3 pr-3 pl-10 text-sm text-black"
                    placeholder="E-Mail eingeben"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium uppercase text-white"
                >
                  Passwort
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border border-gray-300 bg-white/80 block w-full rounded-lg py-3 pr-12 pl-10 text-sm text-black"
                    placeholder="Passwort eingeben"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-white/80">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="ml-2">Angemeldet bleiben</span>
                </label>
                <a
                  href="#"
                  className="text-white/80 hover:text-white text-sm"
                >
                  Passwort vergessen?
                </a>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] px-4 py-3 text-sm font-medium text-white transition-all duration-300 flex items-center justify-center"
                disabled={loading}
              >
                {'Anmelden'}
              </button>
              {msg && <div className="text-white text-center mt-2">{msg}</div>}
            </form>
            <div className="relative text-center text-sm text-white/70 mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-400/40"></div>
              </div>
              <span className="relative px-2 bg-[#888]/90">oder weiter mit</span>
            </div>
            <div className="grid grid-cols-1 gap-3 mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center rounded-lg border border-gray-300 bg-white/80 px-4 py-2.5 text-sm text-black shadow-sm hover:bg-white"
                disabled={loading}
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="h-5 w-5"
                  alt="Google"
                />
                <span className="ml-2">Mit Google anmelden</span>
              </button>
            </div>
            <div className="mt-8 text-center text-sm text-white/80">
              Registrierung nur mit Google möglich.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
