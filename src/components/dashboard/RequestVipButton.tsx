"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  PremiumPlanPicker,
  type PremiumPlanId,
} from "@/components/listings/PremiumPlanPicker";

interface RequestVipButtonProps {
  disabled?: boolean;
}

/**
 * VIP paketlərini göstərir, amma hələlik satın almaq mümkün deyil — ödəniş
 * sistemi qoşulmayıb. Təsdiq düyməsi qəsdən deaktivdir: sahib paketləri və
 * qiymətləri görsün, amma işləməyən addıma yönləndirilməsin. Səbəb seçimin
 * altındakı qeyddə yazılır (PremiumPlanPicker).
 */
export function RequestVipButton({ disabled }: RequestVipButtonProps) {
  const t = useTranslations("dashboard.vip");
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<PremiumPlanId>("day");

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

      <div className="vip-request-panel__actions">
        <button type="button" className="btn btn--primary" disabled>
          {t("confirm")}
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setOpen(false)}
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}
