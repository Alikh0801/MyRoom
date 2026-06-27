"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface LegalAcceptanceFieldProps {
  className?: string;
}

export function LegalAcceptanceField({ className }: LegalAcceptanceFieldProps) {
  const t = useTranslations("legal");

  return (
    <label className={`legal-acceptance${className ? ` ${className}` : ""}`}>
      <input type="checkbox" name="acceptTerms" required />
      <span className="legal-acceptance__text">
        {t("acceptPrefix")}
        <Link href="/terms" target="_blank" rel="noopener noreferrer">
          {t("acceptTermsLink")}
        </Link>{" "}
        {t("acceptAnd")}{" "}
        <Link href="/privacy" target="_blank" rel="noopener noreferrer">
          {t("acceptPrivacyLink")}
        </Link>{" "}
        {t("acceptSuffix")}
      </span>
    </label>
  );
}
