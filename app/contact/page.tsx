import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Nous écrire — support créateur.",
};

export default function ContactPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Contact</h1>
          <p>
            Une question sur un fichier ou une commande ? Ajoutez ici votre
            formulaire ou une adresse e-mail de contact.
          </p>
        </div>
      </div>
      <div className="container content-block">
        <p>
          Placeholder : branchez un formulaire (Resend, etc.) ou indiquez
          votre adresse de support client.
        </p>
      </div>
    </>
  );
}
