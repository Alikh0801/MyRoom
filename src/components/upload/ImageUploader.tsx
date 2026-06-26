"use client";

import { compressListingImage } from "@/lib/images/listing-images";
import { useCallback, useState } from "react";

interface ImageUploaderProps {
  listingId: string;
  onUploadComplete?: (url: string) => void;
  maxImages?: number;
  currentCount?: number;
}

interface Preview {
  id: string;
  url: string;
  uploading: boolean;
}

export function ImageUploader({
  listingId,
  onUploadComplete,
  maxImages = 15,
  currentCount = 0,
}: ImageUploaderProps) {
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(
    async (file: File, sortOrder: number) => {
      const previewId = crypto.randomUUID();
      const localUrl = URL.createObjectURL(file);

      setPreviews((prev) => [
        ...prev,
        { id: previewId, url: localUrl, uploading: true },
      ]);

      try {
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
          throw new Error(err.error ?? "Presign xətası");
        }

        const { uploadUrl, storagePath } = await presignRes.json();

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": "image/webp" },
          body: compressed,
        });

        if (!uploadRes.ok) throw new Error("Yükləmə uğursuz oldu");

        const confirmRes = await fetch("/api/upload/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            listingId,
            storagePath,
            isCover: currentCount === 0 && sortOrder === 0,
            sortOrder,
          }),
        });

        if (!confirmRes.ok) {
          const err = await confirmRes.json();
          throw new Error(err.error ?? "Təsdiq xətası");
        }

        const { image } = await confirmRes.json();

        setPreviews((prev) =>
          prev.map((p) =>
            p.id === previewId ? { ...p, uploading: false } : p
          )
        );

        onUploadComplete?.(image.url);
      } catch (err) {
        setPreviews((prev) => prev.filter((p) => p.id !== previewId));
        setError(err instanceof Error ? err.message : "Xəta baş verdi");
      }
    },
    [listingId, currentCount, onUploadComplete]
  );

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const files = Array.from(e.target.files ?? []);
    const remaining = maxImages - currentCount - previews.length;

    if (files.length > remaining) {
      setError(`Maksimum ${maxImages} şəkil yükləyə bilərsiniz`);
      return;
    }

    await Promise.all(
      files.map((file, i) => uploadImage(file, currentCount + i))
    );

    e.target.value = "";
  }

  return (
    <div className="image-uploader">
      <label className="image-uploader__dropzone">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFiles}
          hidden
        />
        <span>Şəkil əlavə et (JPEG, PNG — avtomatik sıxılır)</span>
      </label>

      {error && <p className="image-uploader__error">{error}</p>}

      {previews.length > 0 && (
        <div className="image-uploader__previews">
          {previews.map((p) => (
            <div key={p.id} className="image-uploader__preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="Önizləmə" />
              {p.uploading && <span className="image-uploader__loading">...</span>}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
