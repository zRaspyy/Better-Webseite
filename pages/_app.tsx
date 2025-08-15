import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '../context/UserContext'
import { CartProvider } from '../context/CartContext'
import Head from 'next/head'
import WartungScreen from '../components/WartungScreen'
import { useState, useEffect } from 'react'
import { ref, onValue, set } from 'firebase/database'
import { db } from '../firebaseConfig'

export default function App({ Component, pageProps }: AppProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [wartungAktiv, setWartungAktiv] = useState(false);
  const [turboMode, setTurboMode] = useState(false);

  useEffect(() => {
    const wartungRef = ref(db, 'settings/maintenance');
    const unsub = onValue(wartungRef, snap => {
      setWartungAktiv(!!snap.val());
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // Turbo-Modus aus Umgebungsvariable aktivieren
    if (process.env.TURBOMODUS === 'true') {
      set(ref(db, 'settings/turboMode'), true);
    }
    // Turbo-Modus immer aktivieren beim Start
    set(ref(db, 'settings/turboMode'), true);
    const turboRef = ref(db, 'settings/turboMode');
    const unsub = onValue(turboRef, snap => {
      setTurboMode(!!snap.val());
    });
    return () => unsub();
  }, []);

  return (
    <CartProvider>
      <>
        <Head>
          <link rel="icon" href="/assets/Logo.png" type="image/png" />
        </Head>
        {wartungAktiv && !unlocked && (
          <WartungScreen active={wartungAktiv} onUnlock={() => setUnlocked(true)} />
        )}
        {!wartungAktiv || unlocked ? (
          <UserProvider>
            <Component {...pageProps} />
          </UserProvider>
        ) : null}
      </>
    </CartProvider>
  )
}
