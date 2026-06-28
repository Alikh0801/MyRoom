"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DeleteListingButton } from "@/components/dashboard/DeleteListingButton";
import { ListingStatusBadge } from "@/components/dashboard/ListingStatusBadge";
import { getLocalizedName } from "@/lib/i18n/localized-name";
import { formatPriceSuffix } from "@/lib/price";
import type { Locale } from "@/i18n/routing";
import type { MyListingItem } from "@/lib/queries/my-listings";

interface MyListingCardProps {
  listing: MyListingItem;
}

export function MyListingCard({ listing }: MyListingCardProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale() as Locale;
  const dateLocale = locale === "ru" ? "ru-RU" : "az-AZ";

  const createdAt = new Date(listing.created_at).toLocaleDateString(dateLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const canViewPublic = listing.status === "approved";

  return (
    <article className="my-listing-card">
      <div className="my-listing-card__image">
        {listing.cover_image ? (
          <Image
            src={listing.cover_image}
            alt={listing.title}
            fill
            sizes="160px"
            className="my-listing-card__img"
          />
        ) : (
          <span className="my-listing-card__no-image">{t("card.noImage")}</span>
        )}
      </div>

      <div className="my-listing-card__body">
        <div className="my-listing-card__head">
          <h2 className="my-listing-card__title">{listing.title}</h2>
          <div className="my-listing-card__badges">
            <ListingStatusBadge status={listing.status} />
            {listing.is_vip && listing.status === "approved" && (
              <span className="my-listing-card__vip">{t("card.vip")}</span>
            )}
          </div>
        </div>

        <p className="my-listing-card__meta">
          {getLocalizedName(listing.category, locale)} · {listing.region},{" "}
          {listing.city}
        </p>
        <p className="my-listing-card__meta">
          {listing.price_per_night} {listing.currency}
          {formatPriceSuffix(listing.price_unit, locale)} ·{" "}
          {t("card.createdAt", { date: createdAt })}
        </p>
        <p className="my-listing-card__hint">
          {t(`statusHints.${listing.status}`)}
        </p>
        {listing.status === "rejected" && listing.rejection_reason && (
          <p className="my-listing-card__rejection">
            <strong>{t("card.rejectionReason")}:</strong>{" "}
            {listing.rejection_reason}
          </p>
        )}
      </div>

      <div className="my-listing-card__actions">
        <Link
          href={`/dashboard/listings/${listing.id}/edit`}
          className="btn btn--primary"
        >
          {t("card.edit")}
        </Link>

        <Link
          href={`/listings/${listing.id}`}
          className="btn btn--ghost"
        >
          {canViewPublic ? t("card.viewPublic") : t("card.preview")}
        </Link>

        <DeleteListingButton
          listingId={listing.id}
          listingTitle={listing.title}
        />
      </div>
    </article>
  );
}
