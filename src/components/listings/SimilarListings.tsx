import { getTranslations } from "next-intl/server";
import { ListingCard } from "@/components/listings/ListingCard";
import { Pagination } from "@/components/ui/Pagination";
import type { ListingCardData } from "@/types/database";

const SIMILAR_LISTINGS_HASH = "#oxsar-elanlar";

interface SimilarListingsProps {
  listings: ListingCardData[];
  page?: number;
  totalPages?: number;
  basePath?: string;
  isLoggedIn?: boolean;
  favoriteIds?: Set<string>;
}

export async function SimilarListings({
  listings,
  page = 1,
  totalPages = 1,
  basePath = "/",
  isLoggedIn = false,
  favoriteIds = new Set(),
}: SimilarListingsProps) {
  if (listings.length === 0) return null;

  const t = await getTranslations("listing");

  return (
    <section
      className="listing-detail__similar"
      id={SIMILAR_LISTINGS_HASH.slice(1)}
    >
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
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath={basePath}
          hash={SIMILAR_LISTINGS_HASH}
        />
      </div>
    </section>
  );
}
