function toWhatsAppPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.startsWith("994") ? cleaned : `994${cleaned.replace(/^0/, "")}`;
}

export function buildWhatsAppUrl(
  phone: string,
  listingTitle: string,
  checkIn?: string,
  checkOut?: string
): string {
  let message = `Salam! MyRoomAZ-da "${listingTitle}" elanınıza maraqlanıram.`;
  if (checkIn && checkOut) {
    message += ` ${checkIn} – ${checkOut} tarixləri üçün müsaitdir?`;
  } else {
    message += " Müsaitlik barədə məlumat ala bilərəm?";
  }

  return `https://wa.me/${toWhatsAppPhone(phone)}?text=${encodeURIComponent(message)}`;
}

export function buildOwnerWhatsAppUrl(phone: string, ownerName: string): string {
  const message = `Salam ${ownerName}! MyRoomAZ-da profilinizi gördüm, əlaqə saxlamaq istəyirəm.`;
  return `https://wa.me/${toWhatsAppPhone(phone)}?text=${encodeURIComponent(message)}`;
}
