"use client";

import imageCompression from "browser-image-compression";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryPicker } from "@/components/listings/CategoryPicker";
import { ImagePreviewSlider } from "@/components/listings/ImagePreviewSlider";
import { HotelRoomTypeFields } from "@/components/listings/HotelRoomTypeFields";
import { ListingFormSection } from "@/components/listings/ListingFormSection";
import { PRICE_UNIT_OPTIONS } from "@/lib/price";
import { AmenitiesPicker } from "@/components/listings/AmenitiesPicker";
import { RegionCombobox } from "@/components/ui/RegionCombobox";
import { filterAmenityGroupsBySlug } from "@/lib/amenities/helpers";
import { isValidRegion } from "@/lib/regions";
import { createListing } from "@/lib/listings/actions";
import { isValidCoordinates } from "@/lib/map";
import { hasAcceptedLegalTerms } from "@/lib/legal/validation";
import { LegalAcceptanceField } from "@/components/legal/LegalAcceptanceField";
import type { AmenityGroup, Category } from "@/types/database";

const LocationPicker = dynamic(
  () =>
    import("@/components/listings/LocationPicker").then(
      (mod) => mod.LocationPicker
    ),
  {
    ssr: false,
    loading: () => (
      <div className="location-picker__loading">Xəritə yüklənir...</div>
    ),
  }
);

interface CreateListingFormProps {
  categories: Category[];
  amenityGroups: AmenityGroup[];
  defaultWhatsapp?: string;
}

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

async function uploadImages(listingId: string, files: File[]) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const previewId = crypto.randomUUID();

    const compressed = await imageCompression(file, {
      maxSizeMB: 0.25,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/webp",
    });

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
      throw new Error(err.error ?? "Şəkil yükləmə xətası");
    }

    const { uploadUrl, storagePath } = await presignRes.json();

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": "image/webp" },
      body: compressed,
    });

    if (!uploadRes.ok) throw new Error("Şəkil serverə yüklənmədi");

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
      throw new Error(err.error ?? "Şəkil təsdiqi xətası");
    }
  }
}

