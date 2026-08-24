"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState, useTransition } from "react";
import { RegionCombobox } from "@/components/ui/RegionCombobox";
import { getLocalizedName } from "@/lib/i18n/localized-name";
import type { Locale } from "@/i18n/routing";
import type { Category } from "@/types/database";

interface HeroSearchProps {
  categories: Category[];
  locale: Locale;
}

function SearchIcon() {
  return (
    <svg
      className="hero__search-icon"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function HeroSearch({ categories, locale }: HeroSearchProps) {
  const t = useTranslations("home");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");
  const [listingId, setListingId] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (listingId) params.set("id", listingId);
    if (region) params.set("region", region);
    if (category) params.set("category", category);
    const href = params.toString() ? `/search?${params.toString()}` : "/search";
    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <form className="hero__search" onSubmit={handleSearch}>
      <div className="hero__search-segment">
        <span className="hero__search-label">
          <SearchIcon />
          {t("searchLocationLabel")}
        </span>
        <RegionCombobox
          value={region}
          onChange={setRegion}
          placeholder={t("searchRegion")}
          inputClassName="hero__search-field"
          allowEmpty
          emptyLabel={t("allRegions")}
        />
      </div>

      <div className="hero__search-divider" aria-hidden="true" />

      <div className="hero__search-segment">
        <span className="hero__search-label">{t("searchCategoryLabel")}</span>
        <select
          className="hero__search-field"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">{t("allTypes")}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {getLocalizedName(cat, locale)}
            </option>
          ))}
        </select>
      </div>

      <div className="hero__search-divider" aria-hidden="true" />

      <div className="hero__search-segment">
        <span className="hero__search-label">{t("searchIdLabel")}</span>
        <input
          type="text"
          className="hero__search-field"
          value={listingId}
          onChange={(e) => setListingId(e.target.value)}
          placeholder={t("searchIdPlaceholder")}
        />
      </div>

      <button type="submit" className="hero__search-btn" disabled={isPending}>
        {isPending ? "..." : t("search")}
      </button>
    </form>
  );
}
