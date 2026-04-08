import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatPriceEUR,
  getCategoryById,
  getProductBySlug,
  getProducts,
} from "@/lib/products";
import { AddToCartButton } from "@/components/AddToCartButton";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Produit" };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const cat = getCategoryById(product.categoryId);

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <p className="tag-muted">
            <Link href="/catalogue">Catalogue</Link>
            {cat ? (
              <>
                {" "}
                · {cat.name}
              </>
            ) : null}
          </p>
          <h1>{product.name}</h1>
          <p>{product.shortDescription}</p>
        </div>
      </div>
      <div className="container">
        <div className="product-detail">
          <div className="product-detail-gallery relative">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="product-detail-info">
            <p className="product-cat" style={{ marginBottom: "0.5rem" }}>
              {cat?.name ?? "Modèle STL"} · {product.format}
            </p>
            <div className="product-detail-price">
              {formatPriceEUR(product.price)}
            </div>
            <div className="product-detail-body">
              <p>{product.description}</p>
            </div>
            <AddToCartButton product={product} />
            <p
              style={{
                fontSize: 13,
                color: "var(--muted)",
                marginTop: "1.5rem",
                lineHeight: 1.6,
              }}
            >
              Téléchargement : après validation du paiement (Stripe ou
              PayPal), un lien signé sera généré depuis notre stockage sécurisé
              (Cloudflare R2).
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
