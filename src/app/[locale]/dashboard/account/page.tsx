import Image from "next/image";
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

function getInitials(fullName: string | null, email: string): string {
  if (fullName?.trim()) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
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
    .select("full_name, phone, whatsapp_phone, email, avatar_url, created_at")
    .eq("id", user.id)
    .maybeSingle();

  const email = profile?.email ?? user.email ?? "";
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(`${locale}-AZ`, {
        year: "numeric",
        month: "long",
      })
    : null;

  return (
    <div className="dashboard-page">
      <div className="container account-page">
        <div className="account-hero">
          <span className="account-hero__avatar">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt=""
                width={64}
                height={64}
                className="account-hero__avatar-img"
              />
            ) : (
              getInitials(profile?.full_name ?? null, email)
            )}
          </span>

          <div className="account-hero__info">
            <h1 className="account-hero__name">
              {profile?.full_name?.trim() || t("pageTitle")}
            </h1>
            {email && <p className="account-hero__email">{email}</p>}
            {memberSince && (
              <p className="account-hero__meta">
                {t("memberSince", { date: memberSince })}
              </p>
            )}
          </div>
        </div>

        <div className="account-card">
          <AccountForm
            fullName={profile?.full_name ?? ""}
            phone={profile?.phone ?? ""}
            whatsappPhone={profile?.whatsapp_phone ?? ""}
            email={email}
          />
        </div>
      </div>
    </div>
  );
}
