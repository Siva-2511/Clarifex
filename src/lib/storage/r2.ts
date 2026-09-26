import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || "dummy-account-id";
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "dummy-access-key";
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "dummy-secret-key";
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || "clarifex-documents";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

/**
 * Generates a pre-signed PUT URL for secure, direct document upload
 */
export async function getPresignedUploadUrl(
  userId: string,
  fileName: string,
  contentType: string,
  expiresIn = 3600,
): Promise<{ uploadUrl: string; storageKey: string }> {
  const fileExt = fileName.includes(".") ? fileName.split(".").pop() : "bin";
  const storageKey = `users/${userId}/${crypto.randomUUID()}.${fileExt}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: storageKey,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn });
  return { uploadUrl, storageKey };
}

/**
 * Generates a pre-signed GET URL for viewing or downloading documents
 */
export async function getPresignedDownloadUrl(
  storageKey: string,
  expiresIn = 3600,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: storageKey,
  });

  return getSignedUrl(r2Client, command, { expiresIn });
}

/**
 * Deletes an object from Cloudflare R2
 */
export async function deleteStorageObject(storageKey: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: storageKey,
  });

  await r2Client.send(command);
}
