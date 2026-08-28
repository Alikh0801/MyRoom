"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  PremiumPlanPicker,
  type PremiumPlanId,
} from "@/components/listings/PremiumPlanPicker";
import { createVipCheckout } from "@/lib/payments/vip";
import {
  PAYMENTS_ENABLED,
  PAYMENTS_TEST_MODE_PATH,
} from "@/lib/payments/config";

interface RequestVipButtonProps {
  listingId: string;
  disabled?: boolean;
}

export function RequestVipButton({ listingId, disabled }: RequestVipButtonProps) {
  const t = useTranslations("dashboard.vip");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<PremiumPlanId>("day");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handlePay() {
    setError(null);

    if (plan === "none") {
      setError(t("selectPlan"));
      return;
    }

    // Ödəniş şlüzü test mərhələsindədir — bank səhifəsinə yönləndirmək
    // əvəzinə məlumat səhifəsi göstəririk.
    if (!PAYMENTS_ENABLED) {
      router.push(PAYMENTS_TEST_MODE_PATH);
      return;
    }

    startTransition(async () => {
      const result = await createVipCheckout(listingId, plan);
      if (result.ok) {
        window.location.href = result.redirectUrl;
      } else {
        setError(result.error);
      }
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        className="btn btn--ghost"
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        {t("button")}
      </button>
    );
  }

  return (
    <div className="vip-request-panel">
      <PremiumPlanPicker selected={plan} onSelectedChange={setPlan} />

      {error && <p className="auth-form__error">{error}</p>}

      <div className="vip-request-panel__actions">
        <button
          type="button"
          className="btn btn--primary"
          disabled={isPending}
          onClick={handlePay}
        >
          {isPending ? t("submitting") : t("confirm")}
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          disabled={isPending}
          onClick={() => setOpen(false)}
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}
