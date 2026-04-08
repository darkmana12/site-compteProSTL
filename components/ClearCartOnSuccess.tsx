"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/context/cart-context";

/**
 * Vide le panier (localStorage) une fois la page succès affichée après paiement.
 */
export function ClearCartOnSuccess() {
  const { clear } = useCart();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    clear();
  }, [clear]);

  return null;
}
