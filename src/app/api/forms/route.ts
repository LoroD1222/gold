import { NextResponse } from "next/server";

const inquiryEndpoint = "https://safari-digital-portal.vercel.app/api/inquiries";
const metaPixelId = "1671525991172204";

type InquiryPayload = {
  key: string;
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  interested_in?: string;
  travel_dates?: string;
  travellers?: string;
  message?: string;
  _gotcha?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  fbclid?: string;
  fbc?: string;
  fbp?: string;
  event_id?: string;
};

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || undefined;
}

async function sendMetaLead(request: Request, inquiry: InquiryPayload) {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  const eventId = stringValue(inquiry.event_id);
  if (!accessToken || !eventId) return;

  const email = stringValue(inquiry.email).toLowerCase();
  const phone = stringValue(inquiry.phone).replace(/\D/g, "");
  const [firstName = "", ...lastNameParts] = stringValue(inquiry.name).toLowerCase().split(/\s+/);
  const ipAddress = clientIp(request);
  const userAgent = request.headers.get("user-agent");
  const userData: Record<string, string | string[]> = {};

  if (ipAddress) userData.client_ip_address = ipAddress;
  if (userAgent) userData.client_user_agent = userAgent;

  if (email) userData.em = [await sha256(email)];
  if (phone) userData.ph = [await sha256(phone)];
  if (firstName) userData.fn = [await sha256(firstName)];
  if (lastNameParts.length) userData.ln = [await sha256(lastNameParts.join(" "))];

  const fbc = stringValue(inquiry.fbc);
  const fbp = stringValue(inquiry.fbp);
  if (fbc) userData.fbc = fbc;
  if (fbp) userData.fbp = fbp;

  const payload = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1_000),
        event_id: eventId,
        event_source_url: request.headers.get("referer") ?? "https://goldentrips.com",
        action_source: "website",
        user_data: userData,
      },
    ],
    ...(process.env.META_CAPI_TEST_EVENT_CODE ? { test_event_code: process.env.META_CAPI_TEST_EVENT_CODE } : {}),
  };

  const response = await fetch(`https://graph.facebook.com/v24.0/${metaPixelId}/events?access_token=${encodeURIComponent(accessToken)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Meta Conversions API returned ${response.status}.`);
  }
}

export async function POST(request: Request) {
  let inquiry: InquiryPayload;

  try {
    inquiry = await request.json() as InquiryPayload;
  } catch {
    return NextResponse.json({ error: "Invalid inquiry payload." }, { status: 400 });
  }

  if (!stringValue(inquiry.key)) {
    return NextResponse.json({ error: "Invalid inquiry payload." }, { status: 400 });
  }

  const portalInquiry = { ...inquiry };
  delete portalInquiry.event_id;
  const inquiryResponse = await fetch(inquiryEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(portalInquiry),
  });

  if (!inquiryResponse.ok) {
    return NextResponse.json({ error: "The inquiry service returned an error." }, { status: 502 });
  }

  try {
    await sendMetaLead(request, inquiry);
  } catch (error) {
    console.error("Unable to send Meta Lead event", error);
  }

  return NextResponse.json({ ok: true });
}
