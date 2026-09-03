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

export async function middleware(request: NextRequest) {
  const legacyCheckEmail = request.nextUrl.pathname.match(CHECK_EMAIL_PATH);

  if (legacyCheckEmail) {
    const locale = legacyCheckEmail[1];
    const url = request.nextUrl.clone();
    // Default dil (az) prefikssiz işlədilir — localePrefix: "as-needed"
    url.pathname =
      locale && locale !== routing.defaultLocale
        ? `/${locale}/auth/verify-email`
        : "/auth/verify-email";
    return NextResponse.redirect(url, 307);
  }

  const intlResponse = intlMiddleware(request);

  if (!shouldRefreshSupabaseSession(request)) {
    return intlResponse;
  }

  return updateSession(request, intlResponse);
}

export const config = {
  matcher: [
    "/((?!api|auth/callback|_next|_vercel|.*\\..*).*)",
  ],
};
