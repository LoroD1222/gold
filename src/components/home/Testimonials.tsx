import Image from "next/image";
import { CompactTestimonialsCarousel } from "@/components/home/CompactTestimonialsCarousel";
import { testimonials } from "@/data/testimonials";
import { tripadvisorProfileUrl } from "@/data/externalLinks";

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
          <p className="mt-[15px] text-base font-medium leading-[1.68] text-black/75">{review.text}</p>
          <a href={tripadvisorProfileUrl} target="_blank" rel="noreferrer" className="mt-[15px] inline-flex items-center gap-2.5 text-base font-bold leading-[1.68] text-black/75 underline underline-offset-4">
            <Image src="/assets/home-testimonials-img-ellipse2.png" width={47} height={47} alt="Tripadvisor" className="size-[46.5px]" />
            Read more on Trip Advisor
          </a>
        </article>
      ))}
    </div>
  );

  const continuationCards = (
    <div aria-hidden="true" className="grid gap-6 md:grid-cols-2 md:gap-[27px]">
      {[
        ["/assets/review-continuation-1.png", "/assets/review-continuation-2.png"],
        ["/assets/review-continuation-3.png", "/assets/review-continuation-4.png"],
      ].map((images, cardIndex) => (
        <article key={images[0]} className="rounded-[12px] bg-sand p-5 sm:h-[669px] sm:p-[30px]">
          <div className="grid grid-cols-2 gap-3.5">
            {images.map((src) => (
              <div key={src} className="relative aspect-[1.11] overflow-hidden rounded-lg sm:h-[199px] sm:aspect-auto">
                <Image src={src} alt="" fill sizes="(max-width: 768px) 40vw, 221px" className="object-cover" />
              </div>
            ))}
          </div>
          <div className="mt-9 flex items-end gap-[13px]">
            <Image src={testimonials[cardIndex + 2].avatar} alt="" width={65} height={65} className="size-[65px] rounded-full object-cover" />
            <Image src="/assets/home-testimonials-img-frame1321315437.svg" width={146} height={26} alt="" className="h-[26px] w-[146px]" />
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <section id={sectionId} aria-labelledby="reviews-title" className={`scroll-mt-28 ${compact ? "bg-cream pb-20 pt-12 sm:pb-28 sm:pt-16" : "bg-cream pb-16 pt-20 sm:pb-20 sm:pt-28"}`}>
      <div className="site-container">
        {compact ? (
          <div className="mx-auto text-center">
            <p className="eyebrow !tracking-[0px]">Verified Family Reviews</p>
            <h2 id="reviews-title" className="mt-4 text-4xl font-semibold leading-tight tracking-[0px] text-ink lg:text-[46px]">The trips that became family stories</h2>
          </div>
        ) : (
          <div className="mx-auto text-center">
            <p className="text-[18px] font-bold uppercase leading-5 tracking-[0px] text-[#f2a93b]">Verified Family Reviews</p>
            <h2 id="reviews-title" className="mt-[23px] text-4xl font-semibold leading-tight tracking-[0px] text-ink lg:text-[53px]">The trips that became family stories</h2>
          </div>
        )}
        <p className={`${compact ? "mt-5 text-sm font-semibold" : "mt-8 text-base font-medium"} text-center`}><span aria-hidden="true" className="mr-1 inline-block align-[-3px] text-[26px] leading-none text-brand">★</span>190 Reviews on <a href={tripadvisorProfileUrl} target="_blank" rel="noreferrer" className="font-bold underline">Trip advisor</a></p>
        {compact ? (
          <CompactTestimonialsCarousel reviews={testimonials} />
        ) : (
          <div className="mx-auto mt-14 max-w-[1061px]">
            {reviewCards}
            <div className="relative mt-[27px] h-[250px] overflow-hidden sm:h-[280px]">
              {continuationCards}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[165px] bg-gradient-to-b from-transparent via-cream/85 to-cream" />
            </div>
            <p className="relative z-10 -mt-10 text-center text-base font-medium"><span aria-hidden="true" className="mr-1 inline-block align-[-3px] text-[26px] leading-none text-brand">★</span>190 Reviews on <a href={tripadvisorProfileUrl} target="_blank" rel="noreferrer" className="font-bold underline">Trip advisor</a></p>
          </div>
        )}
      </div>
    </section>
  );
}
