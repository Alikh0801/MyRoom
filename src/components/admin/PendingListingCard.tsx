import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { approveListing } from "@/lib/admin/actions";
import { DeleteListingForm } from "@/components/admin/DeleteListingForm";
import {
  hasPaidVipPayment,
  vipPlanLabel,
} from "@/lib/listings/vip-payment";
import { formatPriceSuffix } from "@/lib/price";
import type { AdminListingItem } from "@/lib/queries/admin";

interface PendingListingCardProps {
  listing: AdminListingItem;
}

export function PendingListingCard({ listing }: PendingListingCardProps) {
  const date = new Date(listing.created_at).toLocaleDateString("az-AZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const vipPaid = hasPaidVipPayment(listing.vip_payment_status);
  const vipPending =
    listing.vip_payment_status === "pending" && listing.requested_vip_plan;

  return (
    <article className={`admin-card${vipPaid ? " admin-card--vip-paid" : ""}`}>
      <div className="admin-card__image">
        {listing.cover_image ? (
          <Image
            src={listing.cover_image}
            alt={listing.title}
            fill
            sizes="200px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span className="admin-card__no-image">Şəkil yoxdur</span>
        )}
        {vipPaid && <span className="admin-card__vip-badge">VIP ödənişi</span>}
      </div>

      <div className="admin-card__body">
        <h3 className="admin-card__title">{listing.title}</h3>
        <p className="admin-card__meta">
          {listing.category?.name_az} · {listing.region}, {listing.city}
        </p>
        <p className="admin-card__meta">
          {listing.price_per_night} {listing.currency}
          {formatPriceSuffix(listing.price_unit ?? "day")} · {listing.max_guests}{" "}
          qonaq
        </p>
        <p className="admin-card__meta">
          Sahib: {listing.owner?.full_name ?? "—"} · {listing.whatsapp_phone}
        </p>
        <p className="admin-card__date">Göndərildi: {date}</p>

        {vipPaid && listing.requested_vip_plan && (
          <p className="admin-card__vip-notice admin-card__vip-notice--paid">
            Sahib{" "}
            <strong>{vipPlanLabel(listing.requested_vip_plan)}</strong> üçün
            ödəniş edib. Təsdiq zamanı elan avtomatik VIP olacaq.
          </p>
        )}

        {vipPending && listing.requested_vip_plan && (
          <p className="admin-card__vip-notice admin-card__vip-notice--pending">
            {vipPlanLabel(listing.requested_vip_plan)} seçilib — ödəniş
            gözlənilir.
          </p>
        )}
      </div>

      <div className="admin-card__actions">
        <form action={approveListing} className="admin-card__approve-form">
          <input type="hidden" name="listingId" value={listing.id} />
          <button type="submit" className="btn btn--primary">
            {vipPaid ? "VIP ilə təsdiq et" : "Təsdiq et"}
          </button>
        </form>

        <DeleteListingForm listingId={listing.id} />

        <Link
          href={`/admin/pending/${listing.id}/preview`}
          className="admin-card__preview"
        >
          Önizləmə →
        </Link>
      </div>
    </article>
  );
}
