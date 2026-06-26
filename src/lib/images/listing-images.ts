import type { Options } from "browser-image-compression";

/** Elan detalı və lightbox üçün next/image keyfiyyəti */
export const LISTING_IMAGE_DISPLAY_QUALITY = 85;

/** Elan kartları (kiçik thumbnail) */
export const LISTING_CARD_IMAGE_QUALITY = 80;

export const LISTING_IMAGE_COMPRESSION: Options = {
  maxSizeMB: 1.2,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: "image/webp",
  initialQuality: 0.85,
};

export async function compressListingImage(file: File) {
  const imageCompression = (await import("browser-image-compression")).default;
  return imageCompression(file, LISTING_IMAGE_COMPRESSION);
}
