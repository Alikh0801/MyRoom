"use server";

import { cookies, headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const VISITOR_COOKIE = "mr_vid";
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

async function getOrSetVisitorId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(VISITOR_COOKIE)?.value;
  if (existing) return existing;

  const visitorId = crypto.randomUUID();
  try {
    cookieStore.set(VISITOR_COOKIE, visitorId, {
      maxAge: VISITOR_COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
    });
  } catch {
    // Server Action xaricində (məs. Server Component) set mümkün olmaya bilər
  }
  return visitorId;
}

export async function recordSiteVisit(path: string, locale: string) {
  const visitorId = await getOrSetVisitorId();
  const headerStore = await headers();
  const city = headerStore.get("x-vercel-ip-city");

  const supabase = await createClient();
  const { error } = await supabase.rpc("log_site_visit", {
    p_visitor_id: visitorId,
    p_path: path,
    p_locale: locale,
    p_country: headerStore.get("x-vercel-ip-country"),
    p_region: headerStore.get("x-vercel-ip-country-region"),
    p_city: city ? decodeURIComponent(city) : null,
  });

  if (error) {
    console.error("recordSiteVisit:", error.message);
  }
}
