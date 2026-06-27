import { getTranslations, setRequestLocale } from "next-intl/server";
import { LoginForm } from "@/components/auth/LoginForm";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
};

export async function generateMetadata({ params }: LoginPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.login" });

  return {
    title: t("title"),
  };
}

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("auth.login");
  const routeParams = await searchParams;
  const redirectTo = routeParams.redirectTo ?? "/";

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">{t("title")}</h1>
        <p className="auth-card__subtitle">{t("subtitle")}</p>

        {routeParams.error === "auth_callback_failed" && (
          <p className="auth-form__error">{t("callbackError")}</p>
        )}

        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
