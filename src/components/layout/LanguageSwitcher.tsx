"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { FlagIcon } from "@/components/layout/FlagIcon";
import { routing, type Locale } from "@/i18n/routing";

const LOCALE_META: Record<Locale, { code: string }> = {
  az: { code: "AZ" },
  ru: { code: "RU" },
  tr: { code: "TR" },
};

interface LanguageSwitcherProps {
  variant?: "desktop" | "mobile";
}

export function LanguageSwitcher({ variant = "desktop" }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function switchLocale(nextLocale: Locale) {
    setOpen(false);
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
  }

  const current = LOCALE_META[locale];
  const wrapperClass =
    variant === "mobile" ? "lang-switcher--mobile" : "lang-switcher--desktop";

  return (
    <div className={`lang-switcher ${wrapperClass}`} ref={rootRef}>
      <button
        type="button"
        className="lang-switcher__trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t("language")}
      >
        <FlagIcon locale={locale} className="lang-switcher__flag" />
        <span className="lang-switcher__code">{current.code}</span>
        <svg
          className={`lang-switcher__chevron${open ? " lang-switcher__chevron--open" : ""}`}
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="lang-switcher__dropdown" role="menu">
          {routing.locales.map((item) => (
            <button
              key={item}
              type="button"
              role="menuitem"
              className={`lang-switcher__option${
                item === locale ? " lang-switcher__option--active" : ""
              }`}
              onClick={() => switchLocale(item)}
              aria-current={item === locale}
            >
              <FlagIcon locale={item} className="lang-switcher__flag" />
              {LOCALE_META[item].code}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
