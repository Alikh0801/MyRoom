"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useLinkStatus } from "next/link";
import { FavoriteButton } from "@/components/listings/FavoriteButton";
import { formatListingCardDate } from "@/lib/date";
import { formatListingNumber } from "@/lib/listings/listing-number";
import { getLocalizedListingTitle } from "@/lib/i18n/localized-listing";
import { getLocalizedName } from "@/lib/i18n/localized-name";
import { formatPriceSuffix } from "@/lib/price";
import { LISTING_CARD_IMAGE_QUALITY } from "@/lib/images/listing-images";
import type { Locale } from "@/i18n/routing";
import type { ListingCardData } from "@/types/database";

interface ListingCardProps {
  listing: ListingCardData;
  vip?: boolean;
  isFavorited?: boolean;
  isLoggedIn?: boolean;
}

function ListingCardContent({
  listing,
  vip = false,
  isFavorited = false,
  isLoggedIn = false,
}: ListingCardProps) {
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
            src={listing.cover_image_thumb ?? listing.cover_image}
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
      <div className="listing-card__meta-row">
        <div className="listing-card__meta-left">
          <div className="listing-card__date-row">
            <time className="listing-card__date" dateTime={listing.created_at}>
              {formatListingCardDate(listing.created_at)}
            </time>
            <span className="listing-card__id">
              {formatListingNumber(listing.listing_number)}
            </span>
          </div>
          <span
            className="listing-card__views"
            aria-label={t("views", { count: listing.view_count })}
          >
            <svg
              className="listing-card__views-icon"
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
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {listing.view_count}
          </span>
        </div>
        <FavoriteButton
          listingId={listing.id}
          initialFavorited={isFavorited}
          isLoggedIn={isLoggedIn}
          variant="card"
          className="listing-card__favorite"
        />
      </div>
      <div className="listing-card__body">
        <h3 className="listing-card__title">
          {getLocalizedListingTitle(listing, locale)}
        </h3>
        <p className="listing-card__location">
          {listing.region}, {listing.city}
        </p>
        <div className="listing-card__meta">
          <div className="listing-card__facts">
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
            <span
              className="listing-card__bedrooms"
              aria-label={t("bedrooms", { count: listing.bedrooms })}
            >
              {listing.bedrooms}
              <svg
                className="listing-card__bedroom-icon"
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
                <path d="M2 17v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4" />
                <path d="M2 17v2" />
                <path d="M22 17v2" />
                <path d="M6 11V8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3" />
                <path d="M2 17h20" />
              </svg>
            </span>
            <span
              className="listing-card__bathrooms"
              aria-label={t("bathrooms", { count: listing.bathrooms })}
            >
              {listing.bathrooms}
              <svg
                className="listing-card__bathroom-icon"
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
                <rect x="3" y="11" width="18" height="7" rx="3.5" />
                <path d="M6 11V6a2 2 0 0 1 2-2h1" />
                <path d="M8 20v1" />
                <path d="M16 20v1" />
              </svg>
            </span>
          </div>
          <span className="listing-card__price">
            {listing.price_per_night} {listing.currency}
            <small>{formatPriceSuffix(listing.price_unit ?? "day", locale)}</small>
          </span>
        </div>
      </div>
    </article>
  );
}

export function ListingCard({
  listing,
  vip = false,
  isFavorited = false,
  isLoggedIn = false,
}: ListingCardProps) {
  return (
    <Link href={`/listings/${listing.id}`} className="listing-card-link">
      <ListingCardContent
        listing={listing}
        vip={vip}
        isFavorited={isFavorited}
        isLoggedIn={isLoggedIn}
      />
    </Link>
  );
}
