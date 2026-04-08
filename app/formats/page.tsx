import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formats de fichiers",
  description: "STL, OBJ et préparation à l’impression 3D.",
};

export default function FormatsPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Formats de fichiers</h1>
          <p>
            Les modèles sont fournis en STL (et parfois OBJ) prêts pour vos
            trancheurs.
          </p>
        </div>
      </div>
      <div className="container content-block">
        <h2>STL</h2>
        <p>
          Format le plus courant pour l’impression 3D ; compatible avec la
          majorité des logiciels de découpe (slicers).
        </p>
        <h2>OBJ</h2>
        <p>
          Lorsqu’un pack l’indique, des fichiers OBJ peuvent être inclus pour
          des workflows spécifiques.
        </p>
      </div>
    </>
  );
}
