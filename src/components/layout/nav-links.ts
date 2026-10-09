/**
 * Başlıqdakı səhifə keçidləri. Tək siyahıdan həm masaüstü naviqasiyası, həm
 * də mobil menyular (UserMenu / AuthMenu) qidalanır ki, biri əlavə olunanda
 * digəri unudulmasın.
 */
export const HEADER_NAV_LINKS = [
  { href: "/blog", labelKey: "blog" },
  { href: "/about", labelKey: "about" },
] as const;
