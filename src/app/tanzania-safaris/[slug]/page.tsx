import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PlanningCall } from "@/components/home/PlanningCall";
import { Testimonials } from "@/components/home/Testimonials";
import { AccommodationGallery } from "@/components/safari/AccommodationGallery";
import { MiniPlanningForm } from "@/components/safari/MiniPlanningForm";
import { PortableText } from "@/components/safari/PortableText";
import { TripCard } from "@/components/safari/TripCard";
import { TripHeroGallery } from "@/components/safari/TripHeroGallery";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getSafariAnimal, isSafariAnimalId } from "@/data/safariAnimals";
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
  const gallery = usableImages(trip.gallery);
  const priceFrom = trip.startingPrice ?? trip.pricingTiers?.reduce<number | undefined>((lowest, tier) => {
    return lowest === undefined || tier.pricePerPerson < lowest ? tier.pricePerPerson : lowest;
  }, undefined);
  const highlights = Array.from({ length: Math.max(3, trip.highlights?.length ?? 0) }, (_, index) => trip.highlights?.[index]);
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

              <aside aria-label="Trip facts and price" className="h-fit rounded-[15px] bg-[#faf8f4] p-7 shadow-none xl:h-[552px] xl:p-[31px]">
                <p className="min-h-[27px] text-[18px] font-semibold text-black/[.7]">
                  {typeof trip.reviewRating === "number" ? <><span className="mr-2 text-brand">★</span>{trip.reviewRating.toFixed(1)}{trip.reviewCount ? ` - ${trip.reviewCount} Review${trip.reviewCount === 1 ? "" : "s"}` : ""}{trip.reviewSource ? ` about ${trip.reviewSource}` : ""}</> : null}
                </p>
                <dl className="mt-7 space-y-[21px] border-b border-ink/[.08] pb-[33px]">
                  <Fact label="Tour Start" value={trip.tourStart} icon="calendar" />
                  <Fact label="Duration" value={trip.durationDays ? `${trip.durationDays} days` : undefined} icon="clock" />
                  <Fact label="Difficulty" value={trip.difficulty} icon="difficulty" />
                </dl>
                <div className="mt-[33px]">
                  <p className="flex items-center gap-[18px] text-[20px]"><span>Price starts from</span><strong className="text-[32px] font-medium">{typeof priceFrom === "number" ? `$${priceFrom.toLocaleString("en-US")}` : ""}</strong></p>
                  <a href="#planning" className="mt-7 flex min-h-[62px] items-center justify-center rounded-[15px] bg-gradient-to-r from-[#f2a93b] to-[#f5be2b] px-6 py-4 text-[20px] font-bold text-white transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">Request Quote</a>
                  <p className="mt-[19px] min-h-[24px] text-center text-[16px]">{trip.priceNote}</p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <div aria-hidden="true" className="h-[58px] bg-[#faf8f4]"><div className="site-container flex h-full max-w-[1194px] items-end"><div className="h-[6px] w-[127px] bg-brand" /></div></div>

        <section id="overview" className="scroll-mt-28 bg-cream py-20 sm:py-24" aria-labelledby="overview-title">
          <div className="site-container grid max-w-[1198px] gap-12 xl:grid-cols-[790px_385px] xl:gap-[23px]">
            <article className="max-w-none">
              <h2 id="overview-title" className="text-[20px] font-bold">Tour Overview:</h2>
              <PortableText value={trip.overview} className="mt-[34px] min-h-[96px] space-y-[34px] text-[18px] leading-[1.6] text-black/[.69]" />
              <div className="mt-[46px] grid gap-8 sm:grid-cols-2 sm:gap-[42px]">
                {Array.from({ length: 2 }, (_, index) => trip.overviewHighlights?.[index]).map((highlight, index) => (
                  <div key={highlight?._key ?? `overview-highlight-${index}`}>
                    <div className="flex min-h-10 items-center gap-[13px]">
                      <h3 className="text-[20px] font-bold">{highlight?.title}</h3>
                    </div>
                    <p className="mt-[14px] min-h-[54px] text-[18px] leading-[1.5] text-black/[.58]">{highlight?.description}</p>
                  </div>
                ))}
              </div>
            </article>
            <aside className="h-fit xl:sticky xl:top-8 xl:self-start"><MiniPlanningForm /></aside>
          </div>
        </section>

        <section id="highlights" className="scroll-mt-28 bg-cream pb-20 sm:pb-28" aria-labelledby="highlights-title">
          <div className="site-container max-w-[1194px]">
            <h2 id="highlights-title" className="text-[38px] font-semibold tracking-[-0.035em] sm:text-[46px]">{trip.highlightsHeading ?? trip.title}</h2>
            <div className="mt-[59px] grid gap-5 md:grid-cols-3">
              {highlights.map((highlight, index) => (
                <article key={highlight?._key ?? `highlight-${index}`} className="min-h-[257px] rounded-[10px] border border-ink/[.15] bg-white p-8">
                  <div className="grid h-[71px] w-[70px] place-items-center rounded-[5px] border border-brand/20 bg-brand/[.17]">
                    {highlight?.icon?.url && <Image src={highlight.icon.url} width={45} height={38} alt="" className="max-h-[38px] max-w-[45px] object-contain" />}
                  </div>
                  <h3 className="mt-[13px] min-h-[27px] text-[18px] font-medium">{highlight?.title}</h3>
                  <p className="mt-[13px] min-h-[56px] text-[17px] leading-[1.68] text-black/[.6]">{highlight?.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(to_bottom,#fffbf3_0%,#fffbf3_54%,#f4ede1_54%,#f4ede1_100%)] pb-24" aria-labelledby="wildlife-title">
          <div className="site-container max-w-[1200px]">
            <div className="rounded-[10px] border border-ink/[.08] bg-[#fffefc] px-5 py-10 sm:px-8 lg:min-h-[440px] lg:px-8 lg:pb-[45px] lg:pt-16">
              <h2 id="wildlife-title" className="pb-5 text-center text-[26px] font-semibold leading-tight tracking-[-0.03em]">{trip.wildlifeHeading ?? "Wildlife you may encounter"}</h2>
              <div className="mt-8 grid grid-cols-2 items-end gap-8 sm:grid-cols-3 lg:grid-cols-[234px_137px_174px_174px_174px_174px] lg:gap-[11px]">
                {wildlife.map((entry, index) => {
                  const animal = entry && isSafariAnimalId(entry.animal) ? getSafariAnimal(entry.animal) : null;
                  const availabilityClass = entry?.availability === "Abundant" ? "text-brand" : entry?.availability === "Common" ? "text-brand/60" : "text-brand/30";
                  return (
                    <article key={entry?._key ?? `wildlife-${index}`} className="text-center">
                      <div className="flex h-[150px] items-end justify-center sm:h-[170px] lg:h-[185px]">
                        {animal && <Image src={animal.src} width={234} height={185} alt={`${animal.title} silhouette`} sizes="(max-width: 639px) 40vw, 234px" className={`h-auto w-auto object-contain object-bottom mix-blend-multiply ${animal.imageClass}`} />}
                      </div>
                      <h3 className="mt-[9px] min-h-[24px] text-[24px] font-semibold capitalize leading-none">{animal?.title}</h3>
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
            <div className="mt-16 grid gap-12 lg:items-start lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-5 xl:grid-cols-[minmax(0,856px)_337px] xl:gap-[5px]">
              <div className="space-y-[63px]">
                {trip.itinerary?.map((day) => {
                  const images = usableImages(day.images);
                  const accommodationImages = usableImages(day.accommodation?.gallery);
                  return (
                    <article key={day._key} className="grid gap-8 md:grid-cols-[299px_minmax(0,1fr)] md:gap-[30px]">
                      <div className="grid grid-rows-[254px_243px] gap-[18px]">
                        {[0, 1].map((index) => <div key={index} className="relative overflow-hidden rounded-[5px]">{images[index] && <Image src={images[index].url} alt={images[index].alt ?? day.title} fill sizes="299px" className="object-cover" />}</div>)}
                      </div>

                      <div className="flex min-w-0 flex-col">
                        <div>
                          <p className="inline-flex h-[35px] items-center rounded-[4px] bg-brand/[.12] px-[18px] text-[18px] font-bold uppercase leading-none text-brand">{day.dayRange}</p>
                          <h3 className="mt-[21px] text-[32px] font-semibold leading-none tracking-[-0.035em] sm:text-[36px]">{day.title}</h3>
                          <p className="mt-[21px] min-h-[23px] text-[21px] font-bold leading-none text-black/[.6] sm:text-[23px]">{day.region ? `(${day.region})` : ""}</p>
                          <PortableText value={day.description} className="mt-[21px] max-w-[487px] min-h-[48px] space-y-4 text-[16px] leading-[1.51] text-black/[.73]" />
                          {day.meals && <p className="mt-5 text-[16px] font-semibold text-black/[.73]">Meals: <span className="font-normal">{day.meals}</span></p>}
                        </div>

                        <div className="mt-[49px]">
                          <h4 className="text-[21px] font-semibold leading-[35px]">Accommodation</h4>
                          {day.accommodation?.name ? (accommodationImages.length ? <AccommodationGallery name={day.accommodation.name} images={accommodationImages} /> : <p className="mt-4 min-h-[35px] text-[17px] font-medium leading-[35px] underline underline-offset-2">{day.accommodation.name}</p>) : <div className="mt-4 min-h-[35px]" />}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <aside className="order-first h-fit rounded-[9px] bg-white p-[18px] lg:order-none lg:sticky lg:top-8 lg:z-10">
                <div className="relative h-[291px] overflow-hidden rounded-[10px]">
                  {trip.itineraryMap?.url && <Image src={trip.itineraryMap.url} alt={trip.itineraryMap.alt ?? "Itinerary map"} fill sizes="302px" className="object-cover" />}
                  <p className="absolute bottom-[14px] left-3 flex min-h-5 items-center gap-2 text-[16px] font-semibold leading-[1.28] text-black">
                    {trip.durationDays ? <><Image src="/assets/trip-itinerary-img-vector.svg" width={13} height={13} alt="" />{trip.itineraryMapLabel ?? `${trip.durationDays} DAYS`}</> : null}
                  </p>
                </div>
                <ButtonLink href="#planning" className="mt-[21px] min-h-[51px] w-full rounded-[5px] px-4 py-2 text-[17px]">Plan your family trip</ButtonLink>
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
                  <summary className="flex min-h-[77px] cursor-pointer list-none items-center justify-between gap-4 px-[18px] py-4 text-[20px] font-semibold focus-visible:outline-2 focus-visible:outline-brand"><span className="flex items-center gap-6">{item.icon?.url ? <Image src={item.icon.url} width={30} height={30} alt="" className="size-[30px] object-contain" /> : <Image src="/assets/trip-inclusions-img-car-svgrepo-com21.svg" width={20} height={20} alt="" className="size-5" />}{item.title}</span><Image src="/assets/trip-inclusions-img-arrow-drop-down-svgrepo-com1.svg" width={43} height={43} alt="" className="size-[43px] shrink-0 transition group-open:rotate-180" /></summary>
                  <PortableText value={item.description} className="min-h-[1px] px-[18px] pb-6 text-[18px] leading-[1.68] text-black/[.6]" />
                </details>
              ))}
            </div>
            {trip.exclusions?.length ? <div className="mt-12"><h3 className="text-[28px] font-semibold tracking-[-0.035em]">Exclusions</h3><div className="mt-7 space-y-[29px]">{trip.exclusions.map((item) => <details key={item._key} className="group rounded-[10px] bg-sand"><summary className="flex min-h-[77px] cursor-pointer list-none items-center justify-between gap-4 px-[18px] py-4 text-[20px] font-semibold focus-visible:outline-2 focus-visible:outline-brand"><span>{item.title}</span><Image src="/assets/trip-inclusions-img-arrow-drop-down-svgrepo-com1.svg" width={43} height={43} alt="" className="size-[43px] shrink-0 transition group-open:rotate-180" /></summary><PortableText value={item.description} className="min-h-[1px] px-[18px] pb-6 text-[18px] leading-[1.68] text-black/[.6]" /></details>)}</div></div> : null}
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

function Fact({ label, value, icon }: { label: string; value?: string; icon: "calendar" | "clock" | "difficulty" }) {
  return (
    <div className="grid grid-cols-[105px_1fr] items-center gap-4">
      <dt className="text-[20px] font-semibold">{label}:</dt>
      <dd className="flex min-h-[54px] items-center rounded-[15px] bg-sand px-[13px] py-3 text-[20px] font-semibold">
        {icon === "calendar" ? <Image src="/assets/trip-hero-img-layer8.svg" width={21} height={19} alt="" aria-hidden className="mr-3 h-[19px] w-[21px]" /> : icon === "clock" ? <Image src="/assets/trip-hero-img-vector.svg" width={26} height={26} alt="" aria-hidden className="mr-3 size-6" /> : <span aria-hidden className="mr-3 flex h-6 w-[26px] items-end gap-[3px]"><span className="h-1.5 w-1 rounded-t-sm bg-brand" /><span className="h-4 w-[7px] rounded-t-sm bg-brand/[.28]" /><span className="h-6 w-1 rounded-t-sm bg-brand/[.28]" /></span>}
        {value}
      </dd>
    </div>
  );
}
