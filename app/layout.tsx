import type { Metadata } from "next";
import { DM_Serif_Display, Outfit } from "next/font/google";
import { CartProvider } from "@/context/cart-context";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
});

export const metadata: Metadata = {
  title: {
    default: "Forge & Form — Modèles 3D STL premium",
    template: "%s — Forge & Form",
  },
  description:
    "Figurines et personnages 3D en STL, haute résolution. Téléchargement instantané, directement du créateur.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${outfit.variable} ${dmSerif.variable}`}>
      <body className={outfit.className}>
        <CartProvider>
          <Navbar />
          <main className="page-main">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
