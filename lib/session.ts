import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE = "ff_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 j.

function getSecret(): Uint8Array {
  const s = process.env.JWT_SECRET?.trim();
  if (!s || s.length < 32) {
    throw new Error("JWT_SECRET manquant ou trop court (min. 32 caractères).");
  }
  return new TextEncoder().encode(s);
}

function getSecretOrNull(): Uint8Array | null {
  const s = process.env.JWT_SECRET?.trim();
  if (!s || s.length < 32) return null;
  return new TextEncoder().encode(s);
}

export async function createSessionCookie(email: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  const token = await new SignJWT({ email: normalized })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getSessionEmail(): Promise<string | null> {
  const key = getSecretOrNull();
  if (!key) return null;
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return null;
  try {
    const { payload } = await jwtVerify(raw, key, {
      algorithms: ["HS256"],
    });
    const email = payload.email;
    if (typeof email !== "string" || !email.includes("@")) return null;
    return email.trim().toLowerCase();
  } catch {
    return null;
  }
}
