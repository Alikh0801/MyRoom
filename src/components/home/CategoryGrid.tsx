import { Link } from "@/i18n/navigation";
import { CategoryIcon } from "@/lib/category-icons";
import { getLocalizedName } from "@/lib/i18n/localized-name";
import type { Locale } from "@/i18n/routing";
import type { Category } from "@/types/database";

interface CategoryGridProps {
  categories: Category[];
  locale: Locale;
}

export function CategoryGrid({ categories, locale }: CategoryGridProps) {
  return (
    <div className="category-grid">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/search?category=${cat.slug}`}
          className="category-card"
        >
          <span className="category-card__icon">
            <CategoryIcon slug={cat.slug} />
          </span>
          <span className="category-card__label">
            {getLocalizedName(cat, locale)}
          </span>
        </Link>
      ))}
    </div>
  );
}
