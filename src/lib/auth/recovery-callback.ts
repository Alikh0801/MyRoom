import { NextResponse } from "next/server";
import { routing, type Locale } from "@/i18n/routing";
import { withLocalePrefix } from "@/lib/i18n/locale-path";
import { createClient } from "@/lib/supabase/server";

function resolveLocale(localeSegments?: string[]): Locale {
  const maybeLocale = localeSegments?.[0];
  if (maybeLocale && routing.locales.includes(maybeLocale as Locale)) {
    return maybeLocale as Locale;
  }
  return routing.defaultLocale;
}

export async function handleRecoveryCallback(
  request: Request,
  localeSegments?: string[]
): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const locale = resolveLocale(localeSegments);
  const resetPath = withLocalePrefix("/auth/reset-password", locale);
  const forgotPath =
    withLocalePrefix("/auth/forgot-password", locale) +
    "?error=reset_link_expired";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${resetPath}`);
    }
  }

  return NextResponse.redirect(`${origin}${forgotPath}`);
}
