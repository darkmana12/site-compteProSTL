import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Webhook Stripe — en local : stripe listen --forward-to localhost:3000/api/webhooks/stripe
 */
export async function POST(request: NextRequest) {
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!whSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET non configuré." },
      { status: 503 }
    );
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, whSecret);
  } catch (err) {
    console.error("[webhook stripe]", err);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("[webhook] checkout.session.completed", session.id);
  }

  return NextResponse.json({ received: true });
}
