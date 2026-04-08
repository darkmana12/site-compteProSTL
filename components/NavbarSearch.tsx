"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

type Hit = {
  slug: string;
  name: string;
  price: number;
  image: string;
};

function formatEur(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

export function NavbarSearch() {
  const router = useRouter();
  const inputId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [focused, setFocused] = useState(false);

  const queryOk = q.trim().length >= 2;
  const showPanel =
    focused && queryOk && (loading || searched);

  useEffect(() => {
    const query = q.trim();
    if (query.length < 2) {
      setHits([]);
      setSearched(false);
      setLoading(false);
      return;
    }
    const id = window.setTimeout(async () => {
      setLoading(true);
      setSearched(false);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );
        const data = (await res.json()) as { results?: Hit[] };
        setHits(data.results ?? []);
      } catch {
        setHits([]);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 260);
    return () => clearTimeout(id);
  }, [q]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const goCatalogue = () => {
    const query = q.trim();
    setFocused(false);
    if (query) {
      router.push(`/catalogue?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/catalogue");
    }
  };

  const noHits = searched && !loading && hits.length === 0;

  return (
    <div className="nav-search-wrap" ref={wrapRef}>
      <label htmlFor={inputId} className="sr-only">
        Rechercher un modèle
      </label>
      <div className="nav-search-field">
        <span className="nav-search-field-icon" aria-hidden>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </span>
        <input
          id={inputId}
          type="search"
          className="nav-search-field-input"
          placeholder="Rechercher…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              goCatalogue();
            }
          }}
          autoComplete="off"
          enterKeyHint="search"
        />
      </div>

      {showPanel ? (
        <div className="nav-search-dropdown">
          {loading ? (
            <div className="nav-search-dropdown-status">Recherche…</div>
          ) : null}
          {noHits ? (
            <div className="nav-search-dropdown-empty">Aucun résultat.</div>
          ) : null}
          {!loading && hits.length > 0 ? (
            <ul className="nav-search-dropdown-list">
              {hits.map((h) => (
                <li key={h.slug}>
                  <Link
                    href={`/catalogue/${h.slug}`}
                    className="nav-search-hit"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <span className="nav-search-hit-img">
                      <Image
                        src={h.image}
                        alt=""
                        width={44}
                        height={44}
                        className="object-cover"
                      />
                    </span>
                    <span className="nav-search-hit-text">
                      <span className="nav-search-hit-name">{h.name}</span>
                      <span className="nav-search-hit-price">
                        {formatEur(h.price)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          {queryOk && !loading && searched ? (
            <div className="nav-search-dropdown-footer">
              <button
                type="button"
                className="nav-search-catalogue-btn"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => goCatalogue()}
              >
                Voir tout le catalogue filtré →
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
