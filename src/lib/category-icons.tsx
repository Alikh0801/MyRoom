import Image from "next/image";

interface CategoryIconProps {
  slug: string;
  size?: number;
}

const CATEGORY_IMAGES: Record<string, string> = {
  hotel: "hotel",
  hostel: "hostel",
  "a-frame": "a-frame",
  villa: "villa",
  "rayon-evi": "house",
};

function resolveImageSlug(slug: string): string {
  if (slug === "otel") return "hotel";
  return slug;
}

function getCategoryImageName(slug: string): string | null {
  const normalizedSlug = resolveImageSlug(slug);
  return CATEGORY_IMAGES[normalizedSlug] ?? null;
}

export function CategoryIcon({ slug, size = 64 }: CategoryIconProps) {
  const imageName = getCategoryImageName(slug);

  if (!imageName) {
    return null;
  }

  return (
    <span className="category-icon" style={{ width: size, height: size }}>
      <Image
        src={`/categories/${imageName}.png`}
        alt=""
        width={size}
        height={size}
        className="category-icon__image"
        aria-hidden="true"
      />
    </span>
  );
}
