"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { PaymentCardDetails } from "@/components/listings/PaymentCardDetails";
import type { PaymentSettings } from "@/lib/queries/payment-settings";

export const PREMIUM_PLANS = [
  { id: "none", priceAzn: 0, durationKey: "none" as const },
  { id: "day", priceAzn: 3, durationKey: "day" as const },
  { id: "week", priceAzn: 16, durationKey: "week" as const, recommended: true },
] as const;

export type PremiumPlanId = (typeof PREMIUM_PLANS)[number]["id"];

interface PremiumPlanPickerProps {
  paymentSettings: PaymentSettings;
  receiptFile: File | null;
  onReceiptChange: (file: File | null) => void;
  selected?: PremiumPlanId;
  onSelectedChange?: (plan: PremiumPlanId) => void;
  showReceiptRequired?: boolean;
}

export function PremiumPlanPicker({
  paymentSettings,
  receiptFile,
  onReceiptChange,
  selected: controlledSelected,
  onSelectedChange,
  showReceiptRequired = true,
}: PremiumPlanPickerProps) {
  const t = useTranslations("listingForm.premium");
  const [internalSelected, setInternalSelected] =
    useState<PremiumPlanId>("none");
  const selected = controlledSelected ?? internalSelected;

  function setSelected(plan: PremiumPlanId) {
    onSelectedChange?.(plan);
    if (controlledSelected === undefined) {
      setInternalSelected(plan);
    }
    if (plan === "none") {
      onReceiptChange(null);
    }
  }

  const needsPayment = selected === "day" || selected === "week";

  return (
    <div className="premium-picker">
      <input type="hidden" name="premiumPlan" value={selected} />

      <p className="premium-picker__intro">{t("intro")}</p>
      <p className="premium-picker__note">{t("paymentNotice")}</p>

      <div
        className="premium-picker__grid"
        role="radiogroup"
        aria-label={t("ariaLabel")}
      >
        {PREMIUM_PLANS.map((plan) => {
          const isSelected = selected === plan.id;
          const isFree = plan.id === "none";

          return (
            <button
              key={plan.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`premium-picker__card${
                isSelected ? " premium-picker__card--selected" : ""
              }${"recommended" in plan && plan.recommended ? " premium-picker__card--recommended" : ""}${
                isFree ? " premium-picker__card--free" : ""
              }`}
              onClick={() => setSelected(plan.id)}
            >
              {"recommended" in plan && plan.recommended && (
                <span className="premium-picker__badge">{t("recommended")}</span>
              )}

              {!isFree && (
                <span className="premium-picker__vip" aria-hidden="true">
                  VIP
                </span>
              )}

              <span className="premium-picker__duration">
                {t(`plans.${plan.durationKey}.duration`)}
              </span>

              <span className="premium-picker__price">
                {isFree ? (
                  t("plans.none.price")
                ) : (
                  <>
                    <strong>{plan.priceAzn}</strong> AZN
                  </>
                )}
              </span>

              <span className="premium-picker__desc">
                {t(`plans.${plan.durationKey}.desc`)}
              </span>
            </button>
          );
        })}
      </div>

      {needsPayment && (
        <div className="premium-picker__payment">
          <PaymentCardDetails settings={paymentSettings} />

          {showReceiptRequired && (
            <label className="premium-picker__receipt">
              <span className="premium-picker__receipt-label">
                {t("payment.receiptLabel")}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => onReceiptChange(e.target.files?.[0] ?? null)}
              />
              {receiptFile && (
                <span className="premium-picker__receipt-name">
                  {receiptFile.name}
                </span>
              )}
              <span className="premium-picker__receipt-hint">
                {t("payment.receiptHint")}
              </span>
            </label>
          )}
        </div>
      )}
    </div>
  );
}
