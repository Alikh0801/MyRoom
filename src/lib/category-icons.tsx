import type { ReactNode } from "react";

interface CategoryIconProps {
  slug: string;
  size?: number;
}

export function CategoryIcon({ slug, size = 28 }: CategoryIconProps) {
  const icons: Record<string, ReactNode> = {
    otel: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21V7l9-4 9 4v14" />
        <path d="M9 21v-6h6v6" />
        <path d="M3 10h18" />
      </svg>
    ),
    hostel: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10h16v11H4z" />
        <path d="M4 14h4v3H4z" />
        <path d="M10 14h4v3h-4z" />
        <path d="M16 14h4v3h-4z" />
        <path d="M8 10V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4" />
      </svg>
    ),
    "a-frame": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3L2 21h20L12 3z" />
        <path d="M12 11v10" />
        <path d="M8 21h8" />
      </svg>
    ),
    villa: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12l9-8 9 8" />
        <path d="M5 10v10h14V10" />
        <path d="M10 20v-5h4v5" />
        <circle cx="18" cy="5" r="2" />
      </svg>
    ),
    "rayon-evi": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l9-7 9 7" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-4h6v4" />
        <path d="M2 20h20" />
      </svg>
    ),
  };

  return (
    <span className="category-icon" aria-hidden="true">
      {icons[slug] ?? icons.otel}
    </span>
  );
}
