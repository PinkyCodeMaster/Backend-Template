import env from "@/config/env";
import { Client as MinioClient } from "minio";
import type { Readable } from "node:stream";

const endpoint = new URL(env.STORAGE_ENDPOINT);
const storage = new MinioClient({
  endPoint: endpoint.hostname,
  port: Number(endpoint.port || (env.STORAGE_USE_SSL ? 443 : 80)),
  useSSL: env.STORAGE_USE_SSL,
  accessKey: env.STORAGE_ACCESS_KEY,
  secretKey: env.STORAGE_SECRET_KEY,
});

async function ensureBucket(bucket = env.STORAGE_BUCKET) {
  const exists = await storage.bucketExists(bucket).catch(() => false);
  if (!exists) {
    await storage.makeBucket(bucket, "");
  }
}

export async function putObject(params: {
  bucket?: string;
  key: string;
  body: Buffer | string | Readable;
  contentType?: string;
}) {
  const bucket = params.bucket ?? env.STORAGE_BUCKET;
  await ensureBucket(bucket);
  await storage.putObject(bucket, params.key, params.body, undefined, {
    "Content-Type": params.contentType ?? "application/octet-stream",
  });
}

export async function getPresignedUrl(params: {
  bucket?: string;
  key: string;
  expirySeconds?: number;
}) {
  const bucket = params.bucket ?? env.STORAGE_BUCKET;
  await ensureBucket(bucket);
  const expires = params.expirySeconds ?? 60 * 10;
  return storage.presignedGetObject(bucket, params.key, expires);
}

export function getStorageClient() {
  return storage;
}
