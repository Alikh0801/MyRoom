interface CategoryIconProps {
  slug: string;
  size?: number;
}

/**
 * Kateqoriya ikonları — kiçik ölçüdə (40-48px) aydın görünsün deyə sadə
 * xətt (stroke) üslubunda inline SVG-lərdir. Rəng `currentColor`-dan gəlir,
 * ona görə seçilmiş kartda avtomatik olaraq brend rənginə keçir.
 */

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Hotel — çoxmərtəbəli bina, pəncərə sırası və girişdəki naves */
function HotelIcon() {
  return (
    <>
      <path d="M4.5 20.5h15" {...STROKE} />
      <path d="M6.5 20.5V5.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v15" {...STROKE} />
      <path d="M9 8h1.5M13.5 8H15M9 11.5h1.5M13.5 11.5H15" {...STROKE} />
      <path d="M10 20.5v-4a2 2 0 0 1 4 0v4" {...STROKE} />
    </>
  );
}

/** Hostel / Kotec — mərtəbəli çarpayı (hostelin ən tanınan simvolu) */
function HostelIcon() {
  return (
    <>
      <path d="M4 20.5V5" {...STROKE} />
      <path d="M20 20.5v-6" {...STROKE} />
      <path d="M4 14.5h16" {...STROKE} />
      <path d="M4 12.5h16a0 0 0 0 1 0 0v2H4" {...STROKE} />
      <path d="M4 8.5h16" {...STROKE} />
      <path d="M4 6.5h16v2H4" {...STROKE} />
      <circle cx="7.5" cy="6.5" r="1.25" {...STROKE} />
      <circle cx="7.5" cy="12.5" r="1.25" {...STROKE} />
    </>
  );
}

/** A-frame (Glamping) — üçbucaq formalı ev və qapısı */
function AFrameIcon() {
  return (
    <>
      <path d="M12 3.5 3.5 20.5h17L12 3.5Z" {...STROKE} />
      <path d="M12 3.5 6.75 20.5M12 3.5l5.25 17" {...STROKE} />
      <path d="M10 20.5v-3.25a2 2 0 0 1 4 0v3.25" {...STROKE} />
    </>
  );
}

/** Villa / Bağ evi — enli, ikimərtəbəli ev (Rayon evindən fərqlənsin deyə) */
function VillaIcon() {
  return (
    <>
      <path d="M2.5 11.8 12 4.5l9.5 7.3" {...STROKE} />
      <path d="M5.5 10.8V20.5h13V10.8" {...STROKE} />
      <path d="M3 20.5h18" {...STROKE} />
      <path d="M5.5 15.5h13" {...STROKE} />
      <path d="M9 12.9h1.75M13.25 12.9H15" {...STROKE} />
      <path d="M10.25 20.5V17h3.5v3.5" {...STROKE} />
    </>
  );
}

/** Rayon evi — sadə birmərtəbəli ev, baca ilə */
function RayonEviIcon() {
  return (
    <>
      <path d="M3 11.5 12 4.5l9 7" {...STROKE} />
      <path d="M5.5 10v10.5h13V10" {...STROKE} />
      <path d="M3 20.5h18" {...STROKE} />
      <path d="M10 20.5v-4.5h4v4.5" {...STROKE} />
      <path d="M16.5 7.2V5.5h2v3.25" {...STROKE} />
    </>
  );
}

const CATEGORY_ICONS: Record<string, () => React.ReactElement> = {
  hotel: HotelIcon,
  hostel: HostelIcon,
  "a-frame": AFrameIcon,
  villa: VillaIcon,
  "rayon-evi": RayonEviIcon,
};

/** Köhnə slug adları üçün uyğunluq */
function resolveSlug(slug: string): string {
  if (slug === "otel") return "hotel";
  return slug;
}

export function CategoryIcon({ slug, size = 64 }: CategoryIconProps) {
  const Icon = CATEGORY_ICONS[resolveSlug(slug)];

  if (!Icon) {
    return null;
  }

  return (
    <svg
      className="category-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <Icon />
    </svg>
  );
}
