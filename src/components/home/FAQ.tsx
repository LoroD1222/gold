import { faqs } from "@/data/faq";
import { ButtonLink } from "@/components/ui/ButtonLink";
import Image from "next/image";

export function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-[#fffdf8] py-20 pb-12 sm:py-28 sm:pb-16">
      <div className="site-container grid gap-12 lg:grid-cols-[360px_1fr] lg:gap-20">
        <div>
          <p className="eyebrow">Good To Know</p>
          <h2 id="faq-title" className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em]">Frequently Asked Questions</h2>
          <p className="mt-5 max-w-sm leading-7 text-muted">Answers to the questions families ask us most before booking a safari.</p>
          <ButtonLink href="#planning" className="mt-7">Plan your family trip</ButtonLink>
        </div>
        <div className="space-y-3">
          {faqs.map((item, index) => (
            <details key={item.question} open={index === 0} className="group rounded-lg border border-ink/10 bg-white shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 font-semibold focus-visible:outline-2 focus-visible:outline-brand">
                {item.question}
                <span aria-hidden className="grid size-[33px] shrink-0 place-items-center rounded-full bg-brand transition group-open:rotate-180">
                  <Image src="/assets/home-faq-img-arrow-drop-down-svgrepo-com1.svg" width={33} height={33} alt="" />
                </span>
              </summary>
              <p className="px-5 pb-6 leading-7 text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
