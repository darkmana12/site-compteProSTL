import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions fréquentes sur les fichiers STL et les commandes.",
};

export default function FaqPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Questions fréquentes</h1>
          <p>
            Tout ce qu’il faut savoir sur les formats, les téléchargements et
            les commandes.
          </p>
        </div>
      </div>
      <div className="container content-block">
        <h2>Comment recevoir mes fichiers après achat ?</h2>
        <p>
          Après paiement validé (Stripe ou PayPal), un lien sécurisé vers vos
          fichiers hébergés sur Cloudflare R2 sera généré côté serveur. Vous
          pourrez aussi retrouver vos commandes dans votre compte client.
        </p>
        <h2>Quels formats proposez-vous ?</h2>
        <p>
          Principalement du STL, parfois OBJ ou packs selon le produit — voir la
          fiche de chaque modèle.
        </p>
        <h2>Puis-je imprimer pour un usage commercial ?</h2>
        <p>
          Les conditions de licence varient selon le modèle — une section
          dédiée sera ajoutée sur chaque fiche produit.
        </p>
      </div>
    </>
  );
}
