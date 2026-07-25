import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  removeListingVip,
  setListingVip,
} from "@/lib/admin/actions";
import { DeleteListingForm } from "@/components/admin/DeleteListingForm";
import {
  isVipCurrentlyActive,
  vipPlanLabel,
} from "@/lib/listings/vip-payment";
import { formatPriceSuffix } from "@/lib/price";
import type { AdminListingItem } from "@/lib/queries/admin";

interface AdminActiveListingCardProps {
  listing: AdminListingItem;
}

export function AdminActiveListingCard({ listing }: AdminActiveListingCardProps) {
  const date = new Date(listing.created_at).toLocaleDateString("az-AZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const vipActive = isVipCurrentlyActive(
    listing.is_vip,
    listing.vip_expires_at
  );
  const vipPending =
    listing.vip_payment_status === "pending" && listing.requested_vip_plan;

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
        {vipActive && <span className="admin-card__vip-badge">VIP</span>}
        {!vipActive && vipPending && (
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
          {formatPriceSuffix(listing.price_unit)} · {listing.max_guests} qonaq
        </p>
        <p className="admin-card__meta">
          Sahib: {listing.owner?.full_name ?? "—"}
        </p>
        <p className="admin-card__date">Təsdiqlənib: {date}</p>

        {vipActive && listing.vip_expires_at && (
          <p className="admin-card__vip-notice admin-card__vip-notice--paid">
            VIP bitir:{" "}
            {new Date(listing.vip_expires_at).toLocaleString("az-AZ")}
          </p>
        )}

        {vipPending && listing.requested_vip_plan && (
          <div className="admin-card__vip-box">
            <p className="admin-card__vip-notice admin-card__vip-notice--pending">
              Seçilən paket:{" "}
              <strong>{vipPlanLabel(listing.requested_vip_plan)}</strong>
            </p>
            {listing.vip_payment_receipt_url && (
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
            )}
          </div>
        )}
      </div>

      <div className="admin-card__actions">
        <Link href={`/listings/${listing.id}`} className="btn btn--primary">
          Saytda bax
        </Link>

        {vipActive ? (
          <form action={removeListingVip}>
            <input type="hidden" name="listingId" value={listing.id} />
            <button type="submit" className="btn btn--ghost">
              VIP-dən çıxar
            </button>
          </form>
        ) : (
          <form action={setListingVip} className="admin-card__vip-form">
            <input type="hidden" name="listingId" value={listing.id} />
            <select
              name="vipPlan"
              defaultValue={listing.requested_vip_plan ?? "day"}
            >
              <option value="day">1 gün VIP</option>
              <option value="week">1 həftə VIP</option>
            </select>
            <button type="submit" className="btn btn--ghost">
              VIP et
            </button>
          </form>
        )}

        <DeleteListingForm listingId={listing.id} />
      </div>
    </article>
  );
}
