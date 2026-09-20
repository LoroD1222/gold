import Image from "next/image";
import Link from "next/link";
import { MobileMenu } from "./MobileMenu";

const links = [
  ["All Trips", "/tanzania-safaris"],
  ["Safaris", "/tanzania-safaris"],
  ["Kilimanjaro", "/#destinations"],
  ["Zanzibar", "/#destinations"],
  ["Contact", "/#contact"],
] as const;

export function Header({ overlay = false }: { overlay?: boolean }) {
  return (
    <header className={`${overlay ? "absolute inset-x-0 top-0 z-30 text-white" : "relative z-30 bg-cream text-ink"}`}>
      <div className="site-container flex h-24 items-center justify-between gap-8 lg:h-[104px]">
        <Link href="/" aria-label="Golden Trips Tanzania home" className="relative block h-[58px] w-[154px] shrink-0 sm:h-[64px] sm:w-[168px]">
          <Image src={overlay ? "/assets/golden-trips-white-logo.png" : "/assets/home-header-img-image1.png"} alt="Golden Trips Tanzania" fill sizes="168px" className="object-contain" priority />
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-8 text-sm font-medium lg:flex">
          {links.map(([label, href]) => (
            <Link key={label} href={href} className="rounded-sm py-2 transition hover:text-brand focus-visible:outline-2 focus-visible:outline-brand">
              {label}
            </Link>
          ))}
          <Link href="/#planning" className="ml-3 rounded-md bg-brand px-7 py-4 font-semibold text-ink transition hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
            Plan your trip
          </Link>
        </nav>
        <MobileMenu light={overlay} />
      </div>
    </header>
  );
}
