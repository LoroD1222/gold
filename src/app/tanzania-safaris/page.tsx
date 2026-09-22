import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SafariListingFilters } from "@/components/safari/SafariListingFilters";
import { trips } from "@/data/trips";

export const metadata: Metadata = {
  title: "Tanzania Safari in 2027–2028",
  description: "Explore private Tanzania safari examples for 2027 and 2028, including family safaris, classic circuits, and Zanzibar extensions.",
  alternates: { canonical: "/tanzania-safaris" },
  openGraph: {
    title: "Tanzania Safari in 2027–2028",
    description: "Every safari we create is uniquely built around you.",
    url: "/tanzania-safaris",
    images: [{ url: "/assets/list-img-wanyama-part32810.png", width: 4096, height: 2734, alt: "Elephants beside a safari vehicle in Tanzania" }],
  },
};

export default function TanzaniaSafarisPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://goldentrips.com" },
      { "@type": "ListItem", position: 2, name: "Tanzania Safaris", item: "https://goldentrips.com/tanzania-safaris" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Header />
      <main className="bg-sand pb-28">
        <section className="relative h-[324px] overflow-hidden">
          <Image src="/assets/list-img-wanyama-part32810.png" alt="Elephants crossing near a safari vehicle in Tanzania" fill priority sizes="100vw" className="object-cover object-[50%_52%]" />
          <div className="absolute inset-0 bg-black/20" />
        </section>

        <section className="relative -mt-20 pb-8 pt-0" aria-labelledby="listing-title">
          <div className="site-container">
            <div className="relative mx-auto size-[124px] rounded-full bg-brand p-2 shadow-[0_0_0_9px_rgba(245,166,35,.2)]">
              <Image src="/assets/list-img-image5.png" alt="Tripadvisor Travelers' Choice Awards 2026" fill sizes="124px" className="object-contain p-4" />
            </div>
            <nav aria-label="Breadcrumb" className="mt-16 flex justify-center text-sm font-semibold">
              <ol className="flex items-center gap-3"><li><Link href="/">Tanzania</Link></li><li aria-hidden>›</li><li aria-current="page">Safari</li></ol>
            </nav>
            <h1 id="listing-title" className="mt-8 text-center text-[42px] font-semibold leading-tight tracking-[-0.04em] sm:text-[56px]">Tanzania safari in 2027 – 2028</h1>
            <section aria-labelledby="safari-routes-title" className="mx-auto max-w-[1134px]">
              <h2 id="safari-routes-title" className="sr-only">Tanzania safari routes</h2>
              <SafariListingFilters
                trips={trips}
                intro={<p className="mx-auto mt-10 max-w-[820px] text-center text-sm font-medium text-muted">The routes shown are just examples, every safari we create is uniquely built around you</p>}
              />
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
