import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { approveListing } from "@/lib/admin/actions";
import { DeleteListingForm } from "@/components/admin/DeleteListingForm";
import { vipPlanLabel } from "@/lib/listings/vip-payment";
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

  const vipPaid =
    listing.vip_payment_status === "paid" && listing.requested_vip_plan;
  const defaultVip = listing.requested_vip_plan ?? "";

  return (
    <article className="admin-card">
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
        {vipPaid && <span className="admin-card__vip-badge">VIP ödənilib</span>}
      </div>

      <div className="admin-card__body">
        <h3 className="admin-card__title">{listing.title}</h3>
        <p className="admin-card__meta">
          {listing.category?.name_az} · {listing.region}, {listing.city}
        </p>
        <p className="admin-card__meta">
          {listing.price_per_night} {listing.currency}
          {formatPriceSuffix(listing.price_unit ?? "day")} · {listing.max_guests}{" "}
          qonaq sayı
        </p>
        <p className="admin-card__meta">
          Sahib: {listing.owner?.full_name ?? "—"} · {listing.whatsapp_phone}
        </p>
        <p className="admin-card__date">Göndərildi: {date}</p>

        {vipPaid && listing.requested_vip_plan && (
          <p className="admin-card__vip-notice admin-card__vip-notice--paid">
            Onlayn ödənilib:{" "}
            <strong>{vipPlanLabel(listing.requested_vip_plan)}</strong>
          </p>
        )}
      </div>

      <div className="admin-card__actions">
        <form action={approveListing} className="admin-card__approve-form">
          <input type="hidden" name="listingId" value={listing.id} />
          <label className="admin-card__vip-select">
            <span>VIP aktivləşdir</span>
            <select name="activateVip" defaultValue={defaultVip}>
              <option value="">VIP olmadan təsdiq et</option>
              <option value="day">1 gün VIP</option>
              <option value="week">1 həftə VIP</option>
            </select>
          </label>
          <button type="submit" className="btn btn--primary">
            Təsdiq et
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
