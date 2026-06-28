import { getTranslations } from "next-intl/server";
import { ListingCard } from "@/components/listings/ListingCard";
import type { ListingCardData } from "@/types/database";

interface SimilarListingsProps {
  listings: ListingCardData[];
  isLoggedIn?: boolean;
  favoriteIds?: Set<string>;
}

export async function SimilarListings({
  listings,
  isLoggedIn = false,
  favoriteIds = new Set(),
}: SimilarListingsProps) {
  if (listings.length === 0) return null;

  const t = await getTranslations("listing");

  return (
    <section className="listing-detail__similar">
      <div className="container">
        <h2 className="section__title">{t("similar")}</h2>
        <div className="listing-grid">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isLoggedIn={isLoggedIn}
              isFavorited={favoriteIds.has(listing.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
