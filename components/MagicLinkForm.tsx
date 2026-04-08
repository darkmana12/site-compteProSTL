"use client";

import { useState, type FormEvent } from "react";

export function MagicLinkForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "sent" | "noOrders" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        noOrders?: boolean;
        error?: string;
      };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Une erreur est survenue.");
        return;
      }
      if (data.noOrders) {
        setStatus("noOrders");
        setMessage(
          "Aucune commande trouvée pour cet e-mail. Utilisez la même adresse que lors du paiement Stripe."
        );
        return;
      }
      setStatus("sent");
      setMessage(
        "Si cet e-mail correspond à une commande, vous allez recevoir un lien sous peu. Pensez à vérifier les courriers indésirables."
      );
    } catch {
      setStatus("error");
      setMessage("Réseau indisponible. Réessayez plus tard.");
    }
  }

  return (
    <form className="magic-link-form" onSubmit={onSubmit}>
      <label className="magic-link-label" htmlFor="magic-email">
        E-mail utilisé lors du paiement
      </label>
      <div className="magic-link-row">
        <input
          id="magic-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          className="magic-link-input"
          placeholder="vous@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Envoi…" : "Recevoir le lien"}
        </button>
      </div>
      {message ? (
        <p
          className="magic-link-msg"
          style={{
            color:
              status === "error"
                ? "var(--brown)"
                : status === "noOrders"
                  ? "var(--muted)"
                  : "var(--terra)",
          }}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
