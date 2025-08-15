import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "../../context/UserContext";

export default function DiscordAuthPage() {
  const router = useRouter();
  const { user } = useUser(); // Hole den angemeldeten User

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    if (!clientId) {
      alert("Discord Client ID fehlt! Bitte Umgebungsvariable NEXT_PUBLIC_DISCORD_CLIENT_ID setzen.");
      return;
    }
    // Dynamische Redirect-URI für lokal/produktiv
    const isLocal = typeof window !== "undefined" && window.location.host.startsWith("localhost");
    const redirectUri = encodeURIComponent(
      isLocal
        ? "http://localhost:3000/api/auth/discord-callback"
        : "https://www.betterwarzoneaudio.com/api/auth/discord-callback"
    );
    // UID aus UserContext, nicht aus router.query!
    const state = user?.uid || 'no-uid';
    window.location.href = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify email&state=${state}`;
  }, [user]);
  return <div>Du wirst zu Discord weitergeleitet...</div>;
}
