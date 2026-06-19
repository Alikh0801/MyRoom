"use server";

import { redirect } from "next/navigation";
import { translateAuthError } from "@/lib/auth/errors";
import { createClient } from "@/lib/supabase/server";

export interface AuthState {
  error?: string;
  success?: string;
}

export async function signIn(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState | null> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/";

  if (!email || !password) {
    return { error: "Email və şifrə daxil edin." };
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
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const phone = (formData.get("phone") as string)?.trim();

  if (!fullName || !email || !password) {
    return { error: "Ad, email və şifrə mütləqdir." };
  }

  if (password.length < 6) {
    return { error: "Şifrə ən azı 6 simvol olmalıdır." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback?next=/`,
    },
  });

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  if (data.user && !data.session) {
    redirect("/auth/check-email");
  }

  if (phone && data.user && data.session) {
    await supabase
      .from("profiles")
      .update({ phone, whatsapp_phone: phone })
      .eq("id", data.user.id);
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
