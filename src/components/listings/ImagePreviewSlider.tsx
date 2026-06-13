"use client";

import { useEffect, useMemo } from "react";
import { ImageSlider, type SliderImage } from "@/components/listings/ImageSlider";

interface ImagePreviewSliderProps {
  files: File[];
}

export function ImagePreviewSlider({ files }: ImagePreviewSliderProps) {
  const images = useMemo<SliderImage[]>(
    () =>
      files.map((file, i) => ({
        id: `${file.name}-${file.lastModified}-${i}`,
        url: URL.createObjectURL(file),
        alt: file.name,
      })),
    [files]
  );

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [images]);

  if (files.length === 0) return null;

  return (
    <div className="image-preview-slider">
      <ImageSlider images={images} />
    </div>
  );
}
