import type { Locale } from "@/i18n/routing";

/** Kateqoriya slug → rus adı (DB-dən asılı olmayaraq) */
const CATEGORY_NAME_RU: Record<string, string> = {
  hotel: "Отель",
  hostel: "Хостел/Котеч",
  "a-frame": "A-frame (Glamping)",
  villa: "Вилла",
  "rayon-evi": "Загородный дом",
};

/**
 * Slug → türk adı. Verilənlər bazasında "name_tr" sütunu olmadığı üçün
 * kateqoriya, amenity kateqoriyası və amenity adları burada saxlanılır.
 */
const NAME_TR: Record<string, string> = {
  // Kateqoriyalar
  hotel: "Otel",
  hostel: "Hostel/Apart Otel",
  "a-frame": "A-frame (Glamping)",
  villa: "Villa",
  "rayon-evi": "Köy evi",
  // Amenity kateqoriyaları
  room: "Oda özellikleri",
  property: "Tesis özellikleri",
  // Amenities
  wifi: "Wi-Fi",
  tv: "TV",
  ac: "Klima",
  kitchen: "Mutfak",
  refrigerator: "Buzdolabı",
  "coffee-maker": "Kahve makinesi",
  iron: "Ütü",
  bathroom: "Banyo",
  "hair-dryer": "Fön",
  "ironing-board": "Ütü masası",
  "washing-machine": "Çamaşır makinesi",
  bathtub: "Küvet",
  shampoo: "Şampuan",
  soap: "Sabun",
  towel: "Havlu",
  parking: "Otopark",
  pool: "Havuz",
  jacuzzi: "Jakuzi",
  balcony: "Balkon",
  reception: "Resepsiyon",
  "room-service": "Oda servisi",
  breakfast: "Kahvaltı",
  "mountain-view": "Dağ manzarası",
  "forest-view": "Orman manzarası",
  "city-view": "Şehir manzarası",
  "water-view": "Su manzarası",
  "dishes-set": "Mutfak eşyaları",
  barbecue: "Mangal",
  samovar: "Semaver",
  "shower-cabin": "Duşakabin",
  "combi-boiler": "Kombi",
  "water-heater": "Şofben",
};

export interface LocalizedName {
  name_az: string;
  name_ru?: string | null;
  slug?: string;
}

export function getLocalizedName(
  item: LocalizedName,
  locale: Locale | string
): string {
  if (locale === "tr") {
    if (item.slug && item.slug in NAME_TR) {
      return NAME_TR[item.slug];
    }
    return item.name_az;
  }

  if (locale === "ru") {
    if (item.slug && item.slug in CATEGORY_NAME_RU) {
      return CATEGORY_NAME_RU[item.slug];
    }

    if (item.name_ru) {
      return item.name_ru;
    }
  }

  return item.name_az;
}
