import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Panel",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const name = profile?.full_name ?? user.email;

  return (
    <div className="container dashboard">
      <h1 className="section__title">Salam, {name}!</h1>
      <p className="section__subtitle">Mülk sahibi panelinizə xoş gəldiniz.</p>

      <div className="dashboard__cards">
        <Link href="/dashboard/listings/new" className="dashboard__card">
          <h2>Yeni elan</h2>
          <p>Əmlakınızı elan kimi yerləşdirin</p>
        </Link>
        <div className="dashboard__card dashboard__card--muted">
          <h2>Mənim elanlarım</h2>
          <p>Tezliklə — elan idarəetməsi</p>
        </div>
      </div>
    </div>
  );
}
