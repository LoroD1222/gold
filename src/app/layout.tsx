import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import "@fontsource/poppins/latin-700.css";
import "@fontsource/league-spartan/latin-400.css";
import "@fontsource/league-spartan/latin-500.css";
import "@fontsource/league-spartan/latin-600.css";
import "@fontsource/league-spartan/latin-700.css";
import { WhatsAppChatWidget } from "@/components/layout/WhatsAppChatWidget";
import { InquiryFormHandler } from "@/components/forms/InquiryFormHandler";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://goldentrips.com"),
  title: {
    default: "Golden Trips Tanzania | Private Family Safaris",
    template: "%s | Golden Trips Tanzania",
  },
  description: "Private Tanzania family safaris designed around every generation, with flexible pacing, local guides, and personal planning.",
  applicationName: "Golden Trips Tanzania",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "32x32" }],
    shortcut: ["/favicon.png"],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Golden Trips Tanzania",
    title: "Golden Trips Tanzania | Private Family Safaris",
    description: "Private Tanzania family safaris designed around every generation.",
    images: [{ url: "/assets/home-hero.png", width: 1916, height: 821, alt: "A family watching elephants on safari in Tanzania" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fffbf3",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Script src="https://www.googletagmanager.com/gtag/js?id=AW-18474438542" strategy="afterInteractive" />
        <Script id="google-ads-tag" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18474438542');`}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1671525991172204');
fbq('track', 'PageView');`}
        </Script>
        <noscript>
          {/* Meta's tracking fallback must remain a raw 1×1 image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1671525991172204&ev=PageView&noscript=1"
          />
        </noscript>
        {children}
        <InquiryFormHandler />
        <WhatsAppChatWidget />
      </body>
    </html>
  );
}
