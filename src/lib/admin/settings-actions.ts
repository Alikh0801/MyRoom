"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import {
  normalizeInstagramUrl,
  normalizeSitePhone,
  SITE_SETTINGS_CACHE_TAG,
} from "@/lib/queries/site-settings";
import { createClient } from "@/lib/supabase/server";

export type SiteSettingsResult = { ok: true } | { ok: false; error: string };

export async function updateSiteSettings(
  formData: FormData
): Promise<SiteSettingsResult> {
  await requireAdmin();

  const instagramUrl = normalizeInstagramUrl(
    String(formData.get("instagram_url") ?? "")
  );

  if (instagramUrl === null) {
    return {
      ok: false,
      error:
        "Instagram ünvanı düzgün deyil. Nümunə: myroomaz və ya https://www.instagram.com/myroomaz/",
    };
  }

  const phone = normalizeSitePhone(String(formData.get("phone") ?? ""));

  if (phone === null) {
    return {
      ok: false,
      error: "Telefon nömrəsi düzgün deyil. Nümunə: 0501234567",
    };
  }

  const updatedAt = new Date().toISOString();
  const supabase = await createClient();
  // Hər iki parametr bir sorğuda yazılır ki, biri keçib digəri qalmasın
  const { error } = await supabase.from("site_settings").upsert(
    [
      { key: "instagram_url", value: instagramUrl, updated_at: updatedAt },
      { key: "phone", value: phone, updated_at: updatedAt },
    ],
    { onConflict: "key" }
  );

  if (error) {
    console.error("updateSiteSettings:", error.message);
    return { ok: false, error: "Yadda saxlanmadı. Bir azdan yenidən cəhd edin." };
  }

  // Footer bütün səhifələrdə olduğu üçün cache tag-ı ilə hamısı yenilənir
  revalidateTag(SITE_SETTINGS_CACHE_TAG);
  revalidatePath("/", "layout");

  return { ok: true };
}
