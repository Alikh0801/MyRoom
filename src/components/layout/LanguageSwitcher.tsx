"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div
      className="lang-switcher"
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((item) => (
        <button
          key={item}
          type="button"
          className={`lang-switcher__btn${
            item === locale ? " lang-switcher__btn--active" : ""
          }`}
          onClick={() => switchLocale(item)}
          aria-pressed={item === locale}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
