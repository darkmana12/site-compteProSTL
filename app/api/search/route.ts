import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/search";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const results = searchProducts(q).slice(0, 12).map((p) => ({
    slug: p.slug,
    name: p.name,
    price: p.price,
    image: p.image,
  }));
  return NextResponse.json({ results });
}
