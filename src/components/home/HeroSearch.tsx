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

export function HeroSearch({ categories, locale }: HeroSearchProps) {
  const t = useTranslations("home");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (region) params.set("region", region);
    if (category) params.set("category", category);
    const href = params.toString() ? `/search?${params.toString()}` : "/search";
    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <form className="hero__search" onSubmit={handleSearch}>
      <RegionCombobox
        value={region}
        onChange={setRegion}
        placeholder={t("searchRegion")}
        inputClassName="hero__search-input"
        allowEmpty
        emptyLabel={t("allRegions")}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">{t("allTypes")}</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.slug}>
            {getLocalizedName(cat, locale)}
          </option>
        ))}
      </select>
      <button type="submit" className="btn btn--primary" disabled={isPending}>
        {isPending ? "..." : t("search")}
      </button>
    </form>
  );
}
