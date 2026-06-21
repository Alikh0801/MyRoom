"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signUp, type AuthState } from "@/lib/auth/actions";
import {
  TurnstileField,
  useTurnstileRequired,
} from "@/components/auth/TurnstileField";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<AuthState | null, FormData>(
    signUp,
    null
  );
  const [phone, setPhone] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [sameAsPhone, setSameAsPhone] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRequired = useTurnstileRequired();

  function handleSameAsPhoneChange(checked: boolean) {
    setSameAsPhone(checked);
    if (checked) {
      setWhatsappPhone(phone);
    }
  }

  function handlePhoneChange(value: string) {
    setPhone(value);
    if (sameAsPhone) {
      setWhatsappPhone(value);
    }
  }

  const submitDisabled =
    pending || (turnstileRequired && !turnstileToken);

  return (
    <form className="auth-form" action={formAction}>
      {state?.error && <p className="auth-form__error">{state.error}</p>}

      <label className="auth-form__field">
        Ad, soyad
        <input
          type="text"
          name="fullName"
          required
          autoComplete="name"
          placeholder="Ad Soyad"
        />
      </label>

      <label className="auth-form__field">
        Email
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="siz@example.com"
        />
      </label>

      <label className="auth-form__field">
        Zəng üçün telefon *
        <input
          type="tel"
          name="phone"
          required
          autoComplete="tel"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          placeholder="+994 50 123 45 67"
        />
      </label>

      <label className="auth-form__checkbox">
        <input
          type="checkbox"
          checked={sameAsPhone}
          onChange={(e) => handleSameAsPhoneChange(e.target.checked)}
        />
        WhatsApp nömrəsi telefon ilə eynidir
      </label>

      {sameAsPhone ? (
        <input type="hidden" name="whatsappPhone" value={phone} />
      ) : (
        <label className="auth-form__field">
          WhatsApp nömrəsi *
          <input
            type="tel"
            name="whatsappPhone"
            required
            autoComplete="tel"
            value={whatsappPhone}
            onChange={(e) => setWhatsappPhone(e.target.value)}
            placeholder="+994 50 123 45 67"
          />
        </label>
      )}

      <label className="auth-form__field">
        Şifrə
        <input
          type="password"
          name="password"
          required
          autoComplete="new-password"
          placeholder="Ən azı 6 simvol"
          minLength={6}
        />
      </label>

      {turnstileRequired && (
        <input type="hidden" name="turnstileToken" value={turnstileToken} />
      )}
      <TurnstileField
        resetKey={state?.error}
        onTokenChange={setTurnstileToken}
      />

      <button
        type="submit"
        className="btn btn--primary auth-form__submit"
        disabled={submitDisabled}
      >
        {pending ? "Qeydiyyat..." : "Qeydiyyatdan keç"}
      </button>

      <p className="auth-form__footer">
        Artıq hesabınız var? <Link href="/auth/login">Daxil olun</Link>
      </p>
    </form>
  );
}
