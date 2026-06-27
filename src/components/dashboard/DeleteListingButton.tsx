"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { deleteMyListing } from "@/lib/listings/actions";

interface DeleteListingButtonProps {
  listingId: string;
  listingTitle: string;
}

export function DeleteListingButton({
  listingId,
  listingTitle,
}: DeleteListingButtonProps) {
  const t = useTranslations("dashboard.card");
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm(t("deleteConfirm", { title: listingTitle }))) {
      return;
    }

    const formData = new FormData();
    formData.set("listingId", listingId);
    startTransition(() => {
      deleteMyListing(formData);
    });
  }

  return (
    <button
      type="button"
      className="btn btn--ghost my-listing-card__delete"
      onClick={handleDelete}
      disabled={pending}
    >
      {pending ? t("deleting") : t("delete")}
    </button>
  );
}
