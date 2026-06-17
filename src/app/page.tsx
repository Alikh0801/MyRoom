import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HeroSearch } from "@/components/home/HeroSearch";
import { ListingCard } from "@/components/listings/ListingCard";
import { Pagination } from "@/components/ui/Pagination";
import {
  getCategories,
  getHomeListingsPaginated,
  getVipListings,
  HOME_LISTINGS_PAGE_SIZE,
} from "@/lib/queries/listings";

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const requestedPage = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const [vipListings, categories, homeListings] = await Promise.all([
    getVipListings(6),
    getCategories(),
    getHomeListingsPaginated(requestedPage, HOME_LISTINGS_PAGE_SIZE),
  ]);

  const { listings, page, total, totalPages } = homeListings;

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1 className="hero__title">
            Azərbaycanda istirahət üçün ideal yerinizi tapın
          </h1>
          <p className="hero__subtitle">
            Otel, hostel, A-frame (Glamping) və rayon evləri — qısamüddətli günlük icarə
            elanları bir yerdə.
          </p>
          <HeroSearch />
        </div>
      </section>

      <section className="section section--center section--categories">
        <div className="container">
          <h2 className="section__title">Kateqoriyalar</h2>
          <p className="section__subtitle">Nə axtarırsınız?</p>
          <CategoryGrid categories={categories} />
        </div>
      </section>

      <section className="section section--center section--vip">
        <div className="container">
          <h2 className="section__title">Premium elanlar</h2>

          {vipListings.length > 0 ? (
            <div className="listing-grid listing-grid--featured">
              {vipListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} vip />
              ))}
            </div>
          ) : (
            <div className="empty-state empty-state--compact">
              <p>Tezliklə VIP elanlar burada görünəcək.</p>
            </div>
          )}
        </div>
      </section>

      <section
        id="elanlar"
        className="section section--center section--listings"
      >
        <div className="container">
          <h2 className="section__title">Elanlar</h2>
          {total > 0 && (
            <p className="section__subtitle section__subtitle--count">
              {total} elan · Səhifə {page} / {totalPages}
            </p>
          )}

          {listings.length > 0 ? (
            <>
              <div className="listing-grid">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
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
              <h3>Hələ elan yoxdur</h3>
              <p>Tezliklə yeni elanlar əlavə olunacaq.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
