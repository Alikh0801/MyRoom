import {
  compressListingImage,
  compressListingThumbnail,
} from "@/lib/images/listing-images";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export { ACCEPTED_IMAGE_TYPES };

const UPLOAD_CACHE_CONTROL = "public, max-age=31536000, immutable";

type TErrors = (key: string, values?: Record<string, string | number>) => string;

async function presignUpload(
  listingId: string,
  fileName: string,
  tErrors: TErrors
): Promise<{ uploadUrl: string; storagePath: string }> {
  const res = await fetch("/api/upload/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listingId, fileName, contentType: "image/webp" }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? tErrors("uploadFailed"));
  }

  return res.json();
}

async function putToStorage(uploadUrl: string, body: Blob, tErrors: TErrors) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": UPLOAD_CACHE_CONTROL,
    },
    body,
  });

  if (!res.ok) throw new Error(tErrors("uploadServerFailed"));
}

async function uploadOneImage(
  listingId: string,
  file: File,
  isCover: boolean,
  sortOrder: number,
  tErrors: TErrors
) {
  const previewId = crypto.randomUUID();

  const [compressed, thumbnail] = await Promise.all([
    compressListingImage(file),
    compressListingThumbnail(file),
  ]);

  const [full, thumb] = await Promise.all([
    presignUpload(listingId, `${previewId}.webp`, tErrors),
    presignUpload(listingId, `${previewId}-thumb.webp`, tErrors),
  ]);

  await Promise.all([
    putToStorage(full.uploadUrl, compressed, tErrors),
    putToStorage(thumb.uploadUrl, thumbnail, tErrors),
  ]);

  const confirmRes = await fetch("/api/upload/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      listingId,
      storagePath: full.storagePath,
      thumbStoragePath: thumb.storagePath,
      isCover,
      sortOrder,
    }),
  });

  if (!confirmRes.ok) {
    const err = await confirmRes.json();
    throw new Error(err.error ?? tErrors("uploadConfirmFailed"));
  }
}

/** Şəkilləri paralel yükləyir (ardıcıl yükləmə çoxlu şəkildə dəqiqələrlə çəkirdi). */
export async function uploadListingImages(
  listingId: string,
  files: File[],
  tErrors: TErrors,
  options?: { startSortOrder?: number; setCover?: boolean }
) {
  const startSortOrder = options?.startSortOrder ?? 0;
  const setCover = options?.setCover ?? true;

  await Promise.all(
    files.map((file, i) =>
      uploadOneImage(
        listingId,
        file,
        setCover && i === 0 && startSortOrder === 0,
        startSortOrder + i,
        tErrors
      )
    )
  );
}
