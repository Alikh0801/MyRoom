"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

interface LanguageSwitcherProps {
  variant?: "desktop" | "mobile";
}

function GlobeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export function LanguageSwitcher({ variant = "desktop" }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");

  const otherLocale = routing.locales.find((item) => item !== locale) ?? locale;

  function switchLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
  }

  if (variant === "mobile") {
    return (
      <button
        type="button"
        className="lang-switcher--mobile"
        onClick={() => switchLocale(otherLocale)}
        aria-label={`${t("language")}: ${otherLocale.toUpperCase()}`}
      >
        <GlobeIcon />
        <span>{locale.toUpperCase()}</span>
      </button>
    );
  }

  return (
    <div
      className="lang-switcher--desktop"
      role="group"
      aria-label={t("language")}
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
