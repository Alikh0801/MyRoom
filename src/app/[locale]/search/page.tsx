import { Suspense } from "react";
import { ListingCard } from "@/components/listings/ListingCard";
import { SearchFilters } from "@/components/search/SearchFilters";
import {
  getCategories,
  getSearchListings,
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

export const revalidate = 60;

export const metadata = {
  title: "Elan axtarışı",
  description: "Rayon, kateqoriya və qiymətə görə istirahət elanları axtarın.",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const categorySlug =
    params.category === "otel" ? "hotel" : params.category;
  const filters = {
    region: params.region,
    category: categorySlug,
    guests: params.guests ? Number(params.guests) : undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
  };

  const [searchResult, categories] = await Promise.all([
    getSearchListings(filters),
    getCategories(),
  ]);

  const { vipListings, regularListings, total } = searchResult;
  const activeCategory = categories.find((cat) => cat.slug === categorySlug);
  const pageTitle = activeCategory
    ? `${activeCategory.name_az} elanları`
    : "Elan axtarışı";

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-page__layout">
          <Suspense fallback={<div>Yüklənir...</div>}>
            <SearchFilters categories={categories} />
          </Suspense>

          <div className="search-results">
            <h1 className="section__title">{pageTitle}</h1>
            <p className="section__subtitle search-results__count">
              {total} nəticə tapıldı
            </p>

            {total > 0 ? (
              <>
                {vipListings.length > 0 && (
                  <section className="search-results__section">
                    <h2 className="search-results__heading">Premium elanlar</h2>
                    <div className="listing-grid">
                      {vipListings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} vip />
                      ))}
                    </div>
                  </section>
                )}

                {regularListings.length > 0 && (
                  <section className="search-results__section">
                    <h2 className="search-results__heading">Elanlar</h2>
                    <div className="listing-grid">
                      {regularListings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            ) : (
              <div className="empty-state">
                <h3>Elan tapılmadı</h3>
                <p>Filtrləri dəyişib yenidən cəhd edin.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
