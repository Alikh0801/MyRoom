import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CreateListingForm } from "@/components/listings/CreateListingForm";
import { requireAuth } from "@/lib/listings/actions";
import {
  getAmenitiesGrouped,
  getCategoriesForForm,
  getProfileContact,
} from "@/lib/queries/form-data";

type NewListingPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: NewListingPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "listingForm" });

  return {
    title: t("metaTitle"),
  };
}

export default async function NewListingPage({ params }: NewListingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await requireAuth();
  const t = await getTranslations("listingForm");

  const [categories, amenityGroups, profile] = await Promise.all([
    getCategoriesForForm(),
    getAmenitiesGrouped(),
    getProfileContact(user.id),
  ]);

  const defaultWhatsapp = profile?.whatsapp_phone ?? profile?.phone ?? "";

  return (
    <div className="dashboard-page dashboard-page--form">
      <div className="container listing-form-page">
        <Link href="/dashboard/listings" className="listing-form-page__back">
          {t("backLink")}
        </Link>

        <header className="listing-form-page__header">
          <h1 className="listing-form-page__title">{t("pageTitle")}</h1>
          <p className="listing-form-page__subtitle">{t("pageSubtitle")}</p>
        </header>

        <CreateListingForm
          categories={categories}
          amenityGroups={amenityGroups}
          defaultWhatsapp={defaultWhatsapp}
        />
      </div>
    </div>
  );
}
