"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp, type AuthState } from "@/lib/auth/actions";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<AuthState | null, FormData>(
    signUp,
    null
  );

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
        Telefon (WhatsApp)
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          placeholder="+994 50 123 45 67"
        />
      </label>

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

      <button type="submit" className="btn btn--primary auth-form__submit" disabled={pending}>
        {pending ? "Qeydiyyat..." : "Qeydiyyatdan keç"}
      </button>

      <p className="auth-form__footer">
        Artıq hesabınız var? <Link href="/auth/login">Daxil olun</Link>
      </p>
    </form>
  );
}
