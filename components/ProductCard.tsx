"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { formatPriceEUR, getCategoryById } from "@/lib/products";
import type { Product } from "@/lib/types";

function badgeLabel(badge: NonNullable<Product["badge"]>): string {
  switch (badge) {
    case "bestseller":
      return "⭐ Bestseller";
    case "new":
      return "Nouveau";
    case "sale":
      return "Promo";
    default:
      return "";
  }
}

function badgeClass(badge: NonNullable<Product["badge"]>): string {
  switch (badge) {
    case "bestseller":
      return "badge-best";
    case "new":
      return "badge-new";
    case "sale":
      return "badge-sale";
    default:
      return "";
  }
}

export function ProductCard({
  product,
  featured = false,
}: {
  product: Product;
  featured?: boolean;
}) {
  const { addItem } = useCart();
  const cat = getCategoryById(product.categoryId);
  const catLine = [
    cat?.name ?? "Catalogue",
    product.format.includes("+") ? "Pack" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article
      className={`product-card ${featured ? "featured" : ""} reveal-on-scroll`}
    >
      <div className="product-img relative">
        <Link
          href={`/catalogue/${product.slug}`}
          className="relative block h-full w-full"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes={
              featured
                ? "(max-width: 1100px) 100vw, 40vw"
                : "(max-width: 1100px) 50vw, 20vw"
            }
            className="object-cover"
          />
        </Link>
        {product.badge ? (
          <span
            className={`product-badge ${badgeClass(product.badge)}`}
          >
            {badgeLabel(product.badge)}
          </span>
        ) : null}
      </div>
      <div className="product-info">
        <div className="product-cat">{catLine}</div>
        <Link href={`/catalogue/${product.slug}`} className="block">
          <div className="product-name">{product.name}</div>
        </Link>
        {featured ? (
          <p className="product-desc">{product.description}</p>
        ) : null}
        <div className="product-footer">
          <div className="product-price-wrap">
            <span className="product-price">
              {formatPriceEUR(product.price)}
            </span>
            <span className="product-format">{product.format}</span>
          </div>
          <button
            type="button"
            className="btn-add"
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            {featured ? "Acheter" : ""}
          </button>
        </div>
      </div>
    </article>
  );
}
