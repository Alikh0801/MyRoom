/** Azərbaycanın şəhər və rayonları (inzibati vahidlər) */
export const AZ_REGIONS = [
  "Abşeron",
  "Ağcabədi",
  "Ağdam",
  "Ağdaş",
  "Ağstafa",
  "Ağsu",
  "Astara",
  "Babək",
  "Bakı",
  "Balakən",
  "Beyləqan",
  "Biləsuvar",
  "Cəbrayıl",
  "Cəlilabad",
  "Culfa",
  "Daşkəsən",
  "Füzuli",
  "Gədəbəy",
  "Gəncə",
  "Goranboy",
  "Göyçay",
  "Göygöl",
  "Hacıqabul",
  "Xaçmaz",
  "Xankəndi",
  "Xızı",
  "Xocalı",
  "Xocavənd",
  "İmişli",
  "İsmayıllı",
  "Kəlbəcər",
  "Kəngərli",
  "Kürdəmir",
  "Laçın",
  "Lənkəran",
  "Lerik",
  "Masallı",
  "Mingəçevir",
  "Naftalan",
  "Naxçıvan",
  "Neftçala",
  "Oğuz",
  "Ordubad",
  "Qax",
  "Qazax",
  "Qəbələ",
  "Qobustan",
  "Quba",
  "Qubadlı",
  "Qusar",
  "Saatlı",
  "Sabirabad",
  "Şabran",
  "Sədərək",
  "Salyan",
  "Şamaxı",
  "Samux",
  "Şahbuz",
  "Şəki",
  "Şəmkir",
  "Şərur",
  "Şirvan",
  "Siyəzən",
  "Sumqayıt",
  "Şuşa",
  "Tərtər",
  "Tovuz",
  "Ucar",
  "Yardımlı",
  "Yevlax",
  "Zəngilan",
  "Zaqatala",
  "Zərdab",
] as const;

export type AzRegion = (typeof AZ_REGIONS)[number];

const regionSet = new Set<string>(AZ_REGIONS);

export function isValidRegion(value: string): value is AzRegion {
  return regionSet.has(value);
}

export function filterRegions(query: string): AzRegion[] {
  const q = query.trim().toLocaleLowerCase("az");
  if (!q) return [...AZ_REGIONS];
  return AZ_REGIONS.filter((region) =>
    region.toLocaleLowerCase("az").includes(q)
  );
}
