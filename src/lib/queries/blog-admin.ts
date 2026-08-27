import { createClient } from "@/lib/supabase/server";
import type { AdminBlogPost, AdminBlogPostDetail } from "@/lib/blog/types";

const LIST_SELECT = `
  id, slug, status, region, read_minutes, cover_url, published_at,
  title_az, title_ru, title_tr
`;

const DETAIL_SELECT = `
  ${LIST_SELECT}, cover_storage_path,
  excerpt_az, excerpt_ru, excerpt_tr,
  meta_description_az, meta_description_ru, meta_description_tr,
  highlights_az, highlights_ru, highlights_tr,
  body_az, body_ru, body_tr
`;

type Row = Record<string, string | number | null>;

function mapList(row: Row): AdminBlogPost {
  return {
    id: String(row.id),
    slug: String(row.slug),
    status: row.status === "published" ? "published" : "draft",
    region: (row.region as string | null) ?? null,
    readMinutes: Number(row.read_minutes ?? 5),
    coverUrl: (row.cover_url as string | null) ?? null,
    publishedAt: String(row.published_at),
    titleAz: String(row.title_az ?? ""),
    titleRu: (row.title_ru as string | null) ?? null,
    titleTr: (row.title_tr as string | null) ?? null,
  };
}

const str = (v: unknown) => (typeof v === "string" ? v : null);

export async function getAdminBlogPosts(): Promise<AdminBlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(LIST_SELECT)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("getAdminBlogPosts:", error.message);
    return [];
  }

  return ((data ?? []) as Row[]).map(mapList);
}

export async function getAdminBlogPost(
  id: string
): Promise<AdminBlogPostDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(DETAIL_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getAdminBlogPost:", error.message);
    return null;
  }
  if (!data) return null;

  const row = data as Row;

  return {
    ...mapList(row),
    coverStoragePath: str(row.cover_storage_path),
    excerptAz: str(row.excerpt_az),
    excerptRu: str(row.excerpt_ru),
    excerptTr: str(row.excerpt_tr),
    metaDescriptionAz: str(row.meta_description_az),
    metaDescriptionRu: str(row.meta_description_ru),
    metaDescriptionTr: str(row.meta_description_tr),
    highlightsAz: str(row.highlights_az),
    highlightsRu: str(row.highlights_ru),
    highlightsTr: str(row.highlights_tr),
    bodyAz: str(row.body_az),
    bodyRu: str(row.body_ru),
    bodyTr: str(row.body_tr),
  };
}
