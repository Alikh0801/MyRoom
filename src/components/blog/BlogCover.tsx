import type { BlogAccent } from "@/lib/blog/types";

interface AccentPalette {
  skyFrom: string;
  skyTo: string;
  sun: string;
  far: string;
  mid: string;
  near: string;
}

const PALETTES: Record<BlogAccent, AccentPalette> = {
  forest: {
    skyFrom: "#1b4332",
    skyTo: "#40916c",
    sun: "#d8f3dc",
    far: "#2d6a4f",
    mid: "#1b4332",
    near: "#0d2818",
  },
  sunset: {
    skyFrom: "#7f3f2e",
    skyTo: "#e07a5f",
    sun: "#ffe8d6",
    far: "#a0522d",
    mid: "#6b3423",
    near: "#3d1e14",
  },
  sea: {
    skyFrom: "#14425c",
    skyTo: "#4d9dbf",
    sun: "#e0f4fa",
    far: "#2a6f8e",
    mid: "#173f55",
    near: "#0c2634",
  },
  amber: {
    skyFrom: "#7a5423",
    skyTo: "#d4a373",
    sun: "#fff4e0",
    far: "#a97b42",
    mid: "#6d4a20",
    near: "#3f2a12",
  },
  dusk: {
    skyFrom: "#2b2d5c",
    skyTo: "#6d6ba8",
    sun: "#e6e4ff",
    far: "#43457e",
    mid: "#2a2b52",
    near: "#16172e",
  },
};

interface BlogCoverProps {
  accent: BlogAccent;
  /** Eyni səhifədə birdən çox örtük olduğu üçün gradient id-ləri unikal olmalıdır */
  uid: string;
  className?: string;
  /**
   * Geniş/alçaq sahələrdə (məqalə başlığı) "slice" mərkəzdən kəsdiyi üçün
   * silsilələr görünmür — "bottom" onları aşağı kənara bənd edir.
   */
  anchor?: "center" | "bottom";
}

export function BlogCover({
  accent,
  uid,
  className,
  anchor = "center",
}: BlogCoverProps) {
  const palette = PALETTES[accent] ?? PALETTES.forest;
  const skyId = `blog-sky-${uid}`;

  return (
    <svg
      className={className}
      viewBox="0 0 400 260"
      preserveAspectRatio={
        anchor === "bottom" ? "xMidYMax slice" : "xMidYMid slice"
      }
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.skyFrom} />
          <stop offset="100%" stopColor={palette.skyTo} />
        </linearGradient>
      </defs>

      <rect width="400" height="260" fill={`url(#${skyId})`} />
      <circle cx="312" cy="66" r="26" fill={palette.sun} opacity="0.85" />

      {/* Uzaq silsilə */}
      <path
        d="M0 150 L64 104 L112 138 L168 92 L232 146 L288 112 L344 152 L400 118 L400 260 L0 260 Z"
        fill={palette.far}
        opacity="0.75"
      />
      {/* Orta silsilə */}
      <path
        d="M0 182 L58 146 L118 184 L182 138 L246 186 L310 150 L400 190 L400 260 L0 260 Z"
        fill={palette.mid}
        opacity="0.9"
      />
      {/* Ön plan */}
      <path
        d="M0 218 L72 190 L146 222 L214 194 L292 224 L360 200 L400 220 L400 260 L0 260 Z"
        fill={palette.near}
      />
    </svg>
  );
}
