import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panier",
  description: "Votre sélection de modèles 3D STL.",
};

export default function PanierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
