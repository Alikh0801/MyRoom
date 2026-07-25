"use client";

import { useActionState, useState } from "react";
import {
  savePaymentSettings,
  type PaymentSettingsState,
} from "@/lib/admin/payment-settings-actions";
import type { PaymentSettings } from "@/lib/queries/payment-settings";

interface PaymentSettingsFormProps {
  settings: PaymentSettings;
}

export function PaymentSettingsForm({ settings }: PaymentSettingsFormProps) {
  const [state, formAction, pending] = useActionState<
    PaymentSettingsState,
    FormData
  >(savePaymentSettings, null);

  const [cardNumber, setCardNumber] = useState(settings.card_number ?? "");

  return (
    <form className="payment-settings-form" action={formAction}>
      {state?.error && <p className="auth-form__error">{state.error}</p>}
      {state?.success && <p className="auth-form__success">{state.success}</p>}

      <label className="auth-form__field">
        Bank adı
        <input
          type="text"
          name="bankName"
          defaultValue={settings.bank_name ?? ""}
          placeholder="məs. Kapital Bank"
        />
      </label>

      <label className="auth-form__field">
        Kart nömrəsi *
        <input
          type="text"
          name="cardNumber"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="4169 **** **** ****"
          required
        />
      </label>

      <label className="auth-form__field">
        Kart sahibi
        <input
          type="text"
          name="cardholderName"
          defaultValue={settings.cardholder_name ?? ""}
          placeholder="Ad Soyad"
        />
      </label>

      <button
        type="submit"
        className="btn btn--primary"
        disabled={pending}
      >
        {pending ? "Saxlanılır..." : "Yadda saxla"}
      </button>
    </form>
  );
}
