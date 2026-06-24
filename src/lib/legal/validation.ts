export function hasAcceptedLegalTerms(formData: FormData): boolean {
  const value = formData.get("acceptTerms");
  return value === "on" || value === "true" || value === "1";
}
