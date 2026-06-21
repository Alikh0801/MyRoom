"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useEffect, useRef } from "react";
import { isTurnstileEnabled } from "@/lib/auth/turnstile-client";

interface TurnstileFieldProps {
  resetKey?: string | number | boolean;
  onTokenChange: (token: string) => void;
}

export function TurnstileField({ resetKey, onTokenChange }: TurnstileFieldProps) {
  const ref = useRef<TurnstileInstance>(null);
  const enabled = isTurnstileEnabled();

  useEffect(() => {
    if (resetKey) {
      onTokenChange("");
      ref.current?.reset();
    }
  }, [resetKey, onTokenChange]);

  if (!enabled) {
    return null;
  }

  return (
    <div className="auth-form__turnstile">
      <Turnstile
        ref={ref}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={onTokenChange}
        onExpire={() => onTokenChange("")}
        onError={() => onTokenChange("")}
        options={{ theme: "light", size: "flexible" }}
      />
    </div>
  );
}

export function useTurnstileRequired(): boolean {
  return isTurnstileEnabled();
}
