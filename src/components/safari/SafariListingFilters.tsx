"use client";

import { useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import { TripCard } from "@/components/safari/TripCard";
import type { Trip } from "@/data/trips";

type Filter = "all" | "safari" | "zanzibar";

const filters: ReadonlyArray<{ id: Filter; label: string }> = [
  { id: "all", label: "All" },
  { id: "safari", label: "Safari" },
  { id: "zanzibar", label: "Zanzibar" },
];

export function SafariListingFilters({ trips, intro }: { trips: Trip[]; intro: ReactNode }) {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const filteredTrips = useMemo(() => {
    if (activeFilter === "all") return trips;
    if (activeFilter === "zanzibar") return trips.filter((trip) => trip.category.includes("Zanzibar"));
    return trips.filter((trip) => trip.category.includes("Safari"));
  }, [activeFilter, trips]);

  function handleFilterKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

    event.preventDefault();
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? filters.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + filters.length) % filters.length;
    const nextFilter = filters[nextIndex];
    setActiveFilter(nextFilter.id);
    requestAnimationFrame(() => document.getElementById(`safari-filter-${nextFilter.id}`)?.focus());
  }

  return (
    <>
      <div role="tablist" aria-label="Filter Tanzania safari routes" className="mt-7 flex flex-wrap justify-center gap-4">
        {filters.map((filter, index) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              id={`safari-filter-${filter.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="safari-routes-grid"
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveFilter(filter.id)}
              onKeyDown={(event) => handleFilterKeyDown(event, index)}
              className={`inline-flex min-h-10 items-center gap-3 rounded-full border px-5 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${isActive ? "border-brand bg-brand/10 text-ink" : "border-brand bg-cream text-ink hover:bg-brand/10"}`}
            >
              <span aria-hidden="true" className="grid size-5 place-items-center rounded-full bg-brand/25 text-brand">✓</span>
              {filter.label}
            </button>
          );
        })}
      </div>

      {intro}

      <div id="safari-routes-grid" role="tabpanel" aria-live="polite" className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTrips.map((trip, index) => <TripCard key={`${trip.title}-${index}`} trip={trip} />)}
      </div>
    </>
  );
}
