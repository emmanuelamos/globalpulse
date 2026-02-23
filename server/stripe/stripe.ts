/**
 * GlobalPulse Stripe Integration
 * Handles checkout sessions and webhook events.
 */
import Stripe from "stripe";
import { ENV } from "../_core/env";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    _stripe = new Stripe(secretKey, {
      apiVersion: "2025-01-27.acacia" as any,
    });
  }
  return _stripe;
}

/**
 * Create a Checkout Session for Premium subscription
 */
export async function createPremiumCheckout(params: {
  userId: number;
  userEmail: string;
  userName: string | null;
  origin: string;
  stripeCustomerId?: string | null;
}) {
  const stripe = getStripe();

  const sessionConfig: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "GlobalPulse Premium",
            description: "Unlimited access: rewind, recording, past broadcasts, priority call-in, ad-free.",
          },
          unit_amount: 400,
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ],
    client_reference_id: params.userId.toString(),
    metadata: {
      user_id: params.userId.toString(),
      customer_email: params.userEmail,
      customer_name: params.userName || "",
      type: "premium_subscription",
    },
    allow_promotion_codes: true,
    success_url: `${params.origin}/profile?payment=success`,
    cancel_url: `${params.origin}/profile?payment=cancelled`,
  };

  // Use existing customer or prefill email
  if (params.stripeCustomerId) {
    sessionConfig.customer = params.stripeCustomerId;
  } else {
    sessionConfig.customer_email = params.userEmail;
  }

  const session = await stripe.checkout.sessions.create(sessionConfig);
  return { url: session.url };
}

/**
 * Create a Checkout Session for Call-In payment
 */
export async function createCallInCheckout(params: {
  userId: number;
  userEmail: string;
  userName: string | null;
  room: string;
  origin: string;
  stripeCustomerId?: string | null;
}) {
  const stripe = getStripe();

  const sessionConfig: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "GlobalPulse Call-In",
            description: `3-minute live call-in slot — ${params.room} room`,
          },
          unit_amount: 99,
        },
        quantity: 1,
      },
    ],
    client_reference_id: params.userId.toString(),
    metadata: {
      user_id: params.userId.toString(),
      customer_email: params.userEmail,
      customer_name: params.userName || "",
      type: "call_in",
      room: params.room,
    },
    allow_promotion_codes: true,
    success_url: `${params.origin}/broadcasters?payment=success&room=${params.room}`,
    cancel_url: `${params.origin}/broadcasters?payment=cancelled`,
  };

  if (params.stripeCustomerId) {
    sessionConfig.customer = params.stripeCustomerId;
  } else {
    sessionConfig.customer_email = params.userEmail;
  }

  const session = await stripe.checkout.sessions.create(sessionConfig);
  return { url: session.url };
}
