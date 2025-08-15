import { useEffect } from 'react';

type CartLoginModalProps = {
  open: boolean;
  onClose: () => void;
  onSignIn?: () => void;
};

const CartLoginModal = ({ open, onClose, onSignIn }: CartLoginModalProps) => {
  useEffect(() => {
    if (open) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-xs flex flex-col items-center"
        style={{
          minWidth: 320,
          maxWidth: 370,
        }}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
          onClick={onClose}
          aria-label="Schließen"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-white mt-4 mb-2 text-center">Melde dich an</h2>
        <p className="mb-6 text-gray-300 text-center text-sm">
          Um deinen Warenkorb zu nutzen und Produkte zu kaufen, musst du angemeldet sein.
        </p>
        <button
          className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-red-400 to-red-600 text-white font-bold text-base shadow-md hover:bg-red-700 transition-all mb-2"
          onClick={() => {
            if (onSignIn) onSignIn();
            onClose();
          }}
        >
          Anmelden
        </button>
        <button
          className="w-full py-2 rounded-xl border border-red-400 text-red-400 font-medium text-base hover:bg-red-900/20 transition-all"
          onClick={onClose}
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
};

export default CartLoginModal;
