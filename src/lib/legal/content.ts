import type { Locale } from "@/i18n/routing";
import { PRIVACY_INTRO, PRIVACY_SECTIONS } from "@/lib/legal/privacy-az";
import { PRIVACY_INTRO_RU, PRIVACY_SECTIONS_RU } from "@/lib/legal/privacy-ru";
import { TERMS_INTRO, TERMS_SECTIONS } from "@/lib/legal/terms-az";
import { TERMS_INTRO_RU, TERMS_SECTIONS_RU } from "@/lib/legal/terms-ru";

export function getTermsContent(locale: Locale) {
  if (locale === "ru") {
    return { intro: TERMS_INTRO_RU, sections: TERMS_SECTIONS_RU };
  }

  return { intro: TERMS_INTRO, sections: TERMS_SECTIONS };
}

export function getPrivacyContent(locale: Locale) {
  if (locale === "ru") {
    return { intro: PRIVACY_INTRO_RU, sections: PRIVACY_SECTIONS_RU };
  }

  return { intro: PRIVACY_INTRO, sections: PRIVACY_SECTIONS };
}
