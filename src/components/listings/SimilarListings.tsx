import { ListingCard } from "@/components/listings/ListingCard";
import type { ListingCardData } from "@/types/database";

interface SimilarListingsProps {
  listings: ListingCardData[];
}

export function SimilarListings({ listings }: SimilarListingsProps) {
  if (listings.length === 0) return null;

  return (
    <section className="listing-detail__similar">
      <div className="container">
        <h2 className="section__title">Oxşar elanlar</h2>
        <div className="listing-grid">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  );
}
