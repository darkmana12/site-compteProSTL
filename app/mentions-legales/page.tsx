import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales & CGV",
  description: "Informations légales et conditions générales de vente.",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <p className="tag-muted">Légal</p>
          <h1>Mentions légales &amp; CGV</h1>
          <p>
            Page à compléter avec vos informations d’éditeur, hébergeur,
            politique de remboursement pour produits numériques, etc.
          </p>
        </div>
      </div>
      <div className="container content-block">
        <p>
          Ce contenu est un placeholder : remplacez-le par vos mentions
          conformes au droit français (SIREN, TVA, médiation, droit de
          rétractation pour biens numériques non fournis sur support physique,
          etc.).
        </p>
      </div>
    </>
  );
}
