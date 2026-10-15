import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Thank you for getting in touch with Golden Trips Tanzania.",
  alternates: { canonical: "/thank-you" },
};

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <main className="bg-cream">
        <section className="site-container flex min-h-[calc(100dvh-280px)] items-center justify-center py-20 sm:py-28" aria-labelledby="thank-you-title">
          <div className="w-full max-w-[720px] rounded-[24px] border border-ink/[.1] bg-white px-6 py-12 text-center shadow-sm sm:px-12 sm:py-16">
            <p className="eyebrow">Thank you</p>
            <h1 id="thank-you-title" className="mt-5 text-[42px] font-semibold leading-[1.08] tracking-[-0.045em] sm:text-[56px]">
              Your family trip is taking shape.
            </h1>
            <p className="mx-auto mt-6 max-w-[560px] text-base leading-7 text-muted sm:text-lg">
              We&apos;ve received your details. One of our Tanzania travel experts will be in touch shortly to start planning your safari.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/tanzania-safaris">Explore safari trips</ButtonLink>
              <ButtonLink href="/" variant="outline" className="!border-brand !bg-transparent !text-brand hover:!bg-brand/10">Return home</ButtonLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
