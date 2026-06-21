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
    return { ok: false, error: "Təhlükəsizlik yoxlamasını tamamlayın." };
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
    return { ok: false, error: "Təhlükəsizlik yoxlaması uğursuz oldu. Yenidən cəhd edin." };
  }

  return { ok: true };
}
