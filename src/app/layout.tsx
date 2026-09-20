import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { WhatsAppChatWidget } from "@/components/layout/WhatsAppChatWidget";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://goldentrips.com"),
  title: {
    default: "Golden Trips Tanzania | Private Family Safaris",
    template: "%s | Golden Trips Tanzania",
  },
  description: "Private Tanzania family safaris designed around every generation, with flexible pacing, local guides, and personal planning.",
  applicationName: "Golden Trips Tanzania",
  icons: {
    icon: "/assets/home-header-img-image1.png",
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
      <body className={`${poppins.variable} antialiased`}>
        {children}
        <WhatsAppChatWidget />
      </body>
    </html>
  );
}
