function toWhatsAppPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.startsWith("994") ? cleaned : `994${cleaned.replace(/^0/, "")}`;
}

/**
 * Söhbəti hazır mətnsiz açır — istifadəçi öz mesajını yazır. Həm elan, həm
 * sahib profili eyni keçiddən istifadə edir.
 */
export function buildWhatsAppUrl(phone: string): string {
  return `https://wa.me/${toWhatsAppPhone(phone)}`;
}
