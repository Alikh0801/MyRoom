"use client";

import { useState, useTransition } from "react";
import { updateSiteSettings } from "@/lib/admin/settings-actions";
import type { SiteSettings } from "@/lib/queries/site-settings";

interface AdminSettingsFormProps {
  settings: SiteSettings;
}

export function AdminSettingsForm({ settings }: AdminSettingsFormProps) {
  const [instagram, setInstagram] = useState(settings.instagramUrl);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function handleSubmit(formData: FormData) {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateSiteSettings(formData);
      if (result.ok) {
        setSaved(true);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form action={handleSubmit} className="admin-settings">
      <section className="admin-settings__section">
        <h2 className="admin-settings__title">Sosial şəbəkələr</h2>
        <p className="admin-settings__hint">
          Ünvan yazılanda footer-də Instagram ikonu görünür. Sahəni boş
          buraxsanız ikon saytdan silinir.
        </p>

        <label className="admin-settings__field">
          Instagram ünvanı
          <input
            name="instagram_url"
            value={instagram}
            onChange={(event) => {
              setInstagram(event.target.value);
              setSaved(false);
            }}
            placeholder="myroomaz"
            inputMode="url"
            autoComplete="off"
          />
          <span className="admin-settings__hint">
            İstifadəçi adı (<code>myroomaz</code>) və ya tam link yaza
            bilərsiniz.
          </span>
        </label>
      </section>

      {error && <p className="auth-form__error">{error}</p>}
      {saved && !error && (
        <p className="admin-settings__saved" role="status">
          Yadda saxlanıldı.
        </p>
      )}

      <div className="admin-settings__actions">
        <button type="submit" className="btn btn--primary" disabled={isPending}>
          {isPending ? "Yadda saxlanılır…" : "Yadda saxla"}
        </button>
      </div>
    </form>
  );
}
