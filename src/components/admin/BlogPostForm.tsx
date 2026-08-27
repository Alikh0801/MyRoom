"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { AZ_REGIONS } from "@/lib/regions";
import { slugify } from "@/lib/blog/slug";
import type { AdminBlogPostDetail } from "@/lib/blog/types";

type LocaleTab = "az" | "ru" | "tr";

const LOCALE_TABS: { id: LocaleTab; label: string; required?: boolean }[] = [
  { id: "az", label: "Azərbaycanca", required: true },
  { id: "ru", label: "Rusca" },
  { id: "tr", label: "Türkcə" },
];

interface BlogPostFormProps {
  post?: AdminBlogPostDetail;
  action: (formData: FormData) => Promise<void>;
}

function toDateInput(iso: string | undefined): string {
  if (!iso) return new Date().toISOString().slice(0, 10);
  return new Date(iso).toISOString().slice(0, 10);
}

export function BlogPostForm({ post, action }: BlogPostFormProps) {
  const [tab, setTab] = useState<LocaleTab>("az");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [titleAz, setTitleAz] = useState(post?.titleAz ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [coverUrl, setCoverUrl] = useState(post?.coverUrl ?? "");
  const [coverPath, setCoverPath] = useState(post?.coverStoragePath ?? "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const effectiveSlug = slug || slugify(titleAz);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/blog-cover", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Yükləmə alınmadı");
      setCoverUrl(data.url);
      setCoverPath(data.storagePath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükləmə alınmadı");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await action(formData);
      } catch (err) {
        // redirect() də throw edir — onu xəta kimi göstərmirik
        const message = err instanceof Error ? err.message : "Yadda saxlanmadı";
        if (!message.includes("NEXT_REDIRECT")) setError(message);
      }
    });
  }

  return (
    <form action={handleSubmit} className="blog-form">
      {error && <p className="auth-form__error">{error}</p>}

      <section className="blog-form__section">
        <h2 className="blog-form__section-title">Örtük şəkli</h2>
        <div className="blog-form__cover">
          <div className="blog-form__cover-preview">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt="Örtük"
                fill
                sizes="320px"
                className="blog-form__cover-img"
              />
            ) : (
              <span className="blog-form__cover-empty">Şəkil seçilməyib</span>
            )}
          </div>
          <div className="blog-form__cover-actions">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
            <p className="blog-form__hint">JPEG, PNG və ya WebP · maks. 8 MB</p>
            {uploading && <p className="blog-form__hint">Yüklənir…</p>}
            {coverUrl && (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setCoverUrl("");
                  setCoverPath("");
                }}
              >
                Şəkli sil
              </button>
            )}
          </div>
        </div>
        <input type="hidden" name="cover_url" value={coverUrl} />
        <input type="hidden" name="cover_storage_path" value={coverPath} />
      </section>

      <section className="blog-form__section">
        <h2 className="blog-form__section-title">Ümumi</h2>
        <div className="blog-form__grid">
          <label className="blog-form__field">
            Slug (URL)
            <input
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder={slugify(titleAz) || "qebele-belediyicisi"}
            />
            <span className="blog-form__hint">
              /blog/{effectiveSlug || "…"}
            </span>
          </label>

          <label className="blog-form__field">
            Rayon (elan axtarışına keçid üçün)
            <select name="region" defaultValue={post?.region ?? ""}>
              <option value="">Yoxdur</option>
              {AZ_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </label>

          <label className="blog-form__field">
            Oxu müddəti (dəq)
            <input
              type="number"
              name="read_minutes"
              min={1}
              max={120}
              defaultValue={post?.readMinutes ?? 5}
            />
          </label>

          <label className="blog-form__field">
            Dərc tarixi
            <input
              type="date"
              name="published_at"
              defaultValue={toDateInput(post?.publishedAt)}
            />
          </label>

          <label className="blog-form__field">
            Status
            <select name="status" defaultValue={post?.status ?? "draft"}>
              <option value="draft">Qaralama (saytda görünmür)</option>
              <option value="published">Dərc olunub</option>
            </select>
          </label>
        </div>
      </section>

      <section className="blog-form__section">
        <h2 className="blog-form__section-title">Mətn</h2>

        <div className="blog-form__tabs" role="tablist">
          {LOCALE_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              className={`blog-form__tab${
                tab === item.id ? " blog-form__tab--active" : ""
              }`}
              onClick={() => setTab(item.id)}
            >
              {item.label}
              {item.required && <span aria-hidden="true"> *</span>}
            </button>
          ))}
        </div>

        <p className="blog-form__hint blog-form__hint--block">
          Boş buraxılan tərcümələr saytda Azərbaycanca mətnlə əvəz olunur.
          Mətn sahəsində: <code>## Başlıq</code> yeni bölmə açır,{" "}
          <code>- bənd</code> siyahı yaradır, boş sətir abzasları ayırır.
        </p>

        {LOCALE_TABS.map((item) => {
          const isAz = item.id === "az";
          const value = {
            title: isAz ? undefined : (item.id === "ru" ? post?.titleRu : post?.titleTr) ?? "",
            excerpt: (item.id === "az" ? post?.excerptAz : item.id === "ru" ? post?.excerptRu : post?.excerptTr) ?? "",
            meta: (item.id === "az" ? post?.metaDescriptionAz : item.id === "ru" ? post?.metaDescriptionRu : post?.metaDescriptionTr) ?? "",
            highlights: (item.id === "az" ? post?.highlightsAz : item.id === "ru" ? post?.highlightsRu : post?.highlightsTr) ?? "",
            body: (item.id === "az" ? post?.bodyAz : item.id === "ru" ? post?.bodyRu : post?.bodyTr) ?? "",
          };

          return (
            <div
              key={item.id}
              hidden={tab !== item.id}
              className="blog-form__locale"
            >
              <label className="blog-form__field">
                Başlıq{isAz ? " *" : ""}
                {isAz ? (
                  <input
                    name="title_az"
                    required
                    value={titleAz}
                    onChange={(e) => setTitleAz(e.target.value)}
                  />
                ) : (
                  <input name={`title_${item.id}`} defaultValue={value.title} />
                )}
              </label>

              <label className="blog-form__field">
                Qısa təsvir (kartlarda görünür)
                <textarea
                  name={`excerpt_${item.id}`}
                  rows={2}
                  defaultValue={value.excerpt}
                />
              </label>

              <label className="blog-form__field">
                Meta təsvir (Google nəticələri üçün)
                <textarea
                  name={`meta_description_${item.id}`}
                  rows={2}
                  defaultValue={value.meta}
                />
              </label>

              <label className="blog-form__field">
                Qısa faktlar (hər sətir ayrı bənd)
                <textarea
                  name={`highlights_${item.id}`}
                  rows={3}
                  defaultValue={value.highlights}
                />
              </label>

              <label className="blog-form__field">
                Mətn
                <textarea
                  name={`body_${item.id}`}
                  rows={18}
                  defaultValue={value.body}
                  className="blog-form__body"
                />
              </label>
            </div>
          );
        })}
      </section>

      <div className="blog-form__actions">
        <button type="submit" className="btn btn--primary" disabled={isPending || uploading}>
          {isPending ? "Yadda saxlanılır…" : "Yadda saxla"}
        </button>
      </div>
    </form>
  );
}
