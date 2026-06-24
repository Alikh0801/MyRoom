import { WhatsAppButton } from "@/components/listings/WhatsAppButton";
import { formatPriceSuffix } from "@/lib/price";
import { buildDirectionsUrl } from "@/lib/map";
import type { PriceUnit } from "@/types/database";

interface ListingContactCardProps {
  ownerName: string | null;
  phone: string | null;
  whatsappPhone: string;
  listingTitle: string;
  pricePerNight: number;
  priceUnit: PriceUnit;
  currency: string;
  region: string;
  city: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  maxGuests: number;
  bedrooms: number;
  roomTypeName?: string | null;
  roomTypeFloor?: number | null;
}

function formatAddress(region: string, city: string, address: string | null) {
  const parts = [region, city, address].filter(Boolean);
  return parts.join(", ");
}

export function ListingContactCard({
  ownerName,
  phone,
  whatsappPhone,
  listingTitle,
  pricePerNight,
  priceUnit,
  currency,
  region,
  city,
  address,
  lat,
  lng,
  maxGuests,
  bedrooms,
  roomTypeName,
  roomTypeFloor,
}: ListingContactCardProps) {
  const callPhone = phone ?? whatsappPhone;
  const callHref = callPhone
    ? `tel:${callPhone.replace(/[\s()-]/g, "")}`
    : null;
  const directionsUrl =
    lat != null && lng != null ? buildDirectionsUrl(lat, lng) : null;

  return (
    <aside className="listing-detail__contact">
      <p className="listing-detail__price">
        {pricePerNight} {currency}
        <span className="listing-detail__price-unit">
          {formatPriceSuffix(priceUnit)}
        </span>
      </p>

      <dl className="listing-detail__facts">
        <div className="listing-detail__fact">
          <dt>Müəssisə adı</dt>
          <dd>{listingTitle}</dd>
        </div>

        {roomTypeName && (
          <div className="listing-detail__fact">
            <dt>Otaq tipi</dt>
            <dd>
              {roomTypeName}
              {roomTypeFloor != null && (
                <span className="listing-detail__fact-note">
                  {" "}
                  · {roomTypeFloor}. mərtəbə
                </span>
              )}
            </dd>
          </div>
        )}

        <div className="listing-detail__fact">
          <dt>Ünvan</dt>
          <dd>
            {formatAddress(region, city, address)}
            {directionsUrl && (
              <>
                {" "}
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="listing-detail__directions"
                >
                  Yol tap
                </a>
              </>
            )}
          </dd>
        </div>

        <div className="listing-detail__fact">
          <dt>Qonaq</dt>
          <dd>{maxGuests} nəfər</dd>
        </div>

        <div className="listing-detail__fact">
          <dt>Yataq otağı</dt>
          <dd>{bedrooms}</dd>
        </div>
      </dl>

      <div className="listing-detail__owner">
        <h2 className="listing-detail__owner-title">Elan sahibi</h2>
        <p className="listing-detail__owner-name">
          {ownerName ?? "Mülk sahibi"}
        </p>
      </div>

      <div className="listing-detail__contact-actions">
        {whatsappPhone && (
          <WhatsAppButton phone={whatsappPhone} listingTitle={listingTitle} />
        )}
        {callHref && (
          <a href={callHref} className="btn btn--call">
            <svg
              className="btn__icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Zəng et
          </a>
        )}
      </div>
    </aside>
  );
}
