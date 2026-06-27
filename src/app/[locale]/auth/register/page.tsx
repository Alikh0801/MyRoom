import { getTranslations, setRequestLocale } from "next-intl/server";
import { RegisterForm } from "@/components/auth/RegisterForm";

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: RegisterPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.register" });

  return {
    title: t("title"),
  };
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("auth.register");

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">{t("title")}</h1>
        <p className="auth-card__subtitle">{t("subtitle")}</p>
        <RegisterForm />
      </div>
    </div>
  );
}
