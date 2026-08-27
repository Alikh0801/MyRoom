import { redirect } from "next/navigation";

interface CheckEmailPageProps {
  searchParams: Promise<{ email?: string; reason?: string }>;
}

export default async function CheckEmailPage({ searchParams }: CheckEmailPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  if (params.email) {
    query.set("email", params.email);
  }

  if (params.reason) {
    query.set("reason", params.reason);
  }

  const suffix = query.toString();
  redirect(suffix ? `/auth/verify-email?${suffix}` : "/auth/verify-email");
}
