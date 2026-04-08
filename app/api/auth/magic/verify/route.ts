import { NextRequest, NextResponse } from "next/server";
import { consumeMagicToken } from "@/lib/magic-link";
import { createSessionCookie } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const base = request.nextUrl.origin;

  if (!token) {
    return NextResponse.redirect(new URL("/mes-achats?error=invalid", base));
  }

  const email = await consumeMagicToken(token);
  if (!email) {
    return NextResponse.redirect(new URL("/mes-achats?error=expired", base));
  }

  try {
    await createSessionCookie(email);
  } catch (e) {
    console.error("[magic verify] session", e);
    return NextResponse.redirect(new URL("/mes-achats?error=session", base));
  }

  return NextResponse.redirect(new URL("/mes-achats?welcome=1", base));
}
