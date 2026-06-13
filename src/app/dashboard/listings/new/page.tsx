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
    <div className="container dashboard">
      <h1 className="section__title">Yeni elan yerləşdir</h1>
      <p className="section__subtitle">
        Məlumatları doldurun — elanınız yoxlanıldıqdan sonra saytda görünəcək.
      </p>

      <CreateListingForm
        categories={categories}
        amenityGroups={amenityGroups}
        defaultWhatsapp={defaultWhatsapp}
      />
    </div>
  );
}
