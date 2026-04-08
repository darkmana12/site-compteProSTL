/** Même format que metadata Stripe `order_items`. */
export type OrderItemLine = { slug: string; q: number };

export function parseOrderItemsJson(raw: string): OrderItemLine[] {
  try {
    const parsed = JSON.parse(raw) as OrderItemLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
