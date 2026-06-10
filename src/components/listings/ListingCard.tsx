import Image from "next/image";
import Link from "next/link";
import type { ListingCardData } from "@/types/database";

interface ListingCardProps {
  listing: ListingCardData;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link href={`/listings/${listing.id}`} className="listing-card">
      <div className="listing-card__image">
        {listing.cover_image ? (
          <Image
            src={listing.cover_image}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="listing-card__img"
          />
        ) : (
          <div className="listing-card__placeholder">Şəkil yoxdur</div>
        )}
        <span className="listing-card__badge">{listing.category.name_az}</span>
      </div>
      <div className="listing-card__body">
        <h3 className="listing-card__title">{listing.title}</h3>
        <p className="listing-card__location">
          {listing.region}, {listing.city}
        </p>
        <div className="listing-card__meta">
          <span>{listing.max_guests} qonaq</span>
          <span className="listing-card__price">
            {listing.price_per_night} {listing.currency}
            <small>/gecə</small>
          </span>
        </div>
      </div>
    </Link>
  );
}
