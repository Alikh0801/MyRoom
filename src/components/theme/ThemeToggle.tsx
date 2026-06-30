"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getResolvedTheme, setTheme, type Theme } from "@/lib/theme";

function SunIcon() {
  return (
    <svg
      className="theme-toggle__icon theme-toggle__sun"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className="theme-toggle__icon theme-toggle__moon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function ThemeToggle() {
  const t = useTranslations("theme");
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setThemeState(getResolvedTheme());
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  }

  if (!mounted) {
    return <span className="theme-toggle theme-toggle--placeholder" aria-hidden />;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`theme-toggle${isDark ? " theme-toggle--dark" : ""}`}
      onClick={toggle}
      aria-label={isDark ? t("switchToLight") : t("switchToDark")}
      title={isDark ? t("switchToLight") : t("switchToDark")}
    >
      <span className="theme-toggle__thumb" aria-hidden />
      <span className="theme-toggle__icons" aria-hidden>
        <SunIcon />
        <MoonIcon />
      </span>
    </button>
  );
}
