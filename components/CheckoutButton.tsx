"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";

export function CheckoutButton() {
  const { lines } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    if (lines.length === 0) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({
            productId: l.productId,
            quantity: l.quantity,
          })),
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Erreur lors de la création du paiement.");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError("Réponse Stripe inattendue.");
    } catch {
      setError("Réseau indisponible. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        className="btn-primary"
        style={{
          width: "100%",
          justifyContent: "center",
          marginTop: "1.25rem",
        }}
        disabled={loading || lines.length === 0}
        onClick={handleCheckout}
      >
        {loading ? "Redirection vers Stripe…" : "Payer avec Stripe"}
      </button>
      {error ? (
        <p
          style={{
            fontSize: 13,
            color: "#a32020",
            marginTop: "0.75rem",
            lineHeight: 1.4,
          }}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
