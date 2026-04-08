"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  images: string[];
  productName: string;
};

export function ProductDetailGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0);
  const safe = images.filter(Boolean);
  if (safe.length === 0) return null;

  const main = safe[active] ?? safe[0];

  return (
    <div className="product-detail-gallery-wrap">
      <div className="product-detail-gallery relative">
        <Image
          src={main}
          alt={`${productName} — vue ${active + 1}`}
          fill
          sizes="(max-width: 900px) 100vw, 45vw"
          className="object-cover"
          priority
        />
      </div>
      {safe.length > 1 ? (
        <div
          className="product-detail-thumbs"
          role="tablist"
          aria-label="Vues du produit"
        >
          {safe.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`product-detail-thumb ${i === active ? "is-active" : ""}`}
              onClick={() => setActive(i)}
            >
              <Image
                src={src}
                alt=""
                width={88}
                height={88}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
