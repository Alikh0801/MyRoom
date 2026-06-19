import type { ReactNode } from "react";

interface CategoryIconProps {
  slug: string;
  size?: number;
}

interface IconBaseProps {
  size: number;
  children: ReactNode;
}

function IconBase({ size, children }: IconBaseProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const icons: Record<string, (size: number) => ReactNode> = {
  hotel: (size) => (
    <IconBase size={size}>
      <path d="M4 21V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17" />
      <path d="M4 21h16" />
      <path d="M8 21v-4h8v4" />
      <path d="M8 7h2v2H8z" />
      <path d="M14 7h2v2h-2z" />
      <path d="M8 11h2v2H8z" />
      <path d="M14 11h2v2h-2z" />
      <path d="M11 15h2v2h-2z" />
      <path d="M12 2v2" />
    </IconBase>
  ),

  hostel: (size) => (
    <IconBase size={size}>
      <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
      <path d="M3 12h18" />
      <path d="M6 8.5h5" />
      <path d="M6 14.5h5" />
      <path d="M17 6v12" />
      <path d="M17 8.5h3" />
      <path d="M17 12h3" />
      <path d="M17 15.5h3" />
      <path d="M3 20h18" />
    </IconBase>
  ),

  "a-frame": (size) => (
    <IconBase size={size}>
      <path d="M12 2 3 20h18L12 2z" />
      <path d="M12 9v11" />
      <path d="M8 20h8" />
      <path d="M10 14h4" />
      <path d="M19 20V13" />
      <path d="M19 10c1.5 1.2 1.5 2.8 0 4" />
      <path d="M21 20V15" />
      <path d="M21 12c1.2 1 1.2 2.5 0 3.5" />
    </IconBase>
  ),

  villa: (size) => (
    <IconBase size={size}>
      <path d="M12 3 5 11h14L12 3z" />
      <path d="M6 11v5h12v-5" />
      <path d="M10 16v4h4v-4" />
      <path d="M3 20h18" />
      <path d="M4 17.5h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" />
      <path d="M6 19c1.2.8 2.3.8 3.5 0s2.3-.8 3.5 0 2.3.8 3.5 0" />
    </IconBase>
  ),

  "rayon-evi": (size) => (
    <IconBase size={size}>
      <path d="M3 13 12 5l9 8" />
      <path d="M5 12v8h14v-8" />
      <path d="M9 20v-3h6v3" />
      <path d="M11 9h2" />
      <path d="M1 20h22" />
      <path d="M2 20c2.5-1.5 4.5-1.5 7 0s4.5 1.5 7 0 3.5-1.5 6 0" />
    </IconBase>
  ),
};

export function CategoryIcon({ slug, size = 28 }: CategoryIconProps) {
  const render = icons[slug] ?? icons.hotel;

  return <span className="category-icon">{render(size)}</span>;
}
