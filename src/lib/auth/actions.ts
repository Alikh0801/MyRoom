"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { localizedRedirect } from "@/lib/i18n/server-redirect";
import { withLocalePrefix } from "@/lib/i18n/locale-path";
import type { Locale } from "@/i18n/routing";
import { checkAuthRateLimit } from "@/lib/auth/rate-limit";
import { resolveAuthErrorKey, type AuthErrorKey } from "@/lib/auth/errors";
import { verifyTurnstileToken } from "@/lib/auth/turnstile";
import { isValidPhone, normalizePhone } from "@/lib/phone";
import { getClientIp } from "@/lib/request";
import { getSiteUrl } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { hasAcceptedLegalTerms } from "@/lib/legal/validation";
import { EMAIL_OTP_LENGTH } from "@/lib/auth/otp";
import {
  getPendingVerificationCookieOptions,
  PENDING_VERIFICATION_COOKIE,
} from "@/lib/auth/pending-verification";

export interface AuthState {
  error?: string;
  errorKey?: AuthErrorKey;
  success?: string;
}

async function isPhoneRegistered(
  supabase: Awaited<ReturnType<typeof createClient>>,
  phone: string
) {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("phone", phone)
    .maybeSingle();

  return Boolean(data);
}

async function isEmailRegistered(
  supabase: Awaited<ReturnType<typeof createClient>>,
  email: string
) {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  return Boolean(data);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeRedirectTo(value: string): string {
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export async function signInWithGoogle(redirectTo: string): Promise<void> {
  const normalizedRedirectTo = normalizeRedirectTo(redirectTo || "/");
  const locale = (await getLocale()) as Locale;
  const supabase = await createClient();

  const callbackUrl = new URL(`${getSiteUrl()}/auth/callback`);
  callbackUrl.searchParams.set(
    "next",
    withLocalePrefix(normalizedRedirectTo, locale)
  );

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl.toString(),
      queryParams: { hl: locale },
    },
  });

  if (error || !data?.url) {
    await localizedRedirect("/auth/login?error=oauth_failed");
    return;
  }

  redirect(data.url);
}

