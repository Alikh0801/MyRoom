"use client";

import { useTranslations } from "next-intl";
import type { PaymentSettings } from "@/lib/queries/payment-settings";

interface PaymentCardDetailsProps {
  settings: PaymentSettings;
}

export function PaymentCardDetails({ settings }: PaymentCardDetailsProps) {
  const t = useTranslations("listingForm.premium.payment");

  if (!settings.card_number?.trim()) {
    return (
      <div className="payment-card-details payment-card-details--empty">
        <p>{t("cardNotConfigured")}</p>
      </div>
    );
  }

  return (
    <div className="payment-card-details">
      <p className="payment-card-details__title">{t("title")}</p>
      <p className="payment-card-details__hint">{t("hint")}</p>
      <dl className="payment-card-details__list">
        {settings.bank_name && (
          <div>
            <dt>{t("bankName")}</dt>
            <dd>{settings.bank_name}</dd>
          </div>
        )}
        <div>
          <dt>{t("cardNumber")}</dt>
          <dd className="payment-card-details__card">{settings.card_number}</dd>
        </div>
        {settings.cardholder_name && (
          <div>
            <dt>{t("cardholder")}</dt>
            <dd>{settings.cardholder_name}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
