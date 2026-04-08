"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function CatalogueSearchBar({ defaultQuery }: { defaultQuery: string }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultQuery);

  useEffect(() => {
    setValue(defaultQuery);
  }, [defaultQuery]);

  return (
    <form
      className="catalogue-search-form"
      onSubmit={(e) => {
        e.preventDefault();
        const v = value.trim();
        if (v) {
          router.push(`/catalogue?q=${encodeURIComponent(v)}`);
        } else {
          router.push("/catalogue");
        }
      }}
      role="search"
    >
      <label htmlFor="catalogue-search" className="sr-only">
        Rechercher dans le catalogue
      </label>
      <input
        id="catalogue-search"
        type="search"
        className="catalogue-search-input"
        placeholder="Rechercher un modèle…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
      />
      <button type="submit" className="catalogue-search-submit btn-primary">
        Rechercher
      </button>
    </form>
  );
}
