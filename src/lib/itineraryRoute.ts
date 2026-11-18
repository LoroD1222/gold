import type { PortableTextBlock, SafariTrip } from "@/lib/safariTrips";

export type RouteStop = {
  id: string;
  name: string;
  dayLabel: string;
  description?: string;
  latitude: number;
  longitude: number;
  href?: string;
  markerLabel?: string;
};

type ItineraryStop = NonNullable<SafariTrip["itinerary"]>[number];

const knownLocations: ReadonlyArray<{ pattern: RegExp; latitude: number; longitude: number }> = [
  { pattern: /arusha|kilimanjaro airport/i, latitude: -3.3869, longitude: 36.683 },
  { pattern: /tarangire/i, latitude: -3.8333, longitude: 36.0 },
  { pattern: /manyara|mto wa mbu/i, latitude: -3.5833, longitude: 35.85 },
  { pattern: /ngorongoro|karatu|crater/i, latitude: -3.2083, longitude: 35.5877 },
  { pattern: /serengeti|seronera|ndutu|mara river/i, latitude: -2.3333, longitude: 34.8333 },
  { pattern: /lake natron/i, latitude: -2.4167, longitude: 36.0 },
  { pattern: /zanzibar|stone town|paje|nungwi/i, latitude: -6.1659, longitude: 39.2026 },
  { pattern: /kilimanjaro|marangu|machame|moshi/i, latitude: -3.0674, longitude: 37.3556 },
  { pattern: /nyerere|selous/i, latitude: -8.85, longitude: 37.45 },
  { pattern: /ruaha|iringa/i, latitude: -7.75, longitude: 34.9333 },
  { pattern: /dar es salaam/i, latitude: -6.7924, longitude: 39.2083 },
  { pattern: /mwanza|victoria/i, latitude: -2.5164, longitude: 32.9175 },
];

function toPlainText(blocks?: PortableTextBlock[]) {
  return blocks
    ?.flatMap((block) => block.children.map((child) => child.text))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function routeCoordinates(stop: ItineraryStop) {
  if (typeof stop.latitude === "number" && typeof stop.longitude === "number") {
    return { latitude: stop.latitude, longitude: stop.longitude };
  }

  const placeName = [stop.region, stop.title].filter(Boolean).join(" ");
  return knownLocations.find((location) => location.pattern.test(placeName));
}

export function itineraryToRouteStops(itinerary?: SafariTrip["itinerary"]): RouteStop[] {
  return (itinerary ?? []).flatMap((stop, index) => {
    const coordinates = routeCoordinates(stop);
    if (!coordinates) return [];

    return [{
      id: stop._key,
      name: stop.region || stop.title,
      dayLabel: stop.dayRange,
      description: toPlainText(stop.description),
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      href: stop.destinationUrl,
      markerLabel: String(index + 1),
    }];
  });
}
