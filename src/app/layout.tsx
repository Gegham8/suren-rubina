import type { Metadata, Viewport } from "next";
import { Great_Vibes, Italiana, Montserrat } from "next/font/google";

const italiana = Italiana({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-script" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-sans" });

import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/500-italic.css";

import { wedding } from "@/config/wedding";

import "./globals.css";

// The live site URL. Hardcoded so OG/Twitter share images resolve to an
// absolute production URL with no dependency on Vercel env vars.
const SITE_URL = "https://suren-rubina.vercel.app";

const title = `${wedding.names} · ${wedding.date}`;
const description = `You are invited to the wedding of ${wedding.names} on ${wedding.date}.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  // The OG/Twitter image is provided by src/app/opengraph-image.jpg (Next's
  // file convention wires up both <meta og:image> and <meta twitter:image>).
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#ECEBE9",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${italiana.variable} ${greatVibes.variable} ${montserrat.variable}`}>{children}</body>
    </html>
  );
}
