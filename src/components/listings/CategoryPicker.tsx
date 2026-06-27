"use client";

import { useLocale, useTranslations } from "next-intl";
import { CategoryIcon } from "@/lib/category-icons";
import { getLocalizedName } from "@/lib/i18n/localized-name";
import type { Locale } from "@/i18n/routing";
import type { Category } from "@/types/database";

interface CategoryPickerProps {
  categories: Category[];
  value: string;
  onChange: (id: string) => void;
}

export function CategoryPicker({
  categories,
  value,
  onChange,
}: CategoryPickerProps) {
  const t = useTranslations("listingForm");
  const locale = useLocale() as Locale;

  return (
    <div
      className="category-picker"
      role="radiogroup"
      aria-label={t("categoryAriaLabel")}
    >
      <input type="hidden" name="categoryId" value={value} required />
      <div className="category-picker__grid">
        {categories.map((cat) => {
          const selected = value === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`category-picker__card${selected ? " category-picker__card--selected" : ""}`}
              onClick={() => onChange(cat.id)}
            >
              <span className="category-picker__icon">
                <CategoryIcon slug={cat.slug} size={22} />
              </span>
              <span className="category-picker__label">
                {getLocalizedName(cat, locale)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
