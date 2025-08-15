import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { db } from '../../firebaseConfig';
import { ref, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) throw new Error('STRIPE_SECRET_KEY fehlt!');

const stripe = new Stripe(stripeSecret, {});

const priceMap: Record<string, string> = {
  'lifetime-key': 'price_1RvBxGL2fbcoGW3SIFDLUPwt',
  'license-1m': 'price_1RvdnVL2fbcoGW3SOS9a5tQl',
  'license-3m': 'price_1RvhBWL2fbcoGW3SMOQ233kZ',
  'license-6m': 'price_1RvhBdL2fbcoGW3S1hkJInCb',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Nur POST erlaubt.' });
    return;
  }

  const { items, userId, userEmail, coupon, successUrl, cancelUrl, test } = req.body;
  if (!items || !userId || !userEmail) {
    res.status(400).json({ error: 'Fehlende Daten.' });
    return;
  }

  // Testkauf: Simuliere Stripe-Checkout
  if (test) {
    const orderId = uuidv4();
    const invoiceId = "test-" + orderId;
    const now = Date.now();
    const productNames = items.map((i: any) => i.name).join(', ');
    const totalPrice = items.reduce((sum: number, i: any) => sum + Number(i.price), 0);

    // Invoice speichern
    const invoiceData = {
      id: invoiceId,
      email: userEmail,
      product: productNames,
      price: totalPrice,
      paid: true,
      paymentMethod: "Testkauf",
      created: now,
      completed: now,
      test: true,
      userId,
    };
    await set(ref(db, `invoices/${invoiceId}`), invoiceData);

    // Order speichern
    const orderData = {
      licenseKey: "TEST-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
      email: userEmail,
      created: now,
      product: productNames,
      stripeSession: invoiceId,
      amount: totalPrice,
      test: true,
    };
    await set(ref(db, `users/${userId}/orders/${orderId}`), orderData);

    res.status(200).json({ success: true });
    return;
  }

  try {
    const line_items = items.map((item: any) => {
      const priceId = priceMap[item.id];
      if (!priceId) throw new Error('Ungültiges Produkt');
      return {
        price: priceId,
        quantity: 1,
      };
    });

    const origin =
      (req.headers.origin as string) ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      'https://www.betterwarzoneaudio.com';

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      customer_email: userEmail,
      metadata: { userId, coupon: coupon || '' },
      success_url: successUrl || process.env.NEXT_PUBLIC_BASE_URL + '/success',
      cancel_url: cancelUrl || process.env.NEXT_PUBLIC_BASE_URL + '/cart?cancelled=true',
    });

    // Schreibe "pending" Order/Invoice in die DB
    const orderId = session.id;
    const now = Date.now();
    const productNames = items.map((i: any) => i.name).join(', ');
    const totalPrice = items.reduce((sum: number, i: any) => sum + Number(i.price), 0);

    // Invoice
    await set(ref(db, `invoices/${orderId}`), {
      id: orderId,
      email: userEmail,
      product: productNames,
      price: totalPrice,
      paid: false,
      status: 'pending',
      paymentMethod: "Stripe",
      created: now,
      userId,
      coupon: coupon || '',
    });

    // Order
    await set(ref(db, `users/${userId}/orders/${orderId}`), {
      email: userEmail,
      created: now,
      product: productNames,
      stripeSession: orderId,
      amount: totalPrice,
      paid: false,
      status: 'pending',
      coupon: coupon || '',
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Stripe Fehler' });
  }
}
