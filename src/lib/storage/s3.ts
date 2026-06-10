import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getS3Client() {
  return new S3Client({
    region: process.env.S3_REGION ?? "auto",
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
  });
}

export function getPublicUrl(storagePath: string): string {
  const base = process.env.S3_PUBLIC_URL;
  const bucket = process.env.S3_BUCKET!;
  return `${base}/${bucket}/${storagePath}`;
}

export async function getPresignedUploadUrl(
  storagePath: string,
  contentType: string
): Promise<string> {
  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: storagePath,
    ContentType: contentType,
  });
  return getSignedUrl(client, command, { expiresIn: 300 });
}

export async function uploadFile(
  storagePath: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<void> {
  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: storagePath,
      Body: body,
      ContentType: contentType,
    })
  );
}

export async function deleteFile(storagePath: string): Promise<void> {
  const client = getS3Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: storagePath,
    })
  );
}

export function buildStoragePath(
  ownerId: string,
  listingId: string,
  fileName: string
): string {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${ownerId}/${listingId}/${Date.now()}-${safeName}`;
}