export function CreateListingForm({
  categories,
  amenityGroups,
  defaultWhatsapp = "",
}: CreateListingFormProps) {
  const router = useRouter();
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
      setError("Yalnız JPEG, PNG və ya WebP şəkilləri seçə bilərsiniz.");
      return;
    }
    if (images.length > 15) {
      setError("Maksimum 15 şəkil seçə bilərsiniz.");
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
      setError("Ən azı 1 şəkil seçin.");
      return;
    }

    if (!categoryId) {
      setError("Kateqoriya seçin.");
      return;
    }

    if (!isValidRegion(region)) {
      setError("Rayon siyahıdan seçin.");
      return;
    }

    if (lat == null || lng == null || !isValidCoordinates(lat, lng)) {
      setError("Xəritədə mülkün yerini göstərin.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    if (!hasAcceptedLegalTerms(formData)) {
      setError("İstifadəçi şərtləri və Məxfilik siyasəti ilə razı olmalısınız.");
      return;
    }

    setSubmitting(true);
    const result = await createListing(null, formData);

    if (result.error || !result.listingId) {
      setError(result.error ?? "Elan yaradıla bilmədi.");
      setSubmitting(false);
      return;
    }

    try {
      await uploadImages(result.listingId, selectedFiles);
      router.push("/dashboard/listings?created=1");
    } catch (err) {
      setError(
        err instanceof Error
          ? `Elan yaradıldı, amma şəkil xətası: ${err.message}`
          : "Elan yaradıldı, şəkillər yüklənmədi."
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
        title="Şəkillər"
        description="İlk şəkil əsas şəkil olacaq. Minimum 1, maksimum 15 şəkil."
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
              ? `${selectedFiles.length} şəkil seçildi`
              : "Şəkilləri buraya sürüşdürün"}
          </span>
          <span className="listing-form__dropzone-text">
            və ya kompüterdən seçmək üçün klikləyin
          </span>
        </label>

        {selectedFiles.length > 0 && (
          <ImagePreviewSlider files={selectedFiles} />
        )}
      </ListingFormSection>

      <ListingFormSection
        step={step++}
        title="Əsas məlumat"
        description="Elanınızı qonaqlar üçün cəlbedici edin."
      >
        <label className="listing-form__field">
          <span className="listing-form__label">Elan başlığı *</span>
          <input
            type="text"
            name="title"
            required
            minLength={5}
            placeholder="Məs: Quba dağ mənzərəli A-frame ev"
          />
        </label>

        <label className="listing-form__field">
          <span className="listing-form__label">Təsvir *</span>
          <textarea
            name="description"
            required
            minLength={20}
            rows={5}
            placeholder="Eviniz, imkanlar və ətraf mühit haqqında yazın..."
          />
        </label>

        <div className="listing-form__field">
          <span className="listing-form__label">Kateqoriya *</span>
          <CategoryPicker
            categories={categories}
            value={categoryId}
            onChange={setCategoryId}
          />
        </div>
      </ListingFormSection>

      <ListingFormSection
        step={step++}
        title="Məkan məlumatları"
        description="Qonaqlar harada qalacaqlarını və neçə nəfər qəbul edə biləcəyinizi bilsin."
      >
        <div className="listing-form__row">
          <label className="listing-form__field">
            <span className="listing-form__label">Rayon *</span>
            <RegionCombobox
              name="region"
              value={region}
              onChange={setRegion}
              required
              placeholder="Rayon və ya şəhər seç"
            />
          </label>

          <label className="listing-form__field">
            <span className="listing-form__label">Şəhər / kənd *</span>
            <input type="text" name="city" required placeholder="Qəçrəş" />
          </label>
        </div>

        <label className="listing-form__field">
          <span className="listing-form__label">Ünvan (ixtiyari)</span>
          <input type="text" name="address" placeholder="Tam ünvan" />
        </label>

        <div className="listing-form__field">
          <span className="listing-form__label">Xəritədə yer *</span>
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
            <span className="listing-form__label">Qonaq *</span>
            <input
              type="number"
              name="maxGuests"
              required
              min={1}
              defaultValue={2}
            />
          </label>

          <label className="listing-form__field">
            <span className="listing-form__label">Yataq otağı</span>
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
        title="Qiymət və əlaqə"
        description="Qonaqlar sizinlə asanlıqla əlaqə saxlaya bilsin."
      >
        <div className="listing-form__row">
          <label className="listing-form__field">
            <span className="listing-form__label">Qiymət (AZN) *</span>
            <input
              type="number"
              name="pricePerNight"
              required
              min={1}
              step={1}
              placeholder="150"
            />
          </label>

          <label className="listing-form__field">
            <span className="listing-form__label">Vahid *</span>
            <select name="priceUnit" required defaultValue="day">
              {PRICE_UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  /{opt.label.toLowerCase()}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="listing-form__field">
          <span className="listing-form__label">WhatsApp nömrəsi *</span>
          <input
            type="tel"
            name="whatsappPhone"
            required
            defaultValue={defaultWhatsapp}
            placeholder="+994501234567"
          />
        </label>
      </ListingFormSection>

      {isHotel && (
        <ListingFormSection step={step++} title="Otaq tipi">
          <HotelRoomTypeFields roomAmenityGroups={roomAmenityGroups} />
        </ListingFormSection>
      )}

      {listingAmenityGroups.some((g) => g.amenities.length > 0) && (
        <ListingFormSection
          step={step++}
          title={isHotel ? "Müəssisə xüsusiyyətləri" : "Daxildir"}
          description="Mülkünüzdə nələrin olduğunu seçin."
        >
          <AmenitiesPicker groups={listingAmenityGroups} />
        </ListingFormSection>
      )}

      <div className="listing-form__footer">
        <LegalAcceptanceField className="listing-form__legal" />
        <p className="listing-form__note">
          Göndərdikdən sonra elanınız admin tərəfindən yoxlanılacaq.
        </p>
        <button
          type="submit"
          className="btn btn--primary listing-form__submit"
          disabled={submitting}
        >
          {submitting ? "Göndərilir..." : "Elanı göndər"}
        </button>
      </div>
    </form>
  );
}
