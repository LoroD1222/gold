"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  ["All Trips", "/tanzania-safaris"],
  ["Reviews", "/#reviews"],
  ["Destinations", "/#destinations"],
  ["Contact", "/#contact"],
] as const;

export function MobileMenu({ light = false }: { light?: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen((value) => !value)}
        className={`relative z-50 grid size-11 place-items-center rounded-full border focus-visible:outline-2 focus-visible:outline-brand ${light && !open ? "border-white/50 text-white" : "border-ink/15 bg-cream text-ink"}`}
      >
        <span aria-hidden className="text-2xl leading-none">{open ? "×" : "☰"}</span>
      </button>
      {open ? (
        <div id="mobile-navigation" className="fixed inset-0 z-40 bg-cream px-6 pb-8 pt-28 text-ink">
          <nav aria-label="Mobile navigation" className="mx-auto flex max-w-md flex-col gap-2">
            {links.map(([label, href]) => (
              <Link key={label} href={href} onClick={() => setOpen(false)} className="border-b border-ink/10 py-4 text-2xl font-semibold">
                {label}
              </Link>
            ))}
            <Link href="/#planning" onClick={() => setOpen(false)} className="mt-6 rounded-md bg-gradient-to-r from-[#f2a93b] to-[#f5be2b] px-6 py-4 text-center font-semibold transition hover:brightness-95">
              Start planning
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
