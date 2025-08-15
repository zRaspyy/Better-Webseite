import { useEffect } from "react";
import { useRouter } from "next/router";

export default function DiscordSuccessPage() {
  const router = useRouter();
  useEffect(() => {
    const { discord, state } = router.query;
    if (discord) {
      try {
        const discordData = JSON.parse(decodeURIComponent(discord as string));
        window.opener?.postMessage(
          { type: "discord-auth-success", discord: discordData, state },
          "*"
        );
        window.close();
      } catch (e) {
        // Fehler beim Parsen
      }
    }
  }, [router.query]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#18181b] text-white">
      <h2 className="text-2xl font-bold mb-4">Discord Login erfolgreich!</h2>
      <p>Du kannst dieses Fenster jetzt schließen.</p>
    </div>
  );
}
