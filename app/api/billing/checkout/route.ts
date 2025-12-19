import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const priceId = process.env.STRIPE_PRICE_ID;
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

if (!stripeSecret || !priceId) {
  throw new Error('Stripe env vars missing');
}

const stripe = new Stripe(stripeSecret, { apiVersion: '2023-10-16' });

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: false,
    success_url: `${baseUrl}/dashboard?checkout=success`,
    cancel_url: `${baseUrl}/dashboard?checkout=cancelled`,
    billing_address_collection: 'auto'
  });

  return NextResponse.json({ url: session.url });
}
