import Link from "next/link";
import { CategoryIcon } from "@/lib/category-icons";
import type { Category } from "@/types/database";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
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
          <span className="category-card__label">{cat.name_az}</span>
        </Link>
      ))}
    </div>
  );
}
