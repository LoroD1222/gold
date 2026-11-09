import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Binoculars, CircleDollarSign, MapPinned, UsersRound, type LucideIcon } from "lucide-react";
import { FAQ } from "@/components/home/FAQ";
import { PlanningCall } from "@/components/home/PlanningCall";
import { Testimonials } from "@/components/home/Testimonials";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { destinations } from "@/data/destinations";
import { tripadvisorProfileUrl } from "@/data/externalLinks";
import type { Trip } from "@/data/trips";
import { getGroupSafariTripCards } from "@/lib/safariTrips";

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: "Tanzania Group Safaris | Join Shared Safari Tours | Golden Trips" },
  description: "Join a Tanzania group safari and explore Serengeti, Ngorongoro and more. Affordable shared safari adventures for solo travelers, couples and friends.",
  alternates: { canonical: "/tanzania-group-safari" },
  openGraph: {
    title: "Tanzania Group Safaris | Join Shared Safari Tours | Golden Trips",
    description: "Join a Tanzania group safari and explore Serengeti, Ngorongoro and more with fellow travelers.",
    url: "/tanzania-group-safari",
    images: [{ url: "/assets/join-group-hero.jpg", width: 3600, height: 2400, alt: "Friends enjoying a Tanzania safari together" }],
  },
};

const comparisonRows = [
  {
    feature: "Shared safari vehicle",
    golden: "Travel together in a comfortable vehicle with fellow adventurers and an expert local guide.",
  },
  {
    feature: "Better value",
    golden: "Share the journey and enjoy Tanzania's wildlife experiences without arranging a private safari.",
  },
  {
    feature: "Friendly travel companions",
    golden: "Join solo travelers, couples, and friends from around the world who share your sense of adventure.",
  },
  {
    feature: "Iconic wildlife routes",
    golden: "Explore celebrated parks such as Serengeti, Ngorongoro Crater, and Tarangire on the itinerary you choose.",
  },
  {
    feature: "Local support",
    golden: "Our Tanzania team is here to help you find the right shared safari and prepare for departure.",
  },
] as const;

const safetyFeatures: Array<{ icon: string | LucideIcon; title: string; description: string }> = [
  {
    icon: CircleDollarSign,
    title: "Travel Together, Spend Less",
    description: "Join a shared safari and experience Tanzania's wildlife without the cost of arranging an entire private trip.",
  },
  {
    icon: UsersRound,
    title: "Perfect for Solo Travelers & Couples",
    description: "You do not need to organize your own group. Join fellow adventurers and explore Tanzania together.",
  },
  {
    icon: MapPinned,
    title: "Small Groups, Big Adventures",
    description: "Enjoy a friendly safari atmosphere with experienced local guides and like-minded travelers.",
  },
  {
    icon: Binoculars,
    title: "Unforgettable Wildlife Experiences",
    description: "Discover Serengeti, Ngorongoro Crater, Tarangire, and Tanzania's spectacular wildlife.",
  },
];

