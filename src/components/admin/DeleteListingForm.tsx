"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { deleteListingAsAdmin } from "@/lib/admin/actions";

interface DeleteListingFormProps {
  listingId: string;
}

export function DeleteListingForm({ listingId }: DeleteListingFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(e.currentTarget);

    try {
      await deleteListingAsAdmin(formData);
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Silinmə əməliyyatı uğursuz oldu."
      );
      setPending(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        className="btn btn--ghost admin-card__delete"
        onClick={() => setOpen(true)}
      >
        Sil
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="admin-reject-form">
      <input type="hidden" name="listingId" value={listingId} />
      <label className="admin-reject-form__field">
        <span className="admin-reject-form__label">Silinmə səbəbi *</span>
        <textarea
          name="deleteReason"
          required
          minLength={10}
          rows={3}
          placeholder="Niyə silindiyini qısa izah edin..."
          className="admin-reject-form__textarea"
        />
      </label>
      {error && (
        <p className="admin-reject-form__error" role="alert">
          {error}
        </p>
      )}
      <div className="admin-reject-form__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          disabled={pending}
        >
          Ləğv et
        </button>
        <button
          type="submit"
          className="btn btn--ghost admin-card__delete"
          disabled={pending}
        >
          {pending ? "Silinir..." : "Sil"}
        </button>
      </div>
    </form>
  );
}
