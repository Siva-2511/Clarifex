import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "clarifex-documents";

// Server-side admin client (never exposed to browser)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

/**
 * Ensures the storage bucket exists (idempotent)
 */
async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === bucketName);
  if (!exists) {
    await supabase.storage.createBucket(bucketName, { public: false });
  }
}

/**
 * Upload a file buffer to Supabase Storage.
 * Returns the storage path (key) for later retrieval.
 */
export async function uploadToStorage(
  userId: string,
  fileName: string,
  buffer: Buffer,
  contentType: string,
): Promise<{ storageKey: string }> {
  await ensureBucket();

  const fileExt = fileName.includes(".") ? fileName.split(".").pop() : "bin";
  const storageKey = `users/${userId}/${crypto.randomUUID()}.${fileExt}`;

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(storageKey, buffer, { contentType, upsert: false });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  return { storageKey };
}

/**
 * Returns a time-limited signed URL for downloading a stored file.
 */
export async function getPresignedDownloadUrl(
  storageKey: string,
  expiresIn = 3600,
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(storageKey, expiresIn);

  if (error || !data?.signedUrl) {
    throw new Error(`Failed to create signed URL: ${error?.message}`);
  }

  return data.signedUrl;
}

/**
 * Returns a signed upload URL so the browser can upload directly to Supabase.
 */
export async function getPresignedUploadUrl(
  userId: string,
  fileName: string,
  _contentType: string,
  expiresIn = 3600,
): Promise<{ uploadUrl: string; storageKey: string }> {
  await ensureBucket();

  const fileExt = fileName.includes(".") ? fileName.split(".").pop() : "bin";
  const storageKey = `users/${userId}/${crypto.randomUUID()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUploadUrl(storageKey);

  if (error || !data?.signedUrl) {
    throw new Error(`Failed to create signed upload URL: ${error?.message}`);
  }

  return { uploadUrl: data.signedUrl, storageKey };
}

/**
 * Deletes an object from Supabase Storage.
 */
export async function deleteStorageObject(storageKey: string): Promise<void> {
  const { error } = await supabase.storage.from(bucketName).remove([storageKey]);
  if (error) throw new Error(`Storage delete failed: ${error.message}`);
}
