import { NextRequest, NextResponse } from "next/server";
import { countOrdersForEmail } from "@/lib/orders-queries";
import { normalizeEmail } from "@/lib/email-normalize";
import {
  generateMagicToken,
  getPublicSiteUrl,
  hashMagicToken,
  sendMagicLinkEmail,
  storeMagicToken,
} from "@/lib/magic-link";
import { isDatabaseConfigured } from "@/db";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Base de données non configurée." },
      { status: 503 }
    );
  }

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const raw = body.email?.trim();
  if (!raw || !raw.includes("@")) {
    return NextResponse.json({ error: "E-mail invalide." }, { status: 400 });
  }

  const email = normalizeEmail(raw);
  const n = await countOrdersForEmail(email);
  if (n === 0) {
    return NextResponse.json({ ok: true, noOrders: true });
  }

  const plain = generateMagicToken();
  const tokenHash = hashMagicToken(plain);

  try {
    await storeMagicToken(email, tokenHash);
  } catch (e) {
    console.error("[magic-link] store", e);
    return NextResponse.json(
      { error: "Impossible d’enregistrer le lien." },
      { status: 500 }
    );
  }

  const origin = getPublicSiteUrl(request.nextUrl.origin);
  const verifyUrl = `${origin}/api/auth/magic/verify?token=${encodeURIComponent(plain)}`;

  try {
    await sendMagicLinkEmail(email, verifyUrl);
  } catch (e) {
    console.error("[magic-link] email", e);
    const msg = e instanceof Error ? e.message : "Erreur envoi e-mail.";
    return NextResponse.json(
      {
        error:
          msg.includes("RESEND") || msg.includes("manquant")
            ? "Envoi d’e-mails non configuré (RESEND_API_KEY / RESEND_FROM_EMAIL)."
            : "Impossible d’envoyer l’e-mail. Réessayez plus tard.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true });
}
