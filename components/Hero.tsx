import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <h1 className="hero-title">
          Modèles 3D
          <br />
          <em>propre pour impression</em>
        </h1>
        <p className="hero-sub">
          Des modèles haute résolution conçus pour résine et FDM. Téléchargement
          immédiat, directement du créateur à votre imprimante.
        </p>
        <div className="hero-ctas">
          <Link href="/catalogue" className="btn-primary">
            Explorer le catalogue
          </Link>
          <Link href="/catalogue#nouveautes" className="btn-ghost">
            Voir les nouveautés →
          </Link>
        </div>
      </div>
      <div className="hero-right">
        <Image
          src="https://images.unsplash.com/photo-1760446411816-f5484549fb51?w=1200&q=85"
          alt="Impression 3D d’une figurine à côté d’une imprimante — boutique STL"
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          priority
          className="object-cover opacity-75 transition-transform duration-[8000ms] ease-in-out hover:scale-105"
        />
        <div className="hero-overlay" />
        <div className="hero-float-badge">
          <div className="hero-float-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div className="hero-float-text">
            <strong>Livraison instantanée</strong>
            <span>Lien de téléchargement immédiat</span>
          </div>
        </div>
        <div className="hero-float-badge2">
          <span>✦ Populaire</span>
        </div>
      </div>
    </section>
  );
}
