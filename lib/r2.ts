import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return v;
}

export function getR2Client(): S3Client {
  const accountId = requireEnv("R2_ACCOUNT_ID");
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
}

/**
 * URL signée GET pour télécharger un fichier privé sur R2.
 * À appeler uniquement côté serveur après vérification du paiement / commande.
 */
export async function getSignedDownloadUrl(
  objectKey: string,
  expiresInSeconds = 3600
): Promise<string> {
  const bucket = requireEnv("R2_BUCKET_NAME");
  const client = getR2Client();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: objectKey,
  });
  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME
  );
}
