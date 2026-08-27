export interface BlogSection {
  heading: string;
  paragraphs: string[];
  list: string[];
}

/** Örtük şəkli yüklənməyibsə istifadə olunan gradient variantı */
export type BlogAccent = "forest" | "sunset" | "sea" | "amber" | "dusk";

export interface BlogPost {
  id: string;
  slug: string;
  region: string | null;
  readMinutes: number;
  coverUrl: string | null;
  /** Şəkil yoxdursa göstərilən gradient — slug-dan sabit şəkildə seçilir */
  accent: BlogAccent;
  publishedAt: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  highlights: string[];
  intro: string;
  sections: BlogSection[];
}

/** Admin siyahısı üçün — mətn gövdəsi olmadan */
export interface AdminBlogPost {
  id: string;
  slug: string;
  status: "draft" | "published";
  region: string | null;
  readMinutes: number;
  coverUrl: string | null;
  publishedAt: string;
  titleAz: string;
  titleRu: string | null;
  titleTr: string | null;
}

/** Admin redaktə formu üçün tam sətir */
export interface AdminBlogPostDetail extends AdminBlogPost {
  coverStoragePath: string | null;
  excerptAz: string | null;
  excerptRu: string | null;
  excerptTr: string | null;
  metaDescriptionAz: string | null;
  metaDescriptionRu: string | null;
  metaDescriptionTr: string | null;
  highlightsAz: string | null;
  highlightsRu: string | null;
  highlightsTr: string | null;
  bodyAz: string | null;
  bodyRu: string | null;
  bodyTr: string | null;
}
