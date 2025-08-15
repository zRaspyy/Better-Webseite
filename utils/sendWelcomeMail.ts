import nodemailer from "nodemailer";
import { db } from "../firebaseConfig";
import { ref, get, set } from "firebase/database";

export async function sendWelcomeMail(to: string, username: string) {
  // Prüfe, ob die Willkommensmail schon versendet wurde
  const mailFlagRef = ref(db, `welcomeSent/${encodeURIComponent(to)}`);
  const flagSnap = await get(mailFlagRef);
  if (flagSnap.exists()) {
    // Mail wurde schon versendet, abbrechen
    return;
  }

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
          🎉 Willkommen bei Better Warzone Audio!
        </h2>
        <p style="color:#fff;font-size:1.1rem;margin-bottom:18px;">
          Hallo ${username},<br>
          Deine Anmeldung war erfolgreich.<br>
          Du bist jetzt Teil der Community!
        </p>
        <div style="background:#18181b;border-radius:12px;padding:18px;margin-bottom:18px;">
          <h3 style="color:#ff3c3c;margin-bottom:8px;">Deine Vorteile:</h3>
          <ul style="color:#fff;font-size:1rem;line-height:1.7;">
            <li>✔️ Zugang zur App & allen Features</li>
            <li>✔️ Community Discord & Support</li>
            <li>✔️ Eigener Warenkorb & Bestellungen</li>
            <li>✔️ Exklusive Audio-Presets & Updates</li>
          </ul>
        </div>
        <a href="https://www.betterwarzoneaudio.com/download" style="display:inline-block;background:#ff3c3c;color:#fff;font-weight:bold;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:1.1rem;margin-bottom:18px;">
          Jetzt App downloaden
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
    subject: "Willkommen bei Better Warzone Audio – Deine Anmeldung war erfolgreich!",
    html,
  });
  await set(mailFlagRef, true);
}
