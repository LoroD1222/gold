const RESEND_EMAILS_ENDPOINT = "https://api.resend.com/emails";
const DAR_ES_SALAAM_TIME_ZONE = "Africa/Dar_es_Salaam";

export type InquiryEmailData = Record<string, unknown>;

const fieldLabels: Record<string, string> = {
  key: "Form key",
  name: "Name",
  email: "Email",
  phone: "Phone / WhatsApp",
  country: "Country",
  interested_in: "Interested in",
  selected_tour: "Selected tour",
  safari_duration: "Safari duration",
  travel_month: "Travel month",
  flexible_dates: "Flexible dates",
  travel_dates: "Travel dates",
  travellers: "Travellers",
  adults: "Adults",
  children: "Children",
  budget_per_person: "Budget per person",
  message: "Message",
  current_page_url: "Page URL",
  utm_source: "UTM source",
  utm_medium: "UTM medium",
  utm_campaign: "UTM campaign",
  fbclid: "Facebook click ID",
  fbc: "Facebook browser ID",
  fbp: "Facebook pixel ID",
  event_id: "Event ID",
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    "\"": "&quot;",
  })[character] ?? character);
}

function formatLabel(key: string) {
  return fieldLabels[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatValue(value: unknown) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (value === null || value === undefined) return "";

  return JSON.stringify(value);
}

function errorMessage(body: string, status: number) {
  try {
    const parsed = JSON.parse(body) as { message?: unknown; error?: { message?: unknown } | unknown };
    if (typeof parsed.message === "string") return parsed.message;
    if (parsed.error && typeof parsed.error === "object" && "message" in parsed.error && typeof parsed.error.message === "string") {
      return parsed.error.message;
    }
  } catch {
    // Use the status below when Resend did not return JSON.
  }

  return body || `Resend returned HTTP ${status}.`;
}

/** Sends one internal notification for a validated guest inquiry. This module is only imported by a Route Handler. */
export async function sendInquiryEmail(data: InquiryEmailData) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.INQUIRY_FROM;
  const recipients = (process.env.INQUIRY_TO ?? "").split(",").map((address) => address.trim()).filter(Boolean);

  if (!apiKey || !from || recipients.length === 0) {
    throw new Error("Resend configuration is incomplete: RESEND_API_KEY, INQUIRY_FROM, and INQUIRY_TO are required.");
  }

  const fields = Object.entries(data)
    .map(([key, value]) => ({ label: formatLabel(key), value: formatValue(value) }))
    .filter(({ value }) => value.length > 0);
  const submittedAt = new Intl.DateTimeFormat("en-GB", {
    timeZone: DAR_ES_SALAAM_TIME_ZONE,
    dateStyle: "full",
    timeStyle: "long",
  }).format(new Date());
  const guestName = formatValue(data.name).replace(/[\r\n]+/g, " ") || "Guest";
  const trip = formatValue(data.selected_tour || data.interested_in || data.safari_duration).replace(/[\r\n]+/g, " ") || "Safari inquiry";
  const phoneDigits = formatValue(data.phone).replace(/\D/g, "");
  const rows = fields.map(({ label, value }) => `<tr><th align="left" style="padding:8px 12px 8px 0;vertical-align:top">${escapeHtml(label)}</th><td style="padding:8px 0;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join("");
  const whatsappHtml = phoneDigits
    ? `<p><a href="https://wa.me/${phoneDigits}">Reply on WhatsApp</a></p>`
    : "";
  const whatsappText = phoneDigits ? `\nReply on WhatsApp: https://wa.me/${phoneDigits}` : "";
  const textFields = fields.map(({ label, value }) => `${label}: ${value}`).join("\n");
  const email = formatValue(data.email);

  const response = await fetch(RESEND_EMAILS_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: recipients,
      ...(email ? { reply_to: email } : {}),
      subject: `New inquiry: ${guestName} · ${trip}`,
      html: `<h1>New safari inquiry</h1><table>${rows}<tr><th align="left" style="padding:8px 12px 8px 0;vertical-align:top">Submitted at</th><td style="padding:8px 0">${escapeHtml(submittedAt)} (${DAR_ES_SALAAM_TIME_ZONE})</td></tr></table>${whatsappHtml}`,
      text: `New safari inquiry\n\n${textFields}\nSubmitted at: ${submittedAt} (${DAR_ES_SALAAM_TIME_ZONE})${whatsappText}`,
    }),
  });

  if (!response.ok) {
    throw new Error(errorMessage(await response.text(), response.status));
  }
}
