import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="bg-sand py-24 sm:py-36">
        <div className="site-container grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">404 · Route not found</p>
            <h1 className="mt-5 text-5xl font-semibold leading-tight tracking-[-0.05em] sm:text-6xl">This trail doesn&apos;t continue here.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">Return to our family safari collection or start again from the homepage.</p>
            <div className="mt-8 flex flex-wrap gap-4"><ButtonLink href="/">Back to homepage</ButtonLink><ButtonLink href="/tanzania-safaris" variant="outline" className="border-ink/30 !text-ink">View safari trips</ButtonLink></div>
          </div>
          <div className="relative aspect-[1.25] overflow-hidden rounded-2xl"><Image src="/assets/home-destinations-img-serengeti-national-park-image.png" alt="Serengeti plains in Tanzania" fill sizes="(max-width: 1024px) 90vw, 600px" className="object-cover" /></div>
        </div>
      </main>
      <Footer />
    </>
  );
}
