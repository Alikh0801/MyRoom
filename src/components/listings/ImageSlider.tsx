"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { LISTING_IMAGE_DISPLAY_QUALITY } from "@/lib/images/listing-images";

export interface SliderImage {
  id: string;
  url: string;
  alt: string;
}

interface ImageSliderProps {
  images: SliderImage[];
  priority?: boolean;
  fit?: "cover" | "contain";
  initialIndex?: number;
  sizes?: string;
  quality?: number;
  /** Lokal fayl önizləməsi üçün həmişə <img> istifadə et */
  preferNative?: boolean;
}

export function ImageSlider({
  images,
  priority = false,
  fit = "contain",
  initialIndex = 0,
  sizes = "(max-width: 900px) 100vw, 640px",
  quality = LISTING_IMAGE_DISPLAY_QUALITY,
  preferNative = false,
}: ImageSliderProps) {
  const [index, setIndex] = useState(initialIndex);
  const count = images.length;

  const goTo = useCallback(
    (next: number) => {
      if (count <= 1) return;
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    if (index >= count && count > 0) setIndex(0);
  }, [count, index]);

  useEffect(() => {
    if (count <= 1) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [count, goPrev, goNext]);

  if (count === 0) return null;

  const current = images[index];
  const isBlob = current.url.startsWith("blob:");
  const useNativeImg = preferNative || isBlob || current.url.startsWith("data:");

  return (
    <div className={`image-slider${fit === "contain" ? " image-slider--contain" : ""}`}>
      <div className="image-slider__viewport">
        {useNativeImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={current.id}
            src={current.url}
            alt={current.alt}
            className="image-slider__img image-slider__img--native"
          />
        ) : (
          <Image
            key={current.id}
            src={current.url}
            alt={current.alt}
            fill
            priority={priority && index === 0}
            quality={quality}
            sizes={sizes}
            className="image-slider__img"
          />
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              className="image-slider__arrow image-slider__arrow--prev"
              onClick={goPrev}
              aria-label="Əvvəlki şəkil"
            >
              ‹
            </button>
            <button
              type="button"
              className="image-slider__arrow image-slider__arrow--next"
              onClick={goNext}
              aria-label="Növbəti şəkil"
            >
              ›
            </button>
            <span className="image-slider__counter">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="image-slider__dots">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              className={`image-slider__dot${i === index ? " image-slider__dot--active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Şəkil ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
