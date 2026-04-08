import type { Metadata } from "next";
import Link from "next/link";
import { MagicLinkForm } from "@/components/MagicLinkForm";
import { getSessionEmail } from "@/lib/session";
import { listOrdersForEmail } from "@/lib/orders-queries";
import { parseOrderItemsJson } from "@/lib/order-parse";
import { getProductBySlug, formatPriceEUR } from "@/lib/products";
import { isDatabaseConfigured } from "@/db";

export const metadata: Metadata = {
  title: "Mes achats",
  description: "Téléchargez vos fichiers STL achetés.",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    error?: string;
    welcome?: string;
  }>;
};

export default async function MesAchatsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const email = await getSessionEmail();
  const dbOk = isDatabaseConfigured();

  if (!dbOk) {
    return (
      <>
        <div className="page-hero">
          <div className="container">
            <p className="tag-muted">Espace client</p>
            <h1>Mes achats</h1>
            <p>La base de données n’est pas configurée sur cet environnement.</p>
          </div>
        </div>
      </>
    );
  }

  if (!email) {
    return (
      <>
        <div className="page-hero">
          <div className="container">
            <p className="tag-muted">Espace client</p>
            <h1>Mes achats</h1>
            <p>
              Entrez l’e-mail utilisé lors du paiement Stripe : nous vous
              envoyons un lien sécurisé (sans mot de passe) pour accéder à vos
              téléchargements.
            </p>
          </div>
        </div>
        <div className="container content-block">
          {sp.error === "invalid" || sp.error === "expired" ? (
            <p className="mes-achats-banner mes-achats-banner--warn">
              Lien invalide ou expiré. Demandez un nouveau lien ci-dessous.
            </p>
          ) : null}
          {sp.error === "session" ? (
            <p className="mes-achats-banner mes-achats-banner--warn">
              Erreur de session. Vérifiez la variable JWT_SECRET sur le serveur.
            </p>
          ) : null}
          <MagicLinkForm />
        </div>
      </>
    );
  }

  const orders = await listOrdersForEmail(email);

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <p className="tag-muted">Espace client</p>
          <h1>Mes achats</h1>
          <p>
            Connecté en tant que <strong>{email}</strong>. Vous pouvez
            retélécharger vos fichiers autant de fois que nécessaire (liens
            régénérés à chaque clic).
          </p>
        </div>
      </div>
      <div className="container content-block">
        {sp.welcome === "1" ? (
          <p className="mes-achats-banner mes-achats-banner--ok">
            Connexion réussie. Vos achats sont listés ci-dessous.
          </p>
        ) : null}

        <form action="/api/auth/logout" method="POST" className="mes-achats-logout">
          <button type="submit" className="btn-ghost">
            Se déconnecter
          </button>
        </form>

        {orders.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>
            Aucune commande enregistrée pour cet e-mail.
          </p>
        ) : (
          <ul className="mes-achats-order-list">
            {orders.map((order) => {
              const lines = parseOrderItemsJson(order.orderItemsJson);
              const dateStr = order.createdAt.toLocaleDateString("fr-FR", {
                dateStyle: "long",
              });
              const total = formatPriceEUR(order.amountTotalCents / 100);
              return (
                <li key={order.id} className="mes-achats-order-card">
                  <div className="mes-achats-order-head">
                    <span className="mes-achats-order-date">{dateStr}</span>
                    <span className="mes-achats-order-total">{total}</span>
                  </div>
                  <p className="mes-achats-order-id">
                    Réf. Stripe session · {order.stripeCheckoutSessionId.slice(0, 20)}…
                  </p>
                  <ul className="mes-achats-lines">
                    {lines.map((line) => {
                      const product = getProductBySlug(line.slug);
                      const name = product?.name ?? line.slug;
                      const hasFile = Boolean(product?.r2Key);
                      return (
                        <li key={`${order.id}-${line.slug}`}>
                          <span>
                            {name}
                            {line.q > 1 ? ` × ${line.q}` : ""}
                          </span>
                          {hasFile ? (
                            <a
                              className="btn-primary mes-achats-dl"
                              href={`/api/compte/download?orderId=${order.id}&slug=${encodeURIComponent(line.slug)}`}
                            >
                              Télécharger
                            </a>
                          ) : (
                            <span className="mes-achats-missing">
                              Fichier non configuré
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        )}

        <p style={{ marginTop: "2rem" }}>
          <Link href="/catalogue" className="link-arrow">
            Continuer les achats <span>→</span>
          </Link>
        </p>
      </div>
    </>
  );
}
