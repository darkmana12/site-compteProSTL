import { createHash, randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { magicLinkTokens } from "@/db/schema";
import { getDb } from "@/db";
import { normalizeEmail } from "@/lib/email-normalize";

const MAGIC_LINK_TTL_MIN = 15;

export function hashMagicToken(plain: string): string {
  return createHash("sha256").update(plain).digest("hex");
}

export function generateMagicToken(): string {
  return randomBytes(32).toString("hex");
}

export async function storeMagicToken(
  email: string,
  tokenHash: string
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Base de données non configurée.");
  const expiresAt = new Date(Date.now() + MAGIC_LINK_TTL_MIN * 60 * 1000);
  await db.insert(magicLinkTokens).values({
    tokenHash,
    email,
    expiresAt,
  });
}

export async function consumeMagicToken(
  plainToken: string
): Promise<string | null> {
  const db = getDb();
  if (!db) return null;
  const hash = hashMagicToken(plainToken);
  const rows = await db
    .select()
    .from(magicLinkTokens)
    .where(eq(magicLinkTokens.tokenHash, hash))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  if (row.usedAt) return null;
  if (row.expiresAt.getTime() < Date.now()) return null;
  await db
    .update(magicLinkTokens)
    .set({ usedAt: new Date() })
    .where(eq(magicLinkTokens.id, row.id));
  return row.email;
}

export function getPublicSiteUrl(requestOrigin?: string | null): string {
  const env = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (env) return env.replace(/\/$/, "");
  if (requestOrigin) return requestOrigin.replace(/\/$/, "");
  return "http://localhost:3000";
}

export async function sendMagicLinkEmail(
  toEmail: string,
  verifyUrl: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY manquant.");
  }
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!from) {
    throw new Error("RESEND_FROM_EMAIL manquant.");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: normalizeEmail(toEmail),
    subject: "Forge & Form — Lien pour accéder à vos achats",
    html: `
      <p>Bonjour,</p>
      <p>Cliquez sur le bouton ci-dessous pour ouvrir la page <strong>Mes achats</strong> et télécharger vos fichiers (liens régénérés à chaque visite).</p>
      <p><a href="${verifyUrl}" style="display:inline-block;padding:12px 20px;background:#176b60;color:#fff;text-decoration:none;border-radius:8px;">Accéder à mes achats</a></p>
      <p>Ce lien expire dans ${MAGIC_LINK_TTL_MIN} minutes. Si vous n’avez pas demandé cet e-mail, ignorez-le.</p>
      <p>— Forge & Form</p>
    `,
  });
  if (error) {
    throw new Error(error.message);
  }
}
