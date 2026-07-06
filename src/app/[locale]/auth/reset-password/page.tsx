import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { createClient } from "@/lib/supabase/server";

type ResetPasswordPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ResetPasswordPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.reset" });

  return {
    title: t("title"),
  };
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("auth.reset");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">{t("title")}</h1>
        <p className="auth-card__subtitle">{t("subtitle")}</p>

        {user ? (
          <ResetPasswordForm />
        ) : (
          <div className="auth-form">
            <p className="auth-form__error">{t("sessionExpired")}</p>
            <p className="auth-form__footer">
              <Link href="/auth/forgot-password">{t("requestNewLink")}</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
