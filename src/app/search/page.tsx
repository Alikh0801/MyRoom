import { Suspense } from "react";
import { ListingCard } from "@/components/listings/ListingCard";
import { SearchFilters } from "@/components/search/SearchFilters";
import {
  getApprovedListings,
  getCategories,
} from "@/lib/queries/listings";

interface SearchPageProps {
  searchParams: Promise<{
    region?: string;
    category?: string;
    guests?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export const metadata = {
  title: "Elan axtarışı",
  description: "Rayon, kateqoriya və qiymətə görə istirahət elanları axtarın.",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const [listings, categories] = await Promise.all([
    getApprovedListings({
      region: params.region,
      category: params.category,
      guests: params.guests ? Number(params.guests) : undefined,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    }),
    getCategories(),
  ]);

  return (
    <div className="container search-layout">
      <Suspense fallback={<div>Yüklənir...</div>}>
        <SearchFilters categories={categories} />
      </Suspense>

      <div>
        <h1 className="section__title">Elanlar</h1>
        <p className="section__subtitle">
          {listings.length} nəticə tapıldı
        </p>

        {listings.length > 0 ? (
          <div className="listing-grid">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Elan tapılmadı</h3>
            <p>Filtrləri dəyişib yenidən cəhd edin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
