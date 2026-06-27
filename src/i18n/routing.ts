import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["az", "ru"],
  defaultLocale: "az",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
