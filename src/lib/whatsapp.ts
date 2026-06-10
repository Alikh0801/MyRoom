export function buildWhatsAppUrl(
  phone: string,
  listingTitle: string,
  checkIn?: string,
  checkOut?: string
): string {
  const cleaned = phone.replace(/\D/g, "");
  const phoneWithCountry = cleaned.startsWith("994")
    ? cleaned
    : `994${cleaned.replace(/^0/, "")}`;

  let message = `Salam! MyRoom-da "${listingTitle}" elanınıza maraqlanıram.`;
  if (checkIn && checkOut) {
    message += ` ${checkIn} – ${checkOut} tarixləri üçün müsaitdir?`;
  } else {
    message += " Müsaitlik barədə məlumat ala bilərəm?";
  }

  return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
}
