"use client";

import { useTranslations } from "next-intl";
import { startTransition, useActionState, useState } from "react";
import {
  PremiumPlanPicker,
  type PremiumPlanId,
} from "@/components/listings/PremiumPlanPicker";
import {
  requestListingVip,
  type VipRequestState,
} from "@/lib/listings/vip-request-actions";
import { uploadVipReceipt } from "@/lib/listings/upload-vip-receipt";
import type { PaymentSettings } from "@/lib/queries/payment-settings";

interface RequestVipButtonProps {
  listingId: string;
  paymentSettings: PaymentSettings;
  disabled?: boolean;
}

export function RequestVipButton({
  listingId,
  paymentSettings,
  disabled,
}: RequestVipButtonProps) {
  const t = useTranslations("dashboard.vip");
  const tErrors = useTranslations("listingForm.errors");
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<PremiumPlanId>("day");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [state, formAction, pending] = useActionState<
    VipRequestState,
    FormData
  >(requestListingVip, null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setClientError(null);

    if (plan === "none") {
      setClientError(t("selectPlan"));
      return;
    }

    if (!receiptFile) {
      setClientError(t("receiptRequired"));
      return;
    }

    setUploading(true);
    try {
      const { storagePath } = await uploadVipReceipt(
        listingId,
        receiptFile,
        (key) => tErrors(key)
      );

      const formData = new FormData();
      formData.set("listingId", listingId);
      formData.set("premiumPlan", plan);
      formData.set("receiptStoragePath", storagePath);

      startTransition(() => {
        formAction(formData);
      });
    } catch (err) {
      setClientError(
        err instanceof Error ? err.message : t("uploadFailed")
      );
    } finally {
      setUploading(false);
    }
  }

  if (state?.success) {
    return (
      <p className="my-listing-card__vip-success">{state.success}</p>
    );
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

  const busy = pending || uploading;
  const displayError = clientError ?? state?.error;

  return (
    <div className="vip-request-panel">
      <form onSubmit={handleSubmit}>
        <PremiumPlanPicker
          paymentSettings={paymentSettings}
          receiptFile={receiptFile}
          onReceiptChange={setReceiptFile}
          selected={plan}
          onSelectedChange={setPlan}
        />

        {displayError && <p className="auth-form__error">{displayError}</p>}

        <div className="vip-request-panel__actions">
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy ? t("submitting") : t("submit")}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            disabled={busy}
            onClick={() => setOpen(false)}
          >
            {t("cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}
