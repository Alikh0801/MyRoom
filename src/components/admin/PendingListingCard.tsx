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

  const vipPending =
    listing.vip_payment_status === "pending" && listing.requested_vip_plan;
  const defaultVip = listing.requested_vip_plan ?? "";

  return (
    <article
      className={`admin-card${vipPending ? " admin-card--vip-pending" : ""}`}
    >
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
        {vipPending && (
          <span className="admin-card__vip-badge">VIP sorğusu</span>
        )}
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

        {vipPending && listing.requested_vip_plan && (
          <div className="admin-card__vip-box">
            <p className="admin-card__vip-notice admin-card__vip-notice--pending">
              Seçilən paket:{" "}
              <strong>{vipPlanLabel(listing.requested_vip_plan)}</strong>
            </p>
            {listing.vip_payment_receipt_url ? (
              <a
                href={listing.vip_payment_receipt_url}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-card__receipt-link"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={listing.vip_payment_receipt_url}
                  alt="Ödəniş çeki"
                  className="admin-card__receipt-thumb"
                />
                <span>Ödəniş çekinə bax →</span>
              </a>
            ) : (
              <p className="admin-card__vip-notice">Ödəniş çeki yüklənməyib.</p>
            )}
          </div>
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
