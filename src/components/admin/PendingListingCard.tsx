import Image from "next/image";
import Link from "next/link";
import { approveListing, rejectListing } from "@/lib/admin/actions";
import type { PendingListing } from "@/lib/queries/admin";

interface PendingListingCardProps {
  listing: PendingListing;
}

export function PendingListingCard({ listing }: PendingListingCardProps) {
  const date = new Date(listing.created_at).toLocaleDateString("az-AZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="admin-card">
      <div className="admin-card__image">
        {listing.cover_image ? (
          <Image
            src={listing.cover_image}
            alt={listing.title}
            fill
            sizes="200px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span className="admin-card__no-image">Şəkil yoxdur</span>
        )}
      </div>

      <div className="admin-card__body">
        <h3 className="admin-card__title">{listing.title}</h3>
        <p className="admin-card__meta">
          {listing.category?.name_az} · {listing.region}, {listing.city}
        </p>
        <p className="admin-card__meta">
          {listing.price_per_night} {listing.currency}/gecə · {listing.max_guests}{" "}
          qonaq
        </p>
        <p className="admin-card__meta">
          Sahib: {listing.owner?.full_name ?? "—"} · {listing.whatsapp_phone}
        </p>
        <p className="admin-card__date">Göndərildi: {date}</p>
      </div>

      <div className="admin-card__actions">
        <form action={approveListing} className="admin-card__approve-form">
          <input type="hidden" name="listingId" value={listing.id} />
          <label className="admin-card__vip-check">
            <input type="checkbox" name="markVip" />
            VIP et
          </label>
          <button type="submit" className="btn btn--primary">
            Təsdiq et
          </button>
        </form>

        <form action={rejectListing}>
          <input type="hidden" name="listingId" value={listing.id} />
          <button type="submit" className="btn btn--ghost admin-card__reject">
            Rədd et
          </button>
        </form>

        <Link href={`/listings/${listing.id}`} className="admin-card__preview">
          Önizləmə →
        </Link>
      </div>
    </article>
  );
}
