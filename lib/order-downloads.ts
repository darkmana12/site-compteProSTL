import { getSignedDownloadUrl, isR2Configured } from "@/lib/r2";
import { getProductBySlug } from "@/lib/products";
import { getStripe } from "@/lib/stripe";

export type OrderDownloadItem = {
  name: string;
  slug: string;
  quantity: number;
  downloadUrl: string | null;
  missingFile: boolean;
};

/**
 * Vérifie une session Checkout payée et génère des URLs signées R2 par produit.
 */
export async function getSignedDownloadsForCheckoutSession(
  sessionId: string
): Promise<{ paid: boolean; items: OrderDownloadItem[]; error?: string }> {
  if (!isR2Configured()) {
    return {
      paid: false,
      items: [],
      error: "Stockage fichiers non configuré.",
    };
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    if (session.payment_status !== "paid") {
      return { paid: false, items: [], error: "Paiement non confirmé." };
    }

    const raw = session.metadata?.order_items;
    if (!raw) {
      return { paid: true, items: [], error: "Métadonnées commande manquantes." };
    }

    type MetaLine = { slug: string; q: number };
    let parsed: MetaLine[];
    try {
      parsed = JSON.parse(raw) as MetaLine[];
    } catch {
      return { paid: true, items: [], error: "Métadonnées invalides." };
    }

    const items: OrderDownloadItem[] = [];
    for (const row of parsed) {
      const product = getProductBySlug(row.slug);
      if (!product?.r2Key) {
        items.push({
          name: product?.name ?? row.slug,
          slug: row.slug,
          quantity: row.q,
          downloadUrl: null,
          missingFile: true,
        });
        continue;
      }
      const downloadUrl = await getSignedDownloadUrl(product.r2Key, 3600);
      items.push({
        name: product.name,
        slug: product.slug,
        quantity: row.q,
        downloadUrl,
        missingFile: false,
      });
    }

    return { paid: true, items };
  } catch (e) {
    console.error("[order-downloads]", e);
    return {
      paid: false,
      items: [],
      error: "Impossible de vérifier la commande.",
    };
  }
}
