import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PlanningCall } from "@/components/home/PlanningCall";
import { PopularTripsCarousel } from "@/components/home/PopularTripsCarousel";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { trips } from "@/data/trips";
import { destinations } from "@/data/destinations";
import { faqs } from "@/data/faq";

export const metadata: Metadata = {
  title: "Private Family Safaris in Tanzania",
  description: "Plan a private Tanzania family safari made for every generation, with flexible routes, trusted local guides, and expert advice.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Private Family Safaris in Tanzania",
    description: "See Tanzania together on a private safari designed around the way your family wants to travel.",
    url: "/",
    images: [{ url: "/assets/home-hero.png", width: 1916, height: 821, alt: "Family watching elephants from a safari vehicle in Tanzania" }],
  },
};

const comparisonRows = Array.from({ length: 5 }, (_, index) => ({
  feature: index === 0 ? "Private family vehicle" : index === 1 ? "Flexible pacing" : index === 2 ? "Family-friendly lodges" : index === 3 ? "Personal route planning" : "Support before and during travel",
  golden: index === 0 ? "A private vehicle for your family only, on smoother, safer routes." : index === 1 ? "Drive times and breaks planned around your family." : index === 2 ? "Carefully chosen stays with space for every generation." : index === 3 ? "A route built around your interests, ages, and timing." : "A local team available throughout your journey.",
}));

function DestinationAreaIcon() {
  return (
    <span aria-hidden="true" className="relative block size-[11px] shrink-0">
      <Image src="/assets/home-destinations-img-vector.svg" width={11} height={11} alt="" className="absolute inset-0" />
      <Image src="/assets/home-destinations-img-vector1.svg" width={6} height={6} alt="" className="absolute left-[2.5px] top-[2.5px]" />
    </span>
  );
}

const safetyFeatures = [
  { icon: "/assets/home-safety-img-group1321315423.svg", title: "Malaria precautions", description: "Treated nets, repellent, and routes planned around lower risk times and altitudes.", iconFrame: false, iconClass: "h-[71px] w-[70px]" },
  { icon: "/assets/home-safety-img-group1321315430.svg", title: "Medical care on hand", description: "Trained guides and a clear emergency plan, so your family is always looked after.", iconFrame: true, iconClass: "h-[30px] w-[37px]" },
  { icon: "/assets/home-safety-img-group1321315431.svg", title: "Comfortable, careful travel", description: "Smooth routes and unhurried pacing, so the ride is as easy as the destination.", iconFrame: true, iconClass: "h-[28px] w-[47px]" },
  { icon: "/assets/home-safety-img-group1321315424.svg", title: "Food and water safety", description: "Purified water and trusted meals, chosen to suit sensitive stomachs.", iconFrame: false, iconClass: "h-[71px] w-[70px]" },
] as const;

const guides = [
  { name: "Samson Simon", role: "Tracking & Ecosystem Expert", image: "/assets/guide-samson-simon.png", crop: "!h-[157.23%] !w-[123.07%] !left-[-11.54%] !top-[-7.25%]" },
  { name: "Joel Hagai", role: "General Manager and Chief supervisor", image: "/assets/guide-joel-hagai.png", crop: "!h-[127.75%] !w-full !left-0 !top-[-5.83%]" },
  { name: "Irine Lymo", role: "Reservations", image: "/assets/guide-irine-lymo.png", crop: "!h-[154.52%] !w-full !left-0 !top-[-18.48%]" },
  { name: "Leticia Mtani", role: "Tour Consultant", image: "/assets/guide-leticia-mtani.png", crop: "!h-[261.63%] !w-[169.32%] !left-[-34.66%] !top-[-38.74%]" },
  { name: "Anitha Martine", role: "Tour Consultant", image: "/assets/guide-anitha-martine.png", crop: "!h-[237.68%] !w-[153.82%] !left-[-26.77%] !top-[-50.01%]" },
  { name: "Gladness Msela", role: "Accountant", image: "/assets/guide-gladness-msela.png", crop: "!h-[241.33%] !w-[114.73%] !left-[-7.37%] !top-[-28.83%]" },
] as const;

