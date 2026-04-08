"use client";

import Link from "next/link";
import { NavbarSearch } from "@/components/NavbarSearch";
import { useCart } from "@/context/cart-context";

export function Navbar() {
  const { totalCount } = useCart();

  return (
    <nav className="navbar">
      <Link href="/" className="logo">
        Forge<span>&</span>Form
      </Link>
      <ul className="nav-links">
        <li>
          <Link href="/">Accueil</Link>
        </li>
        <li>
          <Link href="/catalogue">Catalogue</Link>
        </li>
        <li>
          <Link href="/catalogue#nouveautes">Nouveautés</Link>
        </li>
        <li>
          <Link href="/contact">Contactez-moi</Link>
        </li>
        <li>
          <Link href="/compte">Compte</Link>
        </li>
      </ul>
      <div className="nav-right">
        <NavbarSearch />
        <Link href="/panier" className="btn-cart">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          Mon panier
          <span className="cart-count">{totalCount}</span>
        </Link>
      </div>
    </nav>
  );
}
