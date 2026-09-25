import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FAQ } from "@/components/home/FAQ";
import { PlanningCall } from "@/components/home/PlanningCall";
import { Testimonials } from "@/components/home/Testimonials";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { destinations } from "@/data/destinations";
import type { Trip } from "@/data/trips";
import { getGroupSafariTripCards } from "@/lib/safariTrips";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Join a Group Safari in Tanzania",
  description: "Travel together and save together on a welcoming Tanzania group safari planned by local family-travel experts.",
  alternates: { canonical: "/join-a-group" },
  openGraph: {
    title: "Join a Group Safari in Tanzania | Golden Trips Tanzania",
    description: "Find a Tanzania group safari and share a remarkable journey with fellow travellers.",
    url: "/join-a-group",
    images: [{ url: "/assets/join-group-hero.jpg", width: 3600, height: 2400, alt: "Friends enjoying a Tanzania safari together" }],
  },
};

const comparisonRows = [
  {
    feature: "Vehicle comfort",
    golden: "A private vehicle for your family only, on smoother, safer routes.",
  },
  {
    feature: "Flexible pacing",
    golden: "Drive times and breaks planned around your family.",
  },
  {
    feature: "Family-friendly lodges",
    golden: "Carefully chosen stays with space for every generation.",
  },
  {
    feature: "Personal route planning",
    golden: "A route built around your interests, ages, and timing.",
  },
  {
    feature: "Support before and during travel",
    golden: "A local team available throughout your journey.",
  },
] as const;

const safetyFeatures = [
  {
    icon: "/assets/home-safety-img-group1321315423.svg",
    title: "Malaria precautions",
    description: "Treated nets, repellent, and routes planned around lower risk times and altitudes.",
  },
  {
    icon: "/assets/home-safety-img-group1321315430.svg",
    title: "Medical care on hand",
    description: "Trained guides and a clear emergency plan, so your family is always looked after.",
  },
  {
    icon: "/assets/home-safety-img-group1321315431.svg",
    title: "Comfortable, careful travel",
    description: "Smooth routes and unhurried pacing, so the ride is as easy as the destination.",
  },
  {
    icon: "/assets/home-safety-img-group1321315424.svg",
    title: "Food and water safety",
    description: "Purified water and trusted meals, chosen to suit sensitive stomachs.",
  },
] as const;

const guides = [
  { name: "Samson Simon", role: "Tracking & Ecosystem Expert", image: "/assets/guide-samson-simon.png", crop: "!h-[157.23%] !w-[123.07%] !left-[-11.54%] !top-[-7.25%]" },
  { name: "Joel Hagai", role: "General Manager and Chief Supervisor", image: "/assets/guide-joel-hagai.png", crop: "!h-[127.75%] !w-full !left-0 !top-[-5.83%]" },
  { name: "Irine Lymo", role: "Reservations", image: "/assets/guide-irine-lymo.png", crop: "!h-[154.52%] !w-full !left-0 !top-[-18.48%]" },
  { name: "Leticia Mtani", role: "Tour Consultant", image: "/assets/guide-leticia-mtani.png", crop: "!h-[261.63%] !w-[169.32%] !left-[-34.66%] !top-[-38.74%]" },
  { name: "Anitha Martine", role: "Tour Consultant", image: "/assets/guide-anitha-martine.png", crop: "!h-[237.68%] !w-[153.82%] !left-[-26.77%] !top-[-50.01%]" },
  { name: "Gladness Msela", role: "Accountant", image: "/assets/guide-gladness-msela.png", crop: "!h-[241.33%] !w-[114.73%] !left-[-7.37%] !top-[-28.83%]" },
] as const;

function formatPrice(price?: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(price ?? 792);
}

function GroupTripCard({ trip }: { trip: Trip }) {
  const duration = trip.duration ?? 4;
  const summary = trip.shortDescription || "A welcoming, carefully planned Tanzania safari for travellers who want to share the journey.";

  return (
    <Link
      href={`/tanzania-safaris/${trip.slug}`}
      className="group flex min-h-[550px] flex-col rounded-[20px] bg-white/85 p-3 shadow-[0_8px_24px_rgba(51,39,20,.05)] ring-1 ring-black/[.03] transition hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(51,39,20,.12)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand sm:min-h-[590px]"
    >
      <div className="relative aspect-[361/250] overflow-hidden rounded-[10px]">
        <Image src="/assets/join-group-card-elephants.png" alt="Elephants on a Tanzania group safari" fill sizes="(max-width: 640px) calc(100vw - 3rem), (max-width: 1024px) 45vw, 361px" className="object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        <h2 className="min-h-[3.3rem] text-[21px] font-bold leading-[1.25] tracking-[-0.03em] text-ink">{trip.title}</h2>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-ink">
          <span>{duration} {duration === 1 ? "Day" : "Days"}</span>
          <span aria-label="Five out of five stars" className="tracking-[.08em] text-brand">★★★★★</span>
          <span className="ml-auto inline-flex items-center gap-1 text-black/75"><span className="flex h-4 items-end gap-0.5" aria-hidden><i className="block h-1.5 w-1 rounded-sm bg-brand" /><i className="block h-2.5 w-1 rounded-sm bg-brand/55" /><i className="block h-4 w-1 rounded-sm bg-brand/30" /></span> Moderate</span>
        </div>
        <p className="mt-4 line-clamp-4 text-[15px] leading-[1.45] text-black/60">{summary}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="text-sm font-semibold leading-tight text-ink">From<span className="mt-1 block text-[30px] leading-none text-brand">${formatPrice(trip.priceFrom)}</span><span className="mt-1 block">/ Person</span></p>
          <span className="inline-flex min-h-12 items-center gap-2 rounded-[8px] bg-gradient-to-r from-[#f2a93b] to-[#f5be2b] px-4 text-sm font-semibold text-ink transition group-hover:brightness-95">View This Trip <span aria-hidden className="text-lg leading-none">→</span></span>
        </div>
      </div>
    </Link>
  );
}

