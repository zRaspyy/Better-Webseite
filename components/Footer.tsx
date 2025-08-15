import { ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [socials, setSocials] = useState({
    discord: '',
    youtube: '',
    telegram: '',
    tiktok: '',
    instagram: '',
    mail: '',
  });
  // Entferne Legal-Texte aus DB
  // const [legal, setLegal] = useState({
  //   datenschutz: '',
  //   agb: '',
  //   impressum: '',
  // });

  useEffect(() => {
    const socialsRef = ref(db, 'settings/socials');
    const unsub = onValue(socialsRef, snap => {
      const val = snap.val() || {};
      setSocials({
        discord: val.discord || '',
        youtube: val.youtube || '',
        telegram: val.telegram || '',
        tiktok: val.tiktok || '',
        instagram: val.instagram || '',
        mail: val.mail || '',
      });
    });
    // Entferne Legal-DB-Listener
    // const legalRef = ref(db, 'settings/legal');
    // const unsubLegal = onValue(legalRef, snap => {
    //   const val = snap.val() || {};
    //   setLegal({
    //     datenschutz: val.datenschutz || '',
    //     agb: val.agb || '',
    //     impressum: val.impressum || '',
    //   });
    // });
    return () => {
      unsub();
      // if (unsubLegal) unsubLegal();
    };
  }, []);

  return (
    <footer className="relative w-full bg-[#111] text-gray-300 pt-10 pb-6 px-4 border-t border-[#232323] font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 font-sans">
        {/* Top: Name und Untertitel */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between font-sans">
          <div>
            <div className="font-bold text-xl text-white font-sans">BETTER WARZONE AUDIO</div>
            <div className="text-sm text-gray-400 mt-1 font-sans">Professionelle Audio Einstellungen für Warzone & Black Ops 6!</div>
          </div>
        </div>
        {/* Linie */}
        <div className="w-full border-t border-[#232323] my-2" />
        {/* Bottom: Copyright, Info, Links */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <span className="text-sm text-gray-300">
              ALLE RECHTE VORBEHALTEN. 2024-2025 © BETTER WARZONE AUDIO
            </span>
            <div className="text-xs text-gray-500 mt-1">
              Dieses Projekt ist unabhängig und wird privat betrieben.
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-2 sm:mt-0">
            {/* Verlinke direkt auf die Seiten */}
            <a href="/datenschutz" className="hover:text-secondary text-sm">Datenschutz</a>
            <a href="/agb" className="hover:text-secondary text-sm">AGB</a>
            <a href="/impressum" className="hover:text-secondary text-sm">Impressum</a>
            <span className="text-xs text-gray-500 sm:ml-4">Powered by @Raspyy</span>
            {/* Social Icons rechts, klein */}
            <ul className="example-2 flex items-center ml-2">
              <li className="icon-content relative">
                <a href={socials.discord || "https://discord.gg/betterwarzoneaudio"} target="_blank" rel="noopener noreferrer" data-social="discord">
                  <span className="filled"></span>
                  {/* Discord SVG */}
                  <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="currentColor" d="M20.317 4.369A19.791 19.791 0 0 0 16.885 3.3a.074.074 0 0 0-.079.037c-.357.632-.76 1.453-1.042 2.104a18.736 18.736 0 0 0-5.527 0c-.282-.651-.685-1.472-1.042-2.104a.073.073 0 0 0-.079-.037A19.736 19.736 0 0 0 3.683 4.369a.064.064 0 0 0-.028.027C.533 8.725-.32 13.01.099 17.255a.08.08 0 0 0 .031.056c2.137 1.57 4.205 2.527 6.24 3.179a.077.077 0 0 0 .084-.027c.48-.658.91-1.352 1.288-2.078a.076.076 0 0 0-.041-.105c-.662-.251-1.294-.549-1.91-.892a.077.077 0 0 1-.008-.127c.128-.096.256-.192.381-.291a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.125.099.253.195.381.291a.077.077 0 0 1-.007.127 13.093 13.093 0 0 1-1.911.893.076.076 0 0 0-.04.104c.378.726.808 1.42 1.289 2.078a.076.076 0 0 0 .084.027c2.035-.652 4.102-1.609 6.24-3.179a.077.077 0 0 0 .03-.056c.5-5.177-.838-9.418-3.654-12.859a.061.061 0 0 0-.028-.027ZM8.02 15.331c-1.183 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.175 1.095 2.156 2.418 0 1.334-.955 2.419-2.157 2.419Zm7.974 0c-1.183 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.175 1.095 2.156 2.418 0 1.334-.946 2.419-2.156 2.419Z"/></svg>
                </a>
                <span className="tooltip bg-[#23232a]">Discord</span>
              </li>
              <li className="icon-content relative">
                <a href={socials.youtube || "https://youtube.com/@raspyy"} target="_blank" rel="noopener noreferrer" data-social="youtube">
                  <span className="filled"></span>
                  {/* YouTube SVG */}
                  <svg viewBox="0 0 576 512" className="w-6 h-6"><path fill="currentColor" d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg>
                </a>
                <span className="tooltip bg-[#23232a]">YouTube</span>
              </li>
              <li className="icon-content relative">
                <a href={socials.telegram || "#"} target="_blank" rel="noopener noreferrer" data-social="telegram">
                  <span className="filled"></span>
                  {/* Telegram SVG */}
                  <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="currentColor" d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm5.707 7.293l-1.414 1.414-7.293 7.293-1.414-1.414 7.293-7.293 1.414 1.414z"/></svg>
                </a>
                <span className="tooltip bg-[#23232a]">Telegram</span>
              </li>
              <li className="icon-content relative">
                <a href={socials.tiktok || "#"} target="_blank" rel="noopener noreferrer" data-social="tiktok">
                  <span className="filled"></span>
                  {/* TikTok SVG */}
                  <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm1 17.93V6.07c3.39.49 6 3.39 6 6.93 0 3.54-2.61 6.44-6 6.93z"/></svg>
                </a>
                <span className="tooltip bg-[#23232a]">TikTok</span>
              </li>
              <li className="icon-content relative">
                <a href={socials.instagram || "#"} target="_blank" rel="noopener noreferrer" data-social="instagram">
                  <span className="filled"></span>
                  {/* Instagram SVG */}
                  <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0 1.838c-3.18 0-3.563.012-4.82.07-1.042.047-1.602.218-1.98.396-.378.178-.646.39-.924.668-.278.278-.49.546-.668.924-.178.378-.349.938-.396 1.98-.058 1.257-.07 1.64-.07 4.82s.012 3.563.07 4.82c.047 1.042.218 1.602.396 1.98.178.378.39.646.668.924.278.278.546.49.924.668.378.178.938.349 1.98.396 1.257.058 1.64.07 4.82.07s3.563-.012 4.82-.07c1.042-.047 1.602-.218 1.98-.396.378-.178.646-.39.924-.668.278-.278.49-.546.668-.924.178-.378.349-.938.396-1.98.058-1.257.07-1.64.07-4.82s-.012-3.563-.07-4.82c-.047-1.042-.218-1.602-.396-1.98-.178-.378-.39-.646-.668-.924-.278-.278-.546-.49-.924-.668-.378-.178-.938-.349-1.98-.396-1.257-.058-1.64-.07-4.82-.07zm0 3.838a6.163 6.163 0 1 0 0 12.326 6.163 6.163 0 0 0 0-12.326zm0 10.163a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>
                </a>
                <span className="tooltip bg-[#23232a]">Instagram</span>
              </li>
              <li className="icon-content relative">
                <a href={socials.mail ? `mailto:${socials.mail}` : "mailto:betterwarzoneaudio@gmail.com"} data-social="mail">
                  <span className="filled"></span>
                  {/* Mail SVG */}
                  <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8l8 5 8-5v10z"/></svg>
                </a>
                <span className="tooltip bg-[#23232a]">Mail</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="button fixed bottom-7 right-7 z-50"
          aria-label="Nach oben scrollen"
        >
          <span className="svgIcon">
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M10 5v10M10 5l-5 5M10 5l5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </button>
      )}
      {/* Socials CSS & Button CSS */}
      <style jsx>{`
        .example-2 {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .icon-content {
          margin: 0 6px;
          position: relative;
        }
        .icon-content .tooltip {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          color: #fff;
          padding: 6px 10px;
          border-radius: 15px;
          opacity: 0;
          visibility: hidden;
          font-size: 13px;
          transition: all 0.3s ease;
          background: #23232a;
          z-index: 10;
        }
        .icon-content:hover .tooltip {
          opacity: 1;
          visibility: visible;
          top: -50px;
        }
        .icon-content a {
          position: relative;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 36px;
          height: 36px;
          border-radius: 20%;
          color: #4d4d4d;
          background-color: #fff;
          transition: all 0.3s ease-in-out;
        }
        .icon-content a:hover {
          box-shadow: 3px 2px 45px 0px rgb(0 0 0 / 50%);
          color: white;
        }
        .icon-content a svg {
          position: relative;
          z-index: 1;
          width: 22px;
          height: 22px;
        }
        .icon-content a .filled {
          position: absolute;
          top: auto;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 0;
          background-color: #000;
          transition: all 0.3s ease-in-out;
          z-index: 0;
        }
        .icon-content a:hover .filled {
          height: 100%;
        }
        /* Neuer Back-to-Top Button */
        .button {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: rgb(20, 20, 20);
          border: none;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0px 0px 0px 4px rgba(180, 160, 255, 0.253);
          cursor: pointer;
          transition-duration: 0.3s;
          overflow: hidden;
          position: fixed;
          right: 28px;
          bottom: 28px;
        }
        .svgIcon {
          width: 12px;
          transition-duration: 0.3s;
        }
        .svgIcon path {
          fill: white;
        }
        .button:hover {
          width: 140px;
          border-radius: 50px;
          transition-duration: 0.3s;
          background-color: rgb(181, 160, 255);
          align-items: center;
        }
        .button:hover .svgIcon {
          transition-duration: 0.3s;
          transform: translateY(-200%);
        }
        .button::before {
          position: absolute;
          bottom: -20px;
          content: "Back to Top";
          color: white;
          font-size: 0px;
        }
        .button:hover::before {
          font-size: 13px;
          opacity: 1;
          bottom: unset;
          transition-duration: 0.3s;
        }
      `}</style>
    </footer>
  );
}
