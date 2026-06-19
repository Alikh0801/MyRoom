import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Daxil ol",
};

interface LoginPageProps {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirectTo ?? "/";

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Daxil ol</h1>
        <p className="auth-card__subtitle">
          Elan yerləşdirmək və idarə etmək üçün hesabınıza daxil olun.
        </p>

        {params.error === "auth_callback_failed" && (
          <p className="auth-form__error">
            Giriş linki etibarsızdır və ya vaxtı keçib. Yenidən cəhd edin.
          </p>
        )}

        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
