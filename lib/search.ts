import type { Product } from "./types";
import { getCategoryById, getProducts } from "./products";

function productMatchesQuery(p: Product, q: string): boolean {
  const cat = getCategoryById(p.categoryId);
  const haystack = [
    p.name,
    p.slug.replace(/-/g, " "),
    p.shortDescription,
    p.description,
    cat?.name ?? "",
    p.format,
  ]
    .join(" ")
    .toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  return words.every((w) => haystack.includes(w));
}

/** Filtre le catalogue (mots séparés par des espaces : tous doivent apparaître). */
export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return getProducts();
  return getProducts().filter((p) => productMatchesQuery(p, q));
}
