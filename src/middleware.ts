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
 * Əvəzi olmayan yazılar buraya yox, REMOVED_BLOG_SLUGS-a yazılır.
 */
const LEGACY_BLOG_SLUGS: Record<string, string> = {
  "quba-istirahet-belediyicisi": "quba-blog",
  "qusar-shahdag-belediyicisi": "qusar-shahdag-blog",
  "lenkeran-astara-belediyicisi": "lenkeran-astara-blog",
  "qebele-istirahet-belediyicisi": "qebele-istirahet-blog",
};

/**
 * Həmişəlik silinmiş, əvəzi olmayan bloq yazıları. Bunlar 404 yox, 410 Gone
 * qaytarır.
 *
 * Fərq praktikdir: 404 "tapılmadı" deməkdir və Google onu müvəqqəti sayıb
 * ünvanı aylarla təkrar tarayır, Search Console-da isə saxlayır. 410 "bu
 * ünvan həmişəlik yoxdur" deməkdir — Google onu daha tez indeksdən çıxarır.
 *
 * Uyğun mövzuda başqa səhifəyə yönləndirmirik: Google məzmunu uyğun gəlməyən
 * yönləndirməni "soft 404" sayır, bu isə sadə 404-dən də pisdir.
 */
const REMOVED_BLOG_SLUGS = new Set(["seki-sefer-belediyicisi"]);

const BLOG_POST_PATH = /^\/(?:(az|ru|tr)\/)?blog\/([^/]+)\/?$/;

const GONE_TEXT: Record<string, { title: string; body: string; link: string }> = {
  az: {
    title: "Bu yazı silinib",
    body: "Axtardığınız bələdçi artıq saytda yoxdur.",
    link: "Bütün bələdçilər",
  },
  ru: {
    title: "Эта статья удалена",
    body: "Запрашиваемый путеводитель больше не доступен на сайте.",
    link: "Все путеводители",
  },
  tr: {
    title: "Bu yazı silindi",
    body: "Aradığınız rehber artık sitede bulunmuyor.",
    link: "Tüm rehberler",
  },
};

/**
 * 410 cavabı middleware-dən gəlir, ona görə səhifə öz layout-unu işlədə
 * bilmir — minimal, özü-özünə yetən HTML qaytarırıq. Bu ünvanlara praktikada
 * yalnız axtarış robotları girir, nadir hallarda gələn insan isə bloqa qayıda
 * bilsin deyə keçid qoyulub.
 */
function goneResponse(locale: string | undefined): NextResponse {
  const lang = locale && locale in GONE_TEXT ? locale : routing.defaultLocale;
  const text = GONE_TEXT[lang];
  const blogHref = localizedPath(locale, "/blog");

  const html = `<!doctype html>
<html lang="${lang}">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${text.title} — MyRoomAZ</title>
<style>
  body { margin: 0; min-height: 100vh; display: flex; align-items: center;
    justify-content: center; font: 16px/1.6 system-ui, sans-serif;
    background: #fafaf8; color: #1c1c1c; text-align: center; padding: 1.5rem; }
  h1 { font-size: 1.375rem; margin: 0 0 0.5rem; }
  p { margin: 0 0 1.5rem; color: #5d5d5d; }
  a { display: inline-block; padding: 0.625rem 1.25rem; border-radius: 999px;
    background: #1b4332; color: #fff; text-decoration: none; font-weight: 600; }
</style>
<main>
  <h1>${text.title}</h1>
  <p>${text.body}</p>
  <a href="${blogHref}">${text.link}</a>
</main>
</html>`;

  return new NextResponse(html, {
    status: 410,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

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
  const blogSlug = blogPost ? decodeURIComponent(blogPost[2]) : null;

  if (blogSlug && REMOVED_BLOG_SLUGS.has(blogSlug)) {
    return goneResponse(blogPost![1]);
  }

  const newSlug = blogSlug && LEGACY_BLOG_SLUGS[blogSlug];

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