export async function signIn(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState | null> {
  const t = await getTranslations("auth.errors");
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const redirectTo = normalizeRedirectTo(
    (formData.get("redirectTo") as string) || "/"
  );
  const turnstileToken = formData.get("turnstileToken") as string | null;

  if (!email || !password) {
    return { error: t("missingCredentials") };
  }

  const ip = await getClientIp();
  const rateLimit = await checkAuthRateLimit("signin", ip);
  if (!rateLimit.ok) {
    return { error: rateLimit.error };
  }

  const captcha = await verifyTurnstileToken(turnstileToken);
  if (!captcha.ok) {
    return { error: captcha.error };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const errorKey = resolveAuthErrorKey(error.message);
    if (errorKey === "emailNotConfirmed") {
      const cookieStore = await cookies();
      cookieStore.set(
        PENDING_VERIFICATION_COOKIE,
        email,
        getPendingVerificationCookieOptions()
      );
      return localizedRedirect(
        `/auth/verify-email?email=${encodeURIComponent(email)}&reason=unconfirmed`
      );
    }
    return { error: t(errorKey) };
  }

  return localizedRedirect(redirectTo || "/");
}

export async function signUp(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState | null> {
  const t = await getTranslations("auth.errors");
  const fullName = (formData.get("fullName") as string)?.trim();
  const emailRaw = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const phoneRaw = (formData.get("phone") as string)?.trim();
  const whatsappRaw = (formData.get("whatsappPhone") as string)?.trim();
  const turnstileToken = formData.get("turnstileToken") as string | null;

  if (!fullName || !emailRaw || !password) {
    return { error: t("missingRequired") };
  }

  const email = normalizeEmail(emailRaw);

  if (!phoneRaw) {
    return { error: t("missingPhone") };
  }

  if (!whatsappRaw) {
    return { error: t("missingWhatsapp") };
  }

  const phone = normalizePhone(phoneRaw);
  const whatsappPhone = normalizePhone(whatsappRaw);

  if (!phone || !isValidPhone(phoneRaw)) {
    return { error: t("invalidPhone") };
  }

  if (!whatsappPhone || !isValidPhone(whatsappRaw)) {
    return { error: t("invalidWhatsapp") };
  }

  if (password.length < 6) {
    return { error: t("passwordTooShort") };
  }

  if (!hasAcceptedLegalTerms(formData)) {
    return { error: t("legalRequired") };
  }

  const ip = await getClientIp();
  const rateLimit = await checkAuthRateLimit("signup", ip);
  if (!rateLimit.ok) {
    return { error: rateLimit.error };
  }

  const captcha = await verifyTurnstileToken(turnstileToken);
  if (!captcha.ok) {
    return { error: captcha.error };
  }

  const supabase = await createClient();

  if (await isEmailRegistered(supabase, email)) {
    return { error: t("emailAlreadyRegistered") };
  }

  if (await isPhoneRegistered(supabase, phone)) {
    return { error: t("phoneAlreadyRegistered") };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
        whatsapp_phone: whatsappPhone,
      },
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/`,
    },
  });

  if (error) {
    if (
      error.message.includes("duplicate") ||
      error.message.includes("unique") ||
      error.message.includes("already registered")
    ) {
      return { error: t("emailAlreadyRegistered") };
    }
    return { error: t(resolveAuthErrorKey(error.message)) };
  }

  if (data.user && data.user.identities?.length === 0) {
    return { error: t("emailAlreadyRegistered") };
  }

  if (data.user && !data.user.email_confirmed_at) {
    const cookieStore = await cookies();
    cookieStore.set(
      PENDING_VERIFICATION_COOKIE,
      email,
      getPendingVerificationCookieOptions()
    );
    return localizedRedirect(
      `/auth/verify-email?email=${encodeURIComponent(email)}`
    );
  }

  if (data.user && data.session) {
    await supabase
      .from("profiles")
      .update({
        phone,
        whatsapp_phone: whatsappPhone,
        full_name: fullName,
        email,
      })
      .eq("id", data.user.id);
  }

  return localizedRedirect("/");
}

export async function verifyEmailOtp(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState | null> {
  const t = await getTranslations("auth.errors");
  const email = normalizeEmail((formData.get("email") as string) ?? "");
  const token = (formData.get("token") as string)?.trim();

  if (!email) {
    return { error: t("emailNotFound") };
  }

  if (!token) {
    return { error: t("missingOtp") };
  }

  if (!new RegExp(`^\\d{${EMAIL_OTP_LENGTH}}$`).test(token)) {
    return { error: t("invalidOtpLength", { length: EMAIL_OTP_LENGTH }) };
  }

  const ip = await getClientIp();
  const rateLimit = await checkAuthRateLimit("verify-otp", ip);
  if (!rateLimit.ok) {
    return { error: rateLimit.error };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "signup",
  });

  if (error) {
    const errorKey = resolveAuthErrorKey(error.message);
    return { error: t(errorKey), errorKey };
  }

  const cookieStore = await cookies();
  cookieStore.delete(PENDING_VERIFICATION_COOKIE);

  return localizedRedirect("/");
}

export async function resendVerificationOtp(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState | null> {
  const tErrors = await getTranslations("auth.errors");
  const tVerify = await getTranslations("auth.verify");
  const email = normalizeEmail((formData.get("email") as string) ?? "");

  if (!email) {
    return { error: tErrors("emailNotFound") };
  }

  const ip = await getClientIp();
  const rateLimit = await checkAuthRateLimit("resend-otp", ip);
  if (!rateLimit.ok) {
    return { error: rateLimit.error };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });

  if (error) {
    return { error: tErrors(resolveAuthErrorKey(error.message)) };
  }

  return { success: tVerify("resendSuccess") };
}

export async function requestPasswordReset(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState | null> {
  const t = await getTranslations("auth.errors");
  const tForgot = await getTranslations("auth.forgot");
  const email = normalizeEmail((formData.get("email") as string) ?? "");
  const turnstileToken = formData.get("turnstileToken") as string | null;

  if (!email) {
    return { error: t("missingEmail") };
  }

  const ip = await getClientIp();
  const rateLimit = await checkAuthRateLimit("forgot-password", ip);
  if (!rateLimit.ok) {
    return { error: rateLimit.error };
  }

  const captcha = await verifyTurnstileToken(turnstileToken);
  if (!captcha.ok) {
    return { error: captcha.error };
  }

  const locale = (await getLocale()) as Locale;
  const recoveryPath =
    locale === "az"
      ? "/auth/callback/recovery"
      : `/auth/callback/recovery/${locale}`;
  const redirectTo = `${getSiteUrl()}${recoveryPath}`;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    const errorKey = resolveAuthErrorKey(error.message);
    if (errorKey === "rateLimitResend" || errorKey === "invalidEmailFormat") {
      return { error: t(errorKey) };
    }
  }

  return { success: tForgot("emailSent") };
}

export async function updatePassword(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState | null> {
  const t = await getTranslations("auth.errors");
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || password.length < 6) {
    return { error: t("passwordTooShort") };
  }

  if (password !== confirmPassword) {
    return { error: t("passwordMismatch") };
  }

  const ip = await getClientIp();
  const rateLimit = await checkAuthRateLimit("reset-password", ip);
  if (!rateLimit.ok) {
    return { error: rateLimit.error };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: t("resetSessionExpired") };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: t(resolveAuthErrorKey(error.message)) };
  }

  await supabase.auth.signOut();
  return localizedRedirect("/auth/login?reset=success");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return localizedRedirect("/");
}
