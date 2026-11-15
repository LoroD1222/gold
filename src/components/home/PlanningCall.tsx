import Image from "next/image";
import { GroupSafariInquiryForm } from "@/components/forms/GroupSafariInquiryForm";

export function PlanningCall({
  id,
  selectedTour,
  description = "Schedule a 30-minute call to get honest advice about safaris, Kilimanjaro routes, and the best travel seasons for your family.",
}: {
  id?: string;
  selectedTour?: string;
  description?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id ?? "planning"}-title`} className="bg-sand py-12 sm:py-20">
      <div className="narrow-container">
        <div className="planning-card grid overflow-hidden rounded-[24px] border border-black/15 bg-[#fffbf6] px-6 py-8 lg:min-h-[565px] lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-4 lg:rounded-[50px] lg:px-[51px] lg:pb-[49px] lg:pt-[62px] xl:min-h-[565px] xl:grid-cols-[580px_390px]">
          <div className="max-w-[580px] lg:flex lg:flex-col lg:justify-center">
          <div className="flex items-center gap-4 lg:gap-[23px]">
            <Image src="/assets/home-consult-samson-simon.png" width={79} height={79} alt="Samson Simon" className="size-16 rounded-full object-cover sm:size-[79px]" />
            <div>
              <p className="text-xl font-semibold leading-[1.1] text-brand lg:text-[28px]">Samson Simon</p>
              <p className="text-sm font-semibold leading-[1.1] text-black/45 lg:text-[20px]">Tour Consultant and Chairperson</p>
            </div>
          </div>
          <h2 id={`${id ?? "planning"}-title`} className="mt-6 text-4xl font-semibold leading-[1.18] tracking-[-0.04em] lg:mt-[23px] lg:text-[clamp(43px,4.1vw,53px)] lg:leading-[1.15]">
            Free planning call with our Tanzania expert
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted lg:mt-[22px] lg:text-[clamp(18px,1.8vw,23px)] lg:leading-[1.4]">
            {description}
          </p>
          <div className="mt-6 flex items-center gap-3 text-sm font-semibold lg:mt-[22px] lg:gap-[13px]">
            <Image src="/assets/home-consult-img-ellipse2.png" width={47} height={47} alt="" className="size-[46.5px]" />
            <p><span className="block text-[19px] leading-[1.37] tracking-[.13em] text-brand">★★★★★</span><span className="mt-[5px] block text-[17px] leading-[1.4]">191 verified reviews on TripAdvisor</span></p>
          </div>
        </div>
        <GroupSafariInquiryForm selectedTour={selectedTour} className="mt-8 lg:mt-0" />
        </div>
      </div>
    </section>
  );
}
