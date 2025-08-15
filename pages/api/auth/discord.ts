import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uid } = req.query;
  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) {
    res.status(500).send("Discord Client ID fehlt! Bitte Umgebungsvariable DISCORD_CLIENT_ID setzen.");
    return;
  }
  // Wähle die Redirect-URI je nach Umgebung
  const isLocal = req.headers.host?.startsWith('localhost');
  const redirectUri = isLocal
    ? encodeURIComponent('http://localhost:3000/api/auth/discord-callback')
    : encodeURIComponent('https://www.betterwarzoneaudio.com/api/auth/discord-callback');
  // UID nur als state, nicht in der URI!
  const state = uid || 'no-uid';

  const discordOAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify email&state=${state}`;

  res.redirect(discordOAuthUrl);
}
