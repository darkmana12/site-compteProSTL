import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guide d’impression",
  description: "Conseils pour résine et FDM.",
};

export default function GuideImpressionPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Guide d’impression</h1>
          <p>
            Quelques repères pour réussir vos impressions — à enrichir avec vos
            profils et photos.
          </p>
        </div>
      </div>
      <div className="container content-block">
        <ul>
          <li>Vérifiez l’échelle et l’orientation dans votre slicer.</li>
          <li>
            Résine : attention aux supports et à l’exposition selon votre
            machine.
          </li>
          <li>FDM : réglage des surplombs et de la température selon le fil.</li>
        </ul>
      </div>
    </>
  );
}
