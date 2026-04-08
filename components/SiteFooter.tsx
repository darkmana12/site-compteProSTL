import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              Forge<span>&</span>Form
            </Link>
            <p className="footer-desc">
              Modèles 3D STL premium pour passionnés d&apos;impression 3D.
              Figurines, créatures et personnages haute résolution directement
              du créateur.
            </p>
            <div className="footer-social">
              <a
                className="social-btn"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                className="social-btn"
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" />
                </svg>
              </a>
              <a
                className="social-btn"
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Pinterest"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.21-1.79 4-4 4-.5 0-.98-.09-1.42-.26L9 22" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Boutique</div>
            <ul className="footer-links">
              <li>
                <Link href="/catalogue">Tous les modèles</Link>
              </li>
              <li>
                <Link href="/catalogue#nouveautes">Nouveautés</Link>
              </li>
              <li>
                <Link href="/catalogue">Bestsellers</Link>
              </li>
              <li>
                <Link href="/catalogue">Packs &amp; bundles</Link>
              </li>
              <li>
                <Link href="/catalogue">Promotions</Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Aide</div>
            <ul className="footer-links">
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
              <li>
                <Link href="/formats">Formats de fichiers</Link>
              </li>
              <li>
                <Link href="/guide-impression">Guide d&apos;impression</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/mentions-legales">CGV &amp; Mentions légales</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} Forge &amp; Form — Tous droits réservés
          </p>
          <div className="footer-pay">
            <span className="pay-tag">Stripe</span>
            <span className="pay-tag">PayPal</span>
            <span className="pay-tag">Visa</span>
            <span className="pay-tag">Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
