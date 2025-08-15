import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { db } from '../../firebaseConfig';
import { ref, set, get } from 'firebase/database';
import nodemailer from 'nodemailer';
import fetch from 'node-fetch';

export const config = {
  api: { bodyParser: false },
};

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
const stripeWebhookSecretThin = process.env.STRIPE_WEBHOOK_SECRET_THIN || "";
const mailUser = process.env.MAIL_USER;
const mailPass = process.env.MAIL_PASS;

if (!stripeSecret || !stripeWebhookSecret || !mailUser || !mailPass) {
  throw new Error('Stripe oder Mail Umgebungsvariablen fehlen!');
}

const stripe = new Stripe(stripeSecret, { apiVersion: '2023-08-16' as Stripe.LatestApiVersion });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: mailUser,
    pass: mailPass,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;
  let verified = false;

  try {
    const buf = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });

    try {
      event = stripe.webhooks.constructEvent(buf, sig, stripeWebhookSecret);
      verified = true;
    } catch {
      event = stripe.webhooks.constructEvent(buf, sig, stripeWebhookSecretThin);
      verified = true;
    }
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const email = session.customer_email;
    const licenseKey = Math.random().toString(36).substring(2, 12).toUpperCase();

    let product = 'lifetime-key';
    let discordRole = '';
    let discordCategory = '';
    let priceId = '';

    // Stripe sendet line_items NICHT direkt im Webhook!
    // Hole sie nach, falls nicht vorhanden:
    let lineItems: Stripe.ApiList<Stripe.LineItem> | undefined = undefined;
    try {
      if (!session.line_items) {
        lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
      } else if (Array.isArray(session.line_items.data)) {
        lineItems = { data: session.line_items.data } as any;
      }
    } catch {}

    if (lineItems && lineItems.data.length > 0) {
      priceId = lineItems.data[0]?.price?.id || '';
      if (priceId === 'price_1RvdnVL2fbcoGW3SOS9a5tQl') {
        product = 'license-1m';
        discordRole = '1404371465431810128';
        discordCategory = '1405196681909375237';
      }
      if (priceId === 'price_1RvhBWL2fbcoGW3SMOQ233kZ') {
        product = 'license-3m';
        discordRole = '1404371513829756938';
        discordCategory = '1405196734409478238';
      }
      if (priceId === 'price_1RvhBdL2fbcoGW3S1hkJInCb') {
        product = 'license-6m';
        discordRole = '1404371573321895979';
        discordCategory = '1405196782891171953';
      }
    }

    let couponCode = session.metadata?.coupon || null;
    let discount = 0;
    if (couponCode) {
      try {
        const snap = await get(ref(db, `settings/coupons/${couponCode}`));
        if (snap.exists()) {
          discount = snap.val().discount || 0;
        }
      } catch {}
    }
    
    let amount = session.amount_total ? session.amount_total / 100 : 0;
    if (discount > 0) amount = Math.max(0, amount - discount);

    if (userId) {
      try {
        await set(ref(db, `users/${userId}/orders/${session.id}`), {
          licenseKey,
          email,
          created: Date.now(),
          product,
          stripeSession: session.id,
          coupon: couponCode,
          discount,
          amount,
          paid: true,
          status: 'completed',
        });

        // Schreibe Stripe-Kauf auch in /invoices
        await set(ref(db, `invoices/${session.id}`), {
          id: session.id,
          email,
          product,
          price: amount,
          paid: true,
          status: 'completed',
          paymentMethod: "Stripe",
          created: Date.now(),
          completed: Date.now(),
          coupon: couponCode,
          discount,
          userId,
        });

        // Schreibe die Discord-Rolle/Kategorie in die User-Datenbank
        if (discordRole && discordCategory) {
          await set(ref(db, `users/${userId}/discordRole`), discordRole);
          await set(ref(db, `users/${userId}/discordCategory`), discordCategory);
        }

        // Discord-Rolle direkt zuweisen, wenn Discord-ID vorhanden
        const discordSnap = await get(ref(db, `users/${userId}/discord/id`));
        const discordId = discordSnap.exists() ? discordSnap.val() : null;
        if (discordId && discordRole) {
          // API-Call zum Zuweisen der Rolle (node-fetch)
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/discord/assign-role`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: userId,
              discordId,
              roleId: discordRole
            })
          });
        }
      } catch (dbErr) {
        return res.status(500).send('Fehler beim Speichern des Lizenz-Keys!');
      }

      try {
        await transporter.sendMail({
          from: mailUser,
          to: email,
          subject: 'Dein Kauf bei Better Warzone Audio',
          html: `
            <h2>Vielen Dank für deinen Kauf!</h2>
            <p>Hier sind deine Bestelldaten:</p>
            <ul style="font-size:1.1em;">
              <li><b>Produkt:</b> ${product}</li>
              <li><b>Kaufdatum:</b> ${new Date().toLocaleString('de-DE')}</li>
              <li><b>Stripe-ID:</b> ${session.id}</li>
            </ul>
            <p><b>Dein Lizenz-Key:</b></p>
            <pre style="font-size:1.2em;font-weight:bold;">${licenseKey}</pre>
            <p>
              Du findest deinen Key und alle Bestellungen jederzeit im User Dashboard.<br>
              Bewahre deinen Key sicher auf – ohne Key ist die Nutzung der App nicht möglich!
            </p>
            <hr>
            <p style="font-size:0.9em;color:#888;">
              Better Warzone Audio &copy; 2025<br>
              Support: betterwarzoneaudio@gmail.com
            </p>
          `,
        });
      } catch (mailErr) {
        return res.status(500).send('Fehler beim Senden der E-Mail!');
      }
    }
  }

  res.status(200).json({ received: true });
}
