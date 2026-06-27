import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AmenitiesDisplay } from "@/components/listings/AmenitiesDisplay";
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
import { getListingById, getSimilarListings } from "@/lib/queries/listings";
import type { Amenity, AmenityCategory } from "@/types/database";

interface ListingPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: ListingPageProps) {
  const { id, locale } = await params;
  const listing = await getListingById(id);
  const t = await getTranslations({ locale, namespace: "listing" });
  if (!listing) return { title: t("notFound") };

  const pageTitle = getLocalizedListingTitle(listing, locale);
  const pageDescription = getLocalizedListingDescription(listing, locale);

  return {
    title: pageTitle,
    description: pageDescription.slice(0, 160),
    openGraph: {
      title: pageTitle,
      description: pageDescription.slice(0, 160),
      images: listing.listing_images[0]?.url
        ? [listing.listing_images[0].url]
        : [],
    },
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id, locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("listing");
  const listing = await getListingById(id);

  if (!listing) notFound();

  const similarListings = await getSimilarListings(
    listing.id,
    listing.category_id,
    listing.region,
    4
  );

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
      ? { geo: { "@type": "GeoCoordinates", latitude: listing.lat, longitude: listing.lng } }
      : {}),
  };

  return (
    <article className="listing-detail">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
              <h1 className="listing-detail__title">{displayTitle}</h1>
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

      <SimilarListings listings={similarListings} />
    </article>
  );
}
