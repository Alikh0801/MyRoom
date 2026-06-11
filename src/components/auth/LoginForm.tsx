"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, type AuthState } from "@/lib/auth/actions";

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo = "/dashboard" }: LoginFormProps) {
  const [state, formAction, pending] = useActionState<AuthState | null, FormData>(
    signIn,
    null
  );

  return (
    <form className="auth-form" action={formAction}>
      <input type="hidden" name="redirectTo" value={redirectTo} />

      {state?.error && <p className="auth-form__error">{state.error}</p>}

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
        Şifrə
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          minLength={6}
        />
      </label>

      <button type="submit" className="btn btn--primary auth-form__submit" disabled={pending}>
        {pending ? "Giriş edilir..." : "Daxil ol"}
      </button>

      <p className="auth-form__footer">
        Hesabınız yoxdur?{" "}
        <Link href="/auth/register">Qeydiyyatdan keçin</Link>
      </p>
    </form>
  );
}
