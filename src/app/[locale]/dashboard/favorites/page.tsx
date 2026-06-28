import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ListingCard } from "@/components/listings/ListingCard";
import { getFavoritePageContext } from "@/lib/favorites/page-context";
import { getFavoriteListings } from "@/lib/queries/favorites";
import { createClient } from "@/lib/supabase/server";

interface FavoritesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: FavoritesPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "favorites" });

  return {
    title: t("metaTitle"),
  };
}

export default async function FavoritesPage({ params }: FavoritesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("favorites");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirectTo=/dashboard/favorites");

  const [listings, favoriteContext] = await Promise.all([
    getFavoriteListings(user.id),
    getFavoritePageContext(),
  ]);

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard__header-row">
          <div>
            <h1 className="section__title">{t("pageTitle")}</h1>
            <p className="section__subtitle dashboard__subtitle">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {listings.length > 0 ? (
          <div className="listing-grid favorites-page__grid">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isLoggedIn={favoriteContext.isLoggedIn}
                isFavorited={favoriteContext.favoriteIds.has(listing.id)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>{t("empty.title")}</h3>
            <p>{t("empty.desc")}</p>
            <Link
              href="/search"
              className="btn btn--primary"
              style={{ marginTop: "1rem" }}
            >
              {t("empty.browseCta")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
