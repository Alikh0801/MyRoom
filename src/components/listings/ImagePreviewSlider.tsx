"use client";

import { useLayoutEffect, useState } from "react";
import { ImageSlider, type SliderImage } from "@/components/listings/ImageSlider";

interface ImagePreviewSliderProps {
  files: File[];
}

export function ImagePreviewSlider({ files }: ImagePreviewSliderProps) {
  const [images, setImages] = useState<SliderImage[]>([]);

  useLayoutEffect(() => {
    const next = files.map((file, i) => ({
      id: `${file.name}-${file.lastModified}-${i}`,
      url: URL.createObjectURL(file),
      alt: file.name,
    }));
    setImages(next);

    return () => {
      next.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [files]);

  if (files.length === 0 || images.length === 0) return null;

  return (
    <div className="image-preview-slider">
      <ImageSlider images={images} preferNative />
    </div>
  );
}
