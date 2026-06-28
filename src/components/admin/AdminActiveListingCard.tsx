import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { DeleteListingForm } from "@/components/admin/DeleteListingForm";
import { formatPriceSuffix } from "@/lib/price";
import type { AdminListingItem } from "@/lib/queries/admin";

interface AdminActiveListingCardProps {
  listing: AdminListingItem;
}

export function AdminActiveListingCard({ listing }: AdminActiveListingCardProps) {
  const date = new Date(listing.created_at).toLocaleDateString("az-AZ", {
    day: "numeric",
    month: "short",
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
        {listing.is_vip && <span className="admin-card__vip-badge">VIP</span>}
      </div>

      <div className="admin-card__body">
        <h3 className="admin-card__title">{listing.title}</h3>
        <p className="admin-card__meta">
          {listing.category?.name_az} · {listing.region}, {listing.city}
        </p>
        <p className="admin-card__meta">
          {listing.price_per_night} {listing.currency}
          {formatPriceSuffix(listing.price_unit)} · {listing.max_guests} qonaq
        </p>
        <p className="admin-card__meta">
          Sahib: {listing.owner?.full_name ?? "—"}
        </p>
        <p className="admin-card__date">Təsdiqlənib: {date}</p>
      </div>

      <div className="admin-card__actions">
        <Link href={`/listings/${listing.id}`} className="btn btn--primary">
          Saytda bax
        </Link>

        <DeleteListingForm listingId={listing.id} />
      </div>
    </article>
  );
}
