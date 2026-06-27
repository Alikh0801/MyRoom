"use client";

import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { CategoryPicker } from "@/components/listings/CategoryPicker";
import { ExistingListingImages } from "@/components/listings/ExistingListingImages";
import { ImagePreviewSlider } from "@/components/listings/ImagePreviewSlider";
import { HotelRoomTypeFields } from "@/components/listings/HotelRoomTypeFields";
import { ListingFormSection } from "@/components/listings/ListingFormSection";
import { getPriceUnitOptions } from "@/lib/price";
import { AmenitiesPicker } from "@/components/listings/AmenitiesPicker";
import { PremiumPlanPicker } from "@/components/listings/PremiumPlanPicker";
import { RegionCombobox } from "@/components/ui/RegionCombobox";
import { filterAmenityGroupsBySlug } from "@/lib/amenities/helpers";
import { isValidRegion } from "@/lib/regions";
import { createListing, updateListing } from "@/lib/listings/actions";
import {
  ACCEPTED_IMAGE_TYPES,
  uploadListingImages,
} from "@/lib/listings/upload-images";
import { isValidCoordinates } from "@/lib/map";
import { hasAcceptedLegalTerms } from "@/lib/legal/validation";
import { LegalAcceptanceField } from "@/components/legal/LegalAcceptanceField";
import type { EditListingData } from "@/lib/queries/edit-listing";
import type { Locale } from "@/i18n/routing";
import type { AmenityGroup, Category } from "@/types/database";

function MapLoadingFallback() {
  const t = useTranslations("listingForm");
  return (
    <div className="location-picker__loading">{t("mapLoading")}</div>
  );
}

const LocationPicker = dynamic(
  () =>
    import("@/components/listings/LocationPicker").then(
      (mod) => mod.LocationPicker
    ),
  {
    ssr: false,
    loading: () => <MapLoadingFallback />,
  }
);

interface CreateListingFormProps {
  categories: Category[];
  amenityGroups: AmenityGroup[];
  defaultWhatsapp?: string;
  editData?: EditListingData;
}

const MAX_IMAGES = 15;

