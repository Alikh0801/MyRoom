import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ListingCard } from "@/components/listings/ListingCard";
import { formatListingCardDate } from "@/lib/date";
import { buildOwnerWhatsAppUrl } from "@/lib/whatsapp";
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
  const callPhone = owner.phone ?? owner.whatsapp_phone;
  const callHref = callPhone ? `tel:${callPhone.replace(/[\s()-]/g, "")}` : null;
  const whatsappUrl = owner.whatsapp_phone
    ? buildOwnerWhatsAppUrl(owner.whatsapp_phone, displayName)
    : null;

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

            {(callHref || whatsappUrl) && (
              <div className="owner-profile__contact-actions">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--whatsapp"
                  >
                    <svg
                      className="btn__icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {t("whatsappButton")}
                  </a>
                )}
                {callHref && (
                  <a href={callHref} className="btn btn--call">
                    <svg
                      className="btn__icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {t("callButton")}
                  </a>
                )}
              </div>
            )}
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
