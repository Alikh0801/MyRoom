type AuthErrorTranslator = (
  key:
    | "missingCredentials"
    | "missingRequired"
    | "missingPhone"
    | "missingWhatsapp"
    | "passwordTooShort"
    | "legalRequired"
) => string;

export function validateLoginForm(
  formData: FormData,
  t: AuthErrorTranslator
): string | null {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return t("missingCredentials");
  }

  return null;
}

export function validateRegisterForm(
  formData: FormData,
  sameAsPhone: boolean,
  t: AuthErrorTranslator
): string | null {
  const fullName = (formData.get("fullName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const whatsappPhone = sameAsPhone
    ? phone
    : (formData.get("whatsappPhone") as string)?.trim();
  const password = formData.get("password") as string;
  const acceptTerms = formData.get("acceptTerms");

  if (!fullName || !email || !password) {
    return t("missingRequired");
  }

  if (!phone) {
    return t("missingPhone");
  }

  if (!whatsappPhone) {
    return t("missingWhatsapp");
  }

  if (password.length < 6) {
    return t("passwordTooShort");
  }

  if (!acceptTerms) {
    return t("legalRequired");
  }

  return null;
}
