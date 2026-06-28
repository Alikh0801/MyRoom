import Image from "next/image";
import { formatPriceSuffix } from "@/lib/price";
import type { DeletedListingRecord } from "@/lib/queries/admin";
import type { PriceUnit } from "@/types/database";

interface AdminDeletedListingCardProps {
  record: DeletedListingRecord;
}

export function AdminDeletedListingCard({
  record,
}: AdminDeletedListingCardProps) {
  const date = new Date(record.deleted_at).toLocaleDateString("az-AZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="admin-card admin-card--deleted">
      <div className="admin-card__image">
        {record.cover_image_url ? (
          <Image
            src={record.cover_image_url}
            alt={record.title}
            fill
            sizes="200px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span className="admin-card__no-image">Şəkil yoxdur</span>
        )}
      </div>

      <div className="admin-card__body">
        <h3 className="admin-card__title">{record.title}</h3>
        {record.region && record.city && (
          <p className="admin-card__meta">
            {record.category_name_az ? `${record.category_name_az} · ` : ""}
            {record.region}, {record.city}
          </p>
        )}
        {record.price_per_night != null && record.currency && (
          <p className="admin-card__meta">
            {record.price_per_night} {record.currency}
            {formatPriceSuffix((record.price_unit as PriceUnit) ?? "day")}
          </p>
        )}
        <p className="admin-card__meta">
          Sahib: {record.owner_name ?? "—"}
        </p>
        <p className="admin-card__date">Silinib: {date}</p>
        <p className="admin-card__delete-reason">
          <strong>Səbəb:</strong> {record.delete_reason}
        </p>
      </div>
    </article>
  );
}
