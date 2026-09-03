import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { AccountForm } from "@/components/account/AccountForm";
import { createClient } from "@/lib/supabase/server";

interface AccountPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AccountPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });

  return {
    title: t("metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("account");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirectTo=/dashboard/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, email")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard__header-row">
          <div>
            <h1 className="section__title">{t("pageTitle")}</h1>
            <p className="section__subtitle dashboard__subtitle">
              {t("subtitle")}
            </p>
          </div>
        </div>

        <div className="account-card">
          <AccountForm
            fullName={profile?.full_name ?? ""}
            phone={profile?.phone ?? ""}
            email={profile?.email ?? user.email ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
