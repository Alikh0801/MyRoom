import { getTranslations } from "next-intl/server";
import { getClientIp } from "@/lib/request";

export function isTurnstileEnabled(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY &&
      process.env.TURNSTILE_SECRET_KEY
  );
}

export async function verifyTurnstileToken(
  token: string | null | undefined
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isTurnstileEnabled()) {
    return { ok: true };
  }

  if (!token?.trim()) {
    const t = await getTranslations("auth.errors");
    return { ok: false, error: t("turnstileIncomplete") };
  }

  const ip = await getClientIp();
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: token,
        remoteip: ip,
      }),
    }
  );

  const result = (await response.json()) as { success?: boolean };

  if (!result.success) {
    const t = await getTranslations("auth.errors");
    return { ok: false, error: t("turnstileFailed") };
  }

  return { ok: true };
}
