"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ImageSlider, type SliderImage } from "@/components/listings/ImageSlider";
import {
  LISTING_IMAGE_DISPLAY_QUALITY,
} from "@/lib/images/listing-images";

export interface GridImage {
  id: string;
  url: string;
  alt: string;
}

interface ListingPhotoGridProps {
  images: GridImage[];
}

function GridCell({
  image,
  className,
  priority,
  overlay,
  sizes,
  onClick,
}: {
  image: GridImage;
  className?: string;
  priority?: boolean;
  overlay?: string;
  sizes: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`listing-photo-grid__cell${className ? ` ${className}` : ""}`}
      onClick={onClick}
      aria-label={overlay ?? image.alt}
    >
      <Image
        src={image.url}
        alt={image.alt}
        fill
        priority={priority}
        quality={LISTING_IMAGE_DISPLAY_QUALITY}
        sizes={sizes}
        className="listing-photo-grid__img"
      />
      {overlay && <span className="listing-photo-grid__overlay">{overlay}</span>}
    </button>
  );
}

export function ListingPhotoGrid({ images }: ListingPhotoGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setStartIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  useEffect(() => {
    if (!lightboxOpen) return;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, closeLightbox]);

  if (images.length === 0) return null;

  const count = images.length;
  const featuredCount = Math.min(count, 3);
  const thumbImages = images.slice(3, 8);
  const remainingCount = count - 8;

  const featuredClass =
    featuredCount === 1
      ? "listing-photo-grid__featured listing-photo-grid__featured--single"
      : featuredCount === 2
        ? "listing-photo-grid__featured listing-photo-grid__featured--double"
        : "listing-photo-grid__featured";

  const sliderImages: SliderImage[] = images.map((img) => ({
    id: img.id,
    url: img.url,
    alt: img.alt,
  }));

  return (
    <>
      <div className="listing-photo-grid">
        <div className={featuredClass}>
          <GridCell
            image={images[0]}
            className="listing-photo-grid__cell--main"
            priority
            sizes="(max-width: 900px) 100vw, 66vw"
            onClick={() => openLightbox(0)}
          />
          {images[1] && (
            <GridCell
              image={images[1]}
              className="listing-photo-grid__cell--side-top"
              sizes="(max-width: 900px) 50vw, 22vw"
              onClick={() => openLightbox(1)}
            />
          )}
          {images[2] && (
            <GridCell
              image={images[2]}
              className="listing-photo-grid__cell--side-bottom"
              sizes="(max-width: 900px) 50vw, 22vw"
              onClick={() => openLightbox(2)}
            />
          )}
        </div>

        {thumbImages.length > 0 && (
          <div
            className="listing-photo-grid__thumbs"
            style={{
              gridTemplateColumns: `repeat(${Math.min(thumbImages.length, 5)}, 1fr)`,
            }}
          >
            {thumbImages.map((image, i) => {
              const globalIndex = i + 3;
              const isLast = i === thumbImages.length - 1;
              const overlay =
                isLast && remainingCount > 0
                  ? `+${remainingCount} foto`
                  : undefined;

              return (
                <GridCell
                  key={image.id}
                  image={image}
                  overlay={overlay}
                  sizes="(max-width: 900px) 25vw, 14vw"
                  onClick={() => openLightbox(globalIndex)}
                />
              );
            })}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="photo-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Şəkil qalereyası"
          onClick={closeLightbox}
        >
          <div
            className="photo-lightbox__panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="photo-lightbox__close"
              onClick={closeLightbox}
              aria-label="Bağla"
            >
              ×
            </button>
            <ImageSlider
              key={startIndex}
              images={sliderImages}
              initialIndex={startIndex}
              fit="contain"
              sizes="(max-width: 900px) 100vw, min(1320px, 90vw)"
              quality={LISTING_IMAGE_DISPLAY_QUALITY}
            />
          </div>
        </div>
      )}
    </>
  );
}
