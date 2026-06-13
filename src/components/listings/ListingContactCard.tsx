import { WhatsAppButton } from "@/components/listings/WhatsAppButton";
import { formatPriceSuffix } from "@/lib/price";
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
  maxGuests,
  bedrooms,
  roomTypeName,
  roomTypeFloor,
}: ListingContactCardProps) {
  const displayPhone = whatsappPhone || phone;

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
          <dd>{formatAddress(region, city, address)}</dd>
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
        {displayPhone && (
          <p className="listing-detail__owner-phone">{displayPhone}</p>
        )}
      </div>

      <WhatsAppButton phone={whatsappPhone} listingTitle={listingTitle} />
    </aside>
  );
}
