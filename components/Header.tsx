import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, UserCircle, Package, Bell, Shield } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '../context/UserContext';
import UserDashboard from './user-dashboard/UserDashboard';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import CartLoginModal from './CartLoginModal';
import Image from 'next/image';
import AdminDashboard from './AdminDashboard';
import { db } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;

export default function Header({ onLoginClick }: { onLoginClick?: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCartLogin, setShowCartLogin] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const { user, avatar, logout } = useUser();
  const cart = useCart();
  const items = cart?.items ?? [];

  // Seiten-Toggles müssen hier stehen!
  const [pages, setPages] = useState<{ [key: string]: boolean }>({});
  useEffect(() => {
    const pagesRef = ref(db, 'settings/pages');
    const unsub = onValue(pagesRef, snap => {
      setPages(snap.val() || {});
    });
    return () => unsub();
  }, []);

  const navItems = [
    { name: 'STARTSEITE', href: '/' },
    pages.download !== false ? { name: 'DOWNLOAD', href: '/download' } : null,
    pages.affiliate !== false ? { name: 'AFFILIATE', href: '/affiliate' } : null,
    pages.reviews ? { name: 'Bewertungen', href: '/reviews' } : null,
    pages['better-tweaks'] ? { name: 'Better Tweaks', href: '/better-tweaks' } : null,
    pages['produkte-katalog'] ? { name: 'Katalog', href: '/produkte-katalog' } : null
  ].filter((item): item is { name: string; href: string } => !!item);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAdminDashboard = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowAdmin(true);
  };

  const openUserDashboard = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowDashboard(true);
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 font-sans ${
        isScrolled
          ? 'backdrop-blur bg-[rgba(30,0,0,0.92)] shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 font-sans">
        <div className="flex h-16 items-center justify-between lg:h-20 font-sans">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden border-[2px] border-[#ff3c3c] bg-black">
                <Image
                  src="/assets/Logo.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] bg-clip-text text-xl font-bold text-transparent">
                BETTER WARZONE AUDIO
              </span>
            </Link>
          </div>

          <nav className="hidden items-center space-x-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white flex items-center space-x-1 font-medium transition-colors duration-200 hover:text-[#ff3c3c]"
              >
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            {/* Cart */}
            <button
              className="relative flex items-center justify-center w-10 h-10 rounded-[8px] border border-white bg-transparent hover:bg-[#181818] transition"
              onClick={() => {
                if (!user) setCartModalOpen(true);
                else setShowCart(true);
              }}
              aria-label="Warenkorb"
            >
              <Package className="w-6 h-6 text-white" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ff3c3c] text-white text-xs rounded-full px-1.5 py-0.5 font-bold border-2 border-black">
                  {items.length}
                </span>
              )}
            </button>
            {/* User/Admin */}
            {user ? (
              <>
                {user.uid === ADMIN_UID ? (
                  <button
                    className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#ff3c3c] bg-transparent hover:bg-[#181818] transition"
                    onClick={openAdminDashboard}
                    aria-label="Admin"
                  >
                    <Shield className="w-7 h-7 text-[#ff3c3c]" />
                  </button>
                ) : (
                  <button
                    className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-transparent hover:bg-[#181818] transition"
                    onClick={openUserDashboard}
                    aria-label="Account"
                  >
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="w-7 h-7 text-white" />
                    )}
                  </button>
                )}
              </>
            ) : (
              <div className="flex items-center bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] rounded-full px-1 py-1">
                <button
                  onClick={onLoginClick}
                  className="px-6 py-2.5 font-medium text-white rounded-full transition-all duration-200 hover:bg-[#ff3c3c]/80 focus:outline-none"
                  style={{ background: 'transparent' }}
                >
                  Anmelden
                </button>
              </div>
            )}
          </div>

          <button
            className="hover:bg-[#2d0101] rounded-lg p-2 transition-colors duration-200 lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="overflow-hidden lg:hidden">
            <div className="bg-[#181818] mt-4 space-y-2 rounded-xl border border-[#222] py-4 shadow-xl backdrop-blur-lg">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white hover:bg-[#ff3c3c]/10 block px-4 py-3 font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {!user && (
                <div className="space-y-2 px-4 py-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLoginClick && onLoginClick();
                    }}
                    className="block w-full rounded-lg bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] py-2.5 text-center font-medium text-white transition-all duration-200 hover:from-[#ff7b7b] hover:to-[#ff3c3c] hover:shadow-lg"
                  >
                    Anmelden
                  </button>
                </div>
              )}
              {user && (
                <div className="space-y-2 px-4 py-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setShowDashboard((v) => !v);
                    }}
                    className="block w-full rounded-lg bg-gradient-to-r from-[#ff3c3c] to-[#ff7b7b] py-2.5 text-center font-medium text-white transition-all duration-200 hover:from-[#ff7b7b] hover:to-[#ff3c3c] hover:shadow-lg"
                  >
                    Account
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        {showDashboard && user && user.uid !== ADMIN_UID && (
          <UserDashboard onClose={() => setShowDashboard(false)} />
        )}
        {showAdmin && user && user.uid === ADMIN_UID && (
          <AdminDashboard
            onClose={() => {
              setShowAdmin(false);
              // Kein Logout hier!
              // localStorage.removeItem('admin');
              // await logout();
            }}
          />
        )}
        <CartDrawer open={showCart} onClose={() => setShowCart(false)} />
        {showCartLogin && (
          <CartLoginModal
            onSignIn={() => {
              setShowCartLogin(false);
              onLoginClick && onLoginClick();
            } }
            onClose={() => setShowCartLogin(false)} open={false}/>
        )}
        <CartLoginModal
          open={cartModalOpen}
          onSignIn={() => {
            setCartModalOpen(false); 
            if (onLoginClick) onLoginClick(); // Login-Fenster öffnen
          }}
          onClose={() => setCartModalOpen(false)}
        />
      </div>
    </header>
  );
}
