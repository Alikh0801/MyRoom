import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { Amenity, AmenityCategory, AmenityGroup } from "@/types/database";

export { filterAmenityGroupsBySlug } from "@/lib/amenities/helpers";

const getAmenitiesGroupedCached = unstable_cache(
  async (): Promise<AmenityGroup[]> => {
    const supabase = createPublicClient();

    const { data: categories } = await supabase
      .from("amenity_categories")
      .select("*")
      .order("sort_order");

    const { data: amenities } = await supabase
      .from("amenities")
      .select("*")
      .order("sort_order");

    if (!categories?.length) return [];

    const amenityList = amenities ?? [];

    return categories.map((category) => ({
      category: category as AmenityCategory,
      amenities: amenityList.filter(
        (a) => a.category_id === category.id
      ) as Amenity[],
    }));
  },
  ["amenity-groups"],
  { revalidate: 3600 }
);

export async function getAmenitiesGrouped(): Promise<AmenityGroup[]> {
  return getAmenitiesGroupedCached();
}

export function groupAmenitiesByCategory(
  amenities: (Amenity & { category?: AmenityCategory | null })[]
): AmenityGroup[] {
  const map = new Map<string, AmenityGroup>();

  for (const amenity of amenities) {
    const category = amenity.category;
    if (!category) continue;

    const existing = map.get(category.id);
    if (existing) {
      existing.amenities.push(amenity);
    } else {
      map.set(category.id, {
        category,
        amenities: [amenity],
      });
    }
  }

  return [...map.values()].sort(
    (a, b) => a.category.sort_order - b.category.sort_order
  );
}
