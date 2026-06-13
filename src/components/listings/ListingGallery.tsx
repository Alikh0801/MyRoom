import { ListingPhotoGrid } from "@/components/listings/ListingPhotoGrid";
import type { ListingImage } from "@/types/database";

interface ListingGalleryProps {
  images: ListingImage[];
  title: string;
}

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const sorted = [...images].sort((a, b) => {
    if (a.is_cover) return -1;
    if (b.is_cover) return 1;
    return a.sort_order - b.sort_order;
  });

  const gridImages = sorted.map((img) => ({
    id: img.id,
    url: img.url,
    alt: title,
  }));

  if (gridImages.length === 0) return null;

  return <ListingPhotoGrid images={gridImages} />;
}
