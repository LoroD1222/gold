import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PlanningCall } from "@/components/home/PlanningCall";
import { Testimonials } from "@/components/home/Testimonials";
import { AccommodationGallery } from "@/components/safari/AccommodationGallery";
import { PortableText } from "@/components/safari/PortableText";
import { TripCard } from "@/components/safari/TripCard";
import { TripDetailTabs } from "@/components/safari/TripDetailTabs";
import { TripHeroGallery } from "@/components/safari/TripHeroGallery";
import { asTripCard, getSafariTrip, type SanityImage } from "@/lib/safariTrips";
import { getSafariAnimal, isSafariAnimalId } from "@/data/safariAnimals";

type TripPageProps = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: TripPageProps): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getSafariTrip(slug).catch(() => null);

  if (!trip) return {};

  const title = trip.seo?.title ?? trip.title;
  const description = trip.seo?.description ?? trip.summary;
  const shareImage = trip.seo?.shareImage?.url ?? usableImages(trip.gallery)[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: `/tanzania-safaris/${trip.slug}` },
    openGraph: {
      title,
      description,
      url: `/tanzania-safaris/${trip.slug}`,
      images: shareImage ? [{ url: shareImage, alt: trip.seo?.shareImage?.alt ?? trip.title }] : undefined,
    },
  };
}

