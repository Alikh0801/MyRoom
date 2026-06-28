import { getTranslations } from "next-intl/server";
import { AmenitiesDisplay } from "@/components/listings/AmenitiesDisplay";
import { FavoriteButton } from "@/components/listings/FavoriteButton";
import { HotelRoomTypeDisplay } from "@/components/listings/HotelRoomTypeDisplay";
import { ListingContactCard } from "@/components/listings/ListingContactCard";
import { ListingGallery } from "@/components/listings/ListingGallery";
import { ListingMapSection } from "@/components/listings/ListingMapSection";
import { SimilarListings } from "@/components/listings/SimilarListings";
import type { Locale } from "@/i18n/routing";
import { getLocalizedName } from "@/lib/i18n/localized-name";
import {
  getLocalizedListingDescription,
  getLocalizedListingTitle,
} from "@/lib/i18n/localized-listing";
import { groupAmenitiesByCategory } from "@/lib/queries/amenities";
import type { ListingCardData, ListingWithRelations } from "@/types/database";
import type { Amenity, AmenityCategory } from "@/types/database";
import type { ReactNode } from "react";

interface ListingDetailViewProps {
  listing: ListingWithRelations;
  locale: Locale;
  similarListings?: ListingCardData[];
  isFavorited?: boolean;
  isLoggedIn?: boolean;
  favoriteIds?: Set<string>;
  showSimilarListings?: boolean;
  previewBanner?: ReactNode;
}

export async function ListingDetailView({
  listing,
  locale,
  similarListings = [],
  isFavorited = false,
  isLoggedIn = false,
  favoriteIds = new Set<string>(),
  showSimilarListings = true,
  previewBanner,
}: ListingDetailViewProps) {
  const t = await getTranslations("listing");

  const images = listing.listing_images;
  const owner = listing.owner;
  const isHotel = listing.category.slug === "hotel";

  const selectedAmenities = listing.listing_amenities
    ?.map((la) => {
      const amenity = Array.isArray(la.amenity) ? la.amenity[0] : la.amenity;
      if (!amenity) return null;
      const category = Array.isArray(amenity.category)
        ? amenity.category[0]
        : amenity.category;
      return { ...amenity, category } as Amenity & {
        category: AmenityCategory;
      };
    })
    .filter(Boolean) as (Amenity & { category: AmenityCategory })[];

  const amenityGroups = groupAmenitiesByCategory(selectedAmenities);
  const roomType = listing.listing_room_types?.[0] ?? null;
  const displayTitle = getLocalizedListingTitle(listing, locale);
  const displayDescription = getLocalizedListingDescription(listing, locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: displayTitle,
    description: displayDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: listing.city,
      addressRegion: listing.region,
      addressCountry: "AZ",
    },
    priceRange: `${listing.price_per_night} ${listing.currency}`,
    ...(listing.lat && listing.lng
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: listing.lat,
            longitude: listing.lng,
          },
        }
      : {}),
  };

  return (
    <article className="listing-detail">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {previewBanner}

      <div className="container">
        <div className="listing-detail__top">
          <div className="listing-detail__gallery-col">
            {images.length > 0 ? (
              <ListingGallery images={images} title={displayTitle} />
            ) : (
              <div className="listing-detail__no-image">{t("noPhoto")}</div>
            )}

            <div className="listing-detail__content">
              <span className="listing-card__badge">
                {getLocalizedName(listing.category, locale)}
              </span>
              <div className="listing-detail__title-row">
                <h1 className="listing-detail__title">{displayTitle}</h1>
                {listing.status === "approved" && (
                  <FavoriteButton
                    listingId={listing.id}
                    initialFavorited={isFavorited}
                    isLoggedIn={isLoggedIn}
                    variant="detail"
                  />
                )}
              </div>
              <p className="listing-detail__description">{displayDescription}</p>
            </div>

            {isHotel && roomType && (
              <HotelRoomTypeDisplay roomType={roomType} locale={locale} />
            )}

            <AmenitiesDisplay
              groups={amenityGroups}
              title={isHotel ? t("propertyFeatures") : t("included")}
              titleSlug={isHotel ? "property" : undefined}
              locale={locale}
            />

            {listing.lat != null && listing.lng != null && (
              <ListingMapSection
                lat={listing.lat}
                lng={listing.lng}
                title={displayTitle}
              />
            )}
          </div>

          <ListingContactCard
            ownerName={owner?.full_name ?? null}
            phone={owner?.phone ?? null}
            whatsappPhone={listing.whatsapp_phone}
            listingTitle={displayTitle}
            pricePerNight={listing.price_per_night}
            priceUnit={listing.price_unit ?? "day"}
            currency={listing.currency}
            region={listing.region}
            city={listing.city}
            address={listing.address}
            lat={listing.lat}
            lng={listing.lng}
            maxGuests={listing.max_guests}
            bedrooms={listing.bedrooms}
            roomTypeName={isHotel ? roomType?.name : null}
            roomTypeFloor={isHotel ? roomType?.floor ?? null : null}
          />
        </div>
      </div>

      {showSimilarListings && (
        <SimilarListings
          listings={similarListings}
          isLoggedIn={isLoggedIn}
          favoriteIds={favoriteIds}
        />
      )}
    </article>
  );
}
