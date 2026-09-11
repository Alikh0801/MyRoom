import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import {
  shouldRefreshSupabaseSession,
  updateSession,
} from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

/**
 * Köhnə /auth/check-email ünvanı (hələ də köhnə məktub/əlfəcinlərdən gələ
 * bilər) /auth/verify-email-ə yönləndirilir.
 *
 * Bu, qəsdən middleware-də edilir: [locale] layout-u başlığı <Suspense>
 * içində render etdiyi üçün bütün səhifələr axınla (streaming) göndərilir və
 * səhifənin içindəki redirect() normal HTTP yönləndirməsi verə bilmir —
 * client tərəfli yönləndirməyə keçir, bu da React-in marşrut ağacını eyni
 * mövqedə dəyişməsinə və "Rendered more hooks..." (React #310) xətasına
 * səbəb olurdu. Middleware render başlamazdan əvvəl işlədiyi üçün burada
 * təmiz 307 qaytarılır.
 */
const CHECK_EMAIL_PATH = /^\/(?:(az|ru|tr)\/)?auth\/check-email\/?$/;

/**
 * Bloq yazılarının köhnə slug-ları. Yazılar statik fayllardan admin panelə
 * köçürüləndə slug-lar dəyişdi, köhnə ünvanlar isə Google-da indekslənmiş
 * qalmışdı və 404 verirdi. 301 ilə yönləndiririk ki, həmin ünvanların
 * topladığı SEO dəyəri yeni ünvanlara keçsin.
 *
 * QEYD: "seki-sefer-belediyicisi" siyahıda yoxdur — həmin mövzuda yazı artıq
 * mövcud deyil. Onu uyğunsuz səhifəyə yönləndirmək Google tərəfindən
 * "soft 404" sayılır, ona görə təbii 404 olaraq qalır.
 */
const LEGACY_BLOG_SLUGS: Record<string, string> = {
  "quba-istirahet-belediyicisi": "quba-blog",
  "qusar-shahdag-belediyicisi": "qusar-shahdag-blog",
  "lenkeran-astara-belediyicisi": "lenkeran-astara-blog",
  "qebele-istirahet-belediyicisi": "qebele-istirahet-blog",
};

const BLOG_POST_PATH = /^\/(?:(az|ru|tr)\/)?blog\/([^/]+)\/?$/;

/** Default dil (az) prefikssiz işlədilir — localePrefix: "as-needed" */
function localizedPath(locale: string | undefined, path: string): string {
  return locale && locale !== routing.defaultLocale
    ? `/${locale}${path}`
    : path;
}

export async function middleware(request: NextRequest) {
  const legacyCheckEmail = request.nextUrl.pathname.match(CHECK_EMAIL_PATH);

  if (legacyCheckEmail) {
    const url = request.nextUrl.clone();
    url.pathname = localizedPath(legacyCheckEmail[1], "/auth/verify-email");
    return NextResponse.redirect(url, 307);
  }

  const blogPost = request.nextUrl.pathname.match(BLOG_POST_PATH);
  const newSlug = blogPost && LEGACY_BLOG_SLUGS[decodeURIComponent(blogPost[2])];

  if (newSlug) {
    const url = request.nextUrl.clone();
    url.pathname = localizedPath(blogPost![1], `/blog/${newSlug}`);
    return NextResponse.redirect(url, 301);
  }

  const intlResponse = intlMiddleware(request);

  if (!shouldRefreshSupabaseSession(request)) {
    return intlResponse;
  }

  return updateSession(request, intlResponse);
}

export const config = {
  matcher: [
    // icon/apple-icon — Next.js-in generasiya etdiyi ikon marşrutlarıdır və
    // adlarında nöqtə olmadığı üçün ".*\..*" istisnasına düşmürlər. Onları
    // ayrıca çıxarmasaq, dil middleware-i "/icon" -> "/az/icon" kimi yazır,
    // belə səhifə olmadığı üçün 404 qayıdır: manifestdəki ikonlar sınır və
    // brauzer konsola xəta yazır.
    "/((?!api|auth/callback|_next|_vercel|icon|apple-icon|.*\\..*).*)",
  ],
};