const guideDescription = "Joseph has a gift for spotting wildlife early and explaining what's happening in a way kids actually follow.";

export default function HomePage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      name: "Golden Trips Tanzania",
      url: "https://goldentrips.com",
      email: "info@goldentrips.com",
      telephone: "+255761575951",
      logo: "https://goldentrips.com/assets/home-header-img-image1.png",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main>
        <section className="relative min-h-[707px] overflow-hidden bg-ink text-white" aria-labelledby="home-title">
          <Image src="/assets/home-hero.png" alt="Family watching elephants during a private Tanzania safari" fill priority sizes="100vw" className="object-cover object-[56%_center]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,27,20,.94)_0%,rgba(20,27,20,.69)_35%,rgba(20,27,20,.08)_77%),linear-gradient(180deg,rgba(17,23,17,.62)_0%,transparent_42%)]" />
          <Header overlay />
          <div className="site-container relative z-10 flex min-h-[603px] flex-col justify-center pb-[50px] pt-[100px] lg:pt-[200px]">
            <div className="max-w-[610px]">
              <h1 id="home-title" className="text-[42px] font-semibold leading-[1.07] tracking-[-0.045em] sm:text-[56px] lg:text-[64px]">
                <span className="text-brand">Family safaris</span> in Tanzania, made for every generation.
              </h1>
              <p className="mt-6 max-w-[540px] text-base leading-7 text-white/85 sm:text-lg">See Tanzania together on a private safari designed around the way your family wants to travel.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="#planning">Plan your family trip</ButtonLink>
                <ButtonLink href="https://wa.me/255761575951?text=Hello%21%20I%27m%20interested%20in%20booking%20a%20safari.%20Can%20you%20help%20me%3F" variant="outline" className="!border-0">
                  <Image src="/assets/home-hero-img-vector.svg" width={18} height={18} alt="" className="mr-2 brightness-0 invert" /> Chat on WhatsApp
                </ButtonLink>
              </div>
            </div>
            <div className="mt-16 flex flex-wrap gap-x-10 gap-y-5 text-xs font-medium sm:text-sm">
              <div className="flex items-center gap-3">
                <Image src="/assets/home-reviews-img-ellipse1.png" width={47} height={47} alt="Tripadvisor" />
                <p>5/5 &nbsp;<span className="text-brand tracking-[.1em]">★★★★★</span><span className="block">Based on 191 verified reviews</span></p>
              </div>
              <div className="flex items-center gap-3">
                <Image src="/assets/home-reviews-img-images6-removebg-preview21.png" width={38} height={44} alt="SafariBookings" className="object-contain" />
                <p>4.9/5 &nbsp;<span className="text-brand tracking-[.1em]">★★★★★</span><span className="block">Based on 216 reviews</span></p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-sand py-20 sm:py-28" aria-labelledby="built-title">
          <div className="site-container grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="max-w-[620px]">
              <p className="eyebrow">Why travel with us</p>
              <h2 id="built-title" className="mt-5 text-4xl font-semibold leading-[1.12] tracking-[-0.045em] sm:text-[52px]">Built around the way your family travels.</h2>
              <p className="mt-7 leading-7 text-muted">The best family trips are not about trying to keep everyone on the same schedule. They are about creating a journey where everyone finds something they love.</p>
              <div className="mt-6 flex flex-wrap gap-x-9 gap-y-3 text-sm font-medium">
                <span className="flex items-center gap-2">
                  <Image src="/assets/home-intro-img-path1.svg" width={22} height={26} alt="" aria-hidden className="h-[19px] w-[16px] shrink-0" />
                  Licensed Tanzania operator
                </span>
                <span className="flex items-center gap-2">
                  <Image src="/assets/home-intro-img-layer1.svg" width={30} height={24} alt="" aria-hidden className="h-4 w-5 shrink-0" />
                  Local team, personal support
                </span>
              </div>
              <p className="mt-7 leading-7 text-muted">One person may be waiting for their first lion sighting. Someone else may remember breakfast overlooking the Serengeti, watching elephants from the lodge, or the afternoon spent relaxing by the pool. That is why we do not force your family into a standard itinerary. We build the safari around you.</p>
              <ButtonLink href="#planning" className="mt-8">Plan your family trip</ButtonLink>
            </div>
            <div className="relative mx-auto aspect-[634/624] w-full max-w-[634px]">
              <Image
                src="/assets/why-travel-golden-trips-tanzania.png"
                alt="Golden Trips Tanzania collage of safari guests, guides, and wildlife"
                fill
                sizes="(max-width: 1024px) 90vw, 634px"
                className="object-contain"
              />
            </div>
          </div>
        </section>

        <section className="bg-cream py-20 sm:py-28" aria-labelledby="comparison-title">
          <div className="site-container">
            <SectionHeading eyebrow="Made for family travel" title="The safari that fits your whole family" id="comparison-title" description={<p>Every family is different, with different ages, energy levels, and needs, and a standard safari itinerary rarely accounts for that. Golden Trip&apos;s family safari is built from the ground up around your whole group, so grandparents, parents, and children can all enjoy the same adventure, at a pace that works for everyone.</p>} />
            <div className="mt-12 overflow-x-auto">
              <table className="w-full min-w-[1271px] table-fixed border-collapse text-left">
                <colgroup>
                  <col className="w-[324px]" />
                  <col className="w-[628px]" />
                  <col className="w-[319px]" />
                </colgroup>
                <thead>
                  <tr className="h-[81px]">
                    <th scope="col" className="p-0 align-middle">
                      <Image src="/assets/home-compare-img-image1.png" width={214} height={81} alt="Golden Trips Tanzania" className="h-[81px] w-[214px]" />
                    </th>
                    <th scope="col" className="p-0 align-middle">
                      <p className="ml-[54px] w-[486px] text-center text-[23px] font-bold leading-[1.38] text-ink">
                        Family safari with <span className="text-brand">Golden Trips Tanzania</span>
                      </p>
                    </th>
                    <th scope="col" className="p-0 text-center align-middle text-[23px] font-bold leading-[1.3] text-ink">Other general safari</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.feature} className="h-[101px] border-y border-[#ede9e2]">
                      <th scope="row" className="p-0 text-[22px] font-bold leading-[1.68] text-[#1c1917]/85">{row.feature}</th>
                      <td className="p-0">
                        <div className="flex items-center justify-center gap-[29px]">
                          <Image src="/assets/home-compare-img-vector.svg" width={29} height={25} alt="Included" className="h-[25px] w-[29px]" />
                          <p className="w-[459px] text-[17px] font-medium leading-[1.5] text-[#1c1917]/60">{row.golden}</p>
                        </div>
                      </td>
                      <td className="p-0">
                        <Image src="/assets/home-compare-img-frame1321315488.svg" width={319} height={46} alt="Not included" className="h-[46px] w-[319px]" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="bg-sand pb-12 pt-20 sm:pb-16 sm:pt-28" aria-labelledby="popular-title">
          <div className="site-container">
            <PopularTripsCarousel trips={trips} />
            <div className="mt-10 text-center">
              <Image src="/assets/home-fit-img-path1.svg" width={68} height={42} alt="" className="mx-auto h-[42px] w-[68px]" />
              <p className="mt-4 text-lg font-semibold">Not sure which family journey fits you best?</p>
              <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-muted">Tell us when you want to travel, who is coming, how long you have. We&apos;ll recommend the route that makes the most sense.</p>
              <Link href="#planning" className="mt-5 inline-block text-sm font-semibold text-brand underline underline-offset-4">Get our safari recommendation</Link>
            </div>
          </div>
        </section>

        <PlanningCall id="planning" />

        <section id="destinations" className="bg-cream py-20 sm:py-28" aria-labelledby="destinations-title">
          <div className="site-container">
            <div className="mx-auto max-w-[987px] text-center">
              <p className="eyebrow">Tanzania Destinations</p>
              <h2 id="destinations-title" className="mt-5 text-3xl font-semibold leading-[.95] tracking-[-0.035em] text-ink sm:text-4xl lg:text-[53px]">Iconic destinations in Tanzania</h2>
              <p className="mx-auto mt-5 max-w-[729px] text-base leading-7 text-muted sm:text-lg">From open plains to white sand beaches, Tanzania&apos;s most iconic destinations offer something for every generation to discover together.</p>
            </div>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[18px]">
              {destinations.map((destination) => (
                <article key={destination.name} className="group relative isolate aspect-[.773] overflow-hidden rounded-[10px] text-white lg:h-[396px] lg:aspect-auto">
                  <Image src={destination.image} alt={`${destination.name} landscape in Tanzania`} fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 306px" className="object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_39%,rgba(70,48,13,.62)_100%)]" />
                  <p className="absolute right-3 top-[15px] inline-flex h-[26px] items-center gap-1 rounded-[3px] bg-brand px-2 text-xs font-medium leading-none text-black">
                    <DestinationAreaIcon />
                    {destination.area}
                  </p>
                  <h3 className={`absolute left-[17px] right-11 ${destination.longTitle ? "top-[65%] lg:top-[257px]" : "top-[70%] lg:top-[280px]"} text-lg font-semibold leading-[1.28]`}>{destination.name}</h3>
                  <p className="absolute left-[17px] top-[78%] w-[68%] text-sm font-medium leading-[1.4] text-white/75 lg:top-[309px] lg:w-[209px]">{destination.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="safety" className="bg-sand py-20 sm:py-28" aria-labelledby="safety-title">
          <div className="site-container">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <SectionHeading eyebrow="Extra care on safety" title="Safety, built around every generation." id="safety-title" description={<p className="max-w-3xl">Traveling with grandparents and young children means thinking ahead, our team plans every detail with their comfort and wellbeing in mind.</p>} />
              <ButtonLink href="#planning" className="shrink-0">Plan your family trip</ButtonLink>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {safetyFeatures.map(({ icon, title, description, iconFrame, iconClass }) => (
                <article key={title} className="rounded-lg bg-cream p-6">
                  {iconFrame ? (
                    <div className="grid h-[71px] w-[70px] place-items-center rounded-[5px] border border-brand/20 bg-brand/[.17]">
                      <Image src={icon} width={47} height={30} alt="" className={iconClass} />
                    </div>
                  ) : (
                    <Image src={icon} width={54} height={54} alt="" className={iconClass} />
                  )}
                  <h3 className="mt-5 font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Testimonials />
        <div className="bg-sand"><PlanningCall id="planning-again" /></div>

        <section id="guides" className="bg-cream py-20 sm:py-28" aria-labelledby="guides-title">
          <div className="site-container">
            <SectionHeading eyebrow="Meet The Team" title="Your ultimate Tanzania vacation experts" id="guides-title" align="center" className="max-w-[980px]" description={<p>Meet the people who turn a safari into a story your family tells for years.</p>} />
            <div className="mx-auto mt-[62px] grid max-w-[1269px] gap-x-[23px] gap-y-[62px] text-center sm:grid-cols-2 lg:grid-cols-3">
              {guides.map(({ name, role, image, crop }) => (
                <article key={name} className="mx-auto w-full max-w-[300px]">
                  <div className="relative mx-auto h-[267px] w-[273px] overflow-hidden rounded-[200px]">
                    <Image src={image} alt={`${name}, ${role}`} fill sizes="273px" className={`!bottom-auto !right-auto !max-w-none ${crop}`} />
                  </div>
                  <h3 className="mt-2 text-[19px] font-bold leading-[1.68] text-black/[.98]">{name}</h3>
                  <p className="mt-2 text-[15px] font-bold leading-[1.4] text-black/[.28]">{role}</p>
                  <p className="mx-auto mt-2 max-w-[268px] text-[13px] font-medium leading-[1.68] text-black/[.67]">{guideDescription}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <FAQ />
      </main>
      <Footer />
    </>
  );
}
