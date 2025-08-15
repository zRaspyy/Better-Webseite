import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { db } from '../../firebaseConfig';
import { get, ref } from 'firebase/database';

const ADMIN_EMAIL = "betterwarzoneaudio@gmail.com";

async function sendLicenseMail(to: string, licenseKey: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const html = `
    <div style="background:#18181b;padding:32px 0;font-family:sans-serif;">
      <div style="max-width:520px;margin:0 auto;background:#23232a;border-radius:18px;box-shadow:0 0 32px #ff3c3c22;padding:32px;">
        <h2 style="color:#ff3c3c;font-size:1.6rem;margin-bottom:12px;">
          🔑 Dein Lizenz-Key für Better Warzone Audio!
        </h2>
        <p style="color:#fff;font-size:1.1rem;margin-bottom:18px;">
          Hier ist dein persönlicher Lizenz-Key:<br>
          <span style="display:inline-block;background:#18181b;color:#ff3c3c;font-weight:bold;font-size:1.2rem;padding:10px 24px;border-radius:8px;border:2px solid #ff3c3c;margin:12px 0;">
            ${licenseKey}
          </span>
        </p>
        <div style="background:#18181b;border-radius:12px;padding:18px;margin-bottom:18px;">
          <h3 style="color:#ff3c3c;margin-bottom:8px;">Rechnung & Details:</h3>
          <ul style="color:#fff;font-size:1rem;line-height:1.7;">
            <li>✔️ Produkt: Lifetime Key</li>
            <li>✔️ Preis: 70 €</li>
            <li>✔️ Zugang zu allen Premium-Features</li>
            <li>✔️ Community Discord & Support</li>
            <li>✔️ Updates & neue Audio-Presets</li>
          </ul>
        </div>
        <a href="https://www.betterwarzoneaudio.com/download" style="display:inline-block;background:#ff3c3c;color:#fff;font-weight:bold;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:1.1rem;margin-bottom:18px;">
          App downloaden & Lizenz aktivieren
        </a>
        <p style="color:#bbb;font-size:0.95rem;margin-top:18px;">
          Fragen oder Probleme? <br>
          Schreibe uns jederzeit an <a href="mailto:betterwarzoneaudio@gmail.com" style="color:#ff3c3c;">betterwarzoneaudio@gmail.com</a> oder trete unserem <a href="https://discord.gg/8vDRCg2vAf" style="color:#ff3c3c;">Discord</a> bei.
        </p>
        <div style="margin-top:24px;text-align:center;">
          <a href="https://www.betterwarzoneaudio.com/" style="color:#ff3c3c;font-weight:bold;text-decoration:none;">betterwarzoneaudio.de</a>
        </div>
        <div style="margin-top:18px;text-align:center;">
          <img src="https://www.betterwarzoneaudio.com/assets/Logo.png" alt="Logo" style="width:48px;height:48px;border-radius:12px;border:2px solid #ff3c3c;background:#18181b;">
        </div>
      </div>
      <div style="text-align:center;color:#888;font-size:0.85rem;margin-top:18px;">
        © 2024 Better Warzone Audio – Alle Rechte vorbehalten.
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Better Warzone Audio" <${process.env.MAIL_USER}>`,
    to,
    subject: "Dein Lizenz-Key & Rechnung für Better Warzone Audio",
    html,
  });
}

async function sendAdminNotificationMail(adminEmail: string, userEmail: string, licenseKey: string, uid: string, product: string = "Lifetime Key", price: number = 70, stripeSession?: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const html = `
    <div style="background:#18181b;padding:32px 0;font-family:sans-serif;">
      <div style="max-width:540px;margin:0 auto;background:#23232a;border-radius:18px;box-shadow:0 0 32px #ff3c3c22;padding:32px;">
        <h2 style="color:#ff3c3c;font-size:1.6rem;margin-bottom:12px;">
          🛒 Produkt verkauft: Better Warzone Audio Lizenz-Key
        </h2>
        <p style="color:#fff;font-size:1.1rem;margin-bottom:18px;">
          Ein Kunde hat ein Produkt gekauft oder einen Lizenz-Key erhalten.<br>
        </p>
        <div style="background:#18181b;border-radius:12px;padding:18px;margin-bottom:18px;">
          <h3 style="color:#ff3c3c;margin-bottom:8px;">Bestelldetails:</h3>
          <ul style="color:#fff;font-size:1rem;line-height:1.7;">
            <li><b>Produkt:</b> ${product}</li>
            <li><b>Lizenz-Key:</b> <span style="color:#ff3c3c;font-weight:bold">${licenseKey}</span></li>
            <li><b>Preis:</b> ${price} €</li>
            <li><b>Kunde E-Mail:</b> <span style="color:#ff3c3c">${userEmail}</span></li>
            <li><b>Kunde UID:</b> <span style="color:#bbb">${uid}</span></li>
            ${stripeSession ? `<li><b>Stripe-Session:</b> <span style="color:#bbb">${stripeSession}</span></li>` : ""}
            <li><b>Zeitpunkt:</b> ${new Date().toLocaleString("de-DE")}</li>
          </ul>
        </div>
        <p style="color:#bbb;font-size:0.95rem;margin-top:18px;">
          Diese E-Mail dient als Bestätigung für den Verkauf.<br>
          Kunde: <b>${userEmail}</b>
        </p>
        <div style="margin-top:24px;text-align:center;">
          <a href="https://www.betterwarzoneaudio.com/" style="color:#ff3c3c;font-weight:bold;text-decoration:none;">betterwarzoneaudio.de</a>
        </div>
        <div style="margin-top:18px;text-align:center;">
          <img src="https://www.betterwarzoneaudio.com/assets/Logo.png" alt="Logo" style="width:48px;height:48px;border-radius:12px;border:2px solid #ff3c3c;background:#18181b;">
        </div>
      </div>
      <div style="text-align:center;color:#888;font-size:0.85rem;margin-top:18px;">
        © 2024 Better Warzone Audio – Alle Rechte vorbehalten.
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Better Warzone Audio" <${process.env.MAIL_USER}>`,
    to: adminEmail,
    subject: "Bestätigung: Kunde hat Produkt/Lizenz-Key erhalten",
    html,
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Nur POST erlaubt' });
    return;
  }
  const { uid, licenseKey } = req.body;
  if (!uid || !licenseKey) {
    res.status(400).json({ error: 'UID und Lizenz-Key erforderlich' });
    return;
  }
  try {
    const userSnap = await get(ref(db, `users/${uid}`));
    const userVal = userSnap.val() || {};
    const email = userVal.email;
    let product = "Lifetime Key";
    let price = 70;
    let stripeSession: string | undefined = undefined;

    if (userVal.orders) {
      const ordersArr = Object.values(userVal.orders) as any[];
      const foundOrder = ordersArr.find((o) => o.licenseKey === licenseKey);
      if (foundOrder) {
        product = foundOrder.product || product;
        price = typeof foundOrder.amount === "number" ? foundOrder.amount : price;
        stripeSession = foundOrder.stripeSession || undefined;
      }
    }

    if (!email) {
      res.status(404).json({ error: 'E-Mail nicht gefunden' });
      return;
    }
    await sendLicenseMail(email, licenseKey);
    await sendAdminNotificationMail(ADMIN_EMAIL, email, licenseKey, uid, product, price, stripeSession);
    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Mailversand fehlgeschlagen' });
  }
}
