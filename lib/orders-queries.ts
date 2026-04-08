import { and, desc, isNotNull, sql } from "drizzle-orm";
import { orders } from "@/db/schema";
import { getDb } from "@/db";
import type { OrderRow } from "@/db/schema";

/** Correspondance insensible à la casse (anciennes lignes + e-mails normalisés). */
function emailMatchClause(email: string) {
  return sql`lower(${orders.customerEmail}) = ${email}`;
}

export async function countOrdersForEmail(email: string): Promise<number> {
  const db = getDb();
  if (!db) return 0;
  const rows = await db
    .select({ id: orders.id })
    .from(orders)
    .where(and(isNotNull(orders.customerEmail), emailMatchClause(email)));
  return rows.length;
}

export async function listOrdersForEmail(email: string): Promise<OrderRow[]> {
  const db = getDb();
  if (!db) return [];
  return db
    .select()
    .from(orders)
    .where(and(isNotNull(orders.customerEmail), emailMatchClause(email)))
    .orderBy(desc(orders.createdAt));
}
