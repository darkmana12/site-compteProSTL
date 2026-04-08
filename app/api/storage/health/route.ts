import { NextResponse } from "next/server";
import { isR2Configured } from "@/lib/r2";

/**
 * Indique si les variables R2 minimales sont présentes (sans exposer de secrets).
 */
export function GET() {
  const secret = process.env.R2_DOWNLOAD_SECRET?.trim();
  return NextResponse.json({
    r2: {
      configured: isR2Configured(),
    },
    download: {
      secretConfigured: Boolean(secret && secret.length >= 8),
    },
  });
}
