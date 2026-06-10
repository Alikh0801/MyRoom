export const metadata = {
  title: "Yeni elan",
};

export default function NewListingPage() {
  return (
    <div className="container" style={{ padding: "4rem 0", textAlign: "center" }}>
      <h1 className="section__title">Yeni elan yerləşdir</h1>
      <p className="section__subtitle" style={{ marginBottom: "2rem" }}>
        Elan yaratma forması növbəti mərhələdə əlavə olunacaq.
      </p>
      <p style={{ color: "var(--color-text-muted)" }}>
        Əvvəlcə Supabase-i konfiqurasiya edin, sonra giriş edib elan əlavə edə bilərsiniz.
      </p>
    </div>
  );
}
