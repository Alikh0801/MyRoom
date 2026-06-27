import { notFound } from "next/navigation";
import { AmenitiesDisplay } from "@/components/listings/AmenitiesDisplay";
import { HotelRoomTypeDisplay } from "@/components/listings/HotelRoomTypeDisplay";
import { ListingContactCard } from "@/components/listings/ListingContactCard";
import { ListingGallery } from "@/components/listings/ListingGallery";
import { ListingMapSection } from "@/components/listings/ListingMapSection";
import { SimilarListings } from "@/components/listings/SimilarListings";
import { groupAmenitiesByCategory } from "@/lib/queries/amenities";
import { getListingById, getSimilarListings } from "@/lib/queries/listings";
import type { Amenity, AmenityCategory } from "@/types/database";

interface ListingPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ListingPageProps) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) return { title: "Elan tapılmadı" };

  return {
    title: listing.title,
    description: listing.description.slice(0, 160),
    openGraph: {
      title: listing.title,
      description: listing.description.slice(0, 160),
      images: listing.listing_images[0]?.url
        ? [listing.listing_images[0].url]
        : [],
    },
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: listing.title,
    description: listing.description,
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
              <ListingGallery images={images} title={listing.title} />
            ) : (
              <div className="listing-detail__no-image">Şəkil yoxdur</div>
            )}

            <div className="listing-detail__content">
              <span className="listing-card__badge">{listing.category.name_az}</span>
              <h1 className="listing-detail__title">{listing.title}</h1>
              <p className="listing-detail__description">{listing.description}</p>
            </div>

            {isHotel && roomType && (
              <HotelRoomTypeDisplay roomType={roomType} />
            )}

            <AmenitiesDisplay
              groups={amenityGroups}
              title={isHotel ? "Müəssisə xüsusiyyətləri" : "Daxildir"}
            />

            {listing.lat != null && listing.lng != null && (
              <ListingMapSection
                lat={listing.lat}
                lng={listing.lng}
                title={listing.title}
              />
            )}
          </div>

          <ListingContactCard
            ownerName={owner?.full_name ?? null}
            phone={owner?.phone ?? null}
            whatsappPhone={listing.whatsapp_phone}
            listingTitle={listing.title}
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
