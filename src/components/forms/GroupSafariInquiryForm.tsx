"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  LoaderCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Sparkles,
  User,
  Users,
} from "lucide-react";

const inquiryEndpoint = "/api/forms";
const formKey = "sdf_0szf-ca_naLURplsT9y-iMVO";
const attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "fbclid"] as const;
const durations: Array<{ value: string; description: string; popular?: boolean }> = [
  { value: "3 Days", description: "Short safari getaway" },
  { value: "4 Days", description: "Most popular choice", popular: true },
  { value: "5 Days", description: "More parks, more wildlife" },
  { value: "6+ Days", description: "The full safari experience" },
  { value: "Help me choose", description: "Get a personal recommendation" },
];
const travellerCounts = ["1", "2", "3", "4", "5+"] as const;
const travelMonths = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
] as const;
const currentYear = new Date().getFullYear();
const travelYears = Array.from({ length: 6 }, (_, index) => String(currentYear + index));
const progressSteps = [
  { full: "Your Safari", short: "Safari" },
  { full: "Travel Plans", short: "Plans" },
  { full: "Contact Details", short: "Contact" },
] as const;

type Step = 1 | 2 | 3;

type GroupSafariInquiryFormProps = {
  selectedTour?: string;
  className?: string;
};

declare global {
  interface Window {
    fbq?: (action: "track", eventName: string, parameters?: Record<string, never>, options?: { eventID: string }) => void;
  }
}

function readCookie(name: string) {
  return document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1];
}

function storeAttribution() {
  const params = new URLSearchParams(window.location.search);
  const attribution = Object.fromEntries(
    attributionKeys.flatMap((key) => {
      const value = params.get(key);
      return value ? [[key, value]] : [];
    }),
  );

  if (Object.keys(attribution).length) sessionStorage.setItem("inquiry-attribution", JSON.stringify(attribution));
}

