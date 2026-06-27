"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ListingImage } from "@/types/database";

export type EditableListingImage = Pick<
  ListingImage,
  "id" | "url" | "is_cover" | "sort_order" | "storage_path"
>;

interface ExistingListingImagesProps {
  images: EditableListingImage[];
  title: string;
  label: string;
  coverLabel: string;
  canDelete: boolean;
  onChange: (images: EditableListingImage[]) => void;
  onDelete: (imageId: string) => void;
}

export function ExistingListingImages({
  images,
  title,
  label,
  coverLabel,
  canDelete,
  onChange,
  onDelete,
}: ExistingListingImagesProps) {
  const t = useTranslations("listingForm.edit");

  if (images.length === 0) return null;

  function moveImage(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= images.length) return;

    const next = [...images];
    const [item] = next.splice(index, 1);
    next.splice(nextIndex, 0, item);

    onChange(
      next.map((image, i) => ({
        ...image,
        sort_order: i,
        is_cover: i === 0,
      }))
    );
  }

  return (
    <div className="existing-listing-images">
      <p className="existing-listing-images__label">{label}</p>
      <p className="existing-listing-images__hint">{t("reorderHint")}</p>

      <div className="existing-listing-images__grid">
        {images.map((image, index) => (
          <div key={image.id} className="existing-listing-images__item">
            <Image
              src={image.url}
              alt={title}
              fill
              sizes="120px"
              className="existing-listing-images__img"
            />

            {index === 0 && (
              <span className="existing-listing-images__cover">{coverLabel}</span>
            )}

            <div className="existing-listing-images__controls">
              <div className="existing-listing-images__arrows">
                <button
                  type="button"
                  className="existing-listing-images__btn"
                  onClick={() => moveImage(index, -1)}
                  disabled={index === 0}
                  aria-label={t("moveLeft")}
                  title={t("moveLeft")}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="existing-listing-images__btn"
                  onClick={() => moveImage(index, 1)}
                  disabled={index === images.length - 1}
                  aria-label={t("moveRight")}
                  title={t("moveRight")}
                >
                  ›
                </button>
              </div>
              {canDelete && (
                <button
                  type="button"
                  className="existing-listing-images__btn existing-listing-images__btn--delete"
                  onClick={() => onDelete(image.id)}
                  aria-label={t("deletePhoto")}
                  title={t("deletePhoto")}
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {images.map((image) => (
        <input key={image.id} type="hidden" name="imageOrder" value={image.id} />
      ))}
    </div>
  );
}
