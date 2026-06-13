import type { AmenityGroup } from "@/types/database";

export function filterAmenityGroupsBySlug(
  groups: AmenityGroup[],
  slug: string
): AmenityGroup[] {
  return groups.filter((g) => g.category.slug === slug);
}
