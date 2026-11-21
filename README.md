# Golden Trips Tanzania

## Inquiry email notifications

Guest inquiries continue to be sent to the Safari Digital portal and are also emailed to the Golden Trips team through Resend. Copy `.env.example` to `.env.local` (or configure the same values in the deployment environment) and set:

- `RESEND_API_KEY`: the private Resend API key. Do not prefix it with `NEXT_PUBLIC_` or expose it in client code.
- `INQUIRY_FROM`: a sender address on a domain verified in Resend, for example `Golden Trips <inquiries@goldentrips.com>`.
- `INQUIRY_TO`: the comma-separated recipient list for inquiry notifications, for example `safaris@goldentrips.com,reservations@goldentrips.com`.

If Resend is unavailable or misconfigured, the server logs the error but the guest inquiry and Safari Digital portal submission still proceed.
