import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function getForgotPasswordPath(next: string): string {
  for (const locale of ["ru", "tr"]) {
    if (next.startsWith(`/${locale}/`)) {
      return `/${locale}/auth/forgot-password?error=reset_link_expired`;
    }
  }
  return "/auth/forgot-password?error=reset_link_expired";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (type === "recovery" || next.includes("reset-password")) {
        const resetPath = next.includes("reset-password") ? next : "/auth/reset-password";
        return NextResponse.redirect(`${origin}${resetPath}`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  const isResetFlow = next.includes("reset-password");
  const failurePath = isResetFlow
    ? getForgotPasswordPath(next)
    : "/auth/login?error=auth_callback_failed";

  return NextResponse.redirect(`${origin}${failurePath}`);
}
