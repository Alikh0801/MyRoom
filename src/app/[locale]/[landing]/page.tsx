import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ListingCard } from "@/components/listings/ListingCard";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getFavoritePageContext } from "@/lib/favorites/page-context";
import { getSearchListings } from "@/lib/queries/listings";
import { buildCanonicalAlternates, getAbsoluteUrl } from "@/lib/seo";
import {
  CATEGORY_LANDINGS,
  getLandingByPath,
  landingHref,
} from "@/lib/seo/category-landings";
import {
  buildBreadcrumbJsonLd,
  jsonLdScriptProps,
} from "@/lib/seo/structured-data";
import "@/app/landing-page.css";

/**
 * Kateqoriya açılış səhifələri: /a-frame-evleri, /rayon-evleri və s.
 *
 * Bu, locale kökündə dinamik seqmentdir, amma yalnız CATEGORY_LANDINGS-dəki
 * ünvanları qəbul edir — başqa hər tək seqmentli ünvan əvvəlki kimi 404
 * verir. Statik marşrutlar (/about, /blog, /search…) Next.js-də dinamik
 * seqmentdən üstün olduğu üçün onlarla toqquşmur.
 *
 * notFound() həm metadata-da, həm də səhifədə açıq çağırılır. Yalnız
 * dynamicParams = false-a güvənmək olmur: səhifə sevimlilər üçün cookie
 * oxuduğundan dinamik render olunur və o halda naməlum ünvan səhifəyə
 * çatırdı (yoxlanılıb: 500 qaytarırdı). Metadata-dakı çağırış statusun
 * cavab axına başlamazdan əvvəl 404 olmasını təmin edir.
 *
 * Qəsdən (with-skeleton) qrupundan kənardadır: oradakı loading.tsx cavabı
 * 200 ilə axına başladır və naməlum ünvanın 404 statusu itərdi.
 */

type LandingPageProps = {
  params: Promise<{ locale: string; landing: string }>;
};

export const dynamicParams = false;
export const revalidate = 60;

export function generateStaticParams() {
  return CATEGORY_LANDINGS.map((landing) => ({ landing: landing.path }));
}

export async function generateMetadata({ params }: LandingPageProps) {
  const { locale, landing: landingPath } = await params;
  const landing = getLandingByPath(landingPath);
  if (!landing) notFound();

  const typedLocale = locale as Locale;
  const copy = landing.copy[typedLocale];
  const path = landingHref(landing);

  return {
    title: copy.title,
    description: copy.metaDescription,
    alternates: buildCanonicalAlternates(path, typedLocale),
    openGraph: {
      title: copy.title,
      description: copy.metaDescription,
      url: getAbsoluteUrl(path, typedLocale),
    },
  };
}

export default async function CategoryLandingPage({ params }: LandingPageProps) {
  const { locale, landing: landingPath } = await params;
  setRequestLocale(locale);

  const typedLocale = locale as Locale;
  const landing = getLandingByPath(landingPath);
  if (!landing) notFound();
  const copy = landing.copy[typedLocale];

  const [t, tSearch, searchResult, favoriteContext] = await Promise.all([
    getTranslations("landing"),
    getTranslations("search"),
    getSearchListings({ category: landing.categorySlug }),
    getFavoritePageContext(),
  ]);

  const { vipListings, regularListings, total } = searchResult;
  const otherLandings = CATEGORY_LANDINGS.filter((l) => l !== landing);

  const breadcrumb = buildBreadcrumbJsonLd(
    [
      { name: t("home"), path: "/" },
      { name: copy.label, path: landingHref(landing) },
    ],
    typedLocale
  );

  const renderCard = (
    listing: (typeof regularListings)[number],
    vip = false
  ) => (
    <ListingCard
      key={listing.id}
      listing={listing}
      vip={vip}
      isLoggedIn={favoriteContext.isLoggedIn}
      isFavorited={favoriteContext.favoriteIds.has(listing.id)}
    />
  );

  return (
    <div className="landing-page">
      <script {...jsonLdScriptProps(breadcrumb)} type="application/ld+json" />

      <div className="container">
        <nav className="landing-page__breadcrumb" aria-label={t("breadcrumb")}>
          <Link href="/">{t("home")}</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{copy.label}</span>
        </nav>

        <header className="landing-page__header">
          <h1 className="landing-page__title">{copy.h1}</h1>
          <p className="landing-page__intro">{copy.intro}</p>
          <div className="landing-page__meta">
            <span className="landing-page__count">
              {t("count", { total })}
            </span>
            <Link
              href={`/search?category=${landing.categorySlug}`}
              className="landing-page__filter-link"
            >
              {t("filterLink")}
            </Link>
          </div>
        </header>

        {total > 0 ? (
          <>
            {vipListings.length > 0 && (
              <section className="search-results__section">
                <h2 className="search-results__heading">
                  {tSearch("vipHeading")}
                </h2>
                <div className="listing-grid">
                  {vipListings.map((listing) => renderCard(listing, true))}
                </div>
              </section>
            )}

            {regularListings.length > 0 && (
              <section className="search-results__section">
                <h2 className="search-results__heading">
                  {tSearch("listingsHeading")}
                </h2>
                <div className="listing-grid">
                  {regularListings.map((listing) => renderCard(listing))}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="empty-state">
            <h3>{t("emptyTitle")}</h3>
            <p>{t("emptyText")}</p>
          </div>
        )}

        <div className="landing-page__content">
          {copy.sections.map((section) => (
            <section key={section.heading} className="landing-card">
              <h2 className="landing-card__title">{section.heading}</h2>
              <p className="landing-card__text">{section.text}</p>
            </section>
          ))}
        </div>

        <section className="landing-faq">
          <h2 className="landing-faq__title">{t("faqTitle")}</h2>
          <dl className="landing-faq__list">
            {copy.faq.map((item) => (
              <div key={item.q} className="landing-faq__item">
                <dt className="landing-faq__q">{item.q}</dt>
                <dd className="landing-faq__a">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <nav className="landing-related" aria-label={t("otherCategories")}>
          <h2 className="landing-related__title">{t("otherCategories")}</h2>
          <ul className="landing-related__list">
            {otherLandings.map((other) => (
              <li key={other.path}>
                <Link href={landingHref(other)} className="landing-related__link">
                  {other.copy[typedLocale].label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
