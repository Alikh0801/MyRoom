import Link from "next/link";
import { HeroSearch } from "@/components/home/HeroSearch";
import { ListingCard } from "@/components/listings/ListingCard";
import { getApprovedListings, getCategories } from "@/lib/queries/listings";

export default async function HomePage() {
  const [listings, categories] = await Promise.all([
    getApprovedListings(),
    getCategories(),
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

      <section className="section">
        <div className="container">
          <h2 className="section__title">Kateqoriyalar</h2>
          <p className="section__subtitle">Nə axtarırsınız?</p>
          <div className="categories">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/search?category=${cat.slug}`}
                className="category-pill"
              >
                {cat.name_az}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section__title">Populyar elanlar</h2>
          <p className="section__subtitle">
            Azərbaycanın ən gözəl guşələrində istirahət
          </p>

          {listings.length > 0 ? (
            <div className="listing-grid">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
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
