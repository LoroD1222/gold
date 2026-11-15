"use client";

import { useEffect, useId, useRef, useState } from "react";

const inquiryEndpoint = "/api/forms";
const formKey = "sdf_0szf-ca_naLURplsT9y-iMVO";
const attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "fbclid"] as const;
const durations = ["3 Days", "4 Days", "5 Days", "6+ Days", "Help me choose"] as const;
const travellerCounts = ["1", "2", "3", "4", "5+"] as const;

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

export function GroupSafariInquiryForm({ selectedTour, className = "" }: GroupSafariInquiryFormProps) {
  const [step, setStep] = useState<Step>(1);
  const [duration, setDuration] = useState("");
  const [travelMonth, setTravelMonth] = useState("");
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
      <section className={`rounded-[15px] border border-brand/30 bg-white p-6 text-center sm:p-8 ${className}`} aria-live="polite">
        <p className="text-lg font-semibold text-brand">Inquiry received</p>
        <h2 className="mt-3 text-2xl font-semibold leading-tight">Thank you! Our team will get in touch to help you find your group safari.</h2>
      </section>
    );
  }

  return (
    <form className={`rounded-[15px] border border-black/15 bg-white p-5 shadow-none sm:p-6 ${className}`} onSubmit={submitInquiry} aria-busy={isSubmitting} aria-labelledby={headingId} noValidate>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-brand">Group safari inquiry</p>
        <p className="text-xs font-semibold text-muted">Step {step} of 3</p>
      </div>
      <ol className="mt-3 flex gap-2" aria-label={`Step ${step} of 3`}>
        {[1, 2, 3].map((item) => <li key={item} className={`h-1 flex-1 rounded-full ${item <= step ? "bg-brand" : "bg-ink/10"}`} aria-current={item === step ? "step" : undefined} />)}
      </ol>

      {selectedTour ? <p className="mt-4 rounded-[8px] bg-sand px-3 py-2 text-sm text-muted">Selected safari: <strong className="font-semibold text-ink">{selectedTour}</strong></p> : null}

      {step === 1 ? (
        <fieldset className="inquiry-step mt-6">
          <legend id={headingId} className="text-[22px] font-semibold leading-[1.25]">What kind of safari are you looking for?</legend>
          <p className="mt-2 text-sm text-muted">Preferred safari duration</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {durations.map((option) => (
              <button key={option} type="button" aria-pressed={duration === option} onClick={() => { setDuration(option); setError(""); }} className={`min-h-16 rounded-[10px] border px-3 text-left text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${duration === option ? "border-brand bg-brand/[.12] text-ink" : "border-ink/[.12] bg-white hover:border-brand/60"}`}>
                {option}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {step === 2 ? (
        <fieldset className="inquiry-step mt-6">
          <legend id={headingId} className="text-[22px] font-semibold leading-[1.25]">When would you like to travel?</legend>
          <label className="form-field mt-5 text-sm font-semibold"><span>Preferred travel month</span><input type="month" value={travelMonth} onChange={(event) => { setTravelMonth(event.target.value); setError(""); }} disabled={flexibleDates} aria-describedby="month-help" /></label>
          <p id="month-help" className="mt-2 text-xs text-muted">A month helps us suggest suitable options; it does not reserve a departure.</p>
          <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm font-medium"><input type="checkbox" checked={flexibleDates} onChange={(event) => { setFlexibleDates(event.target.checked); setError(""); }} className="size-5 accent-brand" />I&apos;m flexible with dates</label>
          <p className="mt-5 text-sm font-semibold">Number of travelers</p>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {travellerCounts.map((option) => <button key={option} type="button" aria-pressed={travellers === option} onClick={() => { setTravellers(option); setError(""); }} className={`min-h-12 rounded-[8px] border text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${travellers === option ? "border-brand bg-brand/[.12]" : "border-ink/[.12] hover:border-brand/60"}`}>{option}</button>)}
          </div>
        </fieldset>
      ) : null}

      {step === 3 ? (
        <fieldset className="inquiry-step mt-6">
          <legend id={headingId} className="text-[22px] font-semibold leading-[1.25]">Where should we send your safari options?</legend>
          <div className="mt-5 grid gap-4">
            <label className="form-field text-sm font-semibold"><span>First name</span><input value={name} onChange={(event) => { setName(event.target.value); setError(""); }} autoComplete="given-name" placeholder="e.g. Sofia" required /></label>
            <label className="form-field text-sm font-semibold"><span>Email address</span><input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} autoComplete="email" placeholder="e.g. sofia@example.com" required /></label>
            <label className="form-field text-sm font-semibold"><span>WhatsApp number <em className="font-normal text-muted">(optional)</em></span><input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" placeholder="e.g. +1 555 019 2834" /></label>
          </div>
          <details className="mt-4 rounded-[8px] border border-ink/[.1] p-3">
            <summary className="cursor-pointer text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-brand">Additional requests <span className="font-normal text-muted">(optional)</span></summary>
            <label className="form-field mt-3 text-sm"><span className="sr-only">Additional requests</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={3} placeholder="Anything else we should know?" /></label>
          </details>
        </fieldset>
      ) : null}

      <label className="sr-only" aria-hidden="true">Leave this field empty<input value={honeypot} onChange={(event) => setHoneypot(event.target.value)} tabIndex={-1} autoComplete="off" /></label>
      {error ? <p role="alert" className="mt-4 text-sm font-medium text-red-700">{error}</p> : null}
      {status ? <p role="status" className="mt-4 text-sm text-muted">{status}</p> : null}
      <div className="mt-6 flex items-center gap-3">
        {step > 1 ? <button type="button" onClick={() => { setStep((current) => (current - 1) as Step); setError(""); }} disabled={isSubmitting} className="min-h-12 rounded-[5px] border border-ink/20 px-4 text-sm font-semibold transition hover:bg-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">Back</button> : null}
        {step < 3 ? <button type="button" onClick={continueToNextStep} className="min-h-12 flex-1 rounded-[5px] bg-gradient-to-r from-[#f2a93b] to-[#f5be2b] px-4 text-sm font-semibold transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">Continue</button> : <button type="submit" disabled={isSubmitting} className="min-h-12 flex-1 rounded-[5px] bg-gradient-to-r from-[#f2a93b] to-[#f5be2b] px-4 text-sm font-semibold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">{isSubmitting ? "Finding your safari…" : "Find My Group Safari"}</button>}
      </div>
      {step === 3 ? <p className="mt-3 text-center text-xs leading-5 text-muted">No payment required. Our local team will help you find the right safari.</p> : null}
    </form>
  );
}
