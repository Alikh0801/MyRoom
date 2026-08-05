import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ListingDetailView } from "@/components/listings/ListingDetailView";
import type { Locale } from "@/i18n/routing";
import {
  getLocalizedListingDescription,
  getLocalizedListingTitle,
} from "@/lib/i18n/localized-listing";
import { getFavoritePageContext } from "@/lib/favorites/page-context";
import {
  getListingById,
  getSimilarListings,
  SIMILAR_LISTINGS_PAGE_SIZE,
} from "@/lib/queries/listings";
import {
  buildCanonicalAlternates,
  getAbsoluteUrl,
  getLocalizedPath,
  SITE_NAME,
} from "@/lib/seo";
import {
  buildBreadcrumbJsonLd,
  buildLodgingBusinessJsonLd,
  jsonLdScriptProps,
} from "@/lib/seo/structured-data";

interface ListingPageProps {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: ListingPageProps) {
  const { id, locale } = await params;
  const listing = await getListingById(id);
  const t = await getTranslations({ locale, namespace: "listing" });
  if (!listing) return { title: t("notFound") };

  const pageTitle = getLocalizedListingTitle(listing, locale);
  const pageDescription = getLocalizedListingDescription(listing, locale);
  const description = pageDescription.slice(0, 160);
  const path = `/listings/${id}`;
  const coverImage = listing.listing_images[0]?.url;

  return {
    title: pageTitle,
    description,
    alternates: buildCanonicalAlternates(path, locale as Locale),
    openGraph: {
      title: pageTitle,
      description,
      url: getAbsoluteUrl(path, locale as Locale),
      type: "article",
      locale: locale === "ru" ? "ru_RU" : "az_AZ",
      images: coverImage
        ? [
            {
              url: coverImage,
              alt: pageTitle,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: coverImage ? [coverImage] : [],
    },
  };
}

export default async function ListingPage({
  params,
  searchParams,
}: ListingPageProps) {
  const { id, locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const [listing, favoriteContext, t, { page: pageParam }] = await Promise.all([
    getListingById(id),
    getFavoritePageContext(),
    getTranslations({ locale, namespace: "home" }),
    searchParams,
  ]);

  if (!listing) notFound();

  const similarPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const similarResult = await getSimilarListings(
    listing.id,
    listing.category_id,
    listing.region,
    similarPage,
    SIMILAR_LISTINGS_PAGE_SIZE
  );

  const pageTitle = getLocalizedListingTitle(listing, locale);
  const pageDescription = getLocalizedListingDescription(listing, locale).slice(0, 160);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(
    [
      { name: SITE_NAME, path: "/" },
      { name: t("listings"), path: "/search" },
      { name: pageTitle, path: `/listings/${id}` },
    ],
    locale
  );
  const lodgingJsonLd = buildLodgingBusinessJsonLd(
    listing,
    locale,
    pageTitle,
    pageDescription
  );

  return (
    <>
      <script {...jsonLdScriptProps(breadcrumbJsonLd)} type="application/ld+json" />
      <script {...jsonLdScriptProps(lodgingJsonLd)} type="application/ld+json" />
      <ListingDetailView
        listing={listing}
        locale={locale}
        similarListings={similarResult.listings}
        similarPage={similarResult.page}
        similarTotalPages={similarResult.totalPages}
        similarBasePath={getLocalizedPath(`/listings/${id}`, locale)}
        isFavorited={favoriteContext.favoriteIds.has(listing.id)}
        isLoggedIn={favoriteContext.isLoggedIn}
        favoriteIds={favoriteContext.favoriteIds}
      />
    </>
  );
}
