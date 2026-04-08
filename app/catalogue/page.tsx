import type { Metadata } from "next";
import Link from "next/link";
import { CatalogueSearchBar } from "@/components/CatalogueSearchBar";
import { ProductCard } from "@/components/ProductCard";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { getProducts } from "@/lib/products";
import { searchProducts } from "@/lib/search";

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Tous les modèles 3D STL — figurines, créatures et packs premium.",
};

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function CataloguePage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const all = getProducts();
  const products = query ? searchProducts(query) : all;

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <p className="tag-muted">Boutique</p>
          <h1>Catalogue</h1>
          <div className="catalogue-search-wrap">
            <CatalogueSearchBar defaultQuery={query} />
          </div>
          {query ? (
            <p className="catalogue-search-meta">
              {products.length} résultat
              {products.length > 1 ? "s" : ""} pour « {query} » —{" "}
              <Link href="/catalogue" className="link-arrow">
                tout afficher
              </Link>
            </p>
          ) : null}
        </div>
      </div>
      <section className="products-section" style={{ paddingTop: "2rem" }}>
        <div className="container">
          {products.length === 0 ? (
            <p className="catalogue-empty">
              Aucun modèle ne correspond à votre recherche.{" "}
              <Link href="/catalogue">Réinitialiser le catalogue</Link>
            </p>
          ) : (
            <RevealOnScroll>
              <div className="catalogue-grid">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} featured={false} />
                ))}
              </div>
            </RevealOnScroll>
          )}
        </div>
      </section>
    </>
  );
}
