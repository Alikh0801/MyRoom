import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import {
  shouldRefreshSupabaseSession,
  updateSession,
} from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
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
