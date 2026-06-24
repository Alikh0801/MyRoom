import Link from "next/link";
import { CreateListingForm } from "@/components/listings/CreateListingForm";
import { requireAuth } from "@/lib/listings/actions";
import {
  getAmenitiesGrouped,
  getCategoriesForForm,
  getProfileContact,
} from "@/lib/queries/form-data";

export const metadata = {
  title: "Yeni elan",
};

export default async function NewListingPage() {
  const user = await requireAuth();

  const [categories, amenityGroups, profile] = await Promise.all([
    getCategoriesForForm(),
    getAmenitiesGrouped(),
    getProfileContact(user.id),
  ]);

  const defaultWhatsapp =
    profile?.whatsapp_phone ?? profile?.phone ?? "";

  return (
    <div className="dashboard-page dashboard-page--form">
      <div className="container listing-form-page">
        <Link href="/dashboard/listings" className="listing-form-page__back">
          ← Mənim elanlarım
        </Link>

        <header className="listing-form-page__header">
          <h1 className="listing-form-page__title">Yeni elan yerləşdir</h1>
          <p className="listing-form-page__subtitle">
            Addım-addım məlumatları doldurun. Elanınız yoxlanıldıqdan sonra
            saytda görünəcək.
          </p>
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
