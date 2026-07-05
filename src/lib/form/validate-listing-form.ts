type ListingErrorTranslator = (key: string) => string;

export function validateListingFormFields(
  formData: FormData,
  isHotel: boolean,
  t: ListingErrorTranslator
): string | null {
  const title = (formData.get("title") as string)?.trim() ?? "";
  const description = (formData.get("description") as string)?.trim() ?? "";
  const city = (formData.get("city") as string)?.trim() ?? "";
  const maxGuests = Number(formData.get("maxGuests"));
  const pricePerNight = Number(formData.get("pricePerNight"));
  const whatsappPhone = (formData.get("whatsappPhone") as string)?.trim() ?? "";
  const roomTypeName = (formData.get("roomTypeName") as string)?.trim() ?? "";

  if (title.length < 5) {
    return t("titleTooShort");
  }

  if (description.length < 20) {
    return t("descriptionTooShort");
  }

  if (!city) {
    return t("cityRegionRequired");
  }

  if (!maxGuests || maxGuests < 1) {
    return t("minGuests");
  }

  if (!pricePerNight || pricePerNight <= 0) {
    return t("invalidPrice");
  }

  if (!whatsappPhone) {
    return t("whatsappRequired");
  }

  if (isHotel && roomTypeName.length < 2) {
    return t("roomTypeNameTooShort");
  }

  return null;
}
