"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const galleryImages = [
  { src: "/assets/trip-hero-img-frame1321315437.png", alt: "Wildebeest moving across the Serengeti during the Great Migration" },
  { src: "/assets/trip-hero-img-frame1321315438.png", alt: "Elephant seen on the safari route" },
  { src: "/assets/trip-itinerary-img-frame1321315453.png", alt: "Lioness in Serengeti National Park" },
  { src: "/assets/trip-itinerary-img-frame1321315454.png", alt: "Sunrise over a Tanzania landscape" },
] as const;

export function TripHeroGallery() {
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const image = galleryImages[activeImage];

  function openLightbox(index = activeImage) {
    setActiveImage(index);
    setIsLightboxOpen(true);
  }

  function changeImage(direction: -1 | 1) {
    setActiveImage((current) => (current + direction + galleryImages.length) % galleryImages.length);
  }

  useEffect(() => {
    if (!isLightboxOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsLightboxOpen(false);
      if (event.key === "ArrowLeft") changeImage(-1);
      if (event.key === "ArrowRight") changeImage(1);
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isLightboxOpen]);

  return (
    <section aria-label="Trip photo gallery">
      <button
        type="button"
        onClick={() => openLightbox()}
        className="relative block w-full aspect-[688/429] overflow-hidden rounded-[10px] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand xl:h-[429px] xl:aspect-auto"
        aria-label={`Open photo ${activeImage + 1} in the gallery: ${image.alt}`}
      >
        <Image key={image.src} src={image.src} alt={image.alt} fill priority sizes="(max-width: 1024px) 100vw, 688px" className="object-cover object-center" />
        <span className="absolute left-5 top-5 rounded-[10px] bg-brand px-4 py-2 text-[20px] font-semibold">Top seller</span>
        <span className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1.5 text-sm font-semibold text-white">View gallery</span>
      </button>
      <div role="tablist" aria-label="Choose a trip photo" className="mt-4 grid grid-cols-4 gap-4 xl:mt-[15px] xl:gap-[17px]">
        {galleryImages.map((item, index) => {
          const isActive = index === activeImage;
          return (
            <button
              key={item.src}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Show photo ${index + 1}: ${item.alt}`}
              onClick={() => openLightbox(index)}
              className={`relative aspect-[1.47] overflow-hidden rounded-[10px] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand xl:h-[107px] xl:aspect-auto ${isActive ? "ring-3 ring-brand ring-offset-2" : "opacity-75 hover:opacity-100"}`}
            >
              <Image src={item.src} alt="" fill sizes="180px" className="object-cover" />
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">Showing photo {activeImage + 1} of {galleryImages.length}: {image.alt}</p>
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Trip photo gallery lightbox"
          className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4 sm:p-8"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsLightboxOpen(false);
          }}
        >
          <div className="relative w-full max-w-6xl">
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute right-0 top-0 z-10 grid size-11 -translate-y-14 place-items-center rounded-full bg-white/15 text-3xl leading-none text-white transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Close trip photo gallery"
            >
              ×
            </button>
            <div className="relative h-[min(74dvh,760px)] overflow-hidden rounded-xl bg-black">
              <Image src={image.src} alt={image.alt} fill priority sizes="90vw" className="object-contain" />
            </div>
            <button
              type="button"
              onClick={() => changeImage(-1)}
              className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-3xl leading-none text-white transition hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-5"
              aria-label="Previous gallery image"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => changeImage(1)}
              className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-3xl leading-none text-white transition hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-5"
              aria-label="Next gallery image"
            >
              →
            </button>
            <p className="mt-4 text-center text-sm text-white sm:text-base">{activeImage + 1} / {galleryImages.length} · {image.alt}</p>
          </div>
        </div>
      )}
    </section>
  );
}
