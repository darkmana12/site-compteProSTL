import { orders } from "@/db/schema";
import { getDb } from "@/db";
import { normalizeEmail } from "@/lib/email-normalize";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";

function paymentIntentId(session: Stripe.Checkout.Session): string | null {
  const pi = session.payment_intent;
  if (pi == null) return null;
  if (typeof pi === "string") return pi;
  return pi.id;
}

/**
 * Enregistre une commande payée après `checkout.session.completed` (idempotent sur session id).
 * Sans DB configurée, ne fait rien (log).
 */
export async function recordPaidOrderFromCheckoutSession(
  sessionId: string
): Promise<void> {
  const db = getDb();
  if (!db) {
    console.warn("[orders] DATABASE_URL absent, persistance ignorée");
    return;
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  if (session.payment_status !== "paid") {
    return;
  }

  const orderItemsJson = session.metadata?.order_items ?? "[]";
  const rawEmail =
    session.customer_details?.email ??
    (typeof session.customer_email === "string" ? session.customer_email : null) ??
    null;
  const email = rawEmail ? normalizeEmail(rawEmail) : null;

  await db
    .insert(orders)
    .values({
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: paymentIntentId(session),
      customerEmail: email,
      amountTotalCents: session.amount_total ?? 0,
      currency: (session.currency ?? "eur").toLowerCase(),
      orderItemsJson,
    })
    .onConflictDoNothing({ target: orders.stripeCheckoutSessionId });
}
