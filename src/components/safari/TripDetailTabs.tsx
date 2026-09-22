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
    <nav aria-label="Trip details" className="mb-12 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div role="tablist" className="flex min-w-max items-center gap-1 border-b border-ink/10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              role="tab"
              aria-selected={isActive}
              className="relative px-5 py-4 text-sm font-semibold text-ink transition hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand sm:px-6 sm:text-base"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span aria-hidden="true" className={`absolute inset-x-5 bottom-0 h-[3px] rounded-t-full bg-brand transition-opacity sm:inset-x-6 ${isActive ? "opacity-100" : "opacity-0"}`} />
            </a>
          );
        })}
      </div>
    </nav>
  );
}
