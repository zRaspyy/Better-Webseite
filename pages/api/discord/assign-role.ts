import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Nur POST erlaubt." });
    return;
  }
  const { uid, discordId, roleId } = req.body;
  if (!uid || !discordId || !roleId) {
    res.status(400).json({ error: "Fehlende Daten." });
    return;
  }

  const guildId = process.env.DISCORD_GUILD_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!guildId || !botToken) {
    res.status(500).json({ error: "Bot-Token oder Guild-ID fehlt." });
    return;
  }

  // Discord API: Rolle zuweisen
  try {
    const url = `https://discord.com/api/v10/guilds/${guildId}/members/${discordId}/roles/${roleId}`;
    const discordRes = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json"
      }
    });
    if (discordRes.ok) {
      res.status(200).json({ success: true });
    } else {
      const errorText = await discordRes.text();
      res.status(400).json({ error: "Discord API Fehler: " + errorText });
    }
  } catch (e: any) {
    res.status(500).json({ error: "Serverfehler: " + (e.message || "Unbekannt") });
  }
}
