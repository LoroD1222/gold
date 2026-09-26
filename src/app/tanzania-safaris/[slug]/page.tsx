import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PlanningCall } from "@/components/home/PlanningCall";
import { Testimonials } from "@/components/home/Testimonials";
import { AccommodationGallery } from "@/components/safari/AccommodationGallery";
import { PortableText } from "@/components/safari/PortableText";
import { TripCard } from "@/components/safari/TripCard";
import { TripDetailTabs } from "@/components/safari/TripDetailTabs";
import { TourFeatures } from "@/components/safari/TourFeatures";
import { TripHeroGallery } from "@/components/safari/TripHeroGallery";
import { TripQuoteDialog } from "@/components/safari/TripQuoteDialog";
import { getSafariAnimal, isSafariAnimalId } from "@/data/safariAnimals";
import { tripadvisorProfileUrl } from "@/data/externalLinks";
import { getSafariTrip, getSafariTripCards, type SanityImage } from "@/lib/safariTrips";

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

  const relatedTrips = await getSafariTripCards().catch(() => []);
  const gallery = uniqueImages([
    ...usableImages(trip.gallery),
    ...(trip.itinerary?.flatMap((day) => usableImages(day.images)) ?? []),
  ]);
  const priceFrom = trip.pricingTiers?.reduce<number | undefined>((lowest, tier) => {
    return lowest === undefined || tier.pricePerPerson < lowest ? tier.pricePerPerson : lowest;
  }, undefined) ?? trip.startingPrice;
  const overviewHighlights = trip.overviewHighlights?.filter((highlight) => highlight?.title || highlight?.description) ?? [];
  const wildlife = Array.from({ length: Math.max(6, trip.wildlife?.length ?? 0) }, (_, index) => trip.wildlife?.[index]);
  const related = relatedTrips.filter((relatedTrip) => relatedTrip.slug !== trip.slug).slice(0, 3);
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
            <p className="eyebrow">Golden Trips · Tanzania Safari Guide</p>
            <h1 id="trip-title" className="mt-8 max-w-[1100px] text-[38px] font-semibold leading-[1.12] tracking-[-0.045em] sm:text-[46px]">{trip.title}</h1>

            <div className="mt-9 grid gap-5 xl:grid-cols-[minmax(0,688px)_486px]">
              <TripHeroGallery images={gallery} promotionLabel={trip.promotionLabel} />

              <aside id="price" aria-label="Trip facts and price" className="scroll-mt-28 h-fit rounded-[15px] bg-[#faf8f4] p-7 shadow-none xl:h-[552px] xl:p-[31px]">
                <a href={tripadvisorProfileUrl} target="_blank" rel="noreferrer" aria-label="5.0 rating from 190 reviews on TripAdvisor" className="inline-flex min-h-[27px] items-center gap-2 text-[18px] font-semibold text-black/[.7] underline decoration-1 underline-offset-4">
                  <Image src="/assets/tripadvisor-mark.png" width={27} height={32} alt="" className="h-[27px] w-auto" />
                  <span aria-hidden="true" className="text-[22px] leading-none text-brand">★</span>
                  <span>5.0</span>
                  <span aria-hidden="true">·</span>
                  190 Reviews
                </a>
                <dl className="mt-7 space-y-[21px] border-b border-ink/[.08] pb-[33px]">
                  <Fact label="Best time" value={trip.tourStart} icon="calendar" />
                  <Fact label="Duration" value={trip.durationDays ? `${trip.durationDays} days` : undefined} icon="clock" />
                  <Fact label="Difficulty" value={trip.difficulty} icon="difficulty" />
                </dl>
                <div className="mt-[33px]">
                  <p className="flex items-center gap-[18px] text-[20px]"><span>Price starts from</span><strong className="text-[32px] font-medium">{typeof priceFrom === "number" ? `$${priceFrom.toLocaleString("en-US")}` : ""}</strong></p>
                  <TripQuoteDialog className="mt-7 flex min-h-[62px] w-full items-center justify-center rounded-[15px] bg-gradient-to-r from-[#f2a93b] to-[#f5be2b] px-6 py-4 text-[24px] font-bold text-black transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">Request Quote</TripQuoteDialog>
                  <p className="mt-[19px] min-h-[24px] text-center text-[16px]">{trip.priceNote}</p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <TripDetailTabs tabs={[
          {id: "overview", label: "Overview"},
          {id: "itinerary", label: "Itinerary"},
          {id: "inclusions", label: "Inclusions"},
        ]} />

        <section id="overview" className="scroll-mt-28 bg-cream py-20 sm:py-24" aria-label="Overview">
          <div className="site-container max-w-[1198px]">
            <article className="max-w-none">
              <PortableText value={trip.overview} className="min-h-[96px] space-y-[34px] text-[18px] leading-[1.6] text-black/[.69]" />
              {overviewHighlights.length > 0 && (
                <div className="mt-[46px] grid gap-8 sm:grid-cols-2 sm:gap-[42px]">
                  {overviewHighlights.map((highlight) => (
                    <div key={highlight._key}>
                      <div className="flex min-h-10 items-center gap-[13px]">
                        <h3 className="text-[20px] font-bold">{highlight.title}</h3>
                      </div>
                      <p className="mt-[14px] min-h-[54px] text-[18px] leading-[1.5] text-black/[.58]">{highlight.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </div>
        </section>

        <TourFeatures trip={trip} />

        <section className="bg-[linear-gradient(to_bottom,#fffbf3_0%,#fffbf3_54%,#f4ede1_54%,#f4ede1_100%)] pb-12 sm:pb-24" aria-labelledby="wildlife-title">
          <div className="site-container max-w-[1200px]">
            <div className="rounded-[10px] border border-ink/[.08] bg-[#fffefc] px-5 py-10 sm:px-8 lg:min-h-[440px] lg:px-8 lg:pb-[45px] lg:pt-16">
              <h2 id="wildlife-title" className="pb-5 text-center text-[26px] font-semibold leading-tight tracking-[-0.03em]">{trip.wildlifeHeading ?? "Wildlife you may encounter"}</h2>
              <div className="mt-8 grid grid-cols-2 items-end gap-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-[11px]">
                {wildlife.map((entry, index) => {
                  const animal = entry && isSafariAnimalId(entry.animal) ? getSafariAnimal(entry.animal) : null;
                    const imageScaleClass = animal?.id === "crocodile" ? "" : animal?.id === "giraffe" ? "lg:scale-110" : ["antelope", "ostrich", "rhinoceros"].includes(animal?.id ?? "") ? "scale-125 lg:scale-110" : "scale-125 lg:scale-125";
                  const availabilityClass = entry?.availability === "Abundant" ? "text-brand" : entry?.availability === "Common" ? "text-brand/60" : "text-brand/30";
                  return (
                    <article key={entry?._key ?? `wildlife-${index}`} className="text-center">
                      <div className="flex h-[150px] items-end justify-center sm:h-[170px] lg:h-[210px]">
                        {animal && <Image src={animal.src} width={234} height={185} alt={`${animal.title} silhouette`} sizes="(max-width: 639px) 40vw, (max-width: 1023px) 30vw, 218px" className={`h-auto w-auto object-contain object-bottom mix-blend-multiply ${animal.imageClass} ${imageScaleClass}`} />}
                      </div>
                      <h3 className="mt-5 min-h-[24px] text-[24px] font-semibold capitalize leading-none">{animal?.title}</h3>
                      <p className={`mt-5 min-h-5 text-[20px] font-extrabold leading-none ${availabilityClass}`}>{entry ? <><span className="mr-2">●</span>{entry.availability}</> : null}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="itinerary" className="scroll-mt-28 bg-sand py-20 sm:py-24 lg:py-28" aria-labelledby="itinerary-title">
          <div className="site-container max-w-[1200px]">
            <h2 id="itinerary-title" className="text-[44px] font-semibold leading-[1.12] tracking-[-0.04em] sm:text-[56px] lg:text-[64px]">{trip.itineraryHeading ?? "Family itinerary day by day"}</h2>
            <div className="mt-16 grid gap-12 lg:items-start lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12 xl:grid-cols-[minmax(0,856px)_337px] xl:gap-12">
              <div className="flex flex-col gap-[63px]">
                {trip.itinerary?.map((day) => {
                  const images = usableImages(day.images);
                  const accommodationImages = usableImages(day.accommodation?.gallery);
                  const accommodationGallery = accommodationImages.length ? accommodationImages : images;
                  return (
                    <article key={day._key} className="grid gap-8 md:grid-cols-[299px_minmax(0,1fr)] md:gap-[30px]">
                      <div className="grid grid-rows-[254px_243px] gap-[18px]">
                        {[0, 1].map((index) => <div key={index} className="relative overflow-hidden rounded-[5px]">{images[index] && <Image src={images[index].url} alt={images[index].alt ?? day.title} fill sizes="299px" className="object-cover" />}</div>)}
                      </div>

                      <div className="flex min-w-0 flex-col">
                        <div>
                          <p className="inline-flex h-[35px] items-center rounded-[4px] bg-brand/[.12] px-[18px] text-[18px] font-bold uppercase leading-none text-brand">{day.dayRange}</p>
                          <h3 className="mt-[21px] text-[32px] font-semibold leading-[1.3] tracking-[-0.035em] sm:text-[36px]">{day.title}</h3>
                          {day.region ? <p className="mt-[21px] text-[21px] font-bold leading-none text-black/[.6] sm:text-[23px]">({day.region})</p> : null}
                          <PortableText value={day.description} className="mt-[25px] max-w-[487px] min-h-[48px] space-y-4 text-[16px] leading-[1.51] text-black/[.73]" />
                          {day.meals && <p className="mt-5 text-[16px] font-semibold text-black/[.73]">Meals: <span className="font-normal">{day.meals}</span></p>}
                        </div>

                        {day.accommodation?.name ? (
                          <div className="mt-[49px]">
                            <h4 className="text-[21px] font-semibold leading-[35px]">Accommodation</h4>
                            <AccommodationGallery name={day.accommodation.name} images={accommodationGallery} />
                          </div>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>

              <aside aria-label="Trip planning" className="order-last h-fit rounded-[9px] bg-white p-[9px_18px_16px] lg:order-none lg:sticky lg:top-8 lg:z-10 lg:self-start">
                <div className="flex flex-col gap-[14px]">
                  <Image src="/assets/trip-itinerary-sidebar-logo.png" width={236} height={90} alt="Golden Trips Tanzania" sizes="194px" className="mx-auto h-auto w-[194px]" />
                  <div className="relative aspect-[302/262] w-full overflow-hidden rounded-[10px]">
                    <Image src="/assets/trip-itinerary-sidebar-map.png" width={362} height={272} alt="Illustrated map of Tanzania" sizes="(min-width: 1280px) 302px, 100vw" className="absolute -left-[16.08%] top-0 h-[102.89%] w-[119.01%] max-w-none object-cover" />
                  </div>
                  <TripQuoteDialog className="flex min-h-[51px] w-full items-center justify-center rounded-[5px] bg-gradient-to-r from-[#f2a93b] to-[#f5be2b] px-4 py-2 text-[17px] font-semibold text-black transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand">Plan your family trip</TripQuoteDialog>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="inclusions" className="scroll-mt-28 bg-cream py-20 sm:py-28" aria-labelledby="inclusions-title">
          <div className="site-container max-w-[1167px]">
            <h2 id="inclusions-title" className="text-[38px] font-semibold tracking-[-0.04em] sm:text-[46px]">Inclusions</h2>
            <div className="mt-12 space-y-[29px]">
              {trip.inclusions?.map((item, index) => (
                <details key={item._key} open={index === 0} className="group rounded-[10px] bg-sand">
                  <summary className="flex min-h-[77px] cursor-pointer list-none items-center px-[18px] py-4 text-[20px] font-semibold focus-visible:outline-2 focus-visible:outline-brand"><span className="flex items-center gap-6"><span aria-hidden className="text-[30px] font-medium leading-none text-brand">✓</span>{item.title}</span></summary>
                  <PortableText value={item.description} className="min-h-[1px] px-[18px] pb-6 text-[18px] leading-[1.68] text-black/[.6]" />
                </details>
              ))}
            </div>
            {trip.exclusions?.length ? <div className="mt-12"><h3 className="text-[28px] font-semibold tracking-[-0.035em]">Exclusions</h3><div className="mt-7 space-y-[29px]">{trip.exclusions.map((item) => <details key={item._key} className="group rounded-[10px] bg-sand"><summary className="flex min-h-[77px] cursor-pointer list-none items-center px-[18px] py-4 text-[20px] font-semibold focus-visible:outline-2 focus-visible:outline-brand"><span className="flex items-center gap-6"><span aria-hidden className="text-[30px] font-medium leading-none text-brand">×</span>{item.title}</span></summary><PortableText value={item.description} className="min-h-[1px] px-[18px] pb-6 text-[18px] leading-[1.68] text-black/[.6]" /></details>)}</div></div> : null}
          </div>
        </section>

        <Testimonials compact sectionId="reviews" />
        <div className="bg-sand"><PlanningCall id="planning" /></div>

        <section className="bg-sand pb-28 pt-10" aria-labelledby="related-title">
          <div className="site-container">
            <h2 id="related-title" className="text-center text-4xl font-semibold tracking-[-0.04em]">Related trips</h2>
            <div className="mx-auto mt-12 grid max-w-[1065px] gap-5 md:grid-cols-3">{related.map((relatedTrip) => <TripCard key={relatedTrip.slug} trip={relatedTrip} compact />)}</div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function usableImages(images?: SanityImage[]) {
  return images?.filter((image): image is SanityImage & { url: string } => typeof image.url === "string" && image.url.length > 0) ?? [];
}

function uniqueImages(images: Array<SanityImage & { url: string }>) {
  return images.filter((image, index) => images.findIndex((candidate) => candidate.url === image.url) === index);
}

function Fact({ label, value, icon }: { label: string; value?: string; icon: "calendar" | "clock" | "difficulty" }) {
  return (
    <div className="grid grid-cols-[105px_1fr] items-center gap-4">
      <dt className="text-[20px] font-semibold">{label}:</dt>
      <dd className="flex min-h-[54px] items-center rounded-[15px] bg-sand px-[13px] py-3 text-[20px] font-semibold">
        {icon === "calendar" ? <Image src="/assets/trip-hero-img-layer8.svg" width={21} height={19} alt="" aria-hidden className="mr-3 h-[19px] w-[21px]" /> : icon === "clock" ? <Image src="/assets/trip-hero-img-vector.svg" width={26} height={26} alt="" aria-hidden className="mr-3 size-6" /> : <span aria-hidden className="relative mr-[9px] h-6 w-[25px] shrink-0"><span className="absolute bottom-0 left-0 h-[9px] w-[6px] rounded-[1px] bg-brand" /><span className="absolute bottom-0 left-[9px] h-4 w-[7px] rounded-[1px] bg-brand/[.28]" /><span className="absolute bottom-0 left-[19px] h-6 w-[6px] rounded-[1px] bg-brand/[.28]" /></span>}
        {value}
      </dd>
    </div>
  );
}
