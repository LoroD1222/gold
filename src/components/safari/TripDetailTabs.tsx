"use client";

import { useEffect, useState } from "react";

type TripDetailTab = { id: string; label: string };

export function TripDetailTabs({ tabs }: { tabs: TripDetailTab[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "");

  useEffect(() => {
    const sections = tabs
      .map((tab) => document.getElementById(tab.id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection) setActiveTab(visibleSection.target.id);
      },
      { rootMargin: "-22% 0px -65% 0px", threshold: [0, 0.1, 0.3, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [tabs]);

  return (
    <nav aria-label="Trip details" className="h-[68px] overflow-hidden bg-white pt-[10px] sm:overflow-x-auto sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden">
      <div role="tablist" className="site-container flex h-full max-w-[1194px] items-stretch gap-0 sm:min-w-max sm:gap-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              role="tab"
              aria-selected={isActive}
              className="relative flex h-full min-w-0 flex-1 items-start justify-center px-0 pt-3 text-[16px] font-semibold leading-none text-black transition hover:text-black focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand sm:shrink-0 sm:flex-none sm:text-[20px] sm:first:w-[127px]"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-[6px] rounded-t-[8px] bg-brand transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`} />
            </a>
          );
        })}
      </div>
    </nav>
  );
}
