"use client";

import { useId, useRef, type ReactNode } from "react";

type TripQuoteDialogProps = {
  children: ReactNode;
  className?: string;
};

export function TripQuoteDialog({ children, className = "" }: TripQuoteDialogProps) {
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
          <p className="text-[18px] font-semibold text-brand">Get Started</p>
          <h2 id={titleId} className="mt-[10px] pr-10 text-[26px] font-semibold leading-[1.25]">
            Tell us about your family, we&apos;ll build the trip
          </h2>
          <form className="mt-6 grid gap-3" action="https://api.web3forms.com/submit" method="post">
            <input type="hidden" name="access_key" value="9da46659-7080-4382-9076-c9e92dffe2a2" />
            <label className="form-field"><span>First Name</span><input name="firstName" autoComplete="given-name" placeholder="e.g. Sofia" required /></label>
            <label className="form-field"><span>Email Address</span><input type="email" name="email" autoComplete="email" placeholder="e.g. sofia@example.com" required /></label>
            <label className="form-field"><span>WhatsApp Number</span><input type="tel" name="phone" autoComplete="tel" placeholder="e.g. +1 (555) 019-2834" /></label>
            <label className="form-field"><span>Message</span><textarea name="message" rows={3} placeholder="Tell us about your ideal trip" required /></label>
            <button type="submit" className="mt-1 min-h-[47px] w-full rounded-[5px] bg-gradient-to-r from-[#f2a93b] to-[#f5be2b] px-4 py-3 text-[16px] font-semibold transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
              Start Planning My Family&apos;s Trip
            </button>
          </form>
        </section>
      </dialog>
    </>
  );
}
