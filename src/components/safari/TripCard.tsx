import Image from "next/image";
import Link from "next/link";
import type { Trip } from "@/data/trips";
import { tripHref } from "@/data/trips";

export function TripCard({ trip, compact = false, carousel = false }: { trip: Trip; compact?: boolean; carousel?: boolean }) {
  const featureCard = carousel || compact;
  const cardClassName = carousel
    ? "h-[390px] w-[calc(100vw-3rem)] max-w-[341px] shrink-0 snap-start sm:h-[477px] sm:w-[calc((100%_-_21px)_/_2)] sm:max-w-none lg:h-[396px] lg:w-[calc((100%_-_63px)_/_4)]"
    : compact
      ? "h-[477px]"
      : "h-[506px]";
  const headingClassName = (featureCard || !compact ? "text-xl" : "text-base") + " max-w-[290px] font-semibold leading-[1.28]";
  const durationClassName = (featureCard ? "mt-3 sm:mt-[11px]" : "mt-3") + " inline-flex w-fit items-center gap-1 rounded-full bg-ink/35 px-2 py-1 text-[11px] font-semibold uppercase backdrop-blur-sm";
  const priceClassName = (featureCard || !compact ? "text-[27px]" : "text-2xl") + " block font-semibold";
  const usesHomeSliderCta = carousel || !compact;
  const buttonClassName = (usesHomeSliderCta ? "min-h-[46px] px-5 text-[18px]" : "min-h-11 px-5") + " inline-flex shrink-0 items-center rounded-full border border-brand py-2 font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white " + (usesHomeSliderCta ? "bg-brand/35 text-white backdrop-blur-md hover:bg-brand hover:text-ink" : "bg-gradient-to-r from-[#f2a93b] to-[#f5be2b] text-ink hover:brightness-95");

  return (
    <Link href={tripHref(trip)} aria-label={"View " + trip.title} className={"group block rounded-[20px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand " + cardClassName}>
      <article className="relative isolate h-full overflow-hidden rounded-[20px] bg-ink text-white shadow-sm">
        {trip.image && (
          <Image
            src={trip.image}
            alt={trip.title + " in Tanzania"}
            fill
            sizes={carousel ? "(max-width: 640px) calc(100vw - 3rem), (max-width: 1024px) calc((100% - 21px) / 2), 25vw" : compact ? "(max-width: 768px) 88vw, 341px" : "(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 362px"}
            className="object-cover transition duration-500 group-hover:scale-[1.025]"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,22,18,.48)_0%,rgba(18,22,18,.04)_42%,rgba(18,22,18,.75)_100%)]" />
        <div className={"relative flex h-full flex-col " + (featureCard ? "p-4 sm:p-[17px]" : "p-4 sm:p-5")}>
          <h3 className={headingClassName}>{trip.title}</h3>
          {trip.duration && (
            <p className={durationClassName}>
              {trip.duration} days
            </p>
          )}
          <div className="mt-auto flex items-end justify-between gap-3">
            {typeof trip.priceFrom === "number" && (
              <p className="leading-tight">
                <span className="block text-sm text-white/70">starts from</span>
                <span className={priceClassName}>{"$" + trip.priceFrom.toLocaleString("en-US")}</span>
                <span className="block font-semibold">per person</span>
              </p>
            )}
            <span aria-hidden="true" className={buttonClassName}>View Trip</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
