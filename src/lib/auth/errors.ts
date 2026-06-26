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
