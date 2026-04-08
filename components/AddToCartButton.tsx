"use client";

import { useCart } from "@/context/cart-context";
import type { Product } from "@/lib/types";
import Link from "next/link";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <button
        type="button"
        className="btn-primary"
        onClick={() => addItem(product)}
      >
        Ajouter au panier
      </button>
      <Link href="/panier" className="btn-ghost">
        Voir le panier
      </Link>
    </div>
  );
}
