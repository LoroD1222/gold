"use client";

import Image from "next/image";
import { useState } from "react";

const galleryImages = [
  { src: "/assets/trip-hero-img-frame1321315437.png", alt: "Wildebeest moving across the Serengeti during the Great Migration" },
  { src: "/assets/trip-hero-img-frame1321315438.png", alt: "Elephant seen on the safari route" },
  { src: "/assets/trip-itinerary-img-frame1321315453.png", alt: "Lioness in Serengeti National Park" },
  { src: "/assets/trip-itinerary-img-frame1321315454.png", alt: "Sunrise over a Tanzania landscape" },
] as const;

export function TripHeroGallery() {
  const [activeImage, setActiveImage] = useState(0);
  const image = galleryImages[activeImage];

  return (
    <section aria-label="Trip photo gallery">
      <div className="relative aspect-[688/429] overflow-hidden rounded-[10px] xl:h-[429px] xl:aspect-auto">
        <Image key={image.src} src={image.src} alt={image.alt} fill priority sizes="(max-width: 1024px) 100vw, 688px" className="object-cover object-center" />
        <span className="absolute left-5 top-5 rounded-[10px] bg-brand px-4 py-2 text-[20px] font-semibold">Top seller</span>
      </div>
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
              onClick={() => setActiveImage(index)}
              className={`relative aspect-[1.47] overflow-hidden rounded-[10px] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand xl:h-[107px] xl:aspect-auto ${isActive ? "ring-3 ring-brand ring-offset-2" : "opacity-75 hover:opacity-100"}`}
            >
              <Image src={item.src} alt="" fill sizes="180px" className="object-cover" />
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">Showing photo {activeImage + 1} of {galleryImages.length}: {image.alt}</p>
    </section>
  );
}
