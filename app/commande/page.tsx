import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Commande",
  description: "Finaliser votre commande — paiement sécurisé.",
};

export default function CommandePage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <p className="tag-muted">Checkout</p>
          <h1>Commande</h1>
          <p>
            Ajoutez des articles au panier, puis utilisez{" "}
            <strong>Payer avec Stripe</strong> pour ouvrir le paiement sécurisé.
            Après validation, vos téléchargements sont sur la page de
            confirmation.
          </p>
        </div>
      </div>
      <div className="container content-block">
        <p>
          <Link href="/panier" className="btn-primary" style={{ marginTop: 8 }}>
            Aller au panier
          </Link>
        </p>
        <p style={{ marginTop: "1.5rem" }}>
          <Link href="/catalogue" className="link-arrow">
            Catalogue <span>→</span>
          </Link>
        </p>
      </div>
    </>
  );
}
