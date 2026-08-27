import { getTranslations, setRequestLocale } from "next-intl/server";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

type ForgotPasswordPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

export async function generateMetadata({ params }: ForgotPasswordPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.forgot" });

  return {
    title: t("title"),
  };
}

export default async function ForgotPasswordPage({
  params,
  searchParams,
}: ForgotPasswordPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("auth.forgot");
  const routeParams = await searchParams;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">{t("title")}</h1>
        <p className="auth-card__subtitle">{t("subtitle")}</p>

        {routeParams.error === "reset_link_expired" && (
          <p className="auth-form__error">{t("linkExpired")}</p>
        )}

        <ForgotPasswordForm />
      </div>
    </div>
  );
}
