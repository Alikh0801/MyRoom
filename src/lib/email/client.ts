/**
 * Transaksiya e-poçtları üçün göndərici (Resend REST API).
 * Sənəd: https://resend.com/docs/api-reference/emails/send-email
 *
 * Ayrıca kitabxana quraşdırılmır — sadə fetch kifayətdir (eyni yanaşma
 * kapital-client.ts-də də işlədilir).
 *
 * VACİB: bu funksiya HEÇ VAXT xəta atmır. E-poçt göndərilməsi əlavə
 * bildirişdir — poçt xidməti işləmirsə belə, onu çağıran əməliyyat (məsələn
 * elanın təsdiqlənməsi) pozulmamalıdır.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type SendEmailResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "failed" };

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    // Açar təyin edilməyibsə funksiya sadəcə susur — sayt normal işləyir.
    console.warn("sendEmail: RESEND_API_KEY/EMAIL_FROM təyin edilməyib, e-poçt göndərilmədi.");
    return { ok: false, reason: "not_configured" };
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [params.to],
        subject: params.subject,
        html: params.html,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`sendEmail: ${res.status} ${body.slice(0, 300)}`);
      return { ok: false, reason: "failed" };
    }

    return { ok: true };
  } catch (err) {
    console.error("sendEmail:", err);
    return { ok: false, reason: "failed" };
  }
}
