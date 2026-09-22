function toWhatsAppPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.startsWith("994") ? cleaned : `994${cleaned.replace(/^0/, "")}`;
}

/**
 * Söhbəti hazır mətnsiz açır — istifadəçi öz mesajını yazır.
 */
export function buildWhatsAppUrl(phone: string): string {
  return `https://wa.me/${toWhatsAppPhone(phone)}`;
}

export function buildOwnerWhatsAppUrl(phone: string, ownerName: string): string {
  const message = `Salam ${ownerName}! MyRoomAZ-da profilinizi gördüm, əlaqə saxlamaq istəyirəm.`;
  return `https://wa.me/${toWhatsAppPhone(phone)}?text=${encodeURIComponent(message)}`;
}
