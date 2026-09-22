import Image from "next/image";
import Link from "next/link";
import { tripadvisorProfileUrl } from "@/data/externalLinks";
import { ButtonLink } from "@/components/ui/ButtonLink";

const exploreLinks = [
  ["All Trips", "/tanzania-safaris"],
  ["Safaris", "/tanzania-safaris"],
  ["Kilimanjaro", "/#destinations"],
  ["Zanzibar", "/#destinations"],
  ["Contact", "/#contact"],
] as const;

const planLinks = [
  ["Family Safaris", "/tanzania-safaris"],
  ["Safety First", "/#safety"],
  ["Destinations", "/#destinations"],
  ["Guides", "/#guides"],
  ["FAQ", "/#faq"],
] as const;

export function Footer() {
  return (
    <footer id="contact" className="bg-[#fffdf8] pb-8 pt-12 sm:pt-16 lg:pt-[72px]">
      <div className="site-container">
        <section aria-labelledby="ready-title" className="relative left-1/2 w-[calc(100vw-2rem)] max-w-[1114px] -translate-x-1/2 sm:w-[calc(100vw-4rem)] lg:w-[calc(100vw-6rem)] lg:aspect-[1114/593]">
          <div className="relative rounded-[24px] bg-sand px-6 py-8 sm:px-10 sm:py-12 lg:aspect-[1114/347] lg:px-0 lg:py-0">
            <div className="relative mb-8 aspect-[460/527] overflow-hidden rounded-[14px] lg:absolute lg:left-[1.9749%] lg:top-[7.781%] lg:mb-0 lg:w-[41.293%]">
              <Image
                src="/assets/home-footer-img-joeh-wildlifephoto-just-marrired301.jpg"
                alt="Travelers seated on a Golden Trips Tanzania safari vehicle"
                fill
                unoptimized
                sizes="(max-width: 1023px) calc(100vw - 4rem), (max-width: 1600px) 42vw, 595px"
                className="object-cover object-[53%_39%] lg:scale-[1.067]"
              />
            </div>

            <div className="lg:absolute lg:left-[48.025%] lg:top-[19.596%] lg:w-[50.538%]">
              <h2 id="ready-title" className="text-4xl font-bold leading-[1.2] tracking-[-0.04em] lg:text-[37px]">
                Ready to plan your safari?
              </h2>
              <p className="mt-5 text-lg leading-[1.6] text-black/[.54] lg:mt-7 lg:text-[22px]">
                Our tanzania travel experts craft personalized, tailor-made itineraries designed just for you.
              </p>
              <ButtonLink href="/#planning" className="mt-7 min-h-[51px] w-[248px] rounded-[5px] px-4 py-2 text-[18px] !bg-[linear-gradient(to_right,#f2a93b,#f5be2b)] hover:brightness-95">
                Plan your family trip
              </ButtonLink>
            </div>
          </div>

          <div className="mt-8 grid gap-8 pt-5 sm:grid-cols-2 lg:absolute lg:left-[48.025%] lg:top-[64.081%] lg:mt-0 lg:w-[50.538%] lg:gap-[10.3%]">
            <ContactMethod
              icon="/assets/home-footer-img-group1321315498.svg"
              label="Contact on Whatsapp"
              href="https://wa.me/255761575951?text=Hello%21%20I%27m%20interested%20in%20booking%20a%20safari.%20Can%20you%20help%20me%3F"
              value="+255 761 575 951"
              detail="Available 7 days a week"
            />
            <ContactMethod
              icon="/assets/home-footer-img-group1321315499.svg"
              label="Email us at"
              href="mailto:info@goldentrips.com"
              value="info@goldentrips.com"
              detail="Custom itinerary in 24 hours"
            />
          </div>
        </section>

        <ReviewPlatforms />

        <div className="rounded-[24px] border border-black/[.08] bg-sand p-6 sm:p-10">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-10 xl:justify-between">
            <div className="w-full lg:w-[360px] lg:shrink-0">
              <Link href="/" aria-label="Golden Trips Tanzania home">
                <Image
                  src="/assets/home-footer-img-footer-logo.png"
                  width={183}
                  height={70}
                  alt="Golden Trips Tanzania"
                  className="h-auto w-[183px]"
                />
              </Link>
              <p className="mt-4 text-[16px] leading-[1.68] text-black/[.64]">
                Family safaris designed around your whole group, with private vehicles, flexible pacing, and guides who explain the journey in a way every age can enjoy.
              </p>
              <a
                href={tripadvisorProfileUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-3 text-[16px] font-bold leading-[1.68] text-brand underline decoration-1 underline-offset-2"
              >
                <Image src="/assets/home-footer-img-ellipse.png" width={47} height={47} alt="" />
                Read more on Trip Advisor
              </a>
            </div>

            <nav aria-label="Footer navigation" className="grid gap-10 sm:grid-cols-3 lg:min-w-0 lg:flex-1 lg:gap-8 xl:w-[704px] xl:flex-none xl:gap-[72px]">
              <FooterColumn title="Explore" links={exploreLinks} />
              <FooterColumn title="Plan" links={planLinks} />
              <div className="min-w-0">
                <p className="text-[18px] font-bold uppercase leading-[1.68] tracking-[.08em] text-brand">Contact</p>
                <address className="mt-[14px] space-y-[14px] text-[16px] not-italic leading-[1.68] text-ink">
                  <p><a href="tel:+255761575951" className="hover:text-brand">+255 761 575 951</a></p>
                  <p><a href="mailto:info@goldentrips.com" className="break-words hover:text-brand">info@goldentrips.com</a></p>
                  <p>WhatsApp support</p>
                  <p>Custom itinerary in 24 hours</p>
                  <p>Available 7 days a week</p>
                </address>
              </div>
            </nav>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-black/[.12] pt-6 text-[14px] leading-[1.68] text-black/[.55] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Golden Trips Tanzania. All rights reserved.</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/" className="hover:text-brand">Privacy Policy</Link>
              <Link href="/" className="hover:text-brand">Terms of Service</Link>
              <Link href="/" className="hover:text-brand">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ContactMethod({
  icon,
  label,
  href,
  value,
  detail,
}: {
  icon: string;
  label: string;
  href: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="flex flex-col items-center gap-[5px] text-center sm:items-start sm:text-left">
      <Image src={icon} width={52} height={52} alt="" />
      <p className="text-[17px] font-semibold leading-[1.68] lg:text-[19px]">{label}</p>
      <a href={href} className="text-[17px] font-bold leading-[1.68] underline decoration-1 underline-offset-2 lg:text-[19px]">{value}</a>
      <p className="text-[17px] leading-[1.68] text-black/[.63] lg:text-[19px]">{detail}</p>
    </div>
  );
}

function ReviewPlatforms() {
  return (
    <section aria-label="Review platforms" className="mb-16 mt-14 lg:mb-[117px] lg:mt-[83px]">
      <div className="mx-auto grid max-w-[790px] items-end gap-10 sm:grid-cols-3 sm:gap-6 lg:grid-cols-[165px_155px_246px] lg:gap-x-[112px]">
        <div className="flex flex-col items-center gap-[17px]">
          <div className="flex h-[78px] w-[164px] flex-col items-center">
            <Image src="/assets/home-footer-img-group.svg" width={164} height={56} alt="Google" />
            <p className="mt-[3px] text-[15px] font-medium leading-[1.28] text-[#655757]">Verified Reviews</p>
          </div>
          <Image src="/assets/home-footer-img-frame1321315446.svg" width={146} height={26} alt="Five-star rating" />
          <p className="text-center text-[15px] font-bold leading-[1.28]">69 reviews</p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Image src="/assets/home-footer-img-image65.png" width={89} height={106} alt="Tripadvisor" className="h-[106px] w-[89px] object-contain" />
          <Image src="/assets/home-footer-img-frame1321315446.svg" width={146} height={26} alt="Five-star rating" />
          <p className="whitespace-nowrap text-center text-[15px] font-bold leading-[1.28]">191 verified reviews</p>
        </div>

        <div className="flex flex-col items-center gap-[17px]">
          <Image src="/assets/home-footer-img-pasted-image21.png" width={246} height={78} alt="SafariBookings.com" className="h-[78px] w-[246px] object-cover object-top" />
          <Image src="/assets/home-footer-img-frame1321315446.svg" width={146} height={26} alt="4.9 out of 5 stars" />
          <p className="whitespace-nowrap text-center text-[15px] font-bold leading-[1.28]">216 reviews</p>
        </div>
      </div>
    </section>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly (readonly [string, string])[] }) {
  return (
    <div className="w-full xl:w-[170px]">
      <p className="text-[18px] font-bold uppercase leading-[1.68] tracking-[.08em] text-brand">{title}</p>
      <ul className="mt-[14px] space-y-[14px] text-[16px] leading-[1.68] text-ink">
        {links.map(([label, href]) => (
          <li key={label}><Link href={href} className="hover:text-brand">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
