"use client";

import { useEffect } from "react";

const inquiryEndpoint = "https://safari-digital-portal.vercel.app/api/inquiries";
const formKey = "sdf_0szf-ca_naLURplsT9y-iMVO";
const attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "fbclid"] as const;

function readCookie(name: string) {
  return document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1];
}

function keepAttribution() {
  const searchParams = new URLSearchParams(window.location.search);
  const attribution = Object.fromEntries(
    attributionKeys.flatMap((key) => {
      const value = searchParams.get(key);
      return value ? [[key, value]] : [];
    }),
  );

  if (Object.keys(attribution).length) {
    sessionStorage.setItem("inquiry-attribution", JSON.stringify(attribution));
  }
}

function storedAttribution() {
  try {
    return JSON.parse(sessionStorage.getItem("inquiry-attribution") ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

export function InquiryFormHandler() {
  useEffect(() => {
    keepAttribution();

    async function submitInquiry(event: SubmitEvent) {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || !form.matches("[data-inquiry-form]")) return;

      const formData = new FormData(form);
      const name = String(formData.get("name") ?? "").trim();
      const email = String(formData.get("email") ?? "").trim();
      const phone = String(formData.get("phone") ?? "").trim();
      const contactField = form.elements.namedItem("email") as HTMLInputElement | null;

      contactField?.setCustomValidity("");
      if (!name || (!email && !phone)) {
        event.preventDefault();
        contactField?.setCustomValidity("Enter an email address or WhatsApp number.");
        contactField?.reportValidity();
        return;
      }

      event.preventDefault();
      const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      const status = form.querySelector<HTMLElement>("[data-inquiry-status]");
      form.setAttribute("aria-busy", "true");
      if (submitButton) submitButton.disabled = true;
      if (status) status.textContent = "Sending your inquiry…";

      try {
        keepAttribution();
        const response = await fetch(inquiryEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: formKey,
            name,
            email,
            phone,
            country: String(formData.get("country") ?? ""),
            interested_in: String(formData.get("interested_in") ?? ""),
            travel_dates: String(formData.get("travel_dates") ?? ""),
            travellers: String(formData.get("travellers") ?? ""),
            message: String(formData.get("message") ?? ""),
            _gotcha: String(formData.get("_gotcha") ?? ""),
            ...storedAttribution(),
            fbc: readCookie("_fbc"),
            fbp: readCookie("_fbp"),
          }),
        });

        if (!response.ok) throw new Error("The inquiry service returned an error.");
        window.location.assign(form.dataset.redirect ?? "/thank-you");
      } catch {
        if (status) status.textContent = "We couldn’t send your inquiry just now. Please try again.";
        form.removeAttribute("aria-busy");
        if (submitButton) submitButton.disabled = false;
      }
    }

    function clearContactError(event: Event) {
      const field = event.target;
      if (!(field instanceof HTMLInputElement)) return;
      const form = field.form;
      if (!form?.matches("[data-inquiry-form]")) return;

      const email = form.elements.namedItem("email") as HTMLInputElement | null;
      const phone = form.elements.namedItem("phone") as HTMLInputElement | null;
      if (email?.value.trim() || phone?.value.trim()) email?.setCustomValidity("");
    }

    document.addEventListener("submit", submitInquiry);
    document.addEventListener("input", clearContactError);
    return () => {
      document.removeEventListener("submit", submitInquiry);
      document.removeEventListener("input", clearContactError);
    };
  }, []);

  return null;
}
