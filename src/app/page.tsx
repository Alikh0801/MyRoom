import Link from "next/link";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HeroSearch } from "@/components/home/HeroSearch";
import { ListingCard } from "@/components/listings/ListingCard";
import {
  getCategories,
  getHomeListings,
  getVipListings,
} from "@/lib/queries/listings";

export default async function HomePage() {
  const [vipListings, categories, listings] = await Promise.all([
    getVipListings(6),
    getCategories(),
    getHomeListings(12),
  ]);

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1 className="hero__title">
            Azərbaycanda istirahət üçün ideal yerinizi tapın
          </h1>
          <p className="hero__subtitle">
            Otel, hostel, A-frame və rayon evləri — qısamüddətli günlük icarə
            elanları bir yerdə.
          </p>
          <HeroSearch />
        </div>
      </section>

      <section className="section section--center section--vip">
        <div className="container">
          <h2 className="section__title">Populyar elanlar</h2>

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

      <section className="section section--center section--categories">
        <div className="container">
          <h2 className="section__title">Kateqoriyalar</h2>
          <p className="section__subtitle">Nə axtarırsınız?</p>
          <CategoryGrid categories={categories} />
        </div>
      </section>

      <section className="section section--center section--listings">
        <div className="container">
          <h2 className="section__title">Elanlar</h2>

          {listings.length > 0 ? (
            <>
              <div className="listing-grid">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
              <Link href="/search" className="section__link">
                Bütün elanlara bax →
              </Link>
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
