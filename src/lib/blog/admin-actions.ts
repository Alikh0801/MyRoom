"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { BLOG_CACHE_TAG } from "@/lib/blog/content";
import { slugify } from "@/lib/blog/slug";
import { deleteFile } from "@/lib/storage/s3";
import { createClient } from "@/lib/supabase/server";

function revalidateBlog(slug?: string) {
  revalidateTag(BLOG_CACHE_TAG);
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/blog/${slug}`);
}

const text = (formData: FormData, key: string): string | null => {
  const value = formData.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

function buildPayload(formData: FormData) {
  const titleAz = text(formData, "title_az");
  if (!titleAz) throw new Error("Azərbaycanca başlıq mütləqdir.");

  const slug = slugify(text(formData, "slug") || titleAz);
  if (!slug) throw new Error("Slug yaradıla bilmədi, başlığı dəyişin.");

  const readMinutes = Number(formData.get("read_minutes"));
  const publishedAt = text(formData, "published_at");

  return {
    slug,
    status: formData.get("status") === "published" ? "published" : "draft",
    region: text(formData, "region"),
    read_minutes:
      Number.isFinite(readMinutes) && readMinutes > 0
        ? Math.min(Math.round(readMinutes), 120)
        : 5,
    published_at: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
    cover_url: text(formData, "cover_url"),
    cover_storage_path: text(formData, "cover_storage_path"),
    title_az: titleAz,
    title_ru: text(formData, "title_ru"),
    title_tr: text(formData, "title_tr"),
    excerpt_az: text(formData, "excerpt_az"),
    excerpt_ru: text(formData, "excerpt_ru"),
    excerpt_tr: text(formData, "excerpt_tr"),
    meta_description_az: text(formData, "meta_description_az"),
    meta_description_ru: text(formData, "meta_description_ru"),
    meta_description_tr: text(formData, "meta_description_tr"),
    highlights_az: text(formData, "highlights_az"),
    highlights_ru: text(formData, "highlights_ru"),
    highlights_tr: text(formData, "highlights_tr"),
    body_az: text(formData, "body_az"),
    body_ru: text(formData, "body_ru"),
    body_tr: text(formData, "body_tr"),
  };
}

export async function createBlogPost(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const payload = buildPayload(formData);

  const { error } = await supabase.from("blog_posts").insert(payload);

  if (error) {
    throw new Error(
      error.code === "23505"
        ? "Bu slug artıq mövcuddur, başqa başlıq və ya slug seçin."
        : error.message
    );
  }

  revalidateBlog(payload.slug);
  redirect("/admin?tab=blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const payload = buildPayload(formData);

  const { data: previous } = await supabase
    .from("blog_posts")
    .select("slug, cover_storage_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("blog_posts")
    .update(payload)
    .eq("id", id);

  if (error) {
    throw new Error(
      error.code === "23505"
        ? "Bu slug artıq mövcuddur, başqa slug seçin."
        : error.message
    );
  }

  // Örtük şəkli dəyişibsə köhnəsini storage-dan sil
  const oldPath = previous?.cover_storage_path as string | undefined;
  if (oldPath && oldPath !== payload.cover_storage_path) {
    await deleteFile(oldPath).catch((err) =>
      console.error("updateBlogPost cover delete:", err)
    );
  }

  revalidateBlog(payload.slug);
  if (previous?.slug && previous.slug !== payload.slug) {
    revalidatePath(`/blog/${previous.slug}`);
  }
  redirect("/admin?tab=blog");
}

export async function deleteBlogPost(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string" || !id) throw new Error("Məqalə tapılmadı.");

  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("slug, cover_storage_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  const path = post?.cover_storage_path as string | undefined;
  if (path) {
    await deleteFile(path).catch((err) =>
      console.error("deleteBlogPost cover delete:", err)
    );
  }

  revalidateBlog(post?.slug as string | undefined);
}
