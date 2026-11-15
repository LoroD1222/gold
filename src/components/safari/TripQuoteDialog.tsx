"use client";

import { useId, useRef, type ReactNode } from "react";
import { GroupSafariInquiryForm } from "@/components/forms/GroupSafariInquiryForm";

type TripQuoteDialogProps = {
  children: ReactNode;
  className?: string;
  selectedTour?: string;
};

export function TripQuoteDialog({ children, className = "", selectedTour }: TripQuoteDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()} aria-haspopup="dialog" className={className}>
        {children}
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[min(100%_-_2rem,460px)] overflow-y-auto rounded-[15px] border-0 bg-transparent p-0 text-ink shadow-2xl backdrop:bg-black/70"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
      >
        <section className="relative rounded-[15px] bg-white p-6 sm:p-8">
          <button type="button" onClick={closeDialog} aria-label="Close quote form" className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-2xl leading-none transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
            ×
          </button>
          <h2 id={titleId} className="sr-only">Group safari inquiry</h2>
          <GroupSafariInquiryForm selectedTour={selectedTour} className="border-0 p-0 shadow-none" />
        </section>
      </dialog>
    </>
  );
}
