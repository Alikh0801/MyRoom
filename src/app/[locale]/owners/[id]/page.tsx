import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { OwnerProfileView } from "@/components/owners/OwnerProfileView";
import type { Locale } from "@/i18n/routing";
import { getFavoritePageContext } from "@/lib/favorites/page-context";
import {
  getOwnerApprovedListings,
  getOwnerPublicProfile,
} from "@/lib/queries/owner-profile";
import { buildCanonicalAlternates, getAbsoluteUrl } from "@/lib/seo";

interface OwnerProfilePageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: OwnerProfilePageProps) {
  const { id, locale } = await params;
  const [owner, listings, t] = await Promise.all([
    getOwnerPublicProfile(id),
    getOwnerApprovedListings(id),
    getTranslations({ locale, namespace: "ownerProfile" }),
  ]);

  if (!owner || listings.length === 0) {
    return { title: t("notFound") };
  }

  const displayName = owner.full_name ?? t("ownerFallback");
  const title = t("metaTitle", { name: displayName });
  const description = t("metaDescription", {
    name: displayName,
    count: listings.length,
  });
  const path = `/owners/${id}`;

  return {
    title,
    description,
    alternates: buildCanonicalAlternates(path, locale as Locale),
    openGraph: {
      title,
      description,
      url: getAbsoluteUrl(path, locale as Locale),
      type: "profile",
    },
  };
}

export default async function OwnerProfilePage({ params }: OwnerProfilePageProps) {
  const { id, locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const [owner, listings, favoriteContext] = await Promise.all([
    getOwnerPublicProfile(id),
    getOwnerApprovedListings(id),
    getFavoritePageContext(),
  ]);

  if (!owner || listings.length === 0) notFound();

  return (
    <OwnerProfileView
      owner={owner}
      listings={listings}
      isLoggedIn={favoriteContext.isLoggedIn}
      favoriteIds={favoriteContext.favoriteIds}
    />
  );
}
