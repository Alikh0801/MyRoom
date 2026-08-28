import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  boostListingViews,
  removeListingVip,
  setListingVip,
} from "@/lib/admin/actions";
import { DeleteListingForm } from "@/components/admin/DeleteListingForm";
import { isVipCurrentlyActive } from "@/lib/listings/vip-payment";
import { formatDateTimeInBaku } from "@/lib/datetime/baku";
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
        {vipActive && <span className="admin-card__vip-badge">VIP</span>}
      </div>

      <div className="admin-card__body">
        <h3 className="admin-card__title">{listing.title}</h3>
        <p className="admin-card__meta">
          {listing.category?.name_az} · {listing.region}, {listing.city}
        </p>
        <p className="admin-card__meta">
          {listing.price_per_night} {listing.currency}
          {formatPriceSuffix(listing.price_unit)} · {listing.max_guests} qonaq sayı
        </p>
        <p className="admin-card__meta">
          Sahib: {listing.owner?.full_name ?? "—"}
        </p>
        <p className="admin-card__meta">Baxış: {listing.view_count}</p>
        <p className="admin-card__date">Təsdiqlənib: {date}</p>

        {vipActive && listing.vip_expires_at && (
          <p className="admin-card__vip-notice admin-card__vip-notice--paid">
            VIP bitir (Bakı vaxtı):{" "}
            {formatDateTimeInBaku(listing.vip_expires_at)}
          </p>
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

        <form action={boostListingViews} className="admin-card__views-form">
          <input type="hidden" name="listingId" value={listing.id} />
          <label className="admin-card__views-label">
            Baxış artır
            <input
              type="number"
              name="amount"
              min={1}
              max={100000}
              defaultValue={10}
              required
            />
          </label>
          <button type="submit" className="btn btn--ghost">
            Artır
          </button>
        </form>

        <DeleteListingForm listingId={listing.id} />
      </div>
    </article>
  );
}
