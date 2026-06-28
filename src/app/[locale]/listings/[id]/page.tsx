import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ListingDetailView } from "@/components/listings/ListingDetailView";
import type { Locale } from "@/i18n/routing";
import {
  getLocalizedListingDescription,
  getLocalizedListingTitle,
} from "@/lib/i18n/localized-listing";
import { getFavoritePageContext } from "@/lib/favorites/page-context";
import { getListingById, getSimilarListings } from "@/lib/queries/listings";

interface ListingPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: ListingPageProps) {
  const { id, locale } = await params;
  const listing = await getListingById(id);
  const t = await getTranslations({ locale, namespace: "listing" });
  if (!listing) return { title: t("notFound") };

  const pageTitle = getLocalizedListingTitle(listing, locale);
  const pageDescription = getLocalizedListingDescription(listing, locale);

  return {
    title: pageTitle,
    description: pageDescription.slice(0, 160),
    openGraph: {
      title: pageTitle,
      description: pageDescription.slice(0, 160),
      images: listing.listing_images[0]?.url
        ? [listing.listing_images[0].url]
        : [],
    },
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id, locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const [listing, favoriteContext] = await Promise.all([
    getListingById(id),
    getFavoritePageContext(),
  ]);

  if (!listing) notFound();

  const similarListings = await getSimilarListings(
    listing.id,
    listing.category_id,
    listing.region,
    4
  );

  return (
    <ListingDetailView
      listing={listing}
      locale={locale}
      similarListings={similarListings}
      isFavorited={favoriteContext.favoriteIds.has(listing.id)}
      isLoggedIn={favoriteContext.isLoggedIn}
      favoriteIds={favoriteContext.favoriteIds}
    />
  );
}
