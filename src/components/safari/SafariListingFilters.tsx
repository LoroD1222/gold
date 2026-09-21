"use client";

import { useMemo, useState, type ReactNode } from "react";
import { TripCard } from "@/components/safari/TripCard";
import type { Trip } from "@/data/trips";

type RouteFilter = "safari" | "zanzibar";

const routeFilters: ReadonlyArray<{ id: RouteFilter; label: string }> = [
  { id: "safari", label: "Safari" },
  { id: "zanzibar", label: "Zanzibar" },
];

export function SafariListingFilters({ trips, intro }: { trips: Trip[]; intro: ReactNode }) {
  const [selectedFilters, setSelectedFilters] = useState<RouteFilter[]>(routeFilters.map((filter) => filter.id));
  const allSelected = selectedFilters.length === routeFilters.length;

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => selectedFilters.some((filter) => trip.category.includes(filter === "safari" ? "Safari" : "Zanzibar")));
  }, [selectedFilters, trips]);

  function toggleAll(checked: boolean) {
    setSelectedFilters(checked ? routeFilters.map((filter) => filter.id) : []);
  }

  function toggleFilter(filterId: RouteFilter, checked: boolean) {
    setSelectedFilters((currentFilters) => checked
      ? [...currentFilters, filterId]
      : currentFilters.filter((filter) => filter !== filterId));
  }

  return (
    <>
      <fieldset className="mt-7 flex flex-wrap justify-center gap-4" aria-controls="safari-routes-grid">
        <legend className="sr-only">Filter Tanzania safari routes</legend>
        <FilterCheckbox label="All" checked={allSelected} onChange={toggleAll} />
        {routeFilters.map((filter) => (
          <FilterCheckbox
            key={filter.id}
            label={filter.label}
            checked={selectedFilters.includes(filter.id)}
            onChange={(checked) => toggleFilter(filter.id, checked)}
          />
        ))}
      </fieldset>

      {intro}

      <div id="safari-routes-grid" aria-live="polite" className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTrips.length > 0 ? (
          filteredTrips.map((trip, index) => <TripCard key={`${trip.title}-${index}`} trip={trip} />)
        ) : (
          <p className="col-span-full rounded-xl border border-brand/40 bg-cream px-6 py-8 text-center text-muted">Choose Safari or Zanzibar to see matching routes.</p>
        )}
      </div>
    </>
  );
}

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className={`inline-flex min-h-10 cursor-pointer items-center gap-3 rounded-full border px-5 py-2 text-sm font-semibold transition focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand ${checked ? "border-brand bg-brand/10 text-ink" : "border-brand bg-cream text-ink hover:bg-brand/10"}`}>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-4 cursor-pointer accent-brand" />
      {label}
    </label>
  );
}
