"use client";

import { useEffect, useId, useRef } from "react";
import { GroupSafariInquiryForm } from "@/components/forms/GroupSafariInquiryForm";

const inquiryLinkSelector = 'a[href="#planning"], a[href="/#planning"], a[href="#planning-again"], a[href="/#planning-again"]';

export function InquiryPopup() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    function openInquiry(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>(inquiryLinkSelector);
      if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      event.preventDefault();
      if (!dialogRef.current?.open) dialogRef.current?.showModal();
    }

    document.addEventListener("click", openInquiry, true);
    return () => document.removeEventListener("click", openInquiry, true);
  }, []);

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-1.5rem)] w-[min(100%_-_1.5rem,480px)] overflow-y-auto rounded-[18px] border-0 bg-transparent p-0 text-ink shadow-2xl backdrop:bg-black/70"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
    >
      <section className="relative rounded-[18px] bg-white p-5 sm:p-7">
        <button type="button" onClick={closeDialog} aria-label="Close inquiry form" className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-white text-2xl leading-none shadow-sm ring-1 ring-black/10 transition hover:bg-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
          ×
        </button>
        <h2 id={titleId} className="sr-only">Group safari inquiry</h2>
        <div className="pt-9">
          <GroupSafariInquiryForm className="!overflow-visible !rounded-none !border-0 !p-0 !shadow-none" />
        </div>
      </section>
    </dialog>
  );
}
