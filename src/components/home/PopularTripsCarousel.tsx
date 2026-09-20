"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent, type PointerEvent } from "react";
import { TripCard } from "@/components/safari/TripCard";
import type { Trip } from "@/data/trips";

type TripFilter = "all" | "safari" | "zanzibar";

type PopularTripsCarouselProps = {
  trips: Trip[];
};

const tabs: ReadonlyArray<{ id: TripFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "safari", label: "Safari" },
  { id: "zanzibar", label: "Zanzibar" },
];

export function PopularTripsCarousel({ trips }: PopularTripsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ pointerId: number; x: number; scrollLeft: number } | null>(null);
  const [filter, setFilter] = useState<TripFilter>("all");
  const [progress, setProgress] = useState(0);
  const [indicatorWidth, setIndicatorWidth] = useState(100);
  const filteredTrips = useMemo(() => trips.filter((trip) => {
    if (filter === "all") return true;
    if (filter === "safari") return trip.category.includes("Safari");
    return trip.category.includes("Zanzibar");
  }), [filter, trips]);
  const syncCarouselState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    setProgress(maxScroll > 0 ? track.scrollLeft / maxScroll : 0);
    setIndicatorWidth(track.scrollWidth > 0 ? Math.min(100, (track.clientWidth / track.scrollWidth) * 100) : 100);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    syncCarouselState();
    const observer = new ResizeObserver(syncCarouselState);
    observer.observe(track);
    return () => observer.disconnect();
  }, [filteredTrips.length, syncCarouselState]);

  function selectFilter(nextFilter: TripFilter) {
    trackRef.current?.scrollTo({ left: 0, behavior: "auto" });
    setProgress(0);
    setFilter(nextFilter);
  }

  function updateProgress() {
    syncCarouselState();
  }

  function handleProgressChange(event: ChangeEvent<HTMLInputElement>) {
    const track = trackRef.current;
    const nextProgress = Number(event.target.value);
    setProgress(nextProgress);

    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    track.scrollTo({ left: Math.max(0, maxScroll) * nextProgress, behavior: "auto" });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? tabs.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];

    selectFilter(nextTab.id);
    requestAnimationFrame(() => document.getElementById("popular-tab-" + nextTab.id)?.focus());
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;

    dragStart.current = { pointerId: event.pointerId, x: event.clientX, scrollLeft: track.scrollLeft };
    track.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    const start = dragStart.current;
    if (!track || !start || start.pointerId !== event.pointerId) return;

    track.scrollLeft = start.scrollLeft - (event.clientX - start.x);
  }

  function stopDragging(event: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    const start = dragStart.current;
    if (!track || !start || start.pointerId !== event.pointerId) return;

    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    dragStart.current = null;
  }

  return (
    <>
      <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="popular-title" className="text-4xl font-semibold tracking-[-0.04em] sm:text-[46px]">
          Our Popular Family Adventures
        </h2>
        <div role="tablist" aria-label="Filter popular family adventures" className="flex gap-[15px]">
          {tabs.map((tab, index) => {
            const isActive = tab.id === filter;
            const tabClassName = (tab.id === "all" ? "w-[67px]" : tab.id === "safari" ? "w-[101px]" : "w-[123px]") + " h-[52px] rounded-[5px] bg-white text-[20px] font-semibold leading-[1.68] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand " + (isActive ? "border border-brand text-[#ff8d28]" : "border border-transparent text-black hover:border-brand/40");

            return (
              <button
                key={tab.id}
                id={"popular-tab-" + tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="popular-trips-track"
                tabIndex={isActive ? 0 : -1}
                className={tabClassName}
                onClick={() => selectFilter(tab.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-[18px]">
        <div
          ref={trackRef}
          id="popular-trips-track"
          role="tabpanel"
          aria-roledescription="carousel"
          aria-labelledby={"popular-tab-" + filter}
          tabIndex={0}
          onScroll={updateProgress}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          className="h-[432px] cursor-grab overflow-x-auto overflow-y-hidden scroll-smooth pr-4 pt-[19px] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden sm:h-[522px] sm:pr-0"
        >
          <div className="flex w-full snap-x snap-mandatory gap-[21px]">
            {filteredTrips.map((trip) => <TripCard key={trip.title} trip={trip} carousel />)}
          </div>
        </div>
        <div className="relative mt-[23px] h-[18px]">
          <div className="absolute inset-x-0 top-1/2 h-[6px] -translate-y-1/2 rounded-full bg-black/[.04]" aria-hidden="true" />
          <div
            aria-hidden="true"
            className="absolute top-1/2 h-[6px] -translate-y-1/2 rounded-full bg-brand transition-[left,width] duration-150"
            style={{ left: progress * (100 - indicatorWidth) + "%", width: indicatorWidth + "%" }}
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={progress}
            onChange={handleProgressChange}
            aria-label="Carousel position"
            className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          />
        </div>
        <p className="sr-only">Swipe, drag, or use the left and right arrow keys to browse popular safari trips.</p>
      </div>
    </>
  );
}
