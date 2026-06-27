import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { CreateListingForm } from "@/components/listings/CreateListingForm";
import { requireAuth } from "@/lib/listings/actions";
import {
  getAmenitiesGrouped,
  getCategoriesForForm,
} from "@/lib/queries/form-data";
import { getMyListingForEdit } from "@/lib/queries/edit-listing";

type EditListingPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: EditListingPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "listingForm.edit" });

  return {
    title: t("metaTitle"),
  };
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const user = await requireAuth(`/dashboard/listings/${id}/edit`);
  const t = await getTranslations("listingForm.edit");

  const editData = await getMyListingForEdit(id, user.id);
  if (!editData) notFound();

  const [categories, amenityGroups] = await Promise.all([
    getCategoriesForForm(),
    getAmenitiesGrouped(),
  ]);

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
          editData={editData}
        />
      </div>
    </div>
  );
}
