import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PlanningCall } from "@/components/home/PlanningCall";
import { Testimonials } from "@/components/home/Testimonials";
import { TripCard } from "@/components/safari/TripCard";
import { TripHeroGallery } from "@/components/safari/TripHeroGallery";
import { MiniPlanningForm } from "@/components/safari/MiniPlanningForm";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { trips } from "@/data/trips";

export const metadata: Metadata = {
  title: "Great Migration & River Crossing in Serengeti",
  description: "A private 8-day Northern Serengeti safari designed around the Great Migration and Mara River crossing season.",
  alternates: { canonical: "/tanzania-safaris/great-migration-river-crossing-serengeti" },
  openGraph: {
    title: "Great Migration & River Crossing in Serengeti",
    description: "Explore a private Tanzania safari focused on the Great Migration river crossings in Northern Serengeti.",
    url: "/tanzania-safaris/great-migration-river-crossing-serengeti",
    images: [{ url: "/assets/trip-hero-img-frame1321315437.png", width: 4096, height: 3072, alt: "Wildebeest gathering during the Great Migration in Serengeti" }],
  },
};

const itinerary = [1, 2, 3];

const inclusionItems = [
  ["/assets/trip-inclusions-img-vector.svg", "Accommodations", "Tented-camp accommodation selected for comfort and access to the safari route.", "size-[26px]"],
  ["/assets/trip-inclusions-img-group.svg", "Meals", "Meals listed in your personal proposal, with dietary needs discussed before travel.", "h-[25px] w-[25px]"],
  ["/assets/trip-inclusions-img-car-svgrepo-com21.svg", "National park fees for the entire tour", "All national park fees for the listed itinerary.", "size-5"],
  ["/assets/trip-inclusions-img-car-svgrepo-com21.svg", "Dedicated support team", "Local planning and on-trip support throughout your journey.", "size-5"],
  ["/assets/trip-inclusions-img-group1.svg", "Ambulance & Medical", "Emergency support planning and clear assistance procedures.", "h-[23px] w-[30px]"],
] as const;

const wildlife = [
  { name: "Elephant", availability: "Abundant", src: "/assets/trip-animal-elephant.jpg", imageClass: "h-[165px] max-w-[234px]", availabilityClass: "text-brand" },
  { name: "Giraffe", availability: "Common", src: "/assets/trip-animal-giraffe.jpg", imageClass: "h-[185px] max-w-[137px]", availabilityClass: "text-brand/60" },
  { name: "Lion", availability: "Rare", src: "/assets/trip-animal-lion.jpg", imageClass: "h-[136px] max-w-[174px]", availabilityClass: "text-brand/30" },
  { name: "Cheetah", availability: "Rare", src: "/assets/trip-animal-cheetah.jpg", imageClass: "h-[136px] max-w-[174px]", availabilityClass: "text-brand/30" },
  { name: "Leopard", availability: "Rare", src: "/assets/trip-animal-leopard.jpg", imageClass: "h-[136px] max-w-[174px]", availabilityClass: "text-brand/30" },
  { name: "Wildebeest", availability: "Abundant", src: "/assets/trip-animal-wildebeest.jpg", imageClass: "h-[136px] max-w-[174px]", availabilityClass: "text-brand" },
] as const;

