import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  db: NeonHttpDatabase<typeof schema> | undefined;
};

export function getDb() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  if (!globalForDb.db) {
    const sql = neon(url);
    globalForDb.db = drizzle(sql, { schema });
  }
  return globalForDb.db;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}
