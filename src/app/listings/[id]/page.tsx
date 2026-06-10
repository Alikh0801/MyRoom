import Image from "next/image";
import { notFound } from "next/navigation";
import { WhatsAppButton } from "@/components/listings/WhatsAppButton";
import { getListingById } from "@/lib/queries/listings";

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

  const images = listing.listing_images;
  const mainImage = images.find((i) => i.is_cover) ?? images[0];
  const thumbImages = images.filter((i) => i.id !== mainImage?.id).slice(0, 2);
  const amenities = listing.listing_amenities?.map((la) => la.amenity) ?? [];

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
        {images.length > 0 && (
          <div className="listing-detail__gallery">
            {mainImage && (
              <div className="listing-detail__gallery-main">
                <Image
                  src={mainImage.url}
                  alt={listing.title}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 66vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
            {thumbImages.map((img) => (
              <div key={img.id} className="listing-detail__gallery-thumb">
                <Image
                  src={img.url}
                  alt={listing.title}
                  fill
                  sizes="33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        )}

        <div className="listing-detail__layout">
          <div>
            <span className="listing-card__badge">{listing.category.name_az}</span>
            <h1 className="listing-detail__title">{listing.title}</h1>
            <p className="listing-detail__location">
              {listing.region}, {listing.city}
              {listing.address && ` — ${listing.address}`}
            </p>

            <div className="listing-detail__stats">
              <span>{listing.max_guests} qonaq</span>
              <span>{listing.bedrooms} yataq otağı</span>
              <span>{listing.bathrooms} vanna otağı</span>
            </div>

            <p className="listing-detail__description">{listing.description}</p>

            {amenities.length > 0 && (
              <>
                <h2 className="section__title" style={{ fontSize: "1.25rem" }}>
                  İmkanlar
                </h2>
                <div className="amenities" style={{ marginTop: "1rem" }}>
                  {amenities.map((a) => (
                    <span key={a.id} className="amenity-tag">
                      {a.name_az}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <aside className="listing-detail__sidebar">
            <p className="listing-detail__price">
              {listing.price_per_night} {listing.currency}
            </p>
            <p className="listing-detail__price-note">gecəlik qiymət</p>
            <WhatsAppButton
              phone={listing.whatsapp_phone}
              listingTitle={listing.title}
            />
          </aside>
        </div>
      </div>
    </article>
  );
}
