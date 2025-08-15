import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { X, UserCircle, Receipt, LogOut, Sparkles } from "lucide-react";
import ProfileTab from "./ProfileTab";
import OrdersTab from "./OrdersTab";
import DiscordTab from "./DiscordTab";

type UserDashboardTab = "profile" | "orders" | "discord";

export default function UserDashboard({ onClose, initialTab = "profile" }: { onClose: () => void; initialTab?: UserDashboardTab }) {
  const { user, avatar, logout } = useUser(); // avatar aus Context holen
  const [tab, setTab] = useState<UserDashboardTab>(initialTab || "profile");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Sidebar wie im AdminDashboard
  function renderSidebar() {
    return (
      <div className="flex flex-col w-56 min-w-56 bg-[#23232a] border-r border-[#23232a] py-8 px-4 gap-3 rounded-l-2xl h-full justify-between">
        {/* Account oben */}
        <div className="flex flex-row items-center gap-3 mb-6">
          {avatar ? (
            <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-[#ff3c3c]" />
          ) : (
            <UserCircle className="w-10 h-10 text-[#ff3c3c] rounded-full bg-[#18181b] border-2 border-[#ff3c3c]" />
          )}
          <div className="flex flex-col">
            <span className="font-bold text-white text-base leading-tight">{user?.displayName || user?.email?.split("@")[0] || "User"}</span>
            <span className="text-xs text-gray-400 leading-tight">{user?.email}</span>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex flex-col gap-2">
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-base transition shadow ${tab === "profile" ? "bg-[#ff3c3c] text-white" : "bg-[#18181b] text-gray-300 hover:bg-[#23232a]"}`}
            onClick={() => setTab("profile")}
          >
            <UserCircle className="w-5 h-5" />
            <span className="text-base">Profil</span>
          </button>
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-base transition shadow ${tab === "orders" ? "bg-[#ff3c3c] text-white" : "bg-[#18181b] text-gray-300 hover:bg-[#23232a]"}`}
            onClick={() => setTab("orders")}
          >
            <Receipt className="w-5 h-5" />
            <span className="text-base">Bestellungen</span>
          </button>
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-base transition shadow ${tab === "discord" ? "bg-[#7289da] text-white" : "bg-[#18181b] text-gray-300 hover:bg-[#23232a]"}`}
            onClick={() => setTab("discord")}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-base">Discord</span>
          </button>
        </div>
        {/* Logout unten */}
        <div className="flex flex-col gap-2 mt-8">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-base bg-[#18181b] text-gray-300 hover:bg-[#23232a] shadow"
            onClick={async () => {
              await logout();
              onClose();
            }}
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-base">Logout</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative bg-[#18181b] border border-[#23232a] rounded-2xl shadow-2xl p-0 w-[900px] h-[600px] mx-auto flex flex-row min-h-[600px] min-w-[900px]">
        {renderSidebar()}
        {/* Content Frame */}
        <div className="flex-1 flex flex-col gap-8 p-8 overflow-y-auto relative items-center justify-center">
          <button
            className="absolute top-6 right-6 text-gray-400 hover:text-white text-xl"
            onClick={onClose}
            aria-label="Schließen"
          >
            <X />
          </button>
          <div className="w-full max-w-[600px] flex flex-col items-center justify-center h-full">
            {/* ...bestehende Tabs... */}
            {tab === "profile" && <ProfileTab user={user} />}
            {tab === "orders" && <OrdersTab user={user} />}
            {tab === "discord" && <DiscordTab user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
}
