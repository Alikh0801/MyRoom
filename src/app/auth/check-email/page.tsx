import Link from "next/link";

export const metadata = {
  title: "Email təsdiqi",
};

interface CheckEmailPageProps {
  searchParams: Promise<{ reason?: string }>;
}

export default async function CheckEmailPage({ searchParams }: CheckEmailPageProps) {
  const params = await searchParams;
  const isUnconfirmed = params.reason === "unconfirmed";

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--center">
        <h1 className="auth-card__title">Emailinizi yoxlayın</h1>
        <p className="auth-card__subtitle">
          {isUnconfirmed
            ? "Elan yerləşdirmək üçün email ünvanınızı təsdiqləməlisiniz. Poçt qutunuzdakı linkə klikləyin."
            : "Qeydiyyat tamamlamaq üçün email ünvanınıza göndərilən linkə klikləyin. Təsdiqdən sonra daxil ola biləcəksiniz."}
        </p>
        <Link href="/auth/login" className="btn btn--primary">
          Giriş səhifəsinə qayıt
        </Link>
      </div>
    </div>
  );
}
