import { NextRequest, NextResponse } from "next/server";
import type { Product } from "@/lib/types";
import { getProductById } from "@/lib/products";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

function getOrigin(request: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (env) return env.replace(/\/$/, "");
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  if (host) return `${proto}://${host}`;
  return "http://localhost:3000";
}

type BodyLine = { productId?: string; quantity?: number };

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe non configuré (STRIPE_SECRET_KEY)." },
      { status: 503 }
    );
  }

  let body: { lines?: BodyLine[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const lines = body.lines;
  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: "Panier vide." }, { status: 400 });
  }

  const validLines: { product: Product; quantity: number }[] = [];
  for (const line of lines) {
    const qty = Math.floor(Number(line.quantity));
    if (!line.productId || qty < 1 || qty > 99) {
      return NextResponse.json({ error: "Quantité invalide." }, { status: 400 });
    }
    const product = getProductById(line.productId);
    if (!product) {
      return NextResponse.json(
        { error: `Produit inconnu : ${line.productId}` },
        { status: 400 }
      );
    }
    validLines.push({ product, quantity: qty });
  }

  const origin = getOrigin(request);
  const stripe = getStripe();
  const metadataItems = validLines.map(({ product, quantity }) => ({
    slug: product.slug,
    q: quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: validLines.map(({ product, quantity }) => ({
        quantity,
        price_data: {
          currency: "eur",
          product_data: {
            name: product.name,
            description: product.shortDescription.slice(0, 120),
          },
          unit_amount: Math.round(product.price * 100),
        },
      })),
      metadata: {
        order_items: JSON.stringify(metadataItems),
      },
      success_url: `${origin}/commande/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/panier`,
      locale: "fr",
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Session Stripe sans URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[checkout]", e);
    return NextResponse.json(
      { error: "Impossible de créer la session de paiement." },
      { status: 500 }
    );
  }
}
