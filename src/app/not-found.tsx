import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container empty-state">
      <h1 className="section__title">Səhifə tapılmadı</h1>
      <p className="section__subtitle">Axtardığınız səhifə mövcud deyil.</p>
      <Link href="/" className="btn btn--primary" style={{ marginTop: "1rem" }}>
        Ana səhifəyə qayıt
      </Link>
    </div>
  );
}
