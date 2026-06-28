import { getTranslations, setRequestLocale } from "next-intl/server";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HeroSearch } from "@/components/home/HeroSearch";
import { ListingCard } from "@/components/listings/ListingCard";
import { Pagination } from "@/components/ui/Pagination";
import { getFavoritePageContext } from "@/lib/favorites/page-context";
import type { Locale } from "@/i18n/routing";
import {
  getCategories,
  getHomeListingsPaginated,
  getVipListings,
  HOME_LISTINGS_PAGE_SIZE,
} from "@/lib/queries/listings";

interface HomePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

export const revalidate = 60;

export default async function HomePage({ params, searchParams }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const pageParams = await searchParams;
  const requestedPage = Math.max(1, parseInt(pageParams.page ?? "1", 10) || 1);

  const [vipListings, categories, homeListings, favoriteContext] =
    await Promise.all([
      getVipListings(6),
      getCategories(),
      getHomeListingsPaginated(requestedPage, HOME_LISTINGS_PAGE_SIZE),
      getFavoritePageContext(),
    ]);

  const { listings, page, total, totalPages } = homeListings;

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1 className="hero__title">{t("heroTitle")}</h1>
          <p className="hero__subtitle">{t("heroSubtitle")}</p>
          <HeroSearch categories={categories} locale={locale as Locale} />
        </div>
      </section>

      <section className="section section--center section--categories">
        <div className="container">
          <h2 className="section__title">{t("categories")}</h2>
          <p className="section__subtitle">{t("categoriesSubtitle")}</p>
          <CategoryGrid categories={categories} locale={locale as Locale} />
        </div>
      </section>

      <section className="section section--center section--vip">
        <div className="container">
          <h2 className="section__title">{t("vipListings")}</h2>

          {vipListings.length > 0 ? (
            <div className="listing-grid listing-grid--featured">
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
          ) : (
            <div className="empty-state empty-state--compact">
              <p>{t("vipEmpty")}</p>
            </div>
          )}
        </div>
      </section>

      <section
        id="elanlar"
        className="section section--center section--listings"
      >
        <div className="container">
          <h2 className="section__title">{t("listings")}</h2>
          {total > 0 && (
            <p className="section__subtitle section__subtitle--count">
              {t("listingsCount", { total, page, totalPages })}
            </p>
          )}

          {listings.length > 0 ? (
            <>
              <div className="listing-grid">
                {listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    isLoggedIn={favoriteContext.isLoggedIn}
                    isFavorited={favoriteContext.favoriteIds.has(listing.id)}
                  />
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                hash="#elanlar"
              />
            </>
          ) : (
            <div className="empty-state">
              <h3>{t("noListingsTitle")}</h3>
              <p>{t("noListingsText")}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
