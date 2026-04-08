import { NextRequest, NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { orders } from "@/db/schema";
import { getDb } from "@/db";
import { getSignedDownloadUrl, isR2Configured } from "@/lib/r2";
import { getSessionEmail } from "@/lib/session";
import { parseOrderItemsJson } from "@/lib/order-parse";
import { getProductBySlug } from "@/lib/products";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const sessionEmail = await getSessionEmail();
  if (!sessionEmail) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  const orderId = request.nextUrl.searchParams.get("orderId");
  const slug = request.nextUrl.searchParams.get("slug");
  if (!orderId || !slug) {
    return NextResponse.json({ error: "Paramètres manquants." }, { status: 400 });
  }

  if (!isR2Configured()) {
    return NextResponse.json(
      { error: "Stockage fichiers non configuré." },
      { status: 503 }
    );
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Base non disponible." }, { status: 503 });
  }

  const rows = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.id, orderId),
        sql`lower(${orders.customerEmail}) = ${sessionEmail}`
      )
    )
    .limit(1);

  const order = rows[0];
  if (!order) {
    return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
  }

  const lines = parseOrderItemsJson(order.orderItemsJson);
  const allowed = lines.some((l) => l.slug === slug);
  if (!allowed) {
    return NextResponse.json({ error: "Article non inclus dans cette commande." }, { status: 403 });
  }

  const product = getProductBySlug(slug);
  if (!product?.r2Key) {
    return NextResponse.json({ error: "Fichier non disponible." }, { status: 404 });
  }

  const url = await getSignedDownloadUrl(product.r2Key, 3600);
  return NextResponse.redirect(url);
}
