"use client";

import Image from "next/image";
import { useId, useRef } from "react";

const galleryImages = [
  {
    src: "/assets/trip-itinerary-img-frame1321315453.png",
    alt: "Lioness in the Serengeti near the camp",
  },
  {
    src: "/assets/trip-itinerary-img-frame1321315454.png",
    alt: "Sunrise over the Tanzania landscape",
  },
  {
    src: "/assets/trip-hero-img-frame1321315437.png",
    alt: "Great Migration wildlife in the Serengeti",
  },
] as const;

export function AccommodationGallery() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  function closeGallery() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="mt-4 flex items-center gap-5 text-left text-[17px] font-medium leading-[35px] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        aria-haspopup="dialog"
      >
        <Image src="/assets/trip-itinerary-img-group.svg" width={35} height={23} alt="" className="h-[23px] w-[35px] shrink-0" />
        Serengeti Sound of Silence Tented Camp
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="w-[min(100%_-_2rem,900px)] rounded-2xl border-0 bg-transparent p-0 text-ink shadow-2xl backdrop:bg-black/70"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeGallery();
        }}
      >
        <section className="relative max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl bg-cream p-5 sm:p-8">
          <button
            type="button"
            onClick={closeGallery}
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white text-2xl leading-none shadow-sm transition hover:bg-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            aria-label="Close accommodation gallery"
          >
            ×
          </button>
          <p className="eyebrow pr-12">Accommodation gallery</p>
          <h2 id={titleId} className="mt-3 pr-12 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
            Serengeti Sound of Silence Tented Camp
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {galleryImages.map((image, index) => (
              <div key={image.src} className={`relative overflow-hidden rounded-xl ${index === 0 ? "aspect-[16/9] sm:col-span-2" : "aspect-[4/3]"}`}>
                <Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) calc(100vw - 4.5rem), 400px" className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      </dialog>
    </>
  );
}
