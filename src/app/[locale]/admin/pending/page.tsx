import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

type AdminPendingRedirectProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function AdminPendingRedirect({
  params,
  searchParams,
}: AdminPendingRedirectProps) {
  const { locale } = await params;
  const queryParams = await searchParams;
  const query = new URLSearchParams();
  query.set("tab", "pending");

  for (const [key, value] of Object.entries(queryParams)) {
    if (key !== "tab" && value) {
      query.set(key, value);
    }
  }

  redirect({ href: `/admin?${query.toString()}`, locale: locale as Locale });
}
