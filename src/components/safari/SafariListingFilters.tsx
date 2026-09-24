"use client";

import { useMemo, useState, type ReactNode } from "react";
import { TripCard } from "@/components/safari/TripCard";
import type { Trip } from "@/data/trips";

type RouteFilter = "safari" | "zanzibar" | "kilimanjaro";
type PriceFilter = "all" | "up-to-2000" | "2000-to-4000" | "over-4000";
type DurationFilter = "all" | "2-to-4" | "5-to-7" | "8-to-12" | "13-or-more";

const routeFilters: ReadonlyArray<{ id: RouteFilter; label: string; category: string }> = [
  { id: "safari", label: "Safari", category: "Safari" },
  { id: "zanzibar", label: "Zanzibar", category: "Zanzibar" },
  { id: "kilimanjaro", label: "Kilimanjaro", category: "Kilimanjaro" },
];

const priceFilters: ReadonlyArray<{ id: PriceFilter; label: string }> = [
  { id: "all", label: "Any price" },
  { id: "up-to-2000", label: "Up to $2,000" },
  { id: "2000-to-4000", label: "$2,000 – $4,000" },
  { id: "over-4000", label: "Over $4,000" },
];

const durationFilters: ReadonlyArray<{ id: DurationFilter; label: string }> = [
  { id: "all", label: "Any duration" },
  { id: "2-to-4", label: "2–4 days" },
  { id: "5-to-7", label: "5–7 days" },
  { id: "8-to-12", label: "8–12 days" },
  { id: "13-or-more", label: "13+ days" },
];

export function SafariListingFilters({ trips, intro }: { trips: Trip[]; intro: ReactNode }) {
  const [selectedFilters, setSelectedFilters] = useState<RouteFilter[]>(routeFilters.map((filter) => filter.id));
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [durationFilter, setDurationFilter] = useState<DurationFilter>("all");

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesRoute = routeFilters.some((filter) => selectedFilters.includes(filter.id) && trip.category.includes(filter.category));
      return matchesRoute && matchesPrice(trip.priceFrom, priceFilter) && matchesDuration(trip.duration, durationFilter);
    });
  }, [durationFilter, priceFilter, selectedFilters, trips]);

  function toggleFilter(filterId: RouteFilter, checked: boolean) {
    setSelectedFilters((currentFilters) => checked
      ? [...currentFilters, filterId]
      : currentFilters.filter((filter) => filter !== filterId));
  }

  return (
    <>
      <fieldset className="mt-7 flex flex-wrap justify-center gap-4" aria-controls="safari-routes-grid">
        <legend className="sr-only">Filter Tanzania safari routes, prices, and durations</legend>
        {routeFilters.map((filter) => (
          <FilterCheckbox
            key={filter.id}
            label={filter.label}
            checked={selectedFilters.includes(filter.id)}
            onChange={(checked) => toggleFilter(filter.id, checked)}
          />
        ))}
        <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-brand bg-cream px-5 py-2 text-sm font-semibold text-ink transition hover:bg-brand/10 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand">
          <span>Price:</span>
          <select value={priceFilter} onChange={(event) => setPriceFilter(event.target.value as PriceFilter)} aria-label="Filter by starting price" className="cursor-pointer bg-transparent font-semibold outline-none">
            {priceFilters.map((filter) => <option key={filter.id} value={filter.id}>{filter.label}</option>)}
          </select>
        </label>
        <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-brand bg-cream px-5 py-2 text-sm font-semibold text-ink transition hover:bg-brand/10 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand">
          <span>Duration:</span>
          <select value={durationFilter} onChange={(event) => setDurationFilter(event.target.value as DurationFilter)} aria-label="Filter by trip duration" className="cursor-pointer bg-transparent font-semibold outline-none">
            {durationFilters.map((filter) => <option key={filter.id} value={filter.id}>{filter.label}</option>)}
          </select>
        </label>
      </fieldset>

      {intro}

      <div id="safari-routes-grid" aria-live="polite" className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTrips.length > 0 ? (
          filteredTrips.map((trip, index) => <TripCard key={`${trip.title}-${index}`} trip={trip} />)
        ) : (
          <p className="col-span-full rounded-xl border border-brand/40 bg-cream px-6 py-8 text-center text-muted">No routes match these filters. Try another route or price range.</p>
        )}
      </div>
    </>
  );
}

function matchesPrice(price: number | undefined, filter: PriceFilter) {
  if (filter === "all") return true;
  if (typeof price !== "number") return false;

  if (filter === "up-to-2000") return price <= 2000;
  if (filter === "2000-to-4000") return price > 2000 && price <= 4000;
  return price > 4000;
}

function matchesDuration(duration: number | undefined, filter: DurationFilter) {
  if (filter === "all") return true;
  if (typeof duration !== "number") return false;

  if (filter === "2-to-4") return duration >= 2 && duration <= 4;
  if (filter === "5-to-7") return duration >= 5 && duration <= 7;
  if (filter === "8-to-12") return duration >= 8 && duration <= 12;
  return duration >= 13;
}

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className={`inline-flex min-h-10 cursor-pointer items-center gap-3 rounded-full border px-5 py-2 text-sm font-semibold transition focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand ${checked ? "border-brand bg-brand/10 text-ink" : "border-brand bg-cream text-ink hover:bg-brand/10"}`}>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-4 cursor-pointer accent-brand" />
      {label}
    </label>
  );
}
