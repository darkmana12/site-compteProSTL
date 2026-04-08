"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckoutButton } from "@/components/CheckoutButton";
import { useCart } from "@/context/cart-context";
import { formatPriceEUR } from "@/lib/products";

export default function PanierPage() {
  const { lines, subtotal, setQuantity, removeLine } = useCart();

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <p className="tag-muted">Panier</p>
          <h1>Mon panier</h1>
          <p>Récapitulatif de votre sélection — paiement sécurisé par Stripe.</p>
        </div>
      </div>
      <div className="container">
        {lines.length === 0 ? (
          <div className="empty-state">
            <p>Votre panier est vide.</p>
            <Link href="/catalogue" className="btn-primary">
              Explorer le catalogue
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-lines-block">
              <h2 className="cart-lines-heading">
                Vos articles ({lines.length})
              </h2>
              <div className="cart-lines">
                {lines.map((line) => (
                  <div key={line.productId} className="cart-line">
                    <Link
                      href={`/catalogue/${line.slug}`}
                      className="cart-line-img relative"
                    >
                      <Image
                        src={line.image}
                        alt={line.name}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </Link>
                    <div className="cart-line-body">
                      <div className="cart-line-header">
                        <h3>
                          <Link href={`/catalogue/${line.slug}`}>
                            {line.name}
                          </Link>
                        </h3>
                        <button
                          type="button"
                          className="cart-line-remove-x"
                          aria-label={`Retirer ${line.name} du panier`}
                          onClick={() => removeLine(line.productId)}
                        >
                          <span aria-hidden>×</span>
                        </button>
                      </div>
                      <p className="cart-line-meta">
                        {formatPriceEUR(line.price)} / unité
                      </p>
                      <p className="cart-line-subtotal">
                        <span>Sous-total</span>
                        <span>
                          {formatPriceEUR(line.price * line.quantity)}
                        </span>
                      </p>
                      <div className="cart-line-actions">
                        <span className="cart-line-qty-label">Quantité</span>
                        <div className="qty-control">
                          <button
                            type="button"
                            aria-label="Diminuer la quantité"
                            onClick={() =>
                              setQuantity(line.productId, line.quantity - 1)
                            }
                          >
                            −
                          </button>
                          <span>{line.quantity}</span>
                          <button
                            type="button"
                            aria-label="Augmenter la quantité"
                            onClick={() =>
                              setQuantity(line.productId, line.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <aside className="cart-summary">
              <h2>Récapitulatif</h2>
              <ul className="cart-summary-lines">
                {lines.map((line) => (
                  <li key={line.productId} className="cart-summary-line">
                    <Link
                      href={`/catalogue/${line.slug}`}
                      className="cart-summary-line-thumb-wrap"
                    >
                      <Image
                        src={line.image}
                        alt=""
                        width={48}
                        height={48}
                        className="cart-summary-line-thumb"
                      />
                    </Link>
                    <div className="cart-summary-line-main">
                      <Link
                        href={`/catalogue/${line.slug}`}
                        className="cart-summary-line-name"
                      >
                        {line.name}
                      </Link>
                      <span className="cart-summary-line-meta">
                        {line.quantity} × {formatPriceEUR(line.price)}
                      </span>
                    </div>
                    <div className="cart-summary-line-actions">
                      <span className="cart-summary-line-price">
                        {formatPriceEUR(line.price * line.quantity)}
                      </span>
                      <button
                        type="button"
                        className="cart-summary-remove-x"
                        aria-label={`Retirer ${line.name} du panier`}
                        onClick={() => removeLine(line.productId)}
                      >
                        <span aria-hidden>×</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-summary-divider" aria-hidden />
              <div className="cart-summary-row">
                <span>Sous-total</span>
                <span>{formatPriceEUR(subtotal)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Livraison</span>
                <span>Numérique</span>
              </div>
              <div className="cart-summary-total">
                <span>Total</span>
                <span>{formatPriceEUR(subtotal)}</span>
              </div>
              <CheckoutButton />
              <p
                style={{
                  fontSize: 12,
                  color: "var(--muted)",
                  marginTop: "1rem",
                  lineHeight: 1.5,
                }}
              >
                Vous serez redirigé vers Stripe Checkout (cartes de test en mode
                essai). Après paiement, vos liens de téléchargement apparaîtront
                sur la page de confirmation.
              </p>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
