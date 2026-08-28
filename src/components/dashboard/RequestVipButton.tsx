"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import {
  PremiumPlanPicker,
  type PremiumPlanId,
} from "@/components/listings/PremiumPlanPicker";
import { createVipCheckout } from "@/lib/payments/vip";

interface RequestVipButtonProps {
  listingId: string;
  disabled?: boolean;
}

export function RequestVipButton({ listingId, disabled }: RequestVipButtonProps) {
  const t = useTranslations("dashboard.vip");
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
          {isPending ? t("submitting") : t("payOnline")}
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
