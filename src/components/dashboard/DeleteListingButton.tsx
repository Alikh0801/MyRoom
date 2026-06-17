"use client";

import { useTransition } from "react";
import { deleteMyListing } from "@/lib/listings/actions";

interface DeleteListingButtonProps {
  listingId: string;
  listingTitle: string;
}

export function DeleteListingButton({
  listingId,
  listingTitle,
}: DeleteListingButtonProps) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (
      !window.confirm(
        `"${listingTitle}" elanını silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.`
      )
    ) {
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
      {pending ? "Silinir..." : "Sil"}
    </button>
  );
}