export default async function SafariTripPage({ params }: TripPageProps) {
  const { slug } = await params;
  const trip = await getSafariTrip(slug).catch(() => null);
  if (!trip) notFound();

  const gallery = usableImages(trip.gallery);
  const priceFrom = trip.startingPrice ?? trip.pricingTiers?.reduce<number | undefined>((lowest, tier) => {
    return lowest === undefined || tier.pricePerPerson < lowest ? tier.pricePerPerson : lowest;
  }, undefined);
  const facts = [
    trip.tourStart ? { label: "Tour start", value: trip.tourStart, icon: "calendar" as const } : null,
    trip.durationDays ? { label: "Duration", value: `${trip.durationDays} days`, icon: "clock" as const } : null,
    trip.difficulty ? { label: "Difficulty", value: trip.difficulty, icon: "difficulty" as const } : null,
  ].filter((fact): fact is { label: string; value: string; icon: "calendar" | "clock" | "difficulty" } => fact !== null);
  const hasOverview = Boolean(trip.overview?.length || trip.overviewHighlights?.length || trip.highlights?.length);
  const hasWildlife = Boolean(trip.wildlife?.length);
  const hasItinerary = Boolean(trip.itinerary?.length);
  const hasInclusions = Boolean(trip.inclusions?.length || trip.exclusions?.length);
  const tabs = [
    hasOverview ? { id: "overview", label: "Overview" } : null,
    hasWildlife ? { id: "wildlife", label: "Wildlife" } : null,
    hasItinerary ? { id: "itinerary", label: "Itinerary" } : null,
    hasInclusions ? { id: "inclusions", label: "Inclusions" } : null,
    { id: "reviews", label: "Reviews" },
  ].filter((tab): tab is { id: string; label: string } => tab !== null);
  const relatedTrips = trip.relatedTrips?.map(asTripCard) ?? [];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://goldentrips.com" },
      { "@type": "ListItem", position: 2, name: "Tanzania Safaris", item: "https://goldentrips.com/tanzania-safaris" },
      { "@type": "ListItem", position: 3, name: trip.title, item: `https://goldentrips.com/tanzania-safaris/${trip.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Header />
      <main>
        <section className="bg-sand pb-20 pt-16 sm:pb-24 sm:pt-20" aria-labelledby="trip-title">
          <div className="site-container max-w-[1194px]">
            {trip.guideLabel && <p className="eyebrow">{trip.guideLabel}</p>}
            <h1 id="trip-title" className="mt-5 max-w-[1100px] text-[38px] font-semibold leading-[1.12] tracking-[-0.045em] sm:mt-8 sm:text-[46px]">{trip.title}</h1>
            {trip.summary && <p className="mt-6 max-w-3xl text-[18px] leading-[1.65] text-muted sm:text-[20px]">{trip.summary}</p>}

            {(gallery.length > 0 || facts.length > 0 || typeof priceFrom === "number") && (
              <div className={`mt-9 grid gap-5 ${gallery.length > 0 ? "xl:grid-cols-[minmax(0,688px)_486px]" : "xl:grid-cols-[486px] xl:justify-end"}`}>
                {gallery.length > 0 && <TripHeroGallery images={gallery} promotionLabel={trip.promotionLabel} />}
                <aside aria-label="Trip facts and price" className="h-fit rounded-[15px] bg-[#faf8f4] p-7 shadow-none xl:p-[31px]">
                  {typeof trip.reviewRating === "number" && (
                    <p className="text-[18px] font-semibold text-black/[.7]">
                      <span className="mr-2 text-brand">★</span>{trip.reviewRating.toFixed(1)}{trip.reviewCount ? ` · ${trip.reviewCount} reviews` : ""}{trip.reviewSource ? ` on ${trip.reviewSource}` : ""}
                    </p>
                  )}
                  {facts.length > 0 && (
                    <dl className={`${trip.reviewRating !== undefined ? "mt-7" : ""} space-y-[21px] border-b border-ink/[.08] pb-[33px]`}>
                      {facts.map((fact) => <Fact key={fact.label} {...fact} />)}
                    </dl>
                  )}
                  {(typeof priceFrom === "number" || trip.pricingTiers?.length) && (
                    <div className={facts.length > 0 ? "mt-[33px]" : trip.reviewRating !== undefined ? "mt-7" : ""}>
                      {typeof priceFrom === "number" && <p className="flex flex-wrap items-center gap-x-[18px] gap-y-1 text-[20px]"><span>Price starts from</span><strong className="text-[32px] font-medium">${priceFrom.toLocaleString("en-US")}</strong><span>per person</span></p>}
                      {trip.pricingTiers?.length ? (
                        <dl className="mt-5 grid gap-2 border-t border-ink/[.08] pt-5 text-sm">
                          {trip.pricingTiers.map((tier) => <div key={tier._key} className="flex items-center justify-between gap-4"><dt>{tier.groupSize}</dt><dd className="font-semibold">${tier.pricePerPerson.toLocaleString("en-US")} pp</dd></div>)}
                        </dl>
                      ) : null}
                      <Link href="#planning" className="mt-7 flex min-h-[62px] items-center justify-center rounded-[15px] bg-gradient-to-r from-[#f2a93b] to-[#f5be2b] px-6 py-4 text-[20px] font-bold text-white transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">{trip.quoteButtonLabel ?? "Request quote"}</Link>
                      {trip.priceNote && <p className="mt-[19px] text-center text-[16px]">{trip.priceNote}</p>}
                    </div>
                  )}
                </aside>
              </div>
            )}
          </div>
        </section>

        <section className="bg-cream py-6 sm:py-8">
          <div className="site-container max-w-[1194px]"><TripDetailTabs tabs={tabs} /></div>
        </section>

        {hasOverview && (
          <section id="overview" className="scroll-mt-28 bg-cream py-16 sm:py-24" aria-labelledby="overview-title">
            <div className="site-container max-w-[1060px]">
              <h2 id="overview-title" className="sr-only">Overview</h2>
              {trip.overview?.length ? <PortableText value={trip.overview} className="mx-auto max-w-3xl space-y-5 text-[18px] leading-[1.7] text-muted sm:text-[20px]" /> : null}
              {trip.overviewHighlights?.length ? (
                <div className="mt-12 grid gap-5 md:grid-cols-2">
                  {trip.overviewHighlights.map((highlight) => <article key={highlight._key} className="rounded-xl border border-ink/10 bg-white p-6"><h2 className="text-2xl font-semibold tracking-[-0.035em]">{highlight.title}</h2><p className="mt-3 leading-7 text-muted">{highlight.description}</p></article>)}
                </div>
              ) : null}
              {trip.highlights?.length ? (
                <div id="highlights" className="mt-14 scroll-mt-28">
                  {trip.highlightsHeading && <h2 className="text-center text-[32px] font-semibold tracking-[-0.04em] sm:text-[42px]">{trip.highlightsHeading}</h2>}
                  <div className="mt-8 grid gap-5 md:grid-cols-3">
                    {trip.highlights.map((highlight) => <article key={highlight._key} className="rounded-xl border border-ink/10 bg-white p-6"><div className="flex items-start gap-4">{highlight.icon?.url && <Image src={highlight.icon.url} alt="" width={38} height={38} className="size-10 object-contain" />}<div><h3 className="text-xl font-semibold">{highlight.title}</h3><p className="mt-3 leading-7 text-muted">{highlight.description}</p></div></div></article>)}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        )}

        {hasWildlife && (
          <section id="wildlife" className="scroll-mt-28 bg-[linear-gradient(to_bottom,#fffbf3_0%,#fffbf3_54%,#f4ede1_54%,#f4ede1_100%)] pb-24" aria-labelledby="wildlife-title">
            <div className="site-container max-w-[1200px]">
              <div className="rounded-[10px] border border-ink/[.08] bg-[#fffefc] px-5 py-10 sm:px-8 lg:px-8 lg:pb-[45px] lg:pt-16">
                <h2 id="wildlife-title" className="pb-5 text-center text-[26px] font-semibold leading-tight tracking-[-0.03em]">{trip.wildlifeHeading ?? "Wildlife"}</h2>
                <div className="mt-8 grid grid-cols-2 items-end gap-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-[11px]">
                  {trip.wildlife?.map((item) => {
                    if (!isSafariAnimalId(item.animal)) return null;
                    const animal = getSafariAnimal(item.animal);
                    const availabilityClass = item.availability === "Abundant" ? "text-brand" : item.availability === "Common" ? "text-brand/60" : "text-brand/30";
                    return <article key={item._key} className="text-center"><div className="flex h-[150px] items-end justify-center sm:h-[170px] lg:h-[185px]"><Image src={animal.src} width={234} height={185} alt={`${animal.title} silhouette`} sizes="(max-width: 639px) 40vw, 234px" className={`h-auto w-auto object-contain object-bottom mix-blend-multiply ${animal.imageClass}`} /></div><h3 className="mt-[9px] text-[24px] font-semibold leading-none">{animal.title}</h3><p className={`mt-5 text-[20px] font-extrabold leading-none ${availabilityClass}`}><span className="mr-2">●</span>{item.availability}</p></article>;
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {hasItinerary && (
          <section id="itinerary" className="scroll-mt-28 bg-sand py-20 sm:py-24 lg:py-28" aria-labelledby="itinerary-title">
            <div className="site-container max-w-[1200px]">
              <h2 id="itinerary-title" className="text-[44px] font-semibold leading-[1.12] tracking-[-0.04em] sm:text-[56px] lg:text-[64px]">{trip.itineraryHeading ?? "Itinerary"}</h2>
              <div className={`mt-16 grid gap-12 ${trip.itineraryMap?.url ? "lg:items-start lg:grid-cols-[minmax(0,1fr)_337px] lg:gap-5" : ""}`}>
                <div className="space-y-[63px]">
                  {trip.itinerary?.map((day) => {
                    const images = usableImages(day.images);
                    const accommodationImages = usableImages(day.accommodation?.gallery);
                    return <article key={day._key} className={`grid gap-7 ${images.length > 0 ? "md:grid-cols-[minmax(0,300px)_1fr]" : ""}`}>
                      {images.length > 0 && <div className="grid gap-4"><div className="relative aspect-[1.08] overflow-hidden rounded-[4px]"><Image src={images[0].url} alt={images[0].alt ?? day.title} fill sizes="(max-width: 767px) 100vw, 300px" className="object-cover" /></div>{images[1] && <div className="relative aspect-[1.08] overflow-hidden rounded-[4px]"><Image src={images[1].url} alt={images[1].alt ?? day.title} fill sizes="(max-width: 767px) 100vw, 300px" className="object-cover" /></div>}</div>}
                      <div>
                        <p className="inline-flex rounded-[4px] bg-brand/[.12] px-[18px] py-2 text-[18px] font-bold uppercase text-brand">{day.dayRange}</p>
                        <h3 className="mt-6 text-[32px] font-semibold leading-[1.12] tracking-[-0.04em] sm:text-[40px]">{day.title}</h3>
                        {day.region && <p className="mt-3 text-[22px] font-semibold uppercase text-muted">({day.region})</p>}
                        <PortableText value={day.description} className="mt-7 space-y-4 text-[18px] leading-[1.55] text-black/[.7]" />
                        {day.meals && <p className="mt-6 text-[17px] font-semibold">Meals: <span className="font-normal text-muted">{day.meals}</span></p>}
                        {day.accommodation?.name && (accommodationImages.length > 0 ? <AccommodationGallery name={day.accommodation.name} images={accommodationImages} /> : <p className="mt-5 text-[17px] font-semibold">Accommodation: <span className="font-normal text-muted">{day.accommodation.name}</span></p>)}
                      </div>
                    </article>;
                  })}
                </div>
                {trip.itineraryMap?.url && <aside className="h-fit rounded-[10px] bg-white p-[17px] lg:sticky lg:top-8 lg:z-10"><div className="relative aspect-[1.18] overflow-hidden rounded-[10px]"><Image src={trip.itineraryMap.url} alt={trip.itineraryMap.alt ?? "Itinerary map"} fill sizes="(max-width: 1023px) 100vw, 302px" className="object-cover" /></div>{trip.itineraryMapLabel && <p className="mt-4 text-[18px] font-bold uppercase">◉ {trip.itineraryMapLabel}</p>}<Link href="#planning" className="mt-5 flex min-h-[51px] items-center justify-center rounded-[5px] bg-gradient-to-r from-[#f2a93b] to-[#f5be2b] px-5 text-[18px] font-bold">{trip.itineraryButtonLabel ?? "Plan your trip"}</Link></aside>}
              </div>
            </div>
          </section>
        )}

        {hasInclusions && (
          <section id="inclusions" className="scroll-mt-28 bg-cream py-20 sm:py-28" aria-labelledby="inclusions-title">
            <div className="site-container max-w-[1200px]">
              <h2 id="inclusions-title" className="text-[38px] font-semibold tracking-[-0.04em] sm:text-[46px]">What&apos;s included</h2>
              {trip.inclusions?.length ? <div className="mt-8 space-y-4">{trip.inclusions.map((item) => <details key={item._key} className="group rounded-[10px] bg-sand"><summary className="flex min-h-[72px] cursor-pointer list-none items-center justify-between gap-4 px-[18px] py-4 text-[19px] font-semibold"><span className="flex items-center gap-5">{item.icon?.url && <Image src={item.icon.url} width={30} height={30} alt="" className="size-7 object-contain" />}{item.title}</span><span aria-hidden className="text-2xl transition group-open:rotate-45">+</span></summary><PortableText value={item.description} className="px-[18px] pb-6 leading-7 text-muted" /></details>)}</div> : null}
              {trip.exclusions?.length ? <div className="mt-12"><h3 className="text-[28px] font-semibold tracking-[-0.035em]">Not included</h3><ul className="mt-5 grid gap-3 sm:grid-cols-2">{trip.exclusions.map((item) => <li key={item._key} className="rounded-lg border border-ink/10 bg-white px-5 py-4"><p className="font-semibold">{item.title}</p><PortableText value={item.description} className="mt-2 text-sm leading-6 text-muted" /></li>)}</ul></div> : null}
            </div>
          </section>
        )}

        <Testimonials compact sectionId="reviews" />
        <div className="bg-sand"><PlanningCall id="planning" /></div>

        {relatedTrips.length > 0 && <section className="bg-sand pb-28 pt-10" aria-labelledby="related-title"><div className="site-container"><h2 id="related-title" className="text-center text-4xl font-semibold tracking-[-0.04em]">Related trips</h2><div className="mx-auto mt-12 grid max-w-[1065px] gap-5 md:grid-cols-3">{relatedTrips.map((relatedTrip) => <TripCard key={relatedTrip.slug} trip={relatedTrip} compact />)}</div></div></section>}
      </main>
      <Footer />
    </>
  );
}

function usableImages(images?: SanityImage[]) {
  return images?.filter((image): image is SanityImage & { url: string } => typeof image.url === "string" && image.url.length > 0) ?? [];
}

function Fact({ label, value, icon }: { label: string; value: string; icon: "calendar" | "clock" | "difficulty" }) {
  return (
    <div className="grid grid-cols-[105px_1fr] items-center gap-4">
      <dt className="text-[20px] font-semibold">{label}:</dt>
      <dd className="flex min-h-[54px] items-center rounded-[15px] bg-sand px-[13px] py-3 text-[20px] font-semibold">
        {icon === "calendar" ? <span aria-hidden className="mr-3 text-brand">◫</span> : icon === "clock" ? <span aria-hidden className="mr-3 text-brand">◷</span> : <span aria-hidden className="mr-3 text-brand">▮▮▮</span>}
        {value}
      </dd>
    </div>
  );
}
