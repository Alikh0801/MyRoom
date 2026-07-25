import { compressListingImage } from "@/lib/images/listing-images";
import { attachVipReceipt } from "@/lib/listings/vip-request-actions";

export async function uploadVipReceipt(
  listingId: string,
  file: File,
  tErrors: (key: string) => string
): Promise<{ storagePath: string }> {
  const previewId = crypto.randomUUID();
  const compressed = await compressListingImage(file);

  const presignRes = await fetch("/api/upload/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      listingId,
      fileName: `vip-receipt-${previewId}.webp`,
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

  const attachResult = await attachVipReceipt(listingId, storagePath);
  if (attachResult.error) {
    throw new Error(attachResult.error);
  }

  return { storagePath };
}
