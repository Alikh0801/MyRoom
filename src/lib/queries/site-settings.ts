import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

export const SITE_SETTINGS_CACHE_TAG = "site-settings";

export interface SiteSettings {
  /** Boş sətir = ünvan təyin edilməyib, footer-də ikon göstərilmir */
  instagramUrl: string;
}

const EMPTY_SETTINGS: SiteSettings = { instagramUrl: "" };

/**
 * Instagram ünvanını normallaşdırır: admin "myroomaz", "@myroomaz" və ya tam
 * linki yazsa da nəticə eyni olur. Yalnız instagram.com qəbul edilir ki,
 * footer-dəki ikon başqa saytlara yönləndirə bilməsin.
 */
export function normalizeInstagramUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return "";

  const handleOnly = value.replace(/^@/, "");

  if (/^[A-Za-z0-9._]{1,30}$/.test(handleOnly)) {
    return `https://www.instagram.com/${handleOnly}/`;
  }

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (host !== "instagram.com") return null;

  const handle = url.pathname.split("/").filter(Boolean)[0];
  if (!handle || !/^[A-Za-z0-9._]{1,30}$/.test(handle)) return null;

  return `https://www.instagram.com/${handle}/`;
}

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value");

    if (error) {
      console.error("getSiteSettings:", error.message);
      return EMPTY_SETTINGS;
    }

    const byKey = new Map((data ?? []).map((row) => [row.key, row.value ?? ""]));

    return {
      instagramUrl: byKey.get("instagram_url")?.trim() ?? "",
    };
  },
  ["site-settings"],
  { tags: [SITE_SETTINGS_CACHE_TAG], revalidate: 3600 }
);
