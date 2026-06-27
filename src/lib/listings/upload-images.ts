import { compressListingImage } from "@/lib/images/listing-images";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export { ACCEPTED_IMAGE_TYPES };

export async function uploadListingImages(
  listingId: string,
  files: File[],
  tErrors: (key: string, values?: Record<string, string | number>) => string,
  options?: { startSortOrder?: number; setCover?: boolean }
) {
  const startSortOrder = options?.startSortOrder ?? 0;
  const setCover = options?.setCover ?? true;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const previewId = crypto.randomUUID();
    const compressed = await compressListingImage(file);

    const presignRes = await fetch("/api/upload/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId,
        fileName: `${previewId}.webp`,
        contentType: "image/webp",
      }),
    });

    if (!presignRes.ok) {
      const err = await presignRes.json();
      throw new Error(err.error ?? tErrors("uploadFailed"));
    }

    const { uploadUrl, storagePath } = await presignRes.json();

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": "image/webp" },
      body: compressed,
    });

    if (!uploadRes.ok) throw new Error(tErrors("uploadServerFailed"));

    const confirmRes = await fetch("/api/upload/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId,
        storagePath,
        isCover: setCover && i === 0 && startSortOrder === 0,
        sortOrder: startSortOrder + i,
      }),
    });

    if (!confirmRes.ok) {
      const err = await confirmRes.json();
      throw new Error(err.error ?? tErrors("uploadConfirmFailed"));
    }
  }
}
