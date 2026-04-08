"use client";

import { useCart } from "@/context/cart-context";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      className="btn-primary"
      onClick={() => addItem(product)}
    >
      Ajouter au panier
    </button>
  );
}
