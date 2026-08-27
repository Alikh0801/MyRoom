export interface BlogSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

/** Örtük qrafikasının rəng variantı (şəkil əvəzinə gradient + mənzərə SVG) */
export type BlogAccent = "forest" | "sunset" | "sea" | "amber" | "dusk";

export interface BlogPost {
  slug: string;
  title: string;
  /** Kartlarda və siyahıda göstərilən qısa mətn */
  excerpt: string;
  metaDescription: string;
  /** Varsa, elan axtarışında bu rayona keçid verilir (/search?region=...) */
  region?: string;
  /** ISO tarix — sıralama və <time> üçün */
  publishedAt: string;
  readMinutes: number;
  accent: BlogAccent;
  intro: string;
  /** Məqalənin yuxarısında "sürətli faktlar" kimi göstərilir */
  highlights?: string[];
  sections: BlogSection[];
}
