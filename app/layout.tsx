import type { Metadata, Viewport } from "next";
import { Geist, Inter } from "next/font/google";
import CookieConsent from "@/components/CookieConsent/CookieConsent";
import Header from "@/components/Header/Header";
import SmoothScroll from "@/components/SmoothScroll/SmoothScroll";
import { pageMeta, seo } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Type system modelled on revolut.com:
// body → Inter (same font Revolut uses, all weights incl. bold),
// headings/display → Geist, an open-source stand-in for Aeonik Pro (commercial licence).
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const heading = Geist({ subsets: ["latin"], variable: "--font-heading", display: "swap" });

export const metadata: Metadata = { metadataBase: new URL(SITE_URL), ...pageMeta(seo.home) };

export const viewport: Viewport = {
  themeColor: "#04294a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${body.variable} ${heading.variable}`}>
      <body>
        <SmoothScroll>
          <Header />
          {children}
          <CookieConsent />
        </SmoothScroll>
      </body>
    </html>
  );
}
