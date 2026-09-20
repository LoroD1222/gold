import Image from "next/image";
import { CompactTestimonialsCarousel } from "@/components/home/CompactTestimonialsCarousel";
import { testimonials } from "@/data/testimonials";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Testimonials({ compact = false, sectionId }: { compact?: boolean; sectionId?: string }) {
  const reviewCards = (
    <div className="grid gap-6 md:grid-cols-2 md:gap-[27px]">
      {testimonials.map((review) => (
        <article key={review.id} className="rounded-[12px] bg-sand p-5 sm:min-h-[669px] sm:p-[30px]">
          <div className="grid grid-cols-2 gap-3.5">
            {review.images.map((src, index) => (
              <div key={src} className="relative aspect-[1.11] overflow-hidden rounded-lg sm:h-[199px] sm:aspect-auto">
                <Image src={src} alt={index === 0 ? `Family safari experience shared by ${review.name}` : "Tanzania landscape from a family safari"} fill sizes="(max-width: 768px) 40vw, 221px" className="object-cover" />
              </div>
            ))}
          </div>
          <div className="mt-9 flex items-end gap-[13px]">
            <Image src={review.avatar} alt="" width={65} height={65} className="size-[65px] rounded-full object-cover" />
            <div>
              <Image src="/assets/home-testimonials-img-frame1321315437.svg" width={146} height={26} alt="5 out of 5 stars" className="h-[26px] w-[146px]" />
              <p className="mt-[3px] text-base leading-[1.68] text-black/75"><strong>{review.name} / </strong><span className="text-black/30">{review.date}</span></p>
            </div>
          </div>
          <h3 className="mt-[15px] text-xl font-bold leading-[1.68] text-black/75">{review.title}</h3>
          <p className="mt-[15px] text-base leading-[1.68] text-black/75">{review.text}</p>
          <a href="https://www.tripadvisor.com/" className="mt-[15px] inline-flex items-center gap-2.5 text-base font-bold leading-[1.68] text-black/75 underline underline-offset-4">
            <Image src="/assets/home-testimonials-img-ellipse2.png" width={47} height={47} alt="Tripadvisor" className="size-[46.5px]" />
            Read more on Trip Advisor
          </a>
        </article>
      ))}
    </div>
  );

  return (
    <section id={sectionId} aria-labelledby="reviews-title" className={`scroll-mt-28 ${compact ? "bg-cream pb-20 pt-12 sm:pb-28 sm:pt-16" : "bg-cream py-20 sm:py-28"}`}>
      <div className="site-container">
        <SectionHeading eyebrow="Verified Family Reviews" title="The trips that became family stories" id="reviews-title" align="center" />
        <p className="mt-5 text-center text-sm font-semibold"><span className="text-brand">★</span> 191 Verified Reviews on <span className="underline">Trip advisor</span></p>
        {compact ? (
          <CompactTestimonialsCarousel reviews={testimonials} />
        ) : (
          <>
            <div className="relative mx-auto mt-14 h-[2400px] max-w-[1061px] overflow-hidden md:h-[1735px]">
              {reviewCards}
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[440px] bg-gradient-to-b from-cream/0 via-cream/85 to-cream" />
              <p className="absolute inset-x-0 bottom-12 z-10 text-center text-sm font-semibold"><span className="text-brand">★</span> 191 Verified Reviews on <span className="underline">Trip advisor</span></p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
