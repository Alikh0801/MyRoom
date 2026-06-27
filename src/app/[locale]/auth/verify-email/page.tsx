import Link from "next/link";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";

export const metadata = {
  title: "Email təsdiqi",
};

interface VerifyEmailPageProps {
  searchParams: Promise<{ email?: string; reason?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams;
  const email = params.email?.trim().toLowerCase() ?? "";
  const isUnconfirmed = params.reason === "unconfirmed";

  if (!email) {
    return (
      <div className="auth-page">
        <div className="auth-card auth-card--center">
          <h1 className="auth-card__title">Email tapılmadı</h1>
          <p className="auth-card__subtitle">
            Təsdiq kodunu daxil etmək üçün əvvəlcə qeydiyyatdan keçin və ya
            daxil olun.
          </p>
          <Link href="/auth/register" className="btn btn--primary">
            Qeydiyyatdan keç
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Email təsdiqi</h1>
        <VerifyEmailForm email={email} isUnconfirmed={isUnconfirmed} />
      </div>
    </div>
  );
}
