import Link from "next/link";
import { cookies } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { OTP_EXPIRY_SECONDS } from "@/lib/auth/otp";
import { PENDING_VERIFICATION_COOKIE } from "@/lib/auth/pending-verification";
import { createClient } from "@/lib/supabase/server";

interface VerifyEmailPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email?: string; reason?: string }>;
}

export async function generateMetadata({ params }: VerifyEmailPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.verify" });

  return {
    title: t("title"),
  };
}

async function resolveVerificationEmail(queryEmail?: string): Promise<string> {
  const normalizedQuery = queryEmail?.trim().toLowerCase() ?? "";

  if (normalizedQuery) {
    return normalizedQuery;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email) {
    return user.email.toLowerCase();
  }

  const cookieStore = await cookies();
  const cookieEmail = cookieStore.get(PENDING_VERIFICATION_COOKIE)?.value;

  return cookieEmail?.trim().toLowerCase() ?? "";
}

export default async function VerifyEmailPage({
  params,
  searchParams,
}: VerifyEmailPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const routeParams = await searchParams;
  const t = await getTranslations("auth.verify");
  const email = await resolveVerificationEmail(routeParams.email);
  const isUnconfirmed = routeParams.reason === "unconfirmed";
  const otpExpiryMinutes = Math.max(1, Math.round(OTP_EXPIRY_SECONDS / 60));

  if (!email) {
    return (
      <div className="auth-page">
        <div className="auth-card auth-card--center">
          <h1 className="auth-card__title">{t("missingEmailTitle")}</h1>
          <p className="auth-card__subtitle">{t("missingEmailSubtitle")}</p>
          <Link href="/auth/register" className="btn btn--primary">
            {t("registerCta")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">{t("title")}</h1>
        <VerifyEmailForm
          email={email}
          isUnconfirmed={isUnconfirmed}
          otpExpiryMinutes={otpExpiryMinutes}
        />
      </div>
    </div>
  );
}
