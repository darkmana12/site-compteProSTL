import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description: "Forge & Form — boutique indépendante de modèles 3D.",
};

export default function AProposPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <p className="tag-muted">La boutique</p>
          <h1>À propos</h1>
          <p>
            Forge &amp; Form est une boutique indépendante de modèles 3D pour
            impression — figurines, créatures et décors, pensés pour la résine
            et le FDM.
          </p>
        </div>
      </div>
      <div className="container content-block">
        <p>
          Chaque modèle est préparé et testé avant mise en ligne. Pas
          d’intermédiaire : vos achats soutiennent directement le travail de
          création derrière les fichiers.
        </p>
      </div>
    </>
  );
}
