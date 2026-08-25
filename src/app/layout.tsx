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

export const metadata: Metadata = {
  title: `${wedding.names} · ${wedding.date}`,
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
