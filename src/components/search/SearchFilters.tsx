"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { RegionCombobox } from "@/components/ui/RegionCombobox";
import { getLocalizedName } from "@/lib/i18n/localized-name";
import type { Locale } from "@/i18n/routing";
import type { Category } from "@/types/database";

interface SearchFiltersProps {
  categories: Category[];
}

export function SearchFilters({ categories }: SearchFiltersProps) {
  const t = useTranslations("search.filters");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [listingId, setListingId] = useState(searchParams.get("id") ?? "");
  const [region, setRegion] = useState(searchParams.get("region") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [guests, setGuests] = useState(searchParams.get("guests") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (listingId) params.set("id", listingId);
    if (region) params.set("region", region);
    if (category) params.set("category", category);
    if (guests) params.set("guests", guests);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.push(`/search?${params.toString()}`);
  }, [listingId, region, category, guests, minPrice, maxPrice, router]);

  const clearFilters = () => {
    setListingId("");
    setRegion("");
    setCategory("");
    setGuests("");
    setMinPrice("");
    setMaxPrice("");
    router.push("/search");
  };

  return (
    <aside className="search-filters">
      <h2 className="search-filters__title">{t("title")}</h2>

      <label className="search-filters__field">
        {t("listingId")}
        <input
          type="text"
          value={listingId}
          onChange={(e) => setListingId(e.target.value)}
          placeholder={t("listingIdPlaceholder")}
        />
      </label>

      <label className="search-filters__field">
        {t("region")}
        <RegionCombobox
          value={region}
          onChange={setRegion}
          placeholder={t("regionPlaceholder")}
          allowEmpty
          emptyLabel={t("allRegions")}
        />
      </label>

      <label className="search-filters__field">
        {t("category")}
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">{t("allCategories")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {getLocalizedName(c, locale)}
            </option>
          ))}
        </select>
      </label>

      <label className="search-filters__field">
        {t("guests")}
        <input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          placeholder="2"
        />
      </label>

      <label className="search-filters__field">
        {t("minPrice")}
        <input
          type="number"
          min={0}
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="50"
        />
      </label>

      <label className="search-filters__field">
        {t("maxPrice")}
        <input
          type="number"
          min={0}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="500"
        />
      </label>

      <div className="search-filters__actions">
        <button type="button" className="btn btn--primary" onClick={applyFilters}>
          {t("apply")}
        </button>
        <button type="button" className="btn btn--ghost" onClick={clearFilters}>
          {t("clear")}
        </button>
      </div>
    </aside>
  );
}
