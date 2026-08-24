"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { recordSiteVisit } from "@/lib/analytics/actions";
import { stripLocalePrefix } from "@/lib/i18n/locale-path";

export function VisitLogger() {
  const pathname = usePathname();
  const locale = useLocale();
  const lastLoggedPath = useRef<string | null>(null);

  useEffect(() => {
    if (lastLoggedPath.current === pathname) return;
    lastLoggedPath.current = pathname;

    const path = stripLocalePrefix(pathname);
    if (path.startsWith("/admin")) return;

    recordSiteVisit(path, locale).catch(() => {
      // Ziyarət qeydi best-effort-dur, xəta səhifə yüklənməsinə mane olmamalıdır.
    });
  }, [pathname, locale]);

  return null;
}