function DestinationAreaIcon() {
  return (
    <span aria-hidden="true" className="relative block size-[11px] shrink-0">
      <Image src="/assets/home-destinations-img-vector.svg" width={11} height={11} alt="" className="absolute inset-0" />
      <Image src="/assets/home-destinations-img-vector1.svg" width={6} height={6} alt="" className="absolute left-[2.5px] top-[2.5px]" />
    </span>
  );
}

export default async function JoinAGroupPage() {
  const groupTrips = await getGroupSafariTripCards().catch(() => []);

  return (
    <>
      <Header />
      <main>
        <section className="relative isolate h-[360px] overflow-visible bg-ink text-white sm:h-[480px]" aria-label="Friends enjoying a Tanzania safari together">
          <Image src="/assets/join-group-hero.jpg" alt="Friends enjoying a Tanzania safari together" fill priority sizes="100vw" className="object-cover object-[50%_58%]" />
          <div className="absolute inset-0 bg-black/[.35]" />
          <div className="absolute inset-x-0 bottom-14 z-10 mx-auto flex max-w-xl flex-col items-center px-6 pb-10 text-center sm:bottom-16">
            <p className="text-base font-semibold sm:text-lg">5/5 · Based on 123+ reviews on Tripadvisor</p>
            <p aria-hidden="true" className="mt-2 text-lg tracking-[.2em] text-brand">★★★★★</p>
          </div>
          <div className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 translate-y-1/2">
            <div className="relative size-[108px] rounded-full bg-brand p-2 shadow-[0_0_0_9px_rgba(245,166,35,.2)] sm:size-[124px]">
              <Image src="/assets/list-img-image5.png" alt="Tripadvisor Travelers' Choice Awards 2026" fill sizes="(max-width: 640px) 108px, 124px" className="object-contain p-4" />
            </div>
          </div>
        </section>

        <section id="group-trips" className="bg-cream pb-20 pt-24 sm:pb-28 sm:pt-28" aria-labelledby="group-trips-title">
          <div className="site-container">
            <nav aria-label="Breadcrumb" className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm font-semibold text-ink sm:text-base">
              <Link href="/" className="hover:text-brand">Tanzania</Link><span aria-hidden>&gt;</span><Link href="/tanzania-safaris" className="hover:text-brand">Safari</Link><span aria-hidden>&gt;</span><span aria-current="page">Join a group</span>
            </nav>
            <div className="mx-auto mt-5 max-w-5xl text-center">
              <p className="text-sm font-semibold text-brand">Travel Together, Save Together</p>
              <h1 id="group-trips-title" className="mt-3 text-4xl font-semibold leading-[1.06] tracking-[-0.045em] text-ink sm:text-[50px]">Join a family group tour and save up to 50%</h1>
            </div>
            {groupTrips.length > 0 ? (
              <div className="mx-auto mt-12 grid max-w-[1199px] gap-5 md:grid-cols-2 xl:grid-cols-3">
                {groupTrips.map((trip) => <GroupTripCard key={trip.slug} trip={trip} />)}
              </div>
            ) : (
              <p className="mx-auto mt-12 max-w-2xl text-center text-base leading-7 text-muted">New group trips are coming soon. Tell us when you&apos;d like to travel and we&apos;ll help you find the right safari.</p>
            )}
          </div>
        </section>

        <PlanningCall id="planning" />

        <section className="bg-[#fffdf8] py-20 sm:py-28" aria-labelledby="comparison-title">
          <div className="site-container">
            <SectionHeading eyebrow="Made for family travel" title="The safari that fits your whole family" id="comparison-title" description={<p className="max-w-4xl">Every family is different, with different ages, energy levels, and needs, and a standard safari itinerary rarely accounts for that. Golden Trips&apos; family safaris are built around your whole group, so grandparents, parents, and children can all enjoy the same adventure at a pace that works for everyone.</p>} />
            <div className="mt-10 overflow-x-auto">
              <table className="min-w-[780px] w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-black/[.08]">
                    <th className="w-[28%] px-0 pb-5 align-middle"><Image src="/assets/home-compare-img-image1.png" width={214} height={81} alt="Golden Trips Tanzania" className="h-auto w-[150px] sm:w-[190px]" /></th>
                    <th className="w-[52%] bg-white/80 px-5 pb-5 text-center text-base font-bold text-ink sm:text-lg">Family safari with <span className="text-brand">Golden Trips Tanzania</span></th>
                    <th className="w-[20%] px-5 pb-5 text-center text-base font-bold text-ink sm:text-lg">Other general safari</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.feature} className="border-b border-black/[.08]">
                      <th scope="row" className="px-0 py-5 text-base font-bold text-black/75 sm:text-lg">{row.feature}</th>
                      <td className="bg-white/80 px-5 py-5"><div className="flex items-center gap-4"><span aria-hidden className="text-[30px] leading-none text-brand">✓</span><p className="max-w-md text-sm leading-6 text-black/55">{row.golden}</p></div></td>
                      <td className="px-5 py-5 text-center text-[30px] font-light leading-none text-brand" aria-label="Not included">×</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="safety" className="bg-sand py-20 sm:py-28" aria-labelledby="safety-title">
          <div className="site-container">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <SectionHeading eyebrow="Extra care on safety" title="Safety, built around every generation." id="safety-title" description={<p className="max-w-3xl">Traveling with grandparents and young children means thinking ahead. Our team plans every detail with their comfort and wellbeing in mind.</p>} />
              <ButtonLink href="#planning" className="shrink-0">Plan your family trip</ButtonLink>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {safetyFeatures.map(({ icon, title, description }) => (
                <article key={title} className="rounded-[10px] bg-cream p-6">
                  <div className="grid size-[58px] place-items-center rounded-[5px] border border-brand/20 bg-brand/[.14]"><Image src={icon} width={47} height={32} alt="" className="max-h-[34px] w-auto" /></div>
                  <h3 className="mt-5 font-semibold text-ink">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Testimonials sectionId="reviews" />

        <section id="guides" className="bg-sand py-20 sm:py-28" aria-labelledby="guides-title">
          <div className="site-container">
            <SectionHeading eyebrow="Meet the team" title="Your ultimate Tanzania vacation experts" id="guides-title" align="center" className="max-w-[980px]" description={<p>Meet the people who turn a safari into a story your family tells for years.</p>} />
            <div className="mx-auto mt-12 grid max-w-[1269px] grid-cols-2 gap-x-4 gap-y-12 text-center sm:mt-16 sm:gap-x-6 sm:gap-y-16 lg:grid-cols-3">
              {guides.map(({ name, role, image, crop }) => (
                <article key={name} className="mx-auto w-full max-w-[300px]">
                  <div className="relative mx-auto h-[160px] w-[160px] overflow-hidden rounded-full sm:h-[220px] sm:w-[220px]">
                    <Image src={image} alt={`${name}, ${role}`} fill sizes="(max-width: 639px) 160px, 220px" className={`!bottom-auto !right-auto !max-w-none ${crop}`} />
                  </div>
                  <h3 className="mt-3 text-base font-bold leading-[1.4] text-ink sm:text-lg">{name}</h3>
                  <p className="mt-1 text-xs font-semibold text-black/45 sm:text-sm">{role}</p>
                  <p className="mx-auto mt-3 max-w-[230px] text-xs leading-5 text-muted">A local expert with a gift for helping every traveller feel at home in Tanzania.</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <PlanningCall id="planning-again" />

        <section id="destinations" className="bg-[#fffdf8] py-20 sm:py-28" aria-labelledby="destinations-title">
          <div className="site-container">
            <SectionHeading eyebrow="Tanzania destinations" title="Iconic destinations in Tanzania" id="destinations-title" align="center" className="max-w-[920px]" description={<p>From open plains to white-sand beaches, Tanzania&apos;s most iconic destinations offer something for every generation to discover together.</p>} />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[18px]">
              {destinations.map((destination) => (
                <article key={destination.name} className="group relative isolate h-[300px] overflow-hidden rounded-[10px] text-white sm:h-[340px]">
                  <Image src={destination.image} alt={`${destination.name} landscape in Tanzania`} fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 306px" className="object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_34%,rgba(38,28,12,.76)_100%)]" />
                  <p className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-[3px] bg-brand px-2 py-1 text-xs font-medium text-black"><DestinationAreaIcon />{destination.area}</p>
                  <div className="absolute bottom-5 left-4 right-4"><h3 className="text-lg font-semibold leading-[1.2]">{destination.name}</h3><p className="mt-2 text-sm leading-5 text-white/80">{destination.description}</p><span aria-hidden className="mt-3 inline-grid size-8 place-items-center rounded-full border border-brand text-lg text-brand">→</span></div>
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
