import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { withLocalePrefix } from "@/lib/i18n/locale-path";
import type { Locale } from "@/i18n/routing";

export async function localizedRedirect(path: string): Promise<never> {
  const locale = (await getLocale()) as Locale;
  const [pathname, search = ""] = path.split("?");
  const href =
    withLocalePrefix(pathname, locale) + (search ? `?${search}` : "");
  redirect(href);
}
