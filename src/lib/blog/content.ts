import type { Locale } from "@/i18n/routing";
import { BLOG_POSTS_AZ } from "@/lib/blog/posts-az";
import { BLOG_POSTS_RU } from "@/lib/blog/posts-ru";
import { BLOG_POSTS_TR } from "@/lib/blog/posts-tr";
import type { BlogPost } from "@/lib/blog/types";

const POSTS_BY_LOCALE: Record<Locale, BlogPost[]> = {
  az: BLOG_POSTS_AZ,
  ru: BLOG_POSTS_RU,
  tr: BLOG_POSTS_TR,
};

/** Ən yeni məqalə birinci olmaqla bütün postlar */
export function getBlogPosts(locale: Locale | string): BlogPost[] {
  const posts = POSTS_BY_LOCALE[locale as Locale] ?? BLOG_POSTS_AZ;
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getBlogPost(
  slug: string,
  locale: Locale | string
): BlogPost | null {
  return getBlogPosts(locale).find((post) => post.slug === slug) ?? null;
}

/** Sitemap və generateStaticParams üçün — slug-lar bütün dillərdə eynidir */
export function getBlogSlugs(): string[] {
  return BLOG_POSTS_AZ.map((post) => post.slug);
}

/** Məqalə altında göstərilən digər bələdçilər */
export function getRelatedPosts(
  slug: string,
  locale: Locale | string,
  limit = 3
): BlogPost[] {
  return getBlogPosts(locale)
    .filter((post) => post.slug !== slug)
    .slice(0, limit);
}
