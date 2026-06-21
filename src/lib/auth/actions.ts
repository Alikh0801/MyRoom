"use server";

import { redirect } from "next/navigation";
import { checkAuthRateLimit } from "@/lib/auth/rate-limit";
import { translateAuthError } from "@/lib/auth/errors";
import { verifyTurnstileToken } from "@/lib/auth/turnstile";
import { isValidPhone, normalizePhone } from "@/lib/phone";
import { getClientIp } from "@/lib/request";
import { createClient } from "@/lib/supabase/server";

export interface AuthState {
  error?: string;
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

export async function signIn(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState | null> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/";
  const turnstileToken = formData.get("turnstileToken") as string | null;

  if (!email || !password) {
    return { error: "Email və şifrə daxil edin." };
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
    return { error: translateAuthError(error.message) };
  }

  redirect(redirectTo);
}

export async function signUp(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState | null> {
  const fullName = (formData.get("fullName") as string)?.trim();
  const emailRaw = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const phoneRaw = (formData.get("phone") as string)?.trim();
  const whatsappRaw = (formData.get("whatsappPhone") as string)?.trim();
  const turnstileToken = formData.get("turnstileToken") as string | null;

  if (!fullName || !emailRaw || !password) {
    return { error: "Ad, email və şifrə mütləqdir." };
  }

  const email = normalizeEmail(emailRaw);

  if (!phoneRaw) {
    return { error: "Zəng üçün telefon nömrəsi mütləqdir." };
  }

  if (!whatsappRaw) {
    return { error: "WhatsApp nömrəsi mütləqdir." };
  }

  const phone = normalizePhone(phoneRaw);
  const whatsappPhone = normalizePhone(whatsappRaw);

  if (!phone || !isValidPhone(phoneRaw)) {
    return { error: "Zəng telefonu düzgün deyil. Nümunə: +994501234567" };
  }

  if (!whatsappPhone || !isValidPhone(whatsappRaw)) {
    return { error: "WhatsApp nömrəsi düzgün deyil. Nümunə: +994501234567" };
  }

  if (password.length < 6) {
    return { error: "Şifrə ən azı 6 simvol olmalıdır." };
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
    return { error: "Bu email ilə artıq qeydiyyatdan keçilib." };
  }

  if (await isPhoneRegistered(supabase, phone)) {
    return { error: "Bu telefon nömrəsi ilə artıq qeydiyyatdan keçilib." };
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
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback?next=/`,
    },
  });

  if (error) {
    if (
      error.message.includes("duplicate") ||
      error.message.includes("unique") ||
      error.message.includes("already registered")
    ) {
      return { error: "Bu email ilə artıq qeydiyyatdan keçilib." };
    }
    return { error: translateAuthError(error.message) };
  }

  if (data.user && data.user.identities?.length === 0) {
    return { error: "Bu email ilə artıq qeydiyyatdan keçilib." };
  }

  if (data.user && !data.session) {
    redirect("/auth/check-email");
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

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
