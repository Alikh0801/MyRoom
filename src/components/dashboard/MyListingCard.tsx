import Image from "next/image";
import Link from "next/link";
import { DeleteListingButton } from "@/components/dashboard/DeleteListingButton";
import { ListingStatusBadge } from "@/components/dashboard/ListingStatusBadge";
import { LISTING_STATUS_HINTS } from "@/lib/listings/status";
import { formatPriceSuffix } from "@/lib/price";
import type { MyListingItem } from "@/lib/queries/my-listings";

interface MyListingCardProps {
  listing: MyListingItem;
}

export function MyListingCard({ listing }: MyListingCardProps) {
  const createdAt = new Date(listing.created_at).toLocaleDateString("az-AZ", {
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
          <span className="my-listing-card__no-image">Şəkil yoxdur</span>
        )}
      </div>

      <div className="my-listing-card__body">
        <div className="my-listing-card__head">
          <h2 className="my-listing-card__title">{listing.title}</h2>
          <div className="my-listing-card__badges">
            <ListingStatusBadge status={listing.status} />
            {listing.is_vip && listing.status === "approved" && (
              <span className="my-listing-card__vip">VIP</span>
            )}
          </div>
        </div>

        <p className="my-listing-card__meta">
          {listing.category.name_az} · {listing.region}, {listing.city}
        </p>
        <p className="my-listing-card__meta">
          {listing.price_per_night} {listing.currency}
          {formatPriceSuffix(listing.price_unit)} · Yaradılıb: {createdAt}
        </p>
        <p className="my-listing-card__hint">
          {LISTING_STATUS_HINTS[listing.status]}
        </p>
      </div>

      <div className="my-listing-card__actions">
        <Link
          href={`/listings/${listing.id}`}
          className="btn btn--ghost"
        >
          {canViewPublic ? "Saytda bax" : "Önizləmə"}
        </Link>

        {listing.status === "rejected" && (
          <Link
            href="/dashboard/listings/new"
            className="btn btn--primary"
          >
            Yeni elan
          </Link>
        )}

        <DeleteListingButton
          listingId={listing.id}
          listingTitle={listing.title}
        />
      </div>
    </article>
  );
}
