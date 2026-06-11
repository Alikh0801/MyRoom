import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Qeydiyyat",
};

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Qeydiyyat</h1>
        <p className="auth-card__subtitle">
          Mülk sahibi kimi qeydiyyatdan keçin və elan yerləşdirin.
        </p>
        <RegisterForm />
      </div>
    </div>
  );
}
