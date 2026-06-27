import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  getLocaleFromPathname,
  stripLocalePrefix,
  withLocalePrefix,
} from "@/lib/i18n/locale-path";

export async function updateSession(
  request: NextRequest,
  response: NextResponse = NextResponse.next({ request })
) {
  let supabaseResponse = response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const locale = getLocaleFromPathname(request.nextUrl.pathname);
  const pathname = stripLocalePrefix(request.nextUrl.pathname);

  function localizedRedirect(path: string) {
    const url = request.nextUrl.clone();
    url.pathname = withLocalePrefix(path, locale);
    return NextResponse.redirect(url);
  }

  if (pathname === "/dashboard") {
    const url = request.nextUrl.clone();
    url.pathname = withLocalePrefix("/", locale);
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (!user && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = withLocalePrefix("/auth/login", locale);
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  const emailConfirmed = Boolean(user?.email_confirmed_at);

  if (user && !emailConfirmed && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = withLocalePrefix("/auth/verify-email", locale);
    if (user.email) {
      url.searchParams.set("email", user.email);
    }
    url.searchParams.set("reason", "unconfirmed");
    return NextResponse.redirect(url);
  }

  if (user && !emailConfirmed && pathname.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = withLocalePrefix("/auth/verify-email", locale);
    if (user.email) {
      url.searchParams.set("email", user.email);
    }
    url.searchParams.set("reason", "unconfirmed");
    return NextResponse.redirect(url);
  }

  if (!user && pathname.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = withLocalePrefix("/auth/login", locale);
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  if (
    user &&
    emailConfirmed &&
    (pathname === "/auth/login" ||
      pathname === "/auth/register" ||
      pathname === "/auth/verify-email")
  ) {
    return localizedRedirect("/");
  }

  return supabaseResponse;
}
