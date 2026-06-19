"use client";

import imageCompression from "browser-image-compression";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImagePreviewSlider } from "@/components/listings/ImagePreviewSlider";
import { HotelRoomTypeFields } from "@/components/listings/HotelRoomTypeFields";
import { PRICE_UNIT_OPTIONS } from "@/lib/price";
import { AmenitiesPicker } from "@/components/listings/AmenitiesPicker";
import { RegionCombobox } from "@/components/ui/RegionCombobox";
import { filterAmenityGroupsBySlug } from "@/lib/amenities/helpers";
import { isValidRegion } from "@/lib/regions";
import { createListing } from "@/lib/listings/actions";
import type { AmenityGroup, Category } from "@/types/database";

interface CreateListingFormProps {
  categories: Category[];
  amenityGroups: AmenityGroup[];
  defaultWhatsapp?: string;
}

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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 15) {
      setError("Maksimum 15 şəkil seçə bilərsiniz");
      return;
    }
    setError(null);
    setSelectedFiles(files);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (selectedFiles.length === 0) {
      setError("Ən azı 1 şəkil seçin.");
      return;
    }

    if (!isValidRegion(region)) {
      setError("Rayon siyahıdan seçin.");
      return;
    }

    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await createListing(null, formData);

    if (result.error || !result.listingId) {
      setError(result.error ?? "Elan yaradıla bilmədi.");
      setSubmitting(false);
      return;
    }

    try {
      await uploadImages(result.listingId, selectedFiles);
      router.push("/dashboard?created=1");
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
      {error && <p className="auth-form__error">{error}</p>}

      <fieldset className="listing-form__section">
        <legend>Əsas məlumat</legend>

        <label className="auth-form__field">
          Elan başlığı *
          <input
            type="text"
            name="title"
            required
            minLength={5}
            placeholder="Məs: Quba dağ mənzərəli A-frame (Glamping) ev"
          />
        </label>

        <label className="auth-form__field">
          Təsvir *
          <textarea
            name="description"
            required
            minLength={20}
            rows={5}
            placeholder="Eviniz, imkanlar və ətraf mühit haqqında yazın..."
          />
        </label>

        <label className="auth-form__field">
          Kateqoriya *
          <select
            name="categoryId"
            required
            defaultValue=""
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="" disabled>
              Seçin
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name_az}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      <fieldset className="listing-form__section">
        <legend>Qiymət və əlaqə</legend>

        <div className="listing-form__row">
          <label className="auth-form__field">
            Qiymət (AZN) *
            <input
              type="number"
              name="pricePerNight"
              required
              min={1}
              step={1}
              placeholder="150"
            />
          </label>

          <label className="auth-form__field">
            Vahid *
            <select name="priceUnit" required defaultValue="day">
              {PRICE_UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  /{opt.label.toLowerCase()}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="auth-form__field">
          WhatsApp nömrəsi *
          <input
            type="tel"
            name="whatsappPhone"
            required
            defaultValue={defaultWhatsapp}
            placeholder="+994501234567"
          />
        </label>
      </fieldset>

      <fieldset className="listing-form__section">
        <legend>Yer və tutum</legend>

        <div className="listing-form__row">
          <label className="auth-form__field">
            Rayon *
            <RegionCombobox
              name="region"
              value={region}
              onChange={setRegion}
              required
              placeholder="Rayon və ya şəhər seç"
            />
          </label>

          <label className="auth-form__field">
            Şəhər / kənd *
            <input type="text" name="city" required placeholder="Qəçrəş" />
          </label>
        </div>

        <label className="auth-form__field">
          Ünvan (ixtiyari)
          <input type="text" name="address" placeholder="Tam ünvan" />
        </label>

        <div className="listing-form__row listing-form__row--3">
          <label className="auth-form__field">
            Qonaq *
            <input
              type="number"
              name="maxGuests"
              required
              min={1}
              defaultValue={2}
            />
          </label>

          <label className="auth-form__field">
            Yataq otağı
            <input
              type="number"
              name="bedrooms"
              min={0}
              defaultValue={1}
            />
          </label>

          <label className="auth-form__field">
            Vanna otağı
            <input
              type="number"
              name="bathrooms"
              min={0}
              defaultValue={1}
            />
          </label>
        </div>
      </fieldset>

      {isHotel && (
        <fieldset className="listing-form__section">
          <legend>Otaq tipi</legend>
          <HotelRoomTypeFields roomAmenityGroups={roomAmenityGroups} />
        </fieldset>
      )}

      {listingAmenityGroups.some((g) => g.amenities.length > 0) && (
        <fieldset className="listing-form__section">
          <legend>{isHotel ? "Müəssisə xüsusiyyətləri" : "Daxildir"}</legend>
          <AmenitiesPicker groups={listingAmenityGroups} />
        </fieldset>
      )}

      <fieldset className="listing-form__section">
        <legend>Şəkillər</legend>
        <p className="listing-form__hint">
          Minimum 1, maksimum 15 şəkil. JPEG və PNG avtomatik sıxılır.
        </p>
        <label className="image-uploader__dropzone">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileChange}
            hidden
          />
          <span>
            {selectedFiles.length > 0
              ? `${selectedFiles.length} şəkil seçildi — əlavə etmək üçün yenidən klikləyin`
              : "Şəkil seçin"}
          </span>
        </label>

        {selectedFiles.length > 0 && (
          <ImagePreviewSlider files={selectedFiles} />
        )}
      </fieldset>

      <button
        type="submit"
        className="btn btn--primary listing-form__submit"
        disabled={submitting}
      >
        {submitting ? "Göndərilir..." : "Elanı göndər"}
      </button>

      <p className="listing-form__note">
        Elan admin təsdiqindən sonra saytda görünəcək.
      </p>
    </form>
  );
}
