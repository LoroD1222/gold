import type { Trip } from "@/data/trips";
import { sanityFetch } from "@/lib/sanity";

export type PortableTextBlock = {
  _key: string;
  _type: "block";
  children: Array<{ _key: string; _type: "span"; text: string; marks?: string[] }>;
  markDefs?: Array<unknown>;
  style?: "normal";
};

export type SanityImage = {
  _key?: string;
  url?: string;
  alt?: string;
};

export type SafariTrip = {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  categories?: string[];
  guideLabel?: string;
  gallery?: SanityImage[];
  promotionLabel?: string;
  tourStart?: string;
  durationDays?: number;
  difficulty?: string;
  startingPrice?: number;
  priceNote?: string;
  quoteButtonLabel?: string;
  pricingTiers?: Array<{ _key: string; groupSize: string; pricePerPerson: number }>;
  overview?: PortableTextBlock[];
  overviewHighlights?: Array<{ _key: string; title: string; description: string }>;
  highlightsHeading?: string;
  highlights?: Array<{ _key: string; title: string; description: string; icon?: SanityImage }>;
  wildlifeHeading?: string;
  wildlife?: Array<{ _key: string; animal: string; availability: "Abundant" | "Common" | "Rare" }>;
  itineraryHeading?: string;
  itinerary?: Array<{
    _key: string;
    dayRange: string;
    title: string;
    region?: string;
    description?: PortableTextBlock[];
    images?: SanityImage[];
    meals?: string;
    accommodation?: { name?: string; gallery?: SanityImage[] };
  }>;
  itineraryButtonLabel?: string;
  inclusions?: Array<{ _key: string; title: string; description?: PortableTextBlock[]; icon?: SanityImage }>;
  exclusions?: Array<{ _key: string; title: string; description?: PortableTextBlock[] }>;
  relatedTrips?: SafariTripCard[];
  seo?: { title?: string; description?: string; shareImage?: SanityImage };
};

export type SafariTripCard = {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  categories?: string[];
  durationDays?: number;
  startingPrice?: number;
  image?: string;
};

const cardProjection = `{
  _id,
  title,
  "slug": slug.current,
  summary,
  categories,
  durationDays,
  startingPrice,
  "image": gallery[0].asset->url
}`;

const safariTripQuery = `
  *[_type == "safariTrip" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    summary,
    categories,
    guideLabel,
    gallery[]{_key, "url": asset->url, alt},
    promotionLabel,
    tourStart,
    durationDays,
    difficulty,
    startingPrice,
    priceNote,
    quoteButtonLabel,
    pricingTiers[]{_key, groupSize, pricePerPerson},
    overview,
    overviewHighlights[]{_key, title, description},
    highlightsHeading,
    highlights[]{_key, title, description, icon{_key, "url": asset->url, alt}},
    wildlifeHeading,
    wildlife[]{_key, animal, availability},
    itineraryHeading,
    itinerary[]{
      _key,
      dayRange,
      title,
      region,
      description,
      images[]{_key, "url": asset->url, alt},
      meals,
      accommodation{name, gallery[]{_key, "url": asset->url, alt}}
    },
    itineraryButtonLabel,
    inclusions[]{_key, title, description, icon{_key, "url": asset->url, alt}},
    exclusions[]{_key, title, description},
    "relatedTrips": relatedTrips[]->${cardProjection},
    seo{title, description, shareImage{"url": asset->url, alt}}
  }
`;

const safariTripCardsQuery = `
  *[_type == "safariTrip" && defined(slug.current)] | order(featured desc, title asc) ${cardProjection}
`;

export async function getSafariTrip(slug: string) {
  return sanityFetch<SafariTrip | null>(safariTripQuery, { slug });
}

export async function getSafariTripCards(): Promise<Trip[]> {
  const trips = await sanityFetch<SafariTripCard[]>(safariTripCardsQuery);
  return trips.map((trip) => ({
    slug: trip.slug,
    title: trip.title,
    duration: trip.durationDays,
    priceFrom: trip.startingPrice,
    image: trip.image,
    category: trip.categories?.join(" ") ?? "",
    shortDescription: trip.summary ?? "",
  }));
}

export function asTripCard(trip: SafariTripCard): Trip {
  return {
    slug: trip.slug,
    title: trip.title,
    duration: trip.durationDays,
    priceFrom: trip.startingPrice,
    image: trip.image,
    category: trip.categories?.join(" ") ?? "",
    shortDescription: trip.summary ?? "",
  };
}
