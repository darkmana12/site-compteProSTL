import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products";
import { getSignedDownloadUrl, isR2Configured } from "@/lib/r2";

export const dynamic = "force-dynamic";

function getToken(request: NextRequest): string | null {
  const q = request.nextUrl.searchParams.get("token");
  if (q) return q;
  const auth = request.headers.get("authorization");
  if (auth?.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  return null;
}

/**
 * Redirige vers une URL GET présignée R2 (courte durée).
 * Protégé par R2_DOWNLOAD_SECRET jusqu’à branchement paiement / commande.
 *
 * Exemple : GET /api/download?slug=guerrier-elfique&token=VOTRE_SECRET
 */
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug?.trim()) {
    return NextResponse.json({ error: "Paramètre slug requis." }, { status: 400 });
  }

  if (!isR2Configured()) {
    return NextResponse.json(
      {
        error:
          "Stockage R2 non configuré. Renseignez R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME.",
      },
      { status: 503 }
    );
  }

  const secret = process.env.R2_DOWNLOAD_SECRET?.trim();
  if (!secret || secret.length < 8) {
    return NextResponse.json(
      {
        error:
          "Téléchargement désactivé. Définissez R2_DOWNLOAD_SECRET (min. 8 caractères) dans .env.local.",
      },
      { status: 503 }
    );
  }

  const token = getToken(request);
  if (!token || token !== secret) {
    return NextResponse.json(
      { error: "Non autorisé. Fournissez ?token= ou Authorization: Bearer." },
      { status: 401 }
    );
  }

  const product = getProductBySlug(slug);
  if (!product?.r2Key) {
    return NextResponse.json(
      { error: "Produit introuvable ou aucun fichier (r2Key) associé." },
      { status: 404 }
    );
  }

  try {
    const url = await getSignedDownloadUrl(product.r2Key, 3600);
    return NextResponse.redirect(url, 302);
  } catch (e) {
    console.error("[download]", e);
    return NextResponse.json(
      { error: "Impossible de générer le lien signé. Vérifiez la clé R2 et les droits du token." },
      { status: 500 }
    );
  }
}
