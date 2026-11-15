import Image from "next/image";
import { GroupSafariInquiryForm } from "@/components/forms/GroupSafariInquiryForm";

export function PlanningCall({
  id,
  selectedTour,
  description = "Schedule a 30-minute call for honest advice about safaris, Kilimanjaro routes, Zanzibar, and the best travel seasons for you.",
}: {
  id?: string;
  selectedTour?: string;
  description?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id ?? "planning"}-title`} className="bg-sand py-10 sm:py-16 lg:py-20">
      <div className="narrow-container">
        <div className="planning-card grid overflow-hidden rounded-[24px] border border-black/10 bg-[#fffbf6] px-4 py-5 shadow-[0_16px_45px_rgba(50,38,19,.05)] sm:px-6 sm:py-7 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center lg:gap-9 lg:rounded-[34px] lg:px-10 lg:py-10 xl:grid-cols-[minmax(0,1fr)_460px] xl:gap-12 xl:px-12">
          <div className="order-2 mt-9 max-w-[520px] lg:order-1 lg:mt-0 lg:py-5">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-brand/[.12] p-1.5 ring-1 ring-brand/20">
                <Image src="/assets/home-consult-samson-simon.png" width={79} height={79} alt="Samson Simon" className="size-16 rounded-full object-cover sm:size-[72px]" />
              </div>
              <div>
                <p className="text-xl font-semibold leading-[1.1] text-brand-dark sm:text-[24px]">Samson Simon</p>
                <p className="mt-1 text-xs font-semibold leading-[1.35] text-black/50 sm:text-sm">Tour Consultant and Chairperson</p>
              </div>
            </div>
            <h2 id={`${id ?? "planning"}-title`} className="mt-6 text-[34px] font-semibold leading-[1.12] tracking-[-0.04em] sm:text-[40px] lg:text-[44px]">
              Free planning call with our Tanzania expert
            </h2>
            <p className="mt-4 text-base leading-7 text-muted sm:text-lg sm:leading-8">
              {description}
            </p>
            <div className="mt-5 flex items-center gap-3 rounded-[14px] border border-black/[.06] bg-white/70 p-3 text-sm font-semibold sm:w-fit sm:pr-5">
              <Image src="/assets/home-consult-img-ellipse2.png" width={47} height={47} alt="" className="size-10 shrink-0 sm:size-[46px]" />
              <p><span className="block text-[16px] leading-none tracking-[.12em] text-brand">★★★★★</span><span className="mt-1.5 block text-xs leading-[1.35] text-ink sm:text-sm">191 verified reviews on TripAdvisor</span></p>
            </div>
          </div>
          <GroupSafariInquiryForm selectedTour={selectedTour} className="order-1 lg:order-2" />
        </div>
      </div>
    </section>
  );
}
