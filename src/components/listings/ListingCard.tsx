"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useLinkStatus } from "next/link";
import { formatListingCardDate } from "@/lib/date";
import { getLocalizedListingTitle } from "@/lib/i18n/localized-listing";
import { getLocalizedName } from "@/lib/i18n/localized-name";
import { formatPriceSuffix } from "@/lib/price";
import { LISTING_CARD_IMAGE_QUALITY } from "@/lib/images/listing-images";
import type { Locale } from "@/i18n/routing";
import type { ListingCardData } from "@/types/database";

interface ListingCardProps {
  listing: ListingCardData;
  vip?: boolean;
}

function ListingCardContent({ listing, vip = false }: ListingCardProps) {
  const t = useTranslations("listing");
  const locale = useLocale() as Locale;
  const { pending } = useLinkStatus();

  return (
    <article
      className={`listing-card${pending ? " listing-card--pending" : ""}`}
      aria-busy={pending}
    >
      <div className="listing-card__image">
        {listing.cover_image ? (
          <Image
            src={listing.cover_image}
            alt={getLocalizedListingTitle(listing, locale)}
            fill
            quality={LISTING_CARD_IMAGE_QUALITY}
            sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
            className="listing-card__img"
          />
        ) : (
          <div className="listing-card__placeholder">{t("noPhoto")}</div>
        )}
        {vip && <span className="listing-card__vip">{t("vip")}</span>}
        <span className="listing-card__badge">
          {getLocalizedName(listing.category, locale)}
        </span>
      </div>
      <time className="listing-card__date" dateTime={listing.created_at}>
        {formatListingCardDate(listing.created_at)}
      </time>
      <div className="listing-card__body">
        <h3 className="listing-card__title">
          {getLocalizedListingTitle(listing, locale)}
        </h3>
        <p className="listing-card__location">
          {listing.region}, {listing.city}
        </p>
        <div className="listing-card__meta">
          <span
            className="listing-card__guests"
            aria-label={t("guests", { count: listing.max_guests })}
          >
            {listing.max_guests}
            <svg
              className="listing-card__guest-icon"
              width="14"
              height="14"
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
          </span>
          <span className="listing-card__price">
            {listing.price_per_night} {listing.currency}
            <small>{formatPriceSuffix(listing.price_unit ?? "day", locale)}</small>
          </span>
        </div>
      </div>
    </article>
  );
}

export function ListingCard({ listing, vip = false }: ListingCardProps) {
  return (
    <Link href={`/listings/${listing.id}`} className="listing-card-link">
      <ListingCardContent listing={listing} vip={vip} />
    </Link>
  );
}
