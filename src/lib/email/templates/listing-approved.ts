import { getSiteUrl } from "@/lib/seo";

/**
 * Elan təsdiqləndikdə sahibinə göndərilən e-poçt.
 * Dizayn supabase/email-templates/confirm-signup-az.html ilə eynidir
 * (table layout + inline stillər — Outlook/Gmail müasir CSS dəstəkləmir).
 *
 * Dil: yalnız Azərbaycan dili — profil məlumatında istifadəçinin dil seçimi
 * saxlanılmır, sayt da default olaraq AZ-dir.
 */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function listingApprovedEmail(params: {
  listingTitle: string;
  listingId: string;
  vipUntil?: string | null;
}): { subject: string; html: string } {
  const title = escapeHtml(params.listingTitle);
  const url = `${getSiteUrl()}/listings/${params.listingId}`;

  const vipBlock = params.vipUntil
    ? `<p style="margin: 0 0 12px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.65; color: #1b4332;">
         Elanınız <strong>VIP</strong> statusu ilə yayımlanır — ${escapeHtml(params.vipUntil)} tarixinə qədər siyahıların yuxarısında görünəcək.
       </p>`
    : "";

  const html = `<!doctype html>
<html lang="az">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <title>Elanınız təsdiqləndi</title>
  </head>
  <body style="margin:0;padding:0;width:100%;background-color:#f8f7f4;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      Elanınız yoxlanışdan keçdi və saytda yayımlandı.
    </div>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f8f7f4;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <!--[if mso]><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600"><tr><td><![endif]-->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;max-width:600px;">
            <tr>
              <td style="font-size:0;line-height:0;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-radius:14px 14px 0 0;overflow:hidden;">
                  <tr>
                    <td width="33.33%" height="5" style="background-color:#00b5e2;font-size:0;line-height:0;">&nbsp;</td>
                    <td width="33.33%" height="5" style="background-color:#ef3340;font-size:0;line-height:0;">&nbsp;</td>
                    <td width="33.34%" height="5" style="background-color:#509e2f;font-size:0;line-height:0;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td align="center" style="background-color:#1b4332;padding:30px 24px;">
                <span style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:26px;font-weight:700;color:#ffffff;">My<span style="color:#d4a373;">Room</span>AZ</span>
              </td>
            </tr>

            <tr>
              <td style="background-color:#ffffff;border:1px solid #e8e4df;border-top:none;border-radius:0 0 14px 14px;padding:40px;">
                <h1 style="margin:0 0 14px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:22px;line-height:1.35;font-weight:700;color:#1a1a1a;">
                  Elanınız təsdiqləndi
                </h1>

                <p style="margin:0 0 20px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#6b6b6b;">
                  Elanınız yoxlanışdan keçdi və artıq saytda yayımlanır:
                </p>

                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="background-color:#f3f6f2;border:1px solid #cfe0d5;border-radius:12px;padding:18px 20px;">
                      <p style="margin:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;font-weight:600;line-height:1.45;color:#1b4332;">
                        ${title}
                      </p>
                    </td>
                  </tr>
                </table>

                ${vipBlock ? `<div style="margin-top:18px;">${vipBlock}</div>` : ""}

                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 0;">
                  <tr>
                    <td style="background-color:#2d6a4f;border-radius:10px;">
                      <a href="${url}" style="display:inline-block;padding:13px 26px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                        Elana bax
                      </a>
                    </td>
                  </tr>
                </table>

                <hr style="border:none;border-top:1px solid #e8e4df;margin:32px 0 24px;" />

                <p style="margin:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.65;color:#6b6b6b;">
                  Elanınızı istənilən vaxt <strong>Elanlarım</strong> bölməsindən redaktə edə bilərsiniz.
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:26px 24px 8px;">
                <p style="margin:0 0 6px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#6b6b6b;">
                  Azərbaycan üzrə qısamüddətli istirahət və günlük icarə elanları
                </p>
                <p style="margin:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;">
                  <a href="${getSiteUrl()}" style="color:#2d6a4f;text-decoration:none;font-weight:600;">myroomaz.com</a>
                </p>
              </td>
            </tr>
          </table>
          <!--[if mso]></td></tr></table><![endif]-->
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject: "Elanınız təsdiqləndi — MyRoomAZ", html };
}
