"use client";

import { compressListingImage } from "@/lib/images/listing-images";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { CategoryPicker } from "@/components/listings/CategoryPicker";
import { ImagePreviewSlider } from "@/components/listings/ImagePreviewSlider";
import { HotelRoomTypeFields } from "@/components/listings/HotelRoomTypeFields";
import { ListingFormSection } from "@/components/listings/ListingFormSection";
import { getPriceUnitOptions } from "@/lib/price";
import { AmenitiesPicker } from "@/components/listings/AmenitiesPicker";
import { PremiumPlanPicker } from "@/components/listings/PremiumPlanPicker";
import { RegionCombobox } from "@/components/ui/RegionCombobox";
import { filterAmenityGroupsBySlug } from "@/lib/amenities/helpers";
import { isValidRegion } from "@/lib/regions";
import { createListing } from "@/lib/listings/actions";
import { isValidCoordinates } from "@/lib/map";
import { hasAcceptedLegalTerms } from "@/lib/legal/validation";
import { LegalAcceptanceField } from "@/components/legal/LegalAcceptanceField";
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
}

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

async function uploadImages(
  listingId: string,
  files: File[],
  tErrors: (key: string) => string
) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const previewId = crypto.randomUUID();

    const compressed = await compressListingImage(file);

    const presignRes = await fetch("/api/upload/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId,
        fileName: `${previewId}.webp`,
        contentType: "image/webp",
      }),
    });

    if (!presignRes.ok) {
      const err = await presignRes.json();
      throw new Error(err.error ?? tErrors("uploadFailed"));
    }

    const { uploadUrl, storagePath } = await presignRes.json();

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": "image/webp" },
      body: compressed,
    });

    if (!uploadRes.ok) throw new Error(tErrors("uploadServerFailed"));

    const confirmRes = await fetch("/api/upload/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId,
        storagePath,
        isCover: i === 0,
        sortOrder: i,
      }),
    });

    if (!confirmRes.ok) {
      const err = await confirmRes.json();
      throw new Error(err.error ?? tErrors("uploadConfirmFailed"));
    }
  }
}

export function CreateListingForm({
  categories,
  amenityGroups,
  defaultWhatsapp = "",
}: CreateListingFormProps) {
  const t = useTranslations("listingForm");
  const tListing = useTranslations("listing");
  const tErrors = useTranslations("listingForm.errors");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const priceUnitOptions = useMemo(
    () => getPriceUnitOptions(locale),
    [locale]
  );

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [region, setRegion] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    if (images.length > 15) {
      setError(tErrors("tooManyImages"));
      return;
    }
    setError(null);
    setSelectedFiles(images);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setImageFiles(Array.from(e.target.files ?? []));
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragOver(false);
    setImageFiles(Array.from(e.dataTransfer.files));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (selectedFiles.length === 0) {
      setError(tErrors("minOneImage"));
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
    if (!hasAcceptedLegalTerms(formData)) {
      setError(tErrors("legalRequired"));
      return;
    }

    setSubmitting(true);
    const result = await createListing(null, formData);

    if (result.error || !result.listingId) {
      setError(result.error ?? tErrors("createFailed"));
      setSubmitting(false);
      return;
    }

    try {
      await uploadImages(result.listingId, selectedFiles, tErrors);
      router.push("/dashboard/listings?created=1");
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
      {error && (
        <div className="listing-form__alert" role="alert">
          {error}
        </div>
      )}

      <ListingFormSection
        step={step++}
        title={t("sections.photosTitle")}
        description={t("sections.photosDesc")}
      >
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
            placeholder={t("placeholders.titleRu")}
          />
        </label>

        <label className="listing-form__field">
          <span className="listing-form__label">{t("fields.descriptionRu")}</span>
          <textarea
            name="descriptionRu"
            minLength={20}
            rows={5}
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
              placeholder={t("placeholders.city")}
            />
          </label>
        </div>

        <label className="listing-form__field">
          <span className="listing-form__label">{t("fields.address")}</span>
          <input
            type="text"
            name="address"
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
              defaultValue={2}
            />
          </label>

          <label className="listing-form__field">
            <span className="listing-form__label">{t("fields.bedrooms")}</span>
            <input
              type="number"
              name="bedrooms"
              min={0}
              defaultValue={1}
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
              placeholder={t("placeholders.price")}
            />
          </label>

          <label className="listing-form__field">
            <span className="listing-form__label">{t("fields.priceUnit")}</span>
            <select name="priceUnit" required defaultValue="day">
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
            defaultValue={defaultWhatsapp}
            placeholder={t("placeholders.whatsapp")}
          />
        </label>
      </ListingFormSection>

      {isHotel && (
        <ListingFormSection step={step++} title={t("sections.roomTypeTitle")}>
          <HotelRoomTypeFields roomAmenityGroups={roomAmenityGroups} />
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
          <AmenitiesPicker groups={listingAmenityGroups} />
        </ListingFormSection>
      )}

      <ListingFormSection
        step={step++}
        title={t("sections.premiumTitle")}
        description={t("sections.premiumDesc")}
        className="listing-form__section--premium"
      >
        <PremiumPlanPicker />
      </ListingFormSection>

      <div className="listing-form__footer">
        <LegalAcceptanceField className="listing-form__legal" />
        <p className="listing-form__note">{t("footer.note")}</p>
        <button
          type="submit"
          className="btn btn--primary listing-form__submit"
          disabled={submitting}
        >
          {submitting ? t("footer.submitting") : t("footer.submit")}
        </button>
      </div>
    </form>
  );
}
