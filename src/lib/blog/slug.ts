const TRANSLIT: Record<string, string> = {
  ə: "e", ı: "i", ö: "o", ü: "u", ç: "c", ş: "s", ğ: "g", İ: "i",
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "j",
  з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c",
  ч: "ch", ш: "sh", щ: "sch", ы: "y", э: "e", ю: "yu", я: "ya",
  ь: "", ъ: "",
};

/** Başlıqdan URL-ə uyğun slug çıxarır (AZ/RU hərfləri translit olunur) */
export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .split("")
    .map((ch) => TRANSLIT[ch] ?? ch)
    .join("")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