function getAttribution() {
  try {
    return JSON.parse(sessionStorage.getItem("inquiry-attribution") ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return <p id={id} role={message ? "alert" : undefined} aria-hidden={message ? undefined : true} className={`min-h-5 pt-1 text-[11px] font-medium leading-4 transition-colors ${message ? "text-red-700" : "text-transparent"}`}>{message ?? "\u00a0"}</p>;
}

export function GroupSafariInquiryForm({ selectedTour, className = "" }: GroupSafariInquiryFormProps) {
  const [step, setStep] = useState<Step>(1);
  const [duration, setDuration] = useState("");
  const [travelMonthNumber, setTravelMonthNumber] = useState("");
  const [travelYear, setTravelYear] = useState(String(currentYear));
  const [flexibleDates, setFlexibleDates] = useState(false);
  const [travellers, setTravellers] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const headingId = useId();
  const submissionLock = useRef(false);
  const travelMonth = travelMonthNumber ? `${travelYear}-${travelMonthNumber}` : "";
  const durationError = step === 1 && error.startsWith("Choose your preferred") ? error : undefined;
  const monthError = step === 2 && error.startsWith("Select a travel month") ? error : undefined;
  const travellersError = step === 2 && error.startsWith("Choose the number") ? error : undefined;
  const nameError = step === 3 && error.startsWith("Enter your first name") ? error : undefined;
  const emailError = step === 3 && error.startsWith("Enter") && !nameError ? error : undefined;
  const submissionError = error.startsWith("We couldn’t") ? error : undefined;

  useEffect(() => {
    storeAttribution();
  }, []);

  function validateCurrentStep() {
    if (step === 1 && !duration) return "Choose your preferred safari duration to continue.";
    if (step === 2 && !flexibleDates && !travelMonth) return "Select a travel month or let us know that your dates are flexible.";
    if (step === 2 && !travellers) return "Choose the number of travelers in your party.";
    if (step === 3 && !name.trim()) return "Enter your first name so our team knows how to address you.";
    if (step === 3 && !email.trim()) return "Enter your email address so we can send your safari options.";
    if (step === 3 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email address.";
    return "";
  }

  function continueToNextStep() {
    const validationMessage = validateCurrentStep();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }
    setError("");
    setStep((current) => (current < 3 ? (current + 1) as Step : current));
  }

  async function submitInquiry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionLock.current || isSubmitting) return;
    const validationMessage = validateCurrentStep();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setError("");
    setStatus("Sending your inquiry…");
    submissionLock.current = true;
    setIsSubmitting(true);
    let submitted = false;

    try {
      storeAttribution();
      const eventId = crypto.randomUUID();
      const inquiryMessage = [
        `Safari duration: ${duration}`,
        `Travel month: ${flexibleDates ? "Flexible dates" : travelMonth}`,
        `Travelers: ${travellers}`,
        selectedTour ? `Selected safari: ${selectedTour}` : "",
        message.trim() ? `Additional requests: ${message.trim()}` : "",
      ].filter(Boolean).join("\n");
      const response = await fetch(inquiryEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: formKey,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          interested_in: selectedTour ?? "",
          selected_tour: selectedTour ?? "",
          safari_duration: duration,
          travel_month: travelMonth,
          flexible_dates: flexibleDates,
          travel_dates: flexibleDates ? "Flexible dates" : travelMonth,
          travellers,
          message: inquiryMessage,
          current_page_url: window.location.href,
          _gotcha: honeypot,
          ...getAttribution(),
          fbc: readCookie("_fbc"),
          fbp: readCookie("_fbp"),
          event_id: eventId,
        }),
      });

      if (!response.ok) throw new Error("The inquiry service returned an error.");

      // This event ID matches the server-side CAPI event for Meta's built-in deduplication.
      window.fbq?.("track", "Lead", {}, { eventID: eventId });
      submitted = true;
      setIsComplete(true);
      setStatus("");
    } catch {
      setError("We couldn’t send your inquiry just now. Please try again.");
      setStatus("");
    } finally {
      if (!submitted) submissionLock.current = false;
      setIsSubmitting(false);
    }
  }

  if (isComplete) {
    return (
      <section className={`grid min-h-[590px] place-items-center rounded-[22px] border border-brand/30 bg-[#fffefb] p-7 text-center shadow-[0_18px_45px_rgba(50,38,19,.08)] sm:p-9 ${className}`} aria-live="polite">
        <div>
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand/[.14] text-brand-dark"><BadgeCheck className="size-7" aria-hidden="true" /></span>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[.08em] text-brand-dark">Inquiry received</p>
          <h2 className="mx-auto mt-3 max-w-sm text-2xl font-semibold leading-tight">Thank you! Our team will get in touch to help you find your group safari.</h2>
        </div>
      </section>
    );
  }

  return (
    <form className={`flex min-h-[590px] flex-col rounded-[22px] border border-ink/10 bg-[#fffefb] p-5 shadow-[0_18px_45px_rgba(50,38,19,.08)] sm:p-6 ${className}`} onSubmit={submitInquiry} aria-busy={isSubmitting} aria-labelledby={headingId} noValidate>
      <div className="flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[.08em] text-brand-dark"><BadgeCheck className="size-4" aria-hidden="true" />No-obligation inquiry</p>
        <p className="text-[11px] font-semibold text-muted">Step {step} of 3</p>
      </div>

      <ol className="mt-4 grid grid-cols-3 gap-1.5" aria-label={`Step ${step} of 3`}>
        {progressSteps.map((progressStep, index) => {
          const item = index + 1;
          const isCurrent = item === step;
          const isCompleteStep = item < step;
          return (
            <li key={progressStep.full} aria-current={isCurrent ? "step" : undefined}>
              <span className={`block h-1.5 rounded-full transition-colors duration-200 ${isCompleteStep ? "bg-brand" : isCurrent ? "bg-brand-dark" : "bg-ink/10"}`} />
              <span className={`mt-1.5 block truncate text-[10px] font-semibold ${isCurrent ? "text-ink" : isCompleteStep ? "text-brand-dark" : "text-muted/70"}`}><span className="sm:hidden">{progressStep.short}</span><span className="hidden sm:inline">{progressStep.full}</span></span>
            </li>
          );
        })}
      </ol>

      {selectedTour ? <p className="mt-3 rounded-[9px] border border-brand/15 bg-brand/[.07] px-3 py-2 text-xs text-muted">Selected safari: <strong className="font-semibold text-ink">{selectedTour}</strong></p> : null}

      <div className="flex flex-1 flex-col">
        {step === 1 ? (
          <fieldset className="inquiry-step mt-5 min-w-0">
            <legend id={headingId} className="text-[22px] font-semibold leading-[1.2] tracking-[-.02em]">What kind of safari are you looking for?</legend>
            <p className="mt-1.5 text-xs text-muted">Choose your preferred safari duration.</p>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {durations.map(({ value, description, popular }) => {
                const selected = duration === value;
                return (
                  <button key={value} type="button" aria-pressed={selected} onClick={() => { setDuration(value); setError(""); }} className={`group relative flex min-h-[82px] flex-col justify-center rounded-[12px] border p-3.5 text-left transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${value === "Help me choose" ? "col-span-2 min-h-[72px]" : ""} ${selected ? "border-brand bg-[#fff7e8] shadow-[0_5px_16px_rgba(99,64,12,.07)]" : "border-ink/10 bg-white hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-[0_5px_16px_rgba(99,64,12,.06)]"}`}>
                    <span className="flex items-center gap-1.5 pr-5 text-[13px] font-semibold leading-4 text-ink">{value}{popular ? <span className="rounded-full bg-brand/[.13] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[.06em] text-brand-dark">Popular</span> : null}</span>
                    <span className="mt-1 block text-[10px] leading-4 text-muted">{description}</span>
                  </button>
                );
              })}
            </div>
            <FieldError id={`${headingId}-duration-error`} message={durationError} />
          </fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset className="inquiry-step mt-5 min-w-0">
            <legend id={headingId} className="text-[22px] font-semibold leading-[1.2] tracking-[-.02em]">When would you like to travel?</legend>
            <div className="mt-5 flex items-center justify-between gap-3">
              <div id={`${headingId}-month-label`} className="flex items-center gap-2 text-xs font-semibold text-ink"><CalendarDays className="size-[18px] text-brand-dark" aria-hidden="true" />Preferred travel month</div>
              <label className="relative shrink-0">
                <span className="sr-only">Travel year</span>
                <select value={travelYear} onChange={(event) => { setTravelYear(event.target.value); setError(""); }} disabled={flexibleDates} className="min-h-10 appearance-none rounded-[9px] border border-ink/10 bg-white py-2 pl-3 pr-9 text-xs font-semibold text-ink outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:bg-sand/60 disabled:text-muted">
                  {travelYears.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
              </label>
            </div>
            <div role="group" aria-labelledby={`${headingId}-month-label`} aria-describedby={`${headingId}-month-help ${headingId}-month-error`} className={`mt-3 grid grid-cols-4 gap-2 transition-opacity ${flexibleDates ? "pointer-events-none opacity-45" : ""}`}>
              {travelMonths.map((month) => {
                const selected = travelMonthNumber === month.value;
                return <button key={month.value} type="button" aria-pressed={selected} disabled={flexibleDates} onClick={() => { setTravelMonthNumber(month.value); setError(""); }} className={`min-h-10 rounded-[9px] border text-xs font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${selected ? "border-brand bg-[#fff7e8] text-brand-dark shadow-[0_3px_10px_rgba(99,64,12,.06)]" : "border-ink/10 bg-white hover:border-brand/50 hover:bg-brand/[.05]"}`}>{month.label}</button>;
              })}
            </div>
            <p id={`${headingId}-month-help`} className="mt-2 text-[11px] leading-4 text-muted">We&apos;ll help you find the best available group departures.</p>
            <FieldError id={`${headingId}-month-error`} message={monthError} />
            <label className="mt-1 flex min-h-12 cursor-pointer items-center gap-3 rounded-[10px] border border-ink/10 bg-white px-3.5 text-sm font-medium transition hover:border-brand/40">
              <input type="checkbox" checked={flexibleDates} onChange={(event) => { setFlexibleDates(event.target.checked); setError(""); }} className="size-5 shrink-0 accent-brand" />I&apos;m flexible with dates
            </label>
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-ink"><Users className="size-[18px] text-brand-dark" aria-hidden="true" />Number of travelers</div>
            <div className="mt-2.5 grid grid-cols-5 gap-2">
              {travellerCounts.map((option) => <button key={option} type="button" aria-pressed={travellers === option} onClick={() => { setTravellers(option); setError(""); }} className={`min-h-12 rounded-[10px] border text-sm font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${travellers === option ? "border-brand bg-[#fff7e8] text-brand-dark shadow-[0_3px_10px_rgba(99,64,12,.06)]" : "border-ink/10 bg-white hover:-translate-y-0.5 hover:border-brand/50"}`}>{option}</button>)}
            </div>
            <FieldError id={`${headingId}-travellers-error`} message={travellersError} />
          </fieldset>
        ) : null}

        {step === 3 ? (
          <fieldset className="inquiry-step mt-5 min-w-0">
            <legend id={headingId} className="text-[22px] font-semibold leading-[1.2] tracking-[-.02em]">Where should we send your safari options?</legend>
            <div className="mt-4 grid gap-1">
              <label className="text-xs font-semibold text-ink" htmlFor={`${headingId}-name`}>First name</label>
              <div className="relative"><User className="pointer-events-none absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-brand-dark" aria-hidden="true" /><input id={`${headingId}-name`} value={name} onChange={(event) => { setName(event.target.value); setError(""); }} autoComplete="given-name" placeholder="e.g. Sofia" required aria-invalid={Boolean(nameError)} aria-describedby={`${headingId}-name-error`} className="min-h-11 w-full rounded-[10px] border border-ink/10 bg-white py-2.5 pl-11 pr-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10" /></div>
              <FieldError id={`${headingId}-name-error`} message={nameError} />

              <label className="text-xs font-semibold text-ink" htmlFor={`${headingId}-email`}>Email address</label>
              <div className="relative"><Mail className="pointer-events-none absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-brand-dark" aria-hidden="true" /><input id={`${headingId}-email`} type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} autoComplete="email" placeholder="e.g. sofia@example.com" required aria-invalid={Boolean(emailError)} aria-describedby={`${headingId}-email-error`} className="min-h-11 w-full rounded-[10px] border border-ink/10 bg-white py-2.5 pl-11 pr-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10" /></div>
              <FieldError id={`${headingId}-email-error`} message={emailError} />

              <label className="text-xs font-semibold text-ink" htmlFor={`${headingId}-phone`}>WhatsApp number <span className="font-normal text-muted">(optional)</span></label>
              <div className="relative"><Phone className="pointer-events-none absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-brand-dark" aria-hidden="true" /><input id={`${headingId}-phone`} type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" placeholder="e.g. +1 555 019 2834" className="min-h-11 w-full rounded-[10px] border border-ink/10 bg-white py-2.5 pl-11 pr-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10" /></div>
            </div>
            <details className="group mt-3 rounded-[10px] border border-ink/10 bg-white transition open:border-brand/30 open:bg-[#fffdf8]">
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-3.5 text-xs font-semibold text-ink focus-visible:outline-2 focus-visible:outline-brand"><MessageSquare className="size-[17px] text-brand-dark" aria-hidden="true" />Additional requests <span className="font-normal text-muted">(optional)</span><ChevronDown className="ml-auto size-4 text-muted transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
              <label className="block px-3.5 pb-3"><span className="sr-only">Additional requests</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={3} placeholder="Anything else we should know?" className="w-full resize-y rounded-[8px] border border-ink/10 bg-white p-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10" /></label>
            </details>
          </fieldset>
        ) : null}
      </div>

      <label className="sr-only" aria-hidden="true">Leave this field empty<input value={honeypot} onChange={(event) => setHoneypot(event.target.value)} tabIndex={-1} autoComplete="off" /></label>
      <p role={submissionError ? "alert" : undefined} aria-hidden={submissionError ? undefined : true} className={`min-h-5 text-[11px] font-medium leading-4 ${submissionError ? "text-red-700" : "text-transparent"}`}>{submissionError ?? "\u00a0"}</p>
      {status ? <p role="status" className="sr-only">{status}</p> : null}
      <div className="mt-1 flex items-center gap-2.5">
        {step > 1 ? <button type="button" onClick={() => { setStep((current) => (current - 1) as Step); setError(""); }} disabled={isSubmitting} className="min-h-12 rounded-[9px] border border-ink/15 bg-white px-4 text-sm font-semibold transition duration-200 hover:border-brand/40 hover:bg-sand/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">Back</button> : null}
        {step < 3 ? <button type="button" onClick={continueToNextStep} className="min-h-12 flex-1 rounded-[9px] bg-brand px-4 text-sm font-semibold text-ink shadow-[0_5px_14px_rgba(245,166,35,.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">Continue</button> : <button type="submit" disabled={isSubmitting} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[9px] bg-brand px-4 text-sm font-semibold text-ink shadow-[0_5px_14px_rgba(245,166,35,.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-brand-dark disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">{isSubmitting ? <><LoaderCircle className="size-4 animate-spin" aria-hidden="true" />Finding your safari…</> : "Find My Group Safari"}</button>}
      </div>
      {step === 3 ? (
        <div className="mt-3 grid grid-cols-3 gap-1.5 border-t border-ink/[.07] pt-3 text-center text-[9px] font-medium leading-3 text-muted">
          <span className="flex flex-col items-center gap-1"><CircleDollarSign className="size-4 text-brand-dark" aria-hidden="true" />No payment required</span>
          <span className="flex flex-col items-center gap-1"><MapPin className="size-4 text-brand-dark" aria-hidden="true" />Local team in Arusha</span>
          <span className="flex flex-col items-center gap-1"><Sparkles className="size-4 text-brand-dark" aria-hidden="true" />Personal recommendations</span>
        </div>
      ) : null}
    </form>
  );
}
