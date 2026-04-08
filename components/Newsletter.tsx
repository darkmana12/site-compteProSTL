"use client";

import { useState } from "react";

export function Newsletter() {
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-inner">
          <div className="newsletter-text">
            <h2 className="newsletter-title">
              Nouveaux modèles chaque semaine.
              <br />
              Soyez le premier informé.
            </h2>
            <p className="newsletter-sub">
              Inscrivez-vous et recevez un modèle offert en bienvenue.
            </p>
          </div>
          <form
            className="newsletter-form"
            onSubmit={(e) => {
              e.preventDefault();
              setMsg(
                "La newsletter arrive bientôt — nous vous préviendrons ici."
              );
            }}
          >
            <input
              type="email"
              className="newsletter-input"
              placeholder="Votre adresse email"
              aria-label="Adresse e-mail"
            />
            <button type="submit" className="newsletter-btn">
              S&apos;inscrire gratuitement
            </button>
            {msg ? <p className="newsletter-note">{msg}</p> : null}
          </form>
        </div>
      </div>
    </section>
  );
}
