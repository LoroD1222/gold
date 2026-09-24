import {
  Baby,
  Binoculars,
  CalendarDays,
  CarFront,
  Gem,
  Houses,
  PlaneLanding,
  Route,
  SlidersHorizontal,
  UserRoundCheck,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { SafariTrip } from "@/lib/safariTrips";

type TourFeatureTrip = Pick<
  SafariTrip,
  | "tourStyle"
  | "accommodationTypes"
  | "tourType"
  | "maxGroupSize"
  | "departureType"
  | "customization"
  | "soloTravelers"
  | "minimumAge"
  | "activities"
  | "gameDriveVehicles"
  | "transportTypes"
  | "airportTransfer"
>;

type TourFeature = {
  label: string;
  value: string;
  description: string;
  Icon: LucideIcon;
};

const accommodationLabels: Record<string, string> = {
  Lodge: "Lodges",
  Hotel: "Hotels",
  "Tented Camp": "Tented Camps",
  Camping: "Camping",
  Cottage: "Cottages",
  "Mountain Hut": "Mountain Huts",
  Other: "Other",
};

export function TourFeatures({ trip }: { trip: TourFeatureTrip }) {
  const features = getTourFeatures(trip);
  if (!features.length) return null;

  return (
    <section id="tour-features" className="scroll-mt-28 bg-cream pb-20 sm:pb-28" aria-label="Tour features">
      <div className="site-container max-w-[1194px]">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map(({ label, value, description, Icon }) => (
            <article key={label} className="min-h-[257px] rounded-[10px] border border-ink/[.15] bg-white p-8">
              <div className="grid h-[71px] w-[70px] place-items-center rounded-[5px] border border-brand/20 bg-brand/[.17]">
                <Icon aria-hidden className="size-10 text-brand" strokeWidth={1.75} />
              </div>
              <h3 className="mt-[13px] text-[18px] font-medium">{label}</h3>
              <p className="mt-[13px] text-[17px] leading-[1.5] text-black/[.6]">
                <span className="block font-semibold text-ink">{value}</span>
                <span className="mt-2 block">{description}</span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function getTourFeatures(trip: TourFeatureTrip): TourFeature[] {
  const features: TourFeature[] = [];
  const accommodation = formatList(trip.accommodationTypes?.map((type) => accommodationLabels[type] ?? type) ?? []);
  const activities = formatList(trip.activities ?? []);
  const vehicles = formatList(trip.gameDriveVehicles ?? []);
  const transport = formatList(trip.transportTypes ?? []);

  if (trip.tourStyle) {
    features.push({ label: "Tour Style", value: trip.tourStyle, description: "The overall comfort and service level of the safari.", Icon: Gem });
  }
  if (accommodation) {
    features.push({ label: "Accommodation", value: accommodation, description: "The types of accommodation used during the tour.", Icon: Houses });
  }
  if (trip.tourType) {
    features.push({
      label: "Tour Type",
      value: `${trip.tourType} Tour`,
      description: trip.tourType === "Private" ? "Your own vehicle and guide, exclusively for your group." : "A safari shared with other travelers.",
      Icon: Users,
    });
  }
  if (typeof trip.maxGroupSize === "number") {
    features.push({
      label: "Group Size",
      value: `Max ${trip.maxGroupSize} ${trip.maxGroupSize === 1 ? "Traveler" : "Travelers"}`,
      description: "The maximum number of travelers sharing the tour or safari vehicle.",
      Icon: UsersRound,
    });
  }
  if (trip.departureType === "Any Day") {
    features.push({ label: "Departure", value: "Can Start Any Day", description: "If availability permits, this tour can start on any day.", Icon: CalendarDays });
  }
  if (trip.departureType === "Fixed Departure") {
    features.push({ label: "Departure", value: "Fixed Departures", description: "This tour operates on selected departure dates.", Icon: CalendarDays });
  }
  if (trip.customization) {
    const descriptions = {
      "Fully Customizable": "This tour can be customized to suit your preferences.",
      "Minor Changes Allowed": "Minor changes to accommodation and destinations can be requested.",
      "Not Customizable": "The accommodation and destinations of this tour cannot be changed.",
    } as const;
    features.push({ label: "Customization", value: trip.customization, description: descriptions[trip.customization], Icon: SlidersHorizontal });
  }
  if (trip.soloTravelers) {
    features.push({
      label: "Solo Travelers",
      value: trip.soloTravelers === "Allowed" ? "Solo Travelers Allowed" : "Solo Travelers Not Allowed",
      description: trip.soloTravelers === "Allowed" ? "Solo travelers can book this tour." : "This tour requires at least two travelers.",
      Icon: UserRoundCheck,
    });
  }
  if (typeof trip.minimumAge === "number") {
    features.push({
      label: "Minimum Age",
      value: trip.minimumAge === 0 ? "Suitable for All Ages" : `Minimum Age: ${trip.minimumAge}+`,
      description: trip.minimumAge === 0 ? "This tour is suitable for children of all ages." : `The minimum age for this tour is ${trip.minimumAge} years.`,
      Icon: Baby,
    });
  }
  if (activities) {
    features.push({ label: "Activities", value: activities, description: "The wildlife, adventure and leisure activities included in the itinerary.", Icon: Binoculars });
  }
  if (vehicles) {
    features.push({ label: "Safari Vehicle", value: vehicles, description: "The type of vehicle used for wildlife viewing and game drives.", Icon: CarFront });
  }
  if (transport) {
    features.push({ label: "Getting Around", value: transport, description: "The main transportation methods used between destinations.", Icon: Route });
  }
  if (trip.airportTransfer) {
    const descriptions = {
      Included: "Airport pickup and drop-off are included in the tour.",
      "Available at Extra Cost": "Airport transfers can be arranged for an additional cost.",
      "Not Included": "Airport transfers are not included in the tour.",
    } as const;
    features.push({ label: "Airport Transfer", value: trip.airportTransfer, description: descriptions[trip.airportTransfer], Icon: PlaneLanding });
  }

  return features;
}

function formatList(values: string[]) {
  if (!values.length) return "";
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} & ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} & ${values.at(-1)}`;
}
