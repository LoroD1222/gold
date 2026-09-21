"use client";

import Image from "next/image";
import { tripadvisorProfileUrl } from "@/data/externalLinks";
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent, type PointerEvent } from "react";
import type { Testimonial } from "@/data/testimonials";

type CompactTestimonialsCarouselProps = {
  reviews: readonly Testimonial[];
};

export function CompactTestimonialsCarousel({ reviews }: CompactTestimonialsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ pointerId: number; x: number; scrollLeft: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(reviews.length > 1);
  const indicatorWidth = 50;

  const updateProgress = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const nextProgress = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
    setProgress(nextProgress);
    setCanGoBack(track.scrollLeft > 1);
    setCanGoForward(track.scrollLeft < maxScroll - 1);
  }, []);

  useEffect(() => {
    updateProgress();
    window.addEventListener("resize", updateProgress);
    return () => window.removeEventListener("resize", updateProgress);
  }, [updateProgress, reviews.length]);

  function handleProgressChange(event: ChangeEvent<HTMLInputElement>) {
    const track = trackRef.current;
    const nextProgress = Number(event.target.value);
    setProgress(nextProgress);

    if (!track) return;
    track.scrollTo({ left: (track.scrollWidth - track.clientWidth) * nextProgress, behavior: "auto" });
  }

  function moveSlide(direction: -1 | 1) {
    const track = trackRef.current;
    const slide = track?.querySelector<HTMLElement>("[data-testimonial-slide]");
    if (!track || !slide) return;

    const slideGap = parseFloat(getComputedStyle(slide.parentElement as HTMLElement).gap) || 0;
    track.scrollBy({ left: direction * (slide.getBoundingClientRect().width + slideGap), behavior: "smooth" });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
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
    <div className="mx-auto mt-14 max-w-[1061px]">
      <div
        ref={trackRef}
        id="testimonials-carousel-track"
        role="region"
        aria-label="Family reviews carousel"
        aria-roledescription="carousel"
        tabIndex={0}
        onScroll={updateProgress}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        className="cursor-grab overflow-x-auto scroll-smooth [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max snap-x snap-mandatory gap-6 pb-1 md:gap-[27px]">
          {reviews.map((review) => (
            <article key={review.id} data-testimonial-slide className="w-[min(100vw-2.5rem,530px)] shrink-0 snap-start rounded-[12px] bg-sand p-5 sm:min-h-[669px] sm:p-[30px]">
              <div className="grid grid-cols-2 gap-3.5">
                {review.images.map((src, index) => (
                  <div key={src} className="relative aspect-[1.11] overflow-hidden rounded-lg sm:h-[199px] sm:aspect-auto">
                    <Image src={src} alt={index === 0 ? `Family safari experience shared by ${review.name}` : "Tanzania landscape from a family safari"} fill sizes="(max-width: 640px) 42vw, 221px" className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="mt-9 flex items-end gap-[13px]">
                <Image src={review.avatar} alt="" width={65} height={65} className="size-[65px] rounded-full object-cover" />
                <div>
                  <Image src="/assets/home-testimonials-img-frame1321315437.svg" width={146} height={26} alt="5 out of 5 stars" className="h-[26px] w-[146px]" />
                  <p className="mt-[3px] text-base leading-[1.68] text-black/75"><strong>{review.name} / </strong><span className="text-black/30">{review.date}</span></p>
                </div>
              </div>
              <h3 className="mt-[15px] text-xl font-bold leading-[1.68] text-black/75">{review.title}</h3>
              <p className="mt-[15px] text-base leading-[1.68] text-black/75">{review.text}</p>
              <a href={tripadvisorProfileUrl} target="_blank" rel="noreferrer" className="mt-[15px] inline-flex items-center gap-2.5 text-base font-bold leading-[1.68] text-black/75 underline underline-offset-4">
                <Image src="/assets/home-testimonials-img-ellipse2.png" width={47} height={47} alt="Tripadvisor" className="size-[46.5px]" />
                Read more on Trip Advisor
              </a>
            </article>
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <div className="relative h-[18px] flex-1">
          <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-[6px] -translate-y-1/2 rounded-full bg-black/[.04]" />
          <div
            aria-hidden="true"
            className="absolute top-1/2 h-[6px] -translate-y-1/2 rounded-full bg-brand transition-[left] duration-150"
            style={{ left: progress * (100 - indicatorWidth) + "%", width: indicatorWidth + "%" }}
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={progress}
            onChange={handleProgressChange}
            aria-label="Testimonial carousel position"
            className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          />
        </div>
        <div className="flex shrink-0 gap-2" aria-label="Testimonial slide controls">
          <button type="button" aria-controls="testimonials-carousel-track" aria-label="Previous review" onClick={() => moveSlide(-1)} disabled={!canGoBack} className="grid size-10 place-items-center rounded-full border border-brand bg-cream text-xl leading-none text-ink transition hover:bg-brand/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40">←</button>
          <button type="button" aria-controls="testimonials-carousel-track" aria-label="Next review" onClick={() => moveSlide(1)} disabled={!canGoForward} className="grid size-10 place-items-center rounded-full border border-brand bg-cream text-xl leading-none text-ink transition hover:bg-brand/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40">→</button>
        </div>
      </div>
      <p className="sr-only">Use the previous and next buttons, swipe, drag, or use the left and right arrow keys to browse family reviews.</p>
    </div>
  );
}
