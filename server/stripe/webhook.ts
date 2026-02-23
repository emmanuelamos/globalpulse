/**
 * Stripe Webhook Handler for GlobalPulse
 * Handles checkout.session.completed, invoice.paid, customer.subscription.deleted
 */
import type { Request, Response } from "express";
import Stripe from "stripe";
import { getStripe } from "./stripe";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export async function handleStripeWebhook(req: Request, res: Response) {
  const stripe = getStripe();
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[Webhook] STRIPE_WEBHOOK_SECRET not configured");
    return res.status(500).json({ error: "Webhook secret not configured" });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("[Webhook] Signature verification failed:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = parseInt(session.metadata?.user_id || session.client_reference_id || "0");
        const type = session.metadata?.type;

        if (!userId) {
          console.warn("[Webhook] No user_id in session metadata");
          break;
        }

        const db = await getDb();
        if (!db) break;

        if (type === "premium_subscription") {
          // Update user to premium
          await db.update(users).set({
            subscriptionTier: "premium",
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
          }).where(eq(users.id, userId));
          console.log(`[Webhook] User ${userId} upgraded to premium`);
        } else if (type === "call_in") {
          // Record the call-in payment — the actual call-in queue entry is created via the API
          console.log(`[Webhook] Call-in payment completed for user ${userId}, room: ${session.metadata?.room}`);
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const db = await getDb();
        if (!db) break;

        // Ensure subscription stays active on renewal
        const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, customerId)).limit(1);
        if (user) {
          await db.update(users).set({ subscriptionTier: "premium" }).where(eq(users.id, user.id));
          console.log(`[Webhook] Subscription renewed for user ${user.id}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const db = await getDb();
        if (!db) break;

        // Downgrade user to free
        const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, customerId)).limit(1);
        if (user) {
          await db.update(users).set({
            subscriptionTier: "free",
            stripeSubscriptionId: null,
          }).where(eq(users.id, user.id));
          console.log(`[Webhook] User ${user.id} downgraded to free`);
        }
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error(`[Webhook] Error processing ${event.type}:`, err);
  }

  res.json({ received: true });
}
