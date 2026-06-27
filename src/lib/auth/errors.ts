export const AUTH_ERROR_KEYS = {
  invalidCredentials: "invalidCredentials",
  emailNotConfirmed: "emailNotConfirmed",
  userAlreadyRegistered: "userAlreadyRegistered",
  passwordTooShort: "passwordTooShort",
  invalidPassword: "invalidPassword",
  invalidEmailFormat: "invalidEmailFormat",
  invalidToken: "invalidToken",
  rateLimitResend: "rateLimitResend",
  confirmationEmailFailed: "confirmationEmailFailed",
  unknown: "unknown",
} as const;

export type AuthErrorKey = keyof typeof AUTH_ERROR_KEYS;

const SUPABASE_ERROR_MAP: Record<string, AuthErrorKey> = {
  "Invalid login credentials": "invalidCredentials",
  "Email not confirmed": "emailNotConfirmed",
  "User already registered": "userAlreadyRegistered",
  "Password should be at least 6 characters": "passwordTooShort",
  "Signup requires a valid password": "invalidPassword",
  "Unable to validate email address: invalid format": "invalidEmailFormat",
  "Token has expired or is invalid": "invalidToken",
  "Email link is invalid or has expired": "invalidToken",
  "Error sending confirmation email": "confirmationEmailFailed",
};

export function resolveAuthErrorKey(message: string): AuthErrorKey {
  if (message.includes("For security purposes, you can only request this after")) {
    return "rateLimitResend";
  }

  return SUPABASE_ERROR_MAP[message] ?? "unknown";
}

/** @deprecated Use resolveAuthErrorKey with getTranslations in server actions */
export function translateAuthError(message: string): string {
  const map: Record<string, string> = {
    "Invalid login credentials": "Email və ya şifrə yanlışdır.",
    "Email not confirmed": "Email ünvanınızı təsdiqləyin.",
    "User already registered": "Bu email ilə artıq qeydiyyatdan keçilib.",
    "Password should be at least 6 characters":
      "Şifrə ən azı 6 simvol olmalıdır.",
    "Signup requires a valid password": "Etibarlı şifrə daxil edin.",
    "Unable to validate email address: invalid format":
      "Email formatı düzgün deyil.",
    "Token has expired or is invalid": "Təsdiq kodu səhvdir və ya vaxtı bitib.",
    "Email link is invalid or has expired":
      "Təsdiq kodu səhvdir və ya vaxtı bitib.",
    "For security purposes, you can only request this after":
      "Yeni kod göndərmək üçün bir az gözləyin.",
    "Error sending confirmation email":
      "Təsdiq emaili göndərilmədi. Supabase SMTP və Resend ayarlarını yoxlayın.",
  };

  return map[message] ?? message;
}
