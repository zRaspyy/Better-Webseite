import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, state } = req.query;
  if (!code) {
    res.status(400).send("Kein Code von Discord erhalten.");
    return;
  }

  // Dynamische Redirect-URI für lokal/produktiv
  const isLocal = req.headers.host?.startsWith('localhost');
  const redirectUri = isLocal
    ? "http://localhost:3000/api/auth/discord-callback"
    : "https://www.betterwarzoneaudio.com/api/auth/discord-callback";

  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    client_secret: process.env.DISCORD_CLIENT_SECRET!,
    grant_type: "authorization_code",
    code: String(code),
    redirect_uri: redirectUri, // <-- Korrekt: camelCase verwenden!
    scope: "identify email"
  });

  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  });
  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    res.status(400).send("Discord Token konnte nicht abgerufen werden.");
    return;
  }

  // Hole User-Daten
  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });
  const userData = await userRes.json();

  res.redirect(`/auth/discord-success?discord=${encodeURIComponent(JSON.stringify(userData))}&state=${encodeURIComponent(String(state))}`);
}
