import type { Locale } from "@/i18n/routing";
import type { ListingWithRelations } from "@/types/database";
import { getAbsoluteUrl, getSiteUrl, SITE_NAME } from "@/lib/seo";

/** Serializes JSON-LD safely for a <script> tag (escapes `</` to avoid tag breakout). */
export function jsonLdScriptProps(data: unknown) {
  return {
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    },
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: getSiteUrl(),
    areaServed: {
      "@type": "Country",
      name: "Azerbaijan",
    },
  };
}

export function buildWebSiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: getAbsoluteUrl("/", locale),
    inLanguage: locale,
  };
}

export function buildBlogPostingJsonLd(
  post: { slug: string; title: string; metaDescription: string; publishedAt: string },
  locale: Locale
) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    inLanguage: locale,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": getAbsoluteUrl(`/blog/${post.slug}`, locale),
    },
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: getSiteUrl(),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: getSiteUrl(),
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getAbsoluteUrl(item.path, locale),
    })),
  };
}

export function buildLodgingBusinessJsonLd(
  listing: ListingWithRelations,
  locale: Locale,
  title: string,
  description: string
) {
  const url = getAbsoluteUrl(`/listings/${listing.id}`, locale);
  const images = listing.listing_images.map((image) => image.url);

  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: title,
    description,
    url,
    image: images.length > 0 ? images : undefined,
    address: {
      "@type": "PostalAddress",
      addressCountry: "AZ",
      addressRegion: listing.region,
      addressLocality: listing.city,
      streetAddress: listing.address ?? undefined,
    },
    geo:
      listing.lat != null && listing.lng != null
        ? {
            "@type": "GeoCoordinates",
            latitude: listing.lat,
            longitude: listing.lng,
          }
        : undefined,
    priceRange: `${listing.price_per_night} ${listing.currency}`,
    numberOfRooms: listing.bedrooms || undefined,
    maximumAttendeeCapacity: listing.max_guests || undefined,
  };
}
