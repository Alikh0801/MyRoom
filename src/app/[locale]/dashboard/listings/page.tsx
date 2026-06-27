import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { MyListingsFilters } from "@/components/dashboard/MyListingsFilters";
import { parseListingStatusFilter } from "@/lib/listings/status";
import { MyListingCard } from "@/components/dashboard/MyListingCard";
import {
  getMyListingCounts,
  getMyListings,
} from "@/lib/queries/my-listings";
import { createClient } from "@/lib/supabase/server";

interface MyListingsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string; created?: string; updated?: string }>;
}

export async function generateMetadata({ params }: MyListingsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });

  return {
    title: t("metaTitle"),
  };
}

export default async function MyListingsPage({
  params,
  searchParams,
}: MyListingsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dashboard");
  const resolvedSearchParams = await searchParams;
  const statusFilter = parseListingStatusFilter(resolvedSearchParams.status);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirectTo=/dashboard/listings");

  const [listings, counts] = await Promise.all([
    getMyListings(user.id, statusFilter),
    getMyListingCounts(user.id),
  ]);

  const pageTitle = statusFilter
    ? t(`status.${statusFilter}`)
    : t("pageTitle");

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard__header-row">
          <div>
            <h1 className="section__title">{pageTitle}</h1>
            <p className="section__subtitle dashboard__subtitle">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {resolvedSearchParams.created === "1" && (
          <div className="dashboard__alert">{t("alerts.created")}</div>
        )}

        {resolvedSearchParams.updated === "1" && (
          <div className="dashboard__alert">{t("alerts.updated")}</div>
        )}

        <MyListingsFilters counts={counts} activeStatus={statusFilter} />

        {listings.length > 0 ? (
          <div className="my-listings">
            {listings.map((listing) => (
              <MyListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>
              {statusFilter
                ? t("empty.filteredTitle", {
                    status: t(`status.${statusFilter}`),
                  })
                : t("empty.noneTitle")}
            </h3>
            <p>
              {statusFilter ? t("empty.filteredDesc") : t("empty.noneDesc")}
            </p>
            {!statusFilter && (
              <Link
                href="/dashboard/listings/new"
                className="btn btn--primary"
                style={{ marginTop: "1rem" }}
              >
                {t("empty.createCta")}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
