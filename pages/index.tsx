import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Produkte from '@/components/Produkte';
import Footer from '../components/Footer';
import LoginPopup from '../components/login-popup';
import BackgroundGlow from '../components/BackgroundGlow';
import AboutUsSection from '../components/AboutUsSection';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-dark relative">
      <BackgroundGlow />
      <Header onLoginClick={() => setShowLogin(true)} />
      <main className={`flex-1 transition-all duration-300 ${showLogin ? 'blur-md pointer-events-none select-none' : ''}`}>
        <Hero />
        <Produkte />
        <AboutUsSection />
      </main>
      <Footer />
      {showLogin && (
        <LoginPopup onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
}
