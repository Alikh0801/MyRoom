export function translateAuthError(message: string): string {
  const map: Record<string, string> = {
    "Invalid login credentials": "Email və ya şifrə yanlışdır.",
    "Email not confirmed": "Email ünvanınızı təsdiqləyin.",
    "User already registered": "Bu email artıq qeydiyyatdadır.",
    "Password should be at least 6 characters":
      "Şifrə ən azı 6 simvol olmalıdır.",
    "Signup requires a valid password": "Etibarlı şifrə daxil edin.",
    "Unable to validate email address: invalid format":
      "Email formatı düzgün deyil.",
  };

  return map[message] ?? message;
}
