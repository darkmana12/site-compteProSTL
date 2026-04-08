import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mon compte",
  description: "Historique des commandes et téléchargements.",
};

export default function ComptePage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <p className="tag-muted">Espace client</p>
          <h1>Mon compte</h1>
          <p>
            Connexion, historique des commandes et liens de téléchargement
            seront reliés à votre backend (auth + base de données).
          </p>
        </div>
      </div>
      <div className="container content-block">
        <div className="checkout-placeholder">
          <p>
            <strong>À venir :</strong> connexion (e-mail ou fournisseur OAuth),
            liste des commandes, régénération de lien sécurisé vers vos fichiers
            R2.
          </p>
          <p>
            En mode invité, un e-mail de confirmation avec lien de
            téléchargement pourra aussi être envoyé après achat (même logique
            serveur).
          </p>
          <p style={{ marginTop: "1rem" }}>
            <Link href="/catalogue" className="link-arrow">
              Continuer les achats <span>→</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
