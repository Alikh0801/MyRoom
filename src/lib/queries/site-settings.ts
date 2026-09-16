import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

export const SITE_SETTINGS_CACHE_TAG = "site-settings";

export interface SiteSettings {
  /** Boş sətir = ünvan təyin edilməyib, footer-də ikon göstərilmir */
  instagramUrl: string;
  /** "+994XXXXXXXXX" formatında saxlanılır; boş sətir = göstərilmir */
  phone: string;
}

const EMPTY_SETTINGS: SiteSettings = { instagramUrl: "", phone: "" };

const AZ_PREFIX = "+994";

/**
 * Telefonu "+994XXXXXXXXX" formatına gətirir. Admin "0501234567",
 * "+994 50 123 45 67" və ya "501234567" yazsa da nəticə eynidir.
 * Düzgün olmayan dəyər üçün null qaytarır.
 */
export function normalizeSitePhone(raw: string): string | null {
  const value = raw.trim();
  if (!value) return "";

  // Rəqəm və "+" xaricində simvol varsa (məsələn hərf) qəbul etmirik
  if (/[^\d\s+()-]/.test(value)) return null;

  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("994")) digits = digits.slice(3);
  else if (digits.startsWith("0")) digits = digits.slice(1);

  if (!/^\d{9}$/.test(digits)) return null;

  return `${AZ_PREFIX}${digits}`;
}

/** "+994501234567" -> "+994 50 123 45 67" (yalnız göstərmək üçün) */
export function formatSitePhone(phone: string): string {
  const local = phone.replace(/^\+994/, "");
  if (local.length !== 9) return phone;
  return `${AZ_PREFIX} ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(
    5,
    7
  )} ${local.slice(7)}`;
}

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
      phone: byKey.get("phone")?.trim() ?? "",
    };
  },
  ["site-settings"],
  { tags: [SITE_SETTINGS_CACHE_TAG], revalidate: 3600 }
);
