import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/** Commande payée (source de vérité côté app, alimentée par le webhook Stripe). */
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  stripeCheckoutSessionId: text("stripe_checkout_session_id").notNull().unique(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  customerEmail: text("customer_email"),
  amountTotalCents: integer("amount_total_cents").notNull(),
  currency: text("currency").notNull().default("eur"),
  /** JSON : même structure que metadata Stripe `order_items` (slug + quantités). */
  orderItemsJson: text("order_items_json").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type OrderRow = typeof orders.$inferSelect;
export type NewOrderRow = typeof orders.$inferInsert;

/** Jeton ponctuel pour lien magique (email → session). */
export const magicLinkTokens = pgTable("magic_link_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  tokenHash: text("token_hash").notNull().unique(),
  email: text("email").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
});
