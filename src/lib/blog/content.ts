import { unstable_cache } from "next/cache";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { accentForSlug, parseBlogBody, parseHighlights } from "@/lib/blog/body";
import type { BlogPost } from "@/lib/blog/types";
import { createPublicClient } from "@/lib/supabase/public";

export const BLOG_CACHE_TAG = "blog-posts";
const BLOG_REVALIDATE_SECONDS = 300;

const POST_SELECT = `
  id, slug, region, read_minutes, cover_url, published_at,
  title_az, title_ru, title_tr,
  excerpt_az, excerpt_ru, excerpt_tr,
  meta_description_az, meta_description_ru, meta_description_tr,
  highlights_az, highlights_ru, highlights_tr,
  body_az, body_ru, body_tr
`;

type BlogRow = Record<string, string | number | null>;

/** Tərcümə boşdursa AZ mətninə qayıdır */
function pick(row: BlogRow, field: string, locale: Locale): string {
  const localized = row[`${field}_${locale}`];
  if (typeof localized === "string" && localized.trim()) return localized;
  const fallback = row[`${field}_${routing.defaultLocale}`];
  return typeof fallback === "string" ? fallback : "";
}

function mapPost(row: BlogRow, locale: Locale): BlogPost {
  const slug = String(row.slug);
  const { intro, sections } = parseBlogBody(pick(row, "body", locale));

  return {
    id: String(row.id),
    slug,
    region: (row.region as string | null) ?? null,
    readMinutes: Number(row.read_minutes ?? 5),
    coverUrl: (row.cover_url as string | null) ?? null,
    accent: accentForSlug(slug),
    publishedAt: String(row.published_at),
    title: pick(row, "title", locale),
    excerpt: pick(row, "excerpt", locale),
    metaDescription: pick(row, "meta_description", locale),
    highlights: parseHighlights(pick(row, "highlights", locale)),
    intro,
    sections,
  };
}

const getPublishedRows = unstable_cache(
  async (): Promise<BlogRow[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select(POST_SELECT)
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("getBlogPosts:", error.message);
      return [];
    }

    return (data ?? []) as BlogRow[];
  },
  ["blog-posts"],
  { revalidate: BLOG_REVALIDATE_SECONDS, tags: [BLOG_CACHE_TAG] }
);

export async function getBlogPosts(locale: Locale | string): Promise<BlogPost[]> {
  const rows = await getPublishedRows();
  return rows.map((row) => mapPost(row, locale as Locale));
}

/**
 * Məqaləni birbaşa slug ilə çəkir — bütün siyahının keşinə bağlı deyil.
 * (Siyahı keşi build zamanı boş yazıla bilir; o zaman detal səhifəsi
 * mövcud məqaləni "tapılmadı" sayırdı.)
 */
const getPostRowBySlug = unstable_cache(
  async (slug: string): Promise<BlogRow | null> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select(POST_SELECT)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) {
      console.error("getBlogPost:", error.message);
      return null;
    }

    return (data as BlogRow | null) ?? null;
  },
  ["blog-post-by-slug"],
  { revalidate: BLOG_REVALIDATE_SECONDS, tags: [BLOG_CACHE_TAG] }
);

export async function getBlogPost(
  slug: string,
  locale: Locale | string
): Promise<BlogPost | null> {
  const row = await getPostRowBySlug(slug);
  return row ? mapPost(row, locale as Locale) : null;
}

/** Sitemap üçün — slug-lar bütün dillərdə eynidir */
export async function getBlogSlugs(): Promise<string[]> {
  const rows = await getPublishedRows();
  return rows.map((row) => String(row.slug));
}

export async function getRelatedPosts(
  slug: string,
  locale: Locale | string,
  limit = 3
): Promise<BlogPost[]> {
  const posts = await getBlogPosts(locale);
  return posts.filter((post) => post.slug !== slug).slice(0, limit);
}
