import type { Metadata } from "next";
import Link from "next/link";
import { getSignedDownloadsForCheckoutSession } from "@/lib/order-downloads";

export const metadata: Metadata = {
  title: "Commande confirmée",
  description: "Téléchargez vos fichiers STL.",
};

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function CommandeSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <>
        <div className="page-hero">
          <div className="container">
            <p className="tag-muted">Commande</p>
            <h1>Session introuvable</h1>
          </div>
        </div>
        <div className="container content-block">
          <p>Lien incomplet (pas de session Stripe).</p>
          <Link href="/panier" className="link-arrow">
            Retour au panier <span>→</span>
          </Link>
        </div>
      </>
    );
  }

  const result = await getSignedDownloadsForCheckoutSession(session_id);

  if (!result.paid) {
    return (
      <>
        <div className="page-hero">
          <div className="container">
            <p className="tag-muted">Commande</p>
            <h1>Erreur</h1>
          </div>
        </div>
        <div className="container content-block">
          <p>{result.error ?? "Paiement non confirmé."}</p>
          <Link href="/panier" className="link-arrow">
            Retour au panier <span>→</span>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <p className="tag-muted">Commande</p>
          <h1>Paiement confirmé</h1>
          <p>
            Merci ! Téléchargez vos fichiers ci-dessous (liens valides environ 1 h).
          </p>
        </div>
      </div>
      <div className="container content-block">
        {result.error && result.items.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>{result.error}</p>
        ) : null}
        <ul className="order-download-list">
          {result.items.map((item) => (
            <li key={item.slug} className="order-download-item">
              <div>
                <strong>{item.name}</strong>
                <span className="order-download-qty"> × {item.quantity}</span>
              </div>
              {item.missingFile || !item.downloadUrl ? (
                <span className="order-download-missing">
                  Fichier non disponible (r2Key manquant côté catalogue).
                </span>
              ) : (
                <a
                  href={item.downloadUrl}
                  className="btn-primary"
                  style={{ marginTop: 8, display: "inline-flex" }}
                >
                  Télécharger
                </a>
              )}
            </li>
          ))}
        </ul>
        <p style={{ marginTop: "2rem" }}>
          <Link href="/catalogue" className="link-arrow">
            Continuer les achats <span>→</span>
          </Link>
        </p>
      </div>
    </>
  );
}
