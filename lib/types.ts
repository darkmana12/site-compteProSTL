export type ProductBadge = "bestseller" | "new" | "sale" | null;

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  currency: "EUR";
  format: string;
  categoryId: string;
  badge: ProductBadge;
  featured: boolean;
  image: string;
  /** Clé objet dans le bucket R2 (ex. products/dragon-pack.zip), renseignée en production */
  r2Key?: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  count: number;
  image: string;
};
