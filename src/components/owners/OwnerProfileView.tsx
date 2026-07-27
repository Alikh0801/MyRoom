import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ListingCard } from "@/components/listings/ListingCard";
import { formatListingCardDate } from "@/lib/date";
import type { OwnerPublicProfile } from "@/lib/queries/owner-profile";
import type { ListingCardData } from "@/types/database";

interface OwnerProfileViewProps {
  owner: OwnerPublicProfile;
  listings: ListingCardData[];
  isLoggedIn?: boolean;
  favoriteIds?: Set<string>;
}

function getInitials(fullName: string | null) {
  if (!fullName?.trim()) return "?";

  const parts = fullName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }

  return parts[0].slice(0, 2).toUpperCase();
}

export async function OwnerProfileView({
  owner,
  listings,
  isLoggedIn = false,
  favoriteIds = new Set<string>(),
}: OwnerProfileViewProps) {
  const t = await getTranslations("ownerProfile");
  const displayName = owner.full_name ?? t("ownerFallback");
  const initials = getInitials(owner.full_name);

  return (
    <div className="owner-profile-page">
      <div className="container">
        <header className="owner-profile__header">
          <div className="owner-profile__avatar" aria-hidden="true">
            {owner.avatar_url ? (
              <Image
                src={owner.avatar_url}
                alt=""
                width={96}
                height={96}
                className="owner-profile__avatar-img"
              />
            ) : (
              <span className="owner-profile__avatar-initials">{initials}</span>
            )}
          </div>

          <div className="owner-profile__info">
            <h1 className="owner-profile__name">{displayName}</h1>
            <p className="owner-profile__meta">
              {t("memberSince", {
                date: formatListingCardDate(owner.created_at),
              })}
            </p>
            <p className="owner-profile__count">
              {t("listingsCount", { count: listings.length })}
            </p>
          </div>
        </header>

        <section className="owner-profile__listings">
          <h2 className="section__title">{t("listingsTitle")}</h2>

          {listings.length > 0 ? (
            <div className="listing-grid">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isLoggedIn={isLoggedIn}
                  isFavorited={favoriteIds.has(listing.id)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>{t("empty.title")}</h3>
              <p>{t("empty.desc")}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
