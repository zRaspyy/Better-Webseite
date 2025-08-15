'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, onValue, set } from 'firebase/database';

export interface ContextUser {
  uid: string;
  email: string;
  displayName?: string;
  // avatar wird separat im Context gehalten!
  // ... weitere Felder
}

type UserCtx = {
  user: ContextUser | null;
  avatar: string | null;
  setAvatar: (url: string) => void;
  logout: () => void;
  getTeams?: () => Promise<any[]>;
  getBilling?: () => Promise<any>;
  getInvoices?: () => Promise<any[]>;
  getAccount?: () => Promise<any>;
};

const UserContext = createContext<UserCtx>({
  user: null,
  avatar: null,
  setAvatar: () => {},
  logout: () => {},
  getTeams: async () => [],
  getBilling: async () => ({}),
  getInvoices: async () => [],
  getAccount: async () => ({}),
});

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ContextUser | null>(null);
  const [avatar, setAvatarState] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser({
          uid: u.uid,
          email: u.email ?? "",
          displayName: u.displayName ?? "",
        });
        const avatarRef = ref(db, `users/${u.uid}/avatar`);
        onValue(avatarRef, (snap) => {
          setAvatarState(snap.val() || null);
        });
      } else {
        setUser(null);
        setAvatarState(null);
      }
    });
    return () => unsub();
  }, []);

  const setAvatar = (url: string) => {
    if (user) {
      set(ref(db, `users/${user.uid}/avatar`), url);
    }
  };

  const logout = () => signOut(auth);

  const getTeams = async () => [{ name: "Demo Team", members: 3 }];
  const getBilling = async () => ({ method: "Stripe", status: "Aktiv" });
  const getInvoices = async () => [{ id: 1, amount: 10, date: "2024-06-01" }];
  const getAccount = async () => ({ email: user?.email, verified: true });

  return (
    <UserContext.Provider value={{ user, avatar, setAvatar, logout, getTeams, getBilling, getInvoices, getAccount }}>
      {children}
    </UserContext.Provider>
  );
}
