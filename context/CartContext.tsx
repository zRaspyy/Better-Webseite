'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  iconName: string;
  image?: string;
  variant?: string;
  quantity?: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateCartItem: (id: string, changes: Partial<CartItem>) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Warenkorb aus localStorage laden
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    }
  }, []);

  // Warenkorb in localStorage speichern
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  const getAffiliate = () => {
    try {
      const rid = typeof document !== 'undefined' ? document.cookie.split('; ').find(r=>r.startsWith('aff_ref=')) : null
      const disc = typeof document !== 'undefined' ? document.cookie.split('; ').find(r=>r.startsWith('aff_disc=')) : null
      const aid = rid ? decodeURIComponent(rid.split('=')[1]) : null
      const d = disc ? parseFloat(decodeURIComponent(disc.split('=')[1])) : 0.05 // Default 5%
      return { aid, d: isNaN(d) ? 0.05 : d }
    } catch { return { aid: null, d: 0.05 } }
  }

  const addToCart = (item: CartItem) => {
    const aff = getAffiliate()
    const price = aff.d>0 ? Number((item.price*(1-aff.d)).toFixed(2)) : item.price
    const enriched = { ...item, price }
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      // Affiliate-Sale nur tracken, wenn wirklich neu!
      if (aff.aid) {
        try { fetch('/api/affiliate/attribution', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ affiliateId: aff.aid, itemId: item.id, name: item.name, price: item.price, discount: aff.d, type: 'sale' }) }) } catch {}
      }
      return [...prev, enriched];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const updateCartItem = (id: string, changes: Partial<CartItem>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...changes } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, updateCartItem }}>
      {children}
    </CartContext.Provider>
  );
};
