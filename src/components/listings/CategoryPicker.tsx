import { CategoryIcon } from "@/lib/category-icons";
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
  return (
    <div className="category-picker" role="radiogroup" aria-label="Kateqoriya">
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
              <span className="category-picker__label">{cat.name_az}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
