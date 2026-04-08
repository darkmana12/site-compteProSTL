import type { ReactNode } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ProductCard } from "@/components/ProductCard";

type Props = {
  title?: ReactNode;
  subtitle?: string;
  limit?: number;
};

export function ProductsSection({
  title = (
    <>
      Bestsellers <span>&amp;</span> Coups de cœur
    </>
  ),
  subtitle = "Les modèles les plus téléchargés de la boutique",
  limit,
}: Props) {
  let list = getProducts();
  if (limit) list = list.slice(0, limit);
  const featured = list.find((p) => p.featured);
  const rest = list.filter((p) => !p.featured);
  const ordered = featured ? [featured, ...rest] : list;

  return (
    <section className="products-section" id="nouveautes">
      <div className="container">
        <div className="section-head">
          <div>
            <h2 className="section-title">{title}</h2>
            <p className="section-sub">{subtitle}</p>
          </div>
        </div>
        <RevealOnScroll>
          <div className="products-grid">
            {ordered.map((p) => (
              <ProductCard key={p.id} product={p} featured={p.featured} />
            ))}
          </div>
        </RevealOnScroll>
        <div className="products-section-cta">
          <Link href="/catalogue" className="link-arrow">
            Voir tout le catalogue <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
