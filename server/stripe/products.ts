/**
 * GlobalPulse Stripe Products Configuration
 * Centralized product/price definitions for consistency across checkout and webhooks.
 */

export const PRODUCTS = {
  premium: {
    name: "GlobalPulse Premium",
    description: "Unlimited access to all features: rewind, recording, past broadcasts, priority call-in queue, and ad-free experience.",
    priceMonthly: 400, // $4.00 in cents
    currency: "usd",
    interval: "month" as const,
    features: [
      "Rewind live broadcasts",
      "Record broadcasts to rewatch",
      "Access past broadcasts (48hr archive)",
      "Priority call-in queue",
      "Ad-free experience",
      "Exclusive country rooms",
    ],
  },
  callIn: {
    name: "GlobalPulse Call-In",
    description: "One-time call-in to the live Broadcasters Room. Speak your mind on air!",
    price: 99, // $0.99 in cents
    currency: "usd",
    features: [
      "3-minute live call-in slot",
      "Speak with AI anchors",
      "Your voice on the global broadcast",
    ],
  },
} as const;
