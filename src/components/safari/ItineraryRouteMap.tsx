"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import type { RouteStop } from "@/lib/itineraryRoute";
import "leaflet/dist/leaflet.css";

type ItineraryRouteMapProps = {
  stops: RouteStop[];
};

export function ItineraryRouteMap({ stops }: ItineraryRouteMapProps) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef(new Map<string, LeafletMarker>());
  const [selectedId, setSelectedId] = useState(stops[0]?.id ?? "");

  const selectedStop = stops.find((stop) => stop.id === selectedId) ?? stops[0];

  useEffect(() => {
    if (!stops.length || !mapElementRef.current) return;

    let cancelled = false;
    let resizeObserver: ResizeObserver | undefined;
    const markers = markerRef.current;

    async function initialiseMap() {
      const L = await import("leaflet");
      if (cancelled || !mapElementRef.current) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const map = L.map(mapElementRef.current, {
        attributionControl: true,
        zoomControl: true,
        scrollWheelZoom: false,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        keyboard: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      const bounds = L.latLngBounds(stops.map((stop) => [stop.latitude, stop.longitude] as [number, number]));
      L.polyline(stops.map((stop) => [stop.latitude, stop.longitude] as [number, number]), {
        color: "#d75d29",
        weight: 3,
        opacity: 0.9,
        dashArray: "7 8",
        lineCap: "round",
      }).addTo(map);

      stops.forEach((stop, index) => {
        const marker = L.marker([stop.latitude, stop.longitude], {
          icon: routeMarkerIcon(L, stop.markerLabel ?? String(index + 1), stop.id === stops[0]?.id),
          keyboard: true,
          title: `${stop.dayLabel}: ${stop.name}`,
          riseOnHover: true,
        }).addTo(map);

        marker.on("click", () => setSelectedId(stop.id));
        marker.on("keypress", (event) => {
          const originalEvent = event.originalEvent as KeyboardEvent | undefined;
          if (originalEvent?.key === "Enter" || originalEvent?.key === " ") setSelectedId(stop.id);
        });
        marker.on("add", () => {
          const markerElement = marker.getElement();
          markerElement?.setAttribute("aria-label", `${stop.dayLabel}: ${stop.name}`);
          markerElement?.setAttribute("role", "button");
        });
        markers.set(stop.id, marker);
      });

      map.fitBounds(bounds, { padding: [24, 24], animate: !reducedMotion });
      const zoomIn = mapElementRef.current.querySelector<HTMLAnchorElement>(".leaflet-control-zoom-in");
      const zoomOut = mapElementRef.current.querySelector<HTMLAnchorElement>(".leaflet-control-zoom-out");
      zoomIn?.setAttribute("aria-label", "Zoom in");
      zoomOut?.setAttribute("aria-label", "Zoom out");

      resizeObserver = new ResizeObserver(() => map.invalidateSize({ animate: false }));
      resizeObserver.observe(mapElementRef.current);
    }

    void initialiseMap();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      markers.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [stops]);

  useEffect(() => {
    if (!selectedStop) return;

    async function updateSelectedMarker() {
      const L = await import("leaflet");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      stops.forEach((stop, index) => {
        markerRef.current.get(stop.id)?.setIcon(routeMarkerIcon(L, stop.markerLabel ?? String(index + 1), stop.id === selectedStop.id));
      });
      mapRef.current?.panTo([selectedStop.latitude, selectedStop.longitude], { animate: !reducedMotion, duration: reducedMotion ? 0 : 0.45 });
    }

    void updateSelectedMarker();
  }, [selectedStop, stops]);

  if (!stops.length) {
    return (
      <div className="space-y-[14px]">
        <div className="relative aspect-[302/262] w-full overflow-hidden rounded-[10px]">
          <Image src="/assets/trip-itinerary-sidebar-map.png" width={362} height={272} alt="Illustrated map of Tanzania" sizes="(min-width: 1280px) 302px, 100vw" className="absolute -left-[16.08%] top-0 h-[102.89%] w-[119.01%] max-w-none object-cover" />
        </div>
        <p className="rounded-[10px] bg-sand px-4 py-3 text-center text-sm leading-6 text-muted">Route stops will appear here once they are added to this itinerary.</p>
      </div>
    );
  }

  return (
    <section aria-label="Interactive itinerary route" className="space-y-[14px]">
      <div className="relative aspect-[302/262] w-full overflow-hidden rounded-[10px] bg-sand">
        <div ref={mapElementRef} className="absolute inset-0" />
      </div>

      <div className="rounded-[10px] border border-ink/[.08] bg-[#fffefc] p-3">
        <h3 className="px-1 text-sm font-bold uppercase tracking-[0.1em] text-ink">Your route</h3>
        <ol className="mt-3 space-y-2" aria-label="Itinerary stops">
          {stops.map((stop, index) => {
            const isSelected = stop.id === selectedStop?.id;
            return (
              <li key={stop.id}>
                <div className={`rounded-[7px] border transition ${isSelected ? "border-brand bg-brand/[.12]" : "border-transparent hover:border-ink/10 hover:bg-sand/70"}`}>
                  <button type="button" onClick={() => setSelectedId(stop.id)} aria-pressed={isSelected} className="flex w-full items-start gap-3 p-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                    <span aria-hidden className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${isSelected ? "bg-brand text-ink" : "bg-ink text-white"}`}>{stop.markerLabel ?? index + 1}</span>
                    <span className="min-w-0"><span className="block text-sm font-semibold leading-5 text-ink">{stop.name}</span><span className="block text-xs leading-5 text-muted">{stop.dayLabel}</span></span>
                  </button>
                  {stop.href ? <a href={stop.href} className="mb-2 ml-11 inline-block text-xs font-semibold text-brand-dark underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">Explore this destination</a> : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

    </section>
  );
}

function routeMarkerIcon(leaflet: typeof import("leaflet"), label: string, isActive: boolean) {
  return leaflet.divIcon({
    className: "itinerary-route-marker",
    html: `<span class="itinerary-route-marker__dot${isActive ? " itinerary-route-marker__dot--active" : ""}">${label}</span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}
