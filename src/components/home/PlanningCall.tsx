import Image from "next/image";

export function PlanningCall({ id }: { id?: string }) {
  return (
    <section id={id} aria-labelledby={`${id ?? "planning"}-title`} className="bg-sand py-12 sm:py-20">
      <div className="narrow-container">
        <div className="planning-card grid overflow-hidden rounded-[24px] border border-black/15 bg-[#fffbf6] px-6 py-8 lg:min-h-[565px] lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-4 lg:rounded-[50px] lg:px-[51px] lg:pb-[49px] lg:pt-[62px] xl:h-[565px] xl:grid-cols-[580px_390px]">
          <div className="max-w-[580px]">
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
            Schedule a 30-minute call to get honest advice about safaris, Kilimanjaro routes, and the best travel seasons for your family.
          </p>
          <div className="mt-6 flex items-center gap-3 text-sm font-semibold lg:mt-[22px] lg:gap-[13px]">
            <Image src="/assets/home-consult-img-ellipse2.png" width={47} height={47} alt="" className="size-[46.5px]" />
            <p><span className="block text-[19px] leading-[1.37] tracking-[.13em] text-brand">★★★★★</span><span className="mt-[5px] block text-[17px] leading-[1.4]">191 verified reviews on TripAdvisor</span></p>
          </div>
        </div>
        <form className="mt-8 rounded-[15px] border border-black/20 bg-white p-5 shadow-none lg:mt-0 lg:h-[454px] lg:p-6" action="#" method="post">
          <p className="text-sm font-semibold text-brand lg:text-[18px]">Get Started</p>
          <p className="mt-3 text-xl font-semibold leading-tight lg:text-[23px] lg:leading-[1.3]">Tell us about your family,<br />we&apos;ll build the trip</p>
          <div className="mt-6 grid gap-3">
            <label className="form-field text-[13px] font-semibold">
              <span>First Name</span>
              <input className="!rounded-[8px] !border-[#f3e7d4] !shadow-none" name="firstName" autoComplete="given-name" placeholder="e.g. Sofia" />
            </label>
            <label className="form-field text-[13px] font-semibold">
              <span>Email Address</span>
              <input className="!rounded-[8px] !border-[#f3e7d4] !shadow-none" type="email" name="email" autoComplete="email" placeholder="e.g. sofia@example.com" />
            </label>
            <label className="form-field text-[13px] font-semibold">
              <span>WhatsApp Number</span>
              <input className="!rounded-[8px] !border-[#f3e7d4] !shadow-none" type="tel" name="phone" autoComplete="tel" placeholder="e.g. +1 (555) 019-2834" />
            </label>
          </div>
          <button type="submit" className="mt-4 min-h-11 w-full rounded-[5px] bg-gradient-to-r from-[#f2a93b] to-[#f5be2b] px-4 py-3 text-sm !font-semibold transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
            Start Planning My Family&apos;s Trip
          </button>
        </form>
        </div>
      </div>
    </section>
  );
}
