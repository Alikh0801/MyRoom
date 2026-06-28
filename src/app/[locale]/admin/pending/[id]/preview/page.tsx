import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ListingDetailView } from "@/components/listings/ListingDetailView";
import type { Locale } from "@/i18n/routing";
import { requireAdmin } from "@/lib/admin/auth";
import { getLocalizedListingTitle } from "@/lib/i18n/localized-listing";
import { getListingByIdForAdmin } from "@/lib/queries/listings";

interface AdminListingPreviewPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: AdminListingPreviewPageProps) {
  const { id, locale } = await params;
  const listing = await getListingByIdForAdmin(id);
  const t = await getTranslations({ locale, namespace: "listing" });
  if (!listing) return { title: t("notFound") };

  const pageTitle = getLocalizedListingTitle(listing, locale);

  return {
    title: `Önizləmə · ${pageTitle}`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminListingPreviewPage({
  params,
}: AdminListingPreviewPageProps) {
  await requireAdmin();

  const { id, locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const listing = await getListingByIdForAdmin(id);
  if (!listing) notFound();

  return (
    <ListingDetailView
      listing={listing}
      locale={locale}
      showSimilarListings={false}
      previewBanner={
        <div className="admin-preview-banner">
          <div className="container admin-preview-banner__inner">
            <p className="admin-preview-banner__text">
              Gözləyən elan önizləməsi — saytda yalnız siz görürsünüz.
            </p>
            <Link href="/admin?tab=pending" className="admin-preview-banner__back">
              ← Admin panel
            </Link>
          </div>
        </div>
      }
    />
  );
}
