/** Supabase signup email OTP length ({{ .Token }}) */
export const EMAIL_OTP_LENGTH = 8;

/** Display hint only; match Supabase Auth → Email OTP expiry setting. */
export const OTP_EXPIRY_SECONDS = Number(
  process.env.NEXT_PUBLIC_OTP_EXPIRY_SECONDS ?? 3600
);
