'use client';

import { useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, pw);
      // UID in Realtime Database speichern (nur UID, keine sensiblen Daten)
      await set(ref(db, `users/${userCred.user.uid}`), { created: Date.now() });
      setMsg('Registrierung erfolgreich! Du kannst dich jetzt anmelden.');
    } catch (err: any) {
      setMsg(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
      <form onSubmit={handleSignup} className="bg-[#181818] rounded-xl p-8 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-white">Registrieren</h2>
        <input
          type="email"
          placeholder="E-Mail"
          className="mb-4 w-full rounded bg-[#232323] px-4 py-3 text-white"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Passwort"
          className="mb-4 w-full rounded bg-[#232323] px-4 py-3 text-white"
          value={pw}
          onChange={e => setPw(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full rounded bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] py-3 font-semibold text-white"
          disabled={loading}
        >
          {loading ? 'Wird erstellt...' : 'Account erstellen'}
        </button>
        {msg && <div className="mt-4 text-center text-sm text-white">{msg}</div>}
      </form>
    </div>
  );
}
