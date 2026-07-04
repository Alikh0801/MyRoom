import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { ListingCard } from "@/components/listings/ListingCard";
import { SearchFilters } from "@/components/search/SearchFilters";
import type { Locale } from "@/i18n/routing";
import { getFavoritePageContext } from "@/lib/favorites/page-context";
import { getLocalizedName } from "@/lib/i18n/localized-name";
import {
  getCategories,
  getSearchListings,
} from "@/lib/queries/listings";
import { buildCanonicalAlternates, getAbsoluteUrl } from "@/lib/seo";

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    region?: string;
    category?: string;
    guests?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export const revalidate = 60;

function buildSearchPath(params: Awaited<SearchPageProps["searchParams"]>) {
  const searchParams = new URLSearchParams();
  if (params.region) searchParams.set("region", params.region);
  if (params.category) searchParams.set("category", params.category);
  if (params.guests) searchParams.set("guests", params.guests);
  if (params.minPrice) searchParams.set("minPrice", params.minPrice);
  if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice);

  const query = searchParams.toString();
  return query ? `/search?${query}` : "/search";
}

export async function generateMetadata({
  params,
  searchParams,
}: SearchPageProps) {
  const [{ locale }, queryParams, categories] = await Promise.all([
    params,
    searchParams,
    getCategories(),
  ]);
  const typedLocale = locale as Locale;
  const categorySlug =
    queryParams.category === "otel" ? "hotel" : queryParams.category;
  const activeCategory = categories.find((cat) => cat.slug === categorySlug);
  const categoryName = activeCategory
    ? getLocalizedName(activeCategory, typedLocale)
    : null;
  const title =
    typedLocale === "ru"
      ? categoryName
        ? `${categoryName} в Азербайджане`
        : "Поиск объявлений"
      : categoryName
        ? `${categoryName} elanları`
        : "Elan axtarışı";
  const description =
    typedLocale === "ru"
      ? "Ищите посуточную аренду и места для отдыха по району, категории, цене и числу гостей."
      : "Rayon, kateqoriya, qiymət və qonaq sayına görə günlük icarə və istirahət elanları axtarın.";
  const path = buildSearchPath(queryParams);

  return {
    title,
    description,
    alternates: buildCanonicalAlternates(path, typedLocale),
    openGraph: {
      title,
      description,
      url: getAbsoluteUrl(path, typedLocale),
    },
  };
}

export default async function SearchPage({
  params: routeParams,
  searchParams,
}: SearchPageProps) {
  const { locale } = await routeParams;
  const typedLocale = locale as Locale;
  setRequestLocale(locale);
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

  const [searchResult, categories, favoriteContext] = await Promise.all([
    getSearchListings(filters),
    getCategories(),
    getFavoritePageContext(),
  ]);

  const { vipListings, regularListings, total } = searchResult;
  const activeCategory = categories.find((cat) => cat.slug === categorySlug);
  const pageTitle = activeCategory
    ? typedLocale === "ru"
      ? `${getLocalizedName(activeCategory, typedLocale)}`
      : `${getLocalizedName(activeCategory, typedLocale)} elanları`
    : typedLocale === "ru"
      ? "Поиск объявлений"
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
                        <ListingCard
                          key={listing.id}
                          listing={listing}
                          vip
                          isLoggedIn={favoriteContext.isLoggedIn}
                          isFavorited={favoriteContext.favoriteIds.has(listing.id)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {regularListings.length > 0 && (
                  <section className="search-results__section">
                    <h2 className="search-results__heading">Elanlar</h2>
                    <div className="listing-grid">
                      {regularListings.map((listing) => (
                        <ListingCard
                          key={listing.id}
                          listing={listing}
                          isLoggedIn={favoriteContext.isLoggedIn}
                          isFavorited={favoriteContext.favoriteIds.has(listing.id)}
                        />
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