const groupSafariFaqs = [
  {
    question: "Can I join a group safari as a solo traveler?",
    answer: "Yes. Solo travelers are welcome to inquire about joining a shared safari with other travelers.",
  },
  {
    question: "How many people are in a group?",
    answer: "Group size can vary by departure and itinerary. Ask us about the trip you are considering and we will confirm the current details.",
  },
  {
    question: "What is included in the safari price?",
    answer: "Your final proposal clearly lists transport, accommodation, park fees, meals, guiding, and support, along with any exclusions, before you book.",
  },
  {
    question: "Are accommodations included?",
    answer: "Accommodation details are included in your final proposal. We will explain the stays and any applicable exclusions before you reserve.",
  },
  {
    question: "How do I find available departure dates?",
    answer: "Choose a group safari that interests you and send an inquiry. Our local team will help you check availability for your preferred travel dates.",
  },
  {
    question: "Can couples and friends join together?",
    answer: "Yes. Couples and friends can inquire together and our team will help match you with a suitable shared safari departure.",
  },
  {
    question: "What national parks will we visit?",
    answer: "Routes vary by itinerary. Group safaris can include Tanzania's iconic parks, such as Serengeti, Ngorongoro Crater, and Tarangire.",
  },
  {
    question: "How do I reserve my place?",
    answer: "Send us an inquiry with your preferred trip and travel dates. We will confirm the available options and guide you through the next steps.",
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

function SafetyFeatureIcon({ icon }: { icon: string | LucideIcon }) {
  if (typeof icon === "string") {
    return <Image src={icon} width={47} height={32} alt="" className="max-h-[34px] w-auto" />;
  }

  const Icon = icon;
  return <Icon aria-hidden="true" className="size-8 stroke-[2.5] text-brand" />;
}

function formatPrice(price?: number) {
  return typeof price === "number" ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(price) : null;
}

function GroupTripCard({ trip }: { trip: Trip }) {
  const duration = trip.duration ?? 4;
  const summary = trip.shortDescription || "A welcoming, carefully planned Tanzania safari for travellers who want to share the journey.";
  const price = formatPrice(trip.priceFrom);
  const difficulty = trip.difficulty?.replace(/ level$/i, "");

  return (
    <Link
      href={`/tanzania-safaris/${trip.slug}`}
      className="group flex min-h-[550px] flex-col rounded-[20px] bg-white/85 p-3 shadow-[0_8px_24px_rgba(51,39,20,.05)] ring-1 ring-black/[.03] transition hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(51,39,20,.12)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand sm:min-h-[590px]"
    >
      <div className="relative aspect-[361/250] overflow-hidden rounded-[10px]">
        {trip.image ? (
          <Image src={trip.image} alt={`${trip.title} in Tanzania`} fill sizes="(max-width: 640px) calc(100vw - 3rem), (max-width: 1024px) 45vw, 361px" className="object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid h-full place-items-center bg-ink px-6 text-center text-sm font-semibold text-white/80">Add a cover photo in Sanity</div>
        )}
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        <h2 className="min-h-[3.3rem] text-[21px] font-bold leading-[1.25] tracking-[-0.03em] text-ink">{trip.title}</h2>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-ink">
          <span>{duration} {duration === 1 ? "Day" : "Days"}</span>
          <span aria-label="Five out of five stars" className="tracking-[.08em] text-brand">★★★★★</span>
          {difficulty ? <span className="ml-auto inline-flex items-center gap-1 text-black/75"><span className="flex h-4 items-end gap-0.5" aria-hidden><i className="block h-1.5 w-1 rounded-sm bg-brand" /><i className="block h-2.5 w-1 rounded-sm bg-brand/55" /><i className="block h-4 w-1 rounded-sm bg-brand/30" /></span> {difficulty}</span> : null}
        </div>
        <p className="mt-4 line-clamp-4 text-[15px] leading-[1.45] text-black/60">{summary}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          {price ? (
            <p className="text-sm font-semibold leading-tight text-ink">From<span className="mt-1 block text-[30px] leading-none text-brand">${price}</span><span className="mt-1 block">/ Person</span></p>
          ) : (
            <p className="text-sm font-semibold leading-tight text-ink">Price<span className="mt-1 block text-[21px] leading-none text-brand">On request</span></p>
          )}
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
      <Script id="contentsquare-group-safari" src="https://t.contentsquare.net/uxa/775d014b5e7f4.js" strategy="afterInteractive" />
      <Header />
      <main>
        <section className="relative isolate h-[360px] overflow-visible bg-ink text-white sm:h-[480px]" aria-label="Friends enjoying a Tanzania safari together">
          <Image src="/assets/join-group-hero.jpg" alt="Friends enjoying a Tanzania safari together" fill priority sizes="100vw" className="object-cover object-[50%_58%]" />
          <div className="absolute inset-0 bg-black/[.35]" />
          <div className="absolute inset-x-0 bottom-14 z-10 mx-auto flex max-w-xl flex-col items-center px-6 pb-10 text-center sm:bottom-16">
            <a href={tripadvisorProfileUrl} target="_blank" rel="noreferrer" className="text-base font-semibold underline decoration-white/70 underline-offset-4 transition hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand sm:text-lg">5/5 · Based on 190+ reviews on TripAdvisor</a>
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
              <h1 id="group-trips-title" className="mt-3 text-4xl font-semibold leading-[1.06] tracking-[-0.045em] text-ink sm:text-[50px]">Join a Tanzania Group Safari &amp; Experience the Wild Together</h1>
              <p className="mx-auto mt-5 max-w-4xl text-base leading-7 text-muted sm:text-lg">Explore Serengeti, Ngorongoro and Tanzania&apos;s most incredible national parks on an unforgettable shared safari. Meet fellow travelers, enjoy expert local guides and experience the adventure at a more affordable price.</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <ButtonLink href="#planning">Find My Group Safari</ButtonLink>
                <ButtonLink href="#group-trips" variant="text">Explore Group Safaris</ButtonLink>
              </div>
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

        <PlanningCall
          id="planning"
          submitLabel="Get My Safari Quote"
          description="Schedule a 30-minute call for honest advice about Tanzania group safaris, shared departures, and the best seasons to travel."
          formPrompt={<>Tell us what you&apos;re looking for,<br />we&apos;ll help you find a group</>}
        />

        <section className="bg-[#fffdf8] py-20 sm:py-28" aria-labelledby="comparison-title">
          <div className="site-container">
            <SectionHeading eyebrow="Made for shared adventures" title="A Tanzania safari is even better together" id="comparison-title" description={<p className="max-w-4xl">You do not need to organize a private safari to experience Tanzania at its best. Join fellow travelers for a welcoming shared adventure, with expert local guidance, iconic wildlife routes, and more value in every unforgettable day.</p>} />
            <div className="mt-10 overflow-x-auto">
              <table className="min-w-[780px] w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-black/[.08]">
                    <th className="w-[28%] px-0 pb-5 align-middle"><Image src="/assets/home-compare-img-image1.png" width={214} height={81} alt="Golden Trips Tanzania" className="h-auto w-[150px] sm:w-[190px]" /></th>
                    <th className="w-[52%] bg-white/80 px-5 pb-5 text-center text-base font-bold text-ink sm:text-lg">Group safari with <span className="text-brand">Golden Trips Tanzania</span></th>
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

        <section id="why-group" className="bg-sand py-20 sm:py-28" aria-labelledby="why-group-title">
          <div className="site-container">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <SectionHeading eyebrow="Why join a group" title="Travel with new people. Come home with great stories." id="why-group-title" description={<p className="max-w-3xl">Whether you&apos;re traveling solo, as a couple, or with friends, a shared safari makes it easy to see Tanzania&apos;s wild places alongside people who came for the same sense of wonder.</p>} />
              <ButtonLink href="#planning" className="shrink-0">Check Availability</ButtonLink>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {safetyFeatures.map(({ icon, title, description }) => {
                return (
                  <article key={title} className="rounded-[10px] bg-cream p-6">
                    <div className="grid size-[58px] place-items-center rounded-[5px] border border-brand/20 bg-brand/[.14]">
                      <SafetyFeatureIcon icon={icon} />
                    </div>
                    <h3 className="mt-5 font-semibold text-ink">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <Testimonials sectionId="reviews" eyebrow="Verified Traveler Reviews" title="The safari stories travelers remember" imageAlt="Tanzania safari experience" />

        <section id="guides" className="bg-sand py-20 sm:py-28" aria-labelledby="guides-title">
          <div className="site-container">
            <SectionHeading eyebrow="Meet the team" title="Your Tanzania safari experts" id="guides-title" align="center" className="max-w-[980px]" description={<p>Meet the local team who help turn a shared Tanzania safari into an unforgettable adventure.</p>} />
            <div className="mx-auto mt-12 grid max-w-[1269px] grid-cols-2 gap-x-4 gap-y-12 text-center sm:mt-16 sm:gap-x-6 sm:gap-y-16 lg:grid-cols-3">
              {guides.map(({ name, role, image, crop }) => (
                <article key={name} className="mx-auto w-full max-w-[300px]">
                  <div className="relative mx-auto h-[160px] w-[160px] overflow-hidden rounded-full sm:h-[220px] sm:w-[220px]">
                    <Image src={image} alt={`${name}, ${role}`} fill sizes="(max-width: 639px) 160px, 220px" className={`!bottom-auto !right-auto !max-w-none ${crop}`} />
                  </div>
                  <h3 className="mt-3 text-base font-bold leading-[1.4] text-ink sm:text-lg">{name}</h3>
                  <p className="mt-1 text-xs font-semibold text-black/45 sm:text-sm">{role}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <PlanningCall
          id="planning-again"
          submitLabel="Join a Group Safari"
          description="Tell us when you would like to travel and we will help you find a Tanzania group safari that suits your plans."
          formPrompt={<>Ready to travel together?<br />Let&apos;s find your safari</>}
        />

        <section id="destinations" className="bg-[#fffdf8] py-20 sm:py-28" aria-labelledby="destinations-title">
          <div className="site-container">
            <SectionHeading eyebrow="Tanzania destinations" title="Iconic destinations in Tanzania" id="destinations-title" align="center" className="max-w-[920px]" description={<p>From open plains to dramatic craters, Tanzania&apos;s most iconic destinations are waiting to be explored together.</p>} />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[18px]">
              {destinations.map((destination) => (
                <article key={destination.name} className="group relative isolate h-[300px] overflow-hidden rounded-[10px] text-white sm:h-[340px]">
                  <Image src={destination.image} alt={`${destination.name} landscape in Tanzania`} fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 306px" className="object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_34%,rgba(38,28,12,.76)_100%)]" />
                  <p className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-[3px] bg-brand px-2 py-1 text-xs font-medium text-black"><DestinationAreaIcon />{destination.area}</p>
                  <div className="absolute bottom-5 left-4 right-4"><h3 className="text-lg font-semibold leading-[1.2]">{destination.name}</h3><p className="mt-2 text-sm leading-5 text-white/80">{destination.description}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <FAQ
          items={groupSafariFaqs}
          intro="Answers to common questions about joining a Tanzania group safari."
          ctaLabel="Find My Group Safari"
        />
      </main>
      <Footer />
    </>
  );
}
