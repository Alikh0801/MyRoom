/**
 * Supabase signup email OTP length ({{ .Token }}).
 * Supabase Dashboard → Authentication → Email OTP Length ilə eyni olmalıdır —
 * uyğunsuzluq olsa kod daxil etmə formu işləməz.
 */
export const EMAIL_OTP_LENGTH = 6;

/** Display hint only; match Supabase Auth → Email OTP expiry setting. */
export const OTP_EXPIRY_SECONDS = Number(
  process.env.NEXT_PUBLIC_OTP_EXPIRY_SECONDS ?? 3600
);