export function CreateListingForm({
  categories,
  amenityGroups,
  defaultWhatsapp = "",
  editData,
}: CreateListingFormProps) {
  const isEdit = Boolean(editData);
  const t = useTranslations("listingForm");
  const tEdit = useTranslations("listingForm.edit");
  const tListing = useTranslations("listing");
  const tErrors = useTranslations("listingForm.errors");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const priceUnitOptions = useMemo(
    () => getPriceUnitOptions(locale),
    [locale]
  );

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [categoryId, setCategoryId] = useState(editData?.category_id ?? "");
  const [region, setRegion] = useState(editData?.region ?? "");
  const [lat, setLat] = useState<number | null>(editData?.lat ?? null);
  const [lng, setLng] = useState<number | null>(editData?.lng ?? null);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>(
    editData?.amenity_ids ?? []
  );
  const [selectedRoomAmenityIds, setSelectedRoomAmenityIds] = useState<string[]>(
    editData?.room_type?.amenity_ids ?? []
  );
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState(() =>
    [...(editData?.images ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  );
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  const existingImageCount = existingImages.length;

  const hotelCategoryId = categories.find((c) => c.slug === "hotel")?.id;
  const isHotel = Boolean(hotelCategoryId && categoryId === hotelCategoryId);

  const propertyAmenityGroups = useMemo(
    () => filterAmenityGroupsBySlug(amenityGroups, "property"),
    [amenityGroups]
  );
  const roomAmenityGroups = useMemo(
    () => filterAmenityGroupsBySlug(amenityGroups, "room"),
    [amenityGroups]
  );
  const listingAmenityGroups = isHotel ? propertyAmenityGroups : amenityGroups;

  let step = 1;

  function setImageFiles(files: File[]) {
    const images = files.filter((file) => ACCEPTED_IMAGE_TYPES.includes(file.type));

    if (images.length === 0) {
      setError(tErrors("invalidImageType"));
      return;
    }

    const combined = [...selectedFiles, ...images];
    const totalCount = existingImageCount + combined.length;

    if (totalCount > MAX_IMAGES) {
      setError(tErrors("tooManyImagesTotal"));
      return;
    }

    setError(null);
    setSelectedFiles(combined);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setImageFiles(Array.from(e.target.files ?? []));
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragOver(false);
    setImageFiles(Array.from(e.dataTransfer.files));
  }

  function handleDeleteExistingImage(imageId: string) {
    if (existingImageCount + selectedFiles.length <= 1) {
      setError(tErrors("cannotDeleteLastPhoto"));
      return;
    }

    setError(null);
    setDeletedImageIds((prev) =>
      prev.includes(imageId) ? prev : [...prev, imageId]
    );
    setExistingImages((prev) => prev.filter((image) => image.id !== imageId));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const totalImages = existingImageCount + selectedFiles.length;

    if (totalImages === 0) {
      setError(tErrors("minOneImage"));
      return;
    }

    if (totalImages > MAX_IMAGES) {
      setError(tErrors("tooManyImagesTotal"));
      return;
    }

    if (!categoryId) {
      setError(tErrors("selectCategory"));
      return;
    }

    if (!isValidRegion(region)) {
      setError(tErrors("selectRegion"));
      return;
    }

    if (lat == null || lng == null || !isValidCoordinates(lat, lng)) {
      setError(tErrors("selectMapLocation"));
      return;
    }

    const formData = new FormData(e.currentTarget);

    if (!isEdit && !hasAcceptedLegalTerms(formData)) {
      setError(tErrors("legalRequired"));
      return;
    }

    setSubmitting(true);

    const result = isEdit
      ? await updateListing(null, formData)
      : await createListing(null, formData);

    if (result.error || !result.listingId) {
      setError(result.error ?? tErrors(isEdit ? "updateFailed" : "createFailed"));
      setSubmitting(false);
      return;
    }

    if (selectedFiles.length === 0) {
      router.push(
        isEdit ? "/dashboard/listings?updated=1" : "/dashboard/listings?created=1"
      );
      return;
    }

    try {
      await uploadListingImages(result.listingId, selectedFiles, tErrors, {
        startSortOrder: existingImageCount,
        setCover: existingImageCount === 0,
      });

      router.push(
        isEdit ? "/dashboard/listings?updated=1" : "/dashboard/listings?created=1"
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? tErrors("createdUploadError", { message: err.message })
          : tErrors("createdNoImages")
      );
      setSubmitting(false);
    }
  }

  return (
    <form className="listing-form" onSubmit={handleSubmit}>
      {isEdit && <input type="hidden" name="listingId" value={editData!.id} />}

      {error && (
        <div className="listing-form__alert" role="alert">
          {error}
        </div>
      )}

      <ListingFormSection
        step={step++}
        title={t("sections.photosTitle")}
        description={
          isEdit ? tEdit("photosDesc") : t("sections.photosDesc")
        }
      >
        {isEdit && (
          <>
            {deletedImageIds.map((id) => (
              <input key={id} type="hidden" name="deletedImageIds" value={id} />
            ))}
            <ExistingListingImages
              images={existingImages}
              title={editData!.title}
              label={tEdit("existingPhotos")}
              coverLabel={tEdit("coverBadge")}
              canDelete={existingImageCount + selectedFiles.length > 1}
              onChange={setExistingImages}
              onDelete={handleDeleteExistingImage}
            />
          </>
        )}

        <label
          className={`listing-form__dropzone${dragOver ? " listing-form__dropzone--active" : ""}${selectedFiles.length > 0 ? " listing-form__dropzone--filled" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            multiple
            onChange={handleFileChange}
            hidden
          />
          <span className="listing-form__dropzone-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 16V4m0 0L8 8m4-4 4 4M4 20h16"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="listing-form__dropzone-title">
            {selectedFiles.length > 0
              ? t("dropzone.selected", { count: selectedFiles.length })
              : isEdit
                ? tEdit("addPhotos")
                : t("dropzone.dragHere")}
          </span>
          <span className="listing-form__dropzone-text">
            {t("dropzone.orSelect")}
          </span>
        </label>

        {selectedFiles.length > 0 && (
          <ImagePreviewSlider files={selectedFiles} />
        )}
      </ListingFormSection>

      <ListingFormSection
        step={step++}
        title={t("sections.basicsTitle")}
        description={t("sections.basicsDesc")}
      >
        <label className="listing-form__field">
          <span className="listing-form__label">{t("fields.title")}</span>
          <input
            type="text"
            name="title"
            required
            minLength={5}
            defaultValue={editData?.title}
            placeholder={t("placeholders.title")}
          />
        </label>

        <label className="listing-form__field">
          <span className="listing-form__label">{t("fields.description")}</span>
          <textarea
            name="description"
            required
            minLength={20}
            rows={5}
            defaultValue={editData?.description}
            placeholder={t("placeholders.description")}
          />
        </label>

        <p className="listing-form__hint">{t("fields.ruOptionalHint")}</p>

        <label className="listing-form__field">
          <span className="listing-form__label">{t("fields.titleRu")}</span>
          <input
            type="text"
            name="titleRu"
            minLength={5}
            defaultValue={editData?.title_ru ?? ""}
            placeholder={t("placeholders.titleRu")}
          />
        </label>

        <label className="listing-form__field">
          <span className="listing-form__label">{t("fields.descriptionRu")}</span>
          <textarea
            name="descriptionRu"
            minLength={20}
            rows={5}
            defaultValue={editData?.description_ru ?? ""}
            placeholder={t("placeholders.descriptionRu")}
          />
        </label>

        <div className="listing-form__field">
          <span className="listing-form__label">{t("fields.category")}</span>
          <CategoryPicker
            categories={categories}
            value={categoryId}
            onChange={setCategoryId}
          />
        </div>
      </ListingFormSection>

      <ListingFormSection
        step={step++}
        title={t("sections.locationTitle")}
        description={t("sections.locationDesc")}
      >
        <div className="listing-form__row">
          <label className="listing-form__field">
            <span className="listing-form__label">{t("fields.region")}</span>
            <RegionCombobox
              name="region"
              value={region}
              onChange={setRegion}
              required
              placeholder={t("placeholders.region")}
            />
          </label>

          <label className="listing-form__field">
            <span className="listing-form__label">{t("fields.city")}</span>
            <input
              type="text"
              name="city"
              required
              defaultValue={editData?.city}
              placeholder={t("placeholders.city")}
            />
          </label>
        </div>

        <label className="listing-form__field">
          <span className="listing-form__label">{t("fields.address")}</span>
          <input
            type="text"
            name="address"
            defaultValue={editData?.address ?? ""}
            placeholder={t("placeholders.address")}
          />
        </label>

        <div className="listing-form__field">
          <span className="listing-form__label">{t("fields.mapLocation")}</span>
          <LocationPicker
            lat={lat}
            lng={lng}
            onChange={(newLat, newLng) => {
              setLat(newLat);
              setLng(newLng);
            }}
          />
        </div>

        <div className="listing-form__row">
          <label className="listing-form__field">
            <span className="listing-form__label">{t("fields.guests")}</span>
            <input
              type="number"
              name="maxGuests"
              required
              min={1}
              defaultValue={editData?.max_guests ?? 2}
            />
          </label>

          <label className="listing-form__field">
            <span className="listing-form__label">{t("fields.bedrooms")}</span>
            <input
              type="number"
              name="bedrooms"
              min={0}
              defaultValue={editData?.bedrooms ?? 1}
            />
          </label>
        </div>
      </ListingFormSection>

      <ListingFormSection
        step={step++}
        title={t("sections.priceTitle")}
        description={t("sections.priceDesc")}
      >
        <div className="listing-form__row">
          <label className="listing-form__field">
            <span className="listing-form__label">{t("fields.price")}</span>
            <input
              type="number"
              name="pricePerNight"
              required
              min={1}
              step={1}
              defaultValue={editData?.price_per_night}
              placeholder={t("placeholders.price")}
            />
          </label>

          <label className="listing-form__field">
            <span className="listing-form__label">{t("fields.priceUnit")}</span>
            <select
              name="priceUnit"
              required
              defaultValue={editData?.price_unit ?? "day"}
            >
              {priceUnitOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  /{opt.label.toLowerCase()}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="listing-form__field">
          <span className="listing-form__label">{t("fields.whatsapp")}</span>
          <input
            type="tel"
            name="whatsappPhone"
            required
            defaultValue={editData?.whatsapp_phone ?? defaultWhatsapp}
            placeholder={t("placeholders.whatsapp")}
          />
        </label>
      </ListingFormSection>

      {isHotel && (
        <ListingFormSection step={step++} title={t("sections.roomTypeTitle")}>
          <HotelRoomTypeFields
            roomAmenityGroups={roomAmenityGroups}
            defaultName={editData?.room_type?.name}
            defaultFloor={editData?.room_type?.floor}
            roomTypeId={editData?.room_type?.id}
            selectedRoomAmenityIds={
              isEdit ? selectedRoomAmenityIds : undefined
            }
            onRoomAmenitiesChange={
              isEdit ? setSelectedRoomAmenityIds : undefined
            }
          />
        </ListingFormSection>
      )}

      {listingAmenityGroups.some((g) => g.amenities.length > 0) && (
        <ListingFormSection
          step={step++}
          title={
            isHotel ? tListing("propertyFeatures") : tListing("included")
          }
          description={t("sections.amenitiesDesc")}
        >
          {isEdit ? (
            <AmenitiesPicker
              groups={listingAmenityGroups}
              selectedIds={selectedAmenityIds}
              onChange={setSelectedAmenityIds}
            />
          ) : (
            <AmenitiesPicker groups={listingAmenityGroups} />
          )}
        </ListingFormSection>
      )}

      {!isEdit && (
        <ListingFormSection
          step={step++}
          title={t("sections.premiumTitle")}
          description={t("sections.premiumDesc")}
          className="listing-form__section--premium"
        >
          <PremiumPlanPicker />
        </ListingFormSection>
      )}

      <div className="listing-form__footer">
        {!isEdit && <LegalAcceptanceField className="listing-form__legal" />}
        <p className="listing-form__note">
          {isEdit ? tEdit("note") : t("footer.note")}
        </p>
        <button
          type="submit"
          className="btn btn--primary listing-form__submit"
          disabled={submitting}
        >
          {submitting
            ? isEdit
              ? tEdit("submitting")
              : t("footer.submitting")
            : isEdit
              ? tEdit("submit")
              : t("footer.submit")}
        </button>
      </div>
    </form>
  );
}
