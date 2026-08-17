import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { WhatsAppButton } from "@/components/listings/WhatsAppButton";
import type { Locale } from "@/i18n/routing";
import { formatPriceSuffix } from "@/lib/price";
import { buildDirectionsUrl } from "@/lib/map";
import type { PriceUnit } from "@/types/database";

interface ListingContactCardProps {
  locale: Locale;
  ownerId: string;
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
  bathrooms: number;
  roomTypeName?: string | null;
  roomTypeFloor?: number | null;
}

function formatAddress(region: string, city: string, address: string | null) {
  const parts = [region, city, address].filter(Boolean);
  return parts.join(", ");
}

export async function ListingContactCard({
  locale,
  ownerId,
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
  bathrooms,
  roomTypeName,
  roomTypeFloor,
}: ListingContactCardProps) {
  const t = await getTranslations("listing");
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
          {formatPriceSuffix(priceUnit, locale)}
        </span>
      </p>

      <dl className="listing-detail__facts">
        <div className="listing-detail__fact">
          <dt>{t("establishmentName")}</dt>
          <dd>{listingTitle}</dd>
        </div>

        {roomTypeName && (
          <div className="listing-detail__fact">
            <dt>{t("roomType")}</dt>
            <dd>
              {roomTypeName}
              {roomTypeFloor != null && (
                <span className="listing-detail__fact-note">
                  {" "}
                  · {t("floor", { floor: roomTypeFloor })}
                </span>
              )}
            </dd>
          </div>
        )}

        <div className="listing-detail__fact">
          <dt>{t("address")}</dt>
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
                  {t("directions")}
                </a>
              </>
            )}
          </dd>
        </div>

        <div className="listing-detail__fact">
          <dt>{t("guest")}</dt>
          <dd className="listing-detail__fact-value">
            <svg
              className="listing-detail__fact-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 21v2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {t("guestCount", { count: maxGuests })}
          </dd>
        </div>

        <div className="listing-detail__fact">
          <dt>{t("bedroom")}</dt>
          <dd className="listing-detail__fact-value">
            <svg
              className="listing-detail__fact-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 17v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4" />
              <path d="M2 17v2" />
              <path d="M22 17v2" />
              <path d="M6 11V8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3" />
              <path d="M2 17h20" />
            </svg>
            {bedrooms}
          </dd>
        </div>

        <div className="listing-detail__fact">
          <dt>{t("bathroom")}</dt>
          <dd className="listing-detail__fact-value">
            <svg
              className="listing-detail__fact-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="7" rx="3.5" />
              <path d="M6 11V6a2 2 0 0 1 2-2h1" />
              <path d="M8 20v1" />
              <path d="M16 20v1" />
            </svg>
            {bathrooms}
          </dd>
        </div>
      </dl>

      <div className="listing-detail__owner">
        <h2 className="listing-detail__owner-title">{t("ownerTitle")}</h2>
        <Link
          href={`/owners/${ownerId}`}
          className="listing-detail__owner-name"
          title={t("viewOwnerProfile")}
        >
          {ownerName ?? t("ownerFallback")}
        </Link>
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
            {t("call")}
          </a>
        )}
      </div>
    </aside>
  );
}
