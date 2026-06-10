import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  phone: string;
  listingTitle: string;
  checkIn?: string;
  checkOut?: string;
}

export function WhatsAppButton({
  phone,
  listingTitle,
  checkIn,
  checkOut,
}: WhatsAppButtonProps) {
  const url = buildWhatsAppUrl(phone, listingTitle, checkIn, checkOut);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn--whatsapp"
    >
      WhatsApp ilə əlaqə
    </a>
  );
}
