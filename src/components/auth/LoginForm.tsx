"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signIn, type AuthState } from "@/lib/auth/actions";
import {
  TurnstileField,
  useTurnstileRequired,
} from "@/components/auth/TurnstileField";

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo = "/" }: LoginFormProps) {
  const [state, formAction, pending] = useActionState<AuthState | null, FormData>(
    signIn,
    null
  );
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRequired = useTurnstileRequired();
  const submitDisabled =
    pending || (turnstileRequired && !turnstileToken);

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
        {pending ? "Giriş edilir..." : "Daxil ol"}
      </button>

      <p className="auth-form__footer">
        Hesabınız yoxdur?{" "}
        <Link href="/auth/register">Qeydiyyatdan keçin</Link>
      </p>
    </form>
  );
}