export default function SafariDetailPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://goldentrips.com" },
      { "@type": "ListItem", position: 2, name: "Tanzania Safaris", item: "https://goldentrips.com/tanzania-safaris" },
      { "@type": "ListItem", position: 3, name: "Great Migration & River Crossing in Serengeti", item: "https://goldentrips.com/tanzania-safaris/great-migration-river-crossing-serengeti" },
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
            <h1 id="trip-title" className="mt-8 max-w-[1100px] text-[38px] font-semibold leading-[1.12] tracking-[-0.045em] sm:text-[46px]">Greate Migration & River Crossing in Serengeti</h1>

            <div className="mt-9 grid gap-5 xl:grid-cols-[minmax(0,688px)_486px]">
              <TripHeroGallery />

              <aside aria-label="Trip facts and price" className="h-fit rounded-[15px] bg-[#faf8f4] p-7 shadow-none xl:h-[552px] xl:p-[31px]">
                <p className="text-[18px] font-semibold text-black/[.7]"><span className="mr-2 text-brand">★</span>4.8 - 231 Review about Golden Trips</p>
                <dl className="mt-7 space-y-[21px] border-b border-ink/[.08] pb-[33px]">
                  <Fact label="Tour Start" value="On Any Date" icon="calendar" />
                  <Fact label="Duration" value="8 days" icon="clock" />
                  <Fact label="Difficulty" value="Easy level" icon="difficulty" />
                </dl>
                <div className="mt-[33px]">
                  <p className="flex items-center gap-[18px] text-[20px]"><span>Price starts from</span><strong className="text-[32px] font-medium">$1,860</strong></p>
                  <a href="#planning" className="mt-7 flex min-h-[62px] items-center justify-center rounded-[15px] bg-gradient-to-r from-[#f2a93b] to-[#f4bd2b] px-6 py-4 text-[24px] font-bold text-white transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">REQUEST QUOTE</a>
                  <p className="mt-[19px] text-center text-[16px]">view prices that apply to you</p>
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
              <div className="mt-[34px] space-y-[34px] text-[18px] leading-[1.6] text-black/[.69]">
                <p>This 3-day fly-in safari in Northern Serengeti is tailor-made for those chasing the Great Migration river crossings. Taking place between July and early September, these dramatic scenes unfold as thousands of wildebeest and zebras plunge into the Mara River, facing strong currents and lurking crocodiles.</p>
                <p>Crossings don&apos;t follow a schedule – which is part of the thrill! You&apos;ll overnight at a camp just a short drive from key crossing points, so you&apos;ll find yourself in a front-row seat to the wildest events and ready to move quickly when it begins. And even beyond the migration, this area is packed with classic safari magic: open savannahs, dramatic views, and rich resident wildlife, including big cats.</p>
                <p>Please note: This safari starts in a remote Kogatende region of Northern Serengeti, which is best reachable by a bush plane. You can fly to Serengeti from all key airports in Tanzania - Arusha, Kilimanjaro, Dar-es-Salaam or Zanzibar. The tour does not include domestic flights, but we can book those for you as well - just let us know your pre- and post-safari plans.</p>
              </div>
              <div className="mt-[46px] grid gap-8 sm:grid-cols-2 sm:gap-[42px]">
                <div><div className="flex items-center gap-[13px]"><Image src="/assets/trip-overview-img-group.svg" width={40} height={34} alt="" className="h-[34px] w-10" /><h3 className="text-[20px] font-bold">Great Migration</h3></div><p className="mt-[22px] text-[18px] leading-[1.5] text-black/[.58]">Epic river crossing await - wildbeest heard at Mara river as far as the eye can see!</p></div>
                <div><div className="flex items-center gap-[13px]"><Image src="/assets/trip-overview-img-car-roof-box-svgrepo-com2.svg" width={40} height={40} alt="" className="size-10" /><h3 className="text-[20px] font-bold">Open Vehicle</h3></div><p className="mt-[14px] text-[18px] leading-[1.5] text-black/[.58]">Explore the plains from open-sided 4x4s for unobstructed views</p></div>
              </div>
            </article>
            <aside><MiniPlanningForm /></aside>
          </div>
        </section>

        <section id="highlights" className="scroll-mt-28 bg-cream pb-20 sm:pb-28" aria-labelledby="highlights-title">
          <div className="site-container max-w-[1194px]">
            <h2 id="highlights-title" className="text-[38px] font-semibold tracking-[-0.035em] sm:text-[46px]">Greate Migration & River Crossing in Serengeti</h2>
            <div className="mt-[59px] grid gap-5 md:grid-cols-3">
              {[
                ["/assets/trip-highlights-img-layer8.svg", "Best TIme To Visit", "h-[38px] w-[40px]"],
                ["/assets/trip-highlights-img-layer9.svg", "High Season", "h-[38px] w-[43px]"],
                ["/assets/trip-highlights-img-layer10.svg", "Malaria precautions", "h-[38px] w-[45px]"],
              ].map(([icon, title, iconClass]) => (
                <article key={title} className="min-h-[257px] rounded-[10px] border border-ink/[.15] bg-white p-8">
                  <div className="grid h-[71px] w-[70px] place-items-center rounded-[5px] border border-brand/20 bg-brand/[.17]"><Image src={icon} width={45} height={38} alt="" className={iconClass} /></div>
                  <h3 className="mt-[13px] text-[18px] font-medium">{title}</h3>
                  <p className="mt-[13px] text-[17px] leading-[1.68] text-black/[.6]">Treated nets, repellent, and routes planned around lower risk times and altitudes.</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(to_bottom,#fffbf3_0%,#fffbf3_54%,#f4ede1_54%,#f4ede1_100%)] pb-24" aria-labelledby="wildlife-title">
          <div className="site-container max-w-[1200px]">
            <div className="rounded-[10px] border border-ink/[.08] bg-[#fffefc] px-5 py-10 sm:px-8 lg:min-h-[440px] lg:px-8 lg:pb-[45px] lg:pt-16">
              <h2 id="wildlife-title" className="text-center text-[26px] font-semibold leading-tight tracking-[-0.03em]">Wildlife you may encounter</h2>
              <div className="mt-8 grid grid-cols-2 items-end gap-8 sm:grid-cols-3 lg:grid-cols-[234px_137px_174px_174px_174px_174px] lg:gap-[11px]">
                {wildlife.map(({ name, availability, src, imageClass, availabilityClass }) => (
                  <article key={name} className="text-center">
                    <div className="flex h-[150px] items-end justify-center sm:h-[170px] lg:h-[185px]">
                      <Image src={src} width={234} height={185} alt={`${name} silhouette`} sizes="(max-width: 639px) 40vw, 234px" className={`h-auto w-auto object-contain object-bottom mix-blend-multiply ${imageClass}`} />
                    </div>
                    <h3 className="mt-[9px] text-[24px] font-semibold capitalize leading-none">{name}</h3>
                    <p className={`mt-5 text-[20px] font-extrabold leading-none ${availabilityClass}`}><span className="mr-2">●</span>{availability}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="itinerary" className="scroll-mt-28 bg-sand py-20 sm:py-24 lg:py-28" aria-labelledby="itinerary-title">
          <div className="site-container max-w-[1200px]">
            <h2 id="itinerary-title" className="text-[44px] font-semibold leading-[1.12] tracking-[-0.04em] sm:text-[56px] lg:text-[64px]">
              Family itinerary day by day
            </h2>
            <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-5 xl:grid-cols-[minmax(0,856px)_337px] xl:gap-[5px]">
              <div className="space-y-[63px]">
                {itinerary.map((day) => (
                  <article key={day} className="grid gap-8 md:grid-cols-[299px_minmax(0,1fr)] md:gap-[30px]">
                    <div className="grid grid-rows-[254px_243px] gap-[18px]">
                      <div className="relative overflow-hidden rounded-[5px]">
                        <Image src="/assets/trip-itinerary-img-frame1321315453.png" alt="Lioness in Serengeti National Park" fill sizes="299px" className="object-cover" />
                      </div>
                      <div className="relative overflow-hidden rounded-[5px]">
                        <Image src="/assets/trip-itinerary-img-frame1321315454.png" alt="Sunrise over a Tanzania landscape" fill sizes="297px" className="object-cover" />
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-col">
                      <div>
                        <p className="inline-flex h-[35px] items-center rounded-[4px] bg-brand/[.12] px-[18px] text-[18px] font-bold uppercase leading-none text-brand">
                          Day 1 - 2
                        </p>
                        <h3 className="mt-[21px] text-[32px] font-semibold leading-none tracking-[-0.035em] sm:text-[36px]">Serengeti National Park</h3>
                        <p className="mt-[21px] text-[21px] font-bold leading-none text-black/[.6] sm:text-[23px]">(CENTRAL WEST/EAST)</p>
                        <p className="mt-[21px] max-w-[487px] text-[16px] leading-[1.51] text-black/[.73]">
                          Serengeti National Park is widely known as the place to go on safari, mainly because of the Great Migration that passes through here. The enormous, stampeding herds are impressive, as are the vast number of predators that live here: over four thousand lions, over 200 cheetahs, a thousand leopards, 3500 hyenas, and hundreds of wild dogs! And of course, plenty of other beautiful animals, which your guide will be delighted to search for together with you. Are you ready for this? Watch the video of the park here.
                        </p>
                      </div>

                      <div className="mt-[49px]">
                        <h4 className="text-[21px] font-semibold leading-[35px]">Accomodation</h4>
                        <p className="mt-4 flex items-center gap-5 text-[17px] font-medium leading-[35px] underline underline-offset-2">
                          <Image src="/assets/trip-itinerary-img-group.svg" width={35} height={35} alt="" className="h-[35px] w-[35px]" />
                          Serengeti Sound of Silence Tented Camp
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="h-fit rounded-[9px] bg-white p-[18px] lg:sticky lg:top-8 lg:self-start">
                <div className="relative h-[291px] overflow-hidden rounded-[10px]">
                  <Image src="/assets/trip-itinerary-img-image67.png" alt="Map of the Northern Serengeti safari itinerary" fill sizes="302px" className="object-cover" />
                  <p className="absolute bottom-[14px] left-3 flex items-center gap-2 text-[16px] font-semibold leading-[1.28] text-black">
                    <Image src="/assets/trip-itinerary-img-vector.svg" width={13} height={13} alt="" />
                    8 DAYS
                  </p>
                </div>
                <ButtonLink href="#planning" className="mt-[21px] min-h-[51px] w-full rounded-[5px] px-4 py-2 text-[17px]">
                  Plan your family trip
                </ButtonLink>
              </aside>
            </div>
          </div>
        </section>

        <section id="inclusions" className="scroll-mt-28 bg-cream py-20 sm:py-28" aria-labelledby="inclusions-title">
          <div className="site-container max-w-[1167px]">
            <h2 id="inclusions-title" className="text-[38px] font-semibold tracking-[-0.04em] sm:text-[46px]">Inclusions</h2>
            <details open className="group mt-12 rounded-[10px] bg-sand p-6 sm:p-8">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[20px] font-semibold focus-visible:outline-2 focus-visible:outline-brand"><span className="flex items-center gap-6"><Image src="/assets/trip-inclusions-img-car-svgrepo-com21.svg" width={20} height={20} alt="" className="size-5" />4x4 Land Cruiser with pop-up roof and special fatures</span><Image src="/assets/trip-inclusions-img-arrow-drop-down-svgrepo-com1.svg" width={43} height={43} alt="" className="size-[43px] shrink-0" /></summary>
              <div className="mt-7 space-y-7 text-[16px] leading-[1.68] text-black/[.6]">
                <p>The best safari experience starts with the fleet of top-tier Land Cruisers at Altezza Travel. Our vehicles are customized specifically for Tanzania&apos;s challenging terrain, all in perfect, well-maintained condition. Each vehicle undergoes daily washing and is meticulously inspected at our own garage before every journey.</p>
                <div><h3 className="text-[18px] font-semibold text-ink">GPS tracking</h3><p className="mt-3">GPS tracking On top of that, our Land Cruisers come with advanced features to make your safari even more special. Each vehicle is equipped with GPS tracking to monitor the car&apos;s position in real time, and radio communication that keeps our guides in touch with park rangers and other drivers – perfect for swapping tips on where rare animals are.</p></div>
                <div><h3 className="text-lg font-semibold text-ink">Special features</h3><p className="mt-3">Each Altezza vehicle is equipped with a fridge, ergonomic seats, charging stations, and reliable Wi-Fi – making even long drives comfortable and connected. While you&apos;re out exploring the wild, Wi-Fi will be available in about 60–75% of the areas you travel through.</p></div>
                <div><h3 className="text-lg font-semibold text-ink">Binoculars</h3><p className="mt-3">Each Altezza vehicle comes equipped with a pair of high-quality binoculars, so you can get a closer look at distant wildlife. Whether it&apos;s a leopard lounging in a tree or birds soaring overhead, binoculars help you enjoy the details that make each sighting extra special.</p></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[0, 1].map((index) => <div key={index} className="relative aspect-[1.25] overflow-hidden rounded-lg"><Image src="/assets/trip-inclusions-img-wanyama-part31181.png" alt={index === 0 ? "Golden Trips Tanzania Land Cruiser" : ""} fill sizes="(max-width: 640px) 90vw, 500px" className="object-cover object-[50%_58%]" /></div>)}
                </div>
              </div>
            </details>
            <div className="mt-7 space-y-[29px]">
              {inclusionItems.map(([icon, title, text, iconClass]) => (
                <details key={title} className="group rounded-[10px] bg-sand">
                  <summary className="flex min-h-[77px] cursor-pointer list-none items-center justify-between gap-4 px-[18px] py-4 text-[20px] font-semibold focus-visible:outline-2 focus-visible:outline-brand"><span className="flex items-center gap-6"><Image src={icon} width={30} height={30} alt="" className={iconClass} />{title}</span><Image src="/assets/trip-inclusions-img-arrow-drop-down-svgrepo-com1.svg" width={43} height={43} alt="" className="size-[43px] shrink-0 transition group-open:rotate-180" /></summary>
                  <p className="px-[18px] pb-6 text-[18px] leading-[1.68] text-black/[.6]">{text}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <Testimonials compact sectionId="reviews" />
        <div className="bg-sand"><PlanningCall id="planning" /></div>

        <section className="bg-sand pb-28 pt-10" aria-labelledby="related-title">
          <div className="site-container">
            <h2 id="related-title" className="text-center text-4xl font-semibold tracking-[-0.04em]">Related trips</h2>
            <div className="mx-auto mt-12 grid max-w-[1065px] gap-5 md:grid-cols-3">
              {trips.slice(0, 3).map((trip) => <TripCard key={trip.title} trip={trip} compact />)}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Fact({ label, value, icon }: { label: string; value: string; icon: "calendar" | "clock" | "difficulty" }) {
  return (
    <div className="grid grid-cols-[105px_1fr] items-center gap-4">
      <dt className="text-[20px] font-semibold">{label}:</dt>
      <dd className="flex min-h-[54px] items-center rounded-[15px] bg-sand px-[13px] py-3 text-[20px] font-semibold">
        {icon === "calendar" ? (
          <Image src="/assets/trip-hero-img-layer8.svg" width={21} height={19} alt="" aria-hidden className="mr-3 h-[19px] w-[21px]" />
        ) : icon === "clock" ? (
          <Image src="/assets/trip-hero-img-vector.svg" width={26} height={26} alt="" aria-hidden className="mr-3 size-6" />
        ) : (
          <span aria-hidden className="mr-3 flex h-6 w-[26px] items-end gap-[3px]">
            <span className="h-1.5 w-1 rounded-t-sm bg-brand" />
            <span className="h-4 w-[7px] rounded-t-sm bg-brand/[.28]" />
            <span className="h-6 w-1 rounded-t-sm bg-brand/[.28]" />
          </span>
        )}
        {value}
      </dd>
    </div>
  );
}
