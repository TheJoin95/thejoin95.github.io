import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteOrigin, siteIndexable } from "@/lib/seo-config";
import { Analytics } from "@/components/analytics";
import { SiteFooter, SiteHeader } from "@/components/site/shell";
import "./globals.css";

const instrumentSans = localFont({
  src: "../../node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2",
  variable: "--font-instrument",
  weight: "400 700",
  display: "optional",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  robots: { index: siteIndexable(), follow: true },
  alternates: { types: { "application/rss+xml": new URL("/rss.xml", siteOrigin()).href } },
  title: { default: "Miki Lombardi", template: "%s | Miki Lombardi" },
  description: "Ideas, writing, and experiments by Miki Lombardi.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full antialiased ${instrumentSans.variable}`}>
      <body className="group/site min-h-full bg-background font-sans text-foreground">
        <a className="absolute -top-32 left-4 z-50 bg-(--paper) px-4 py-3 text-(--ink) focus:top-4" href="#main-content">Skip to content</a>
        <Analytics><SiteHeader /><main className="min-h-[45svh]" id="main-content" tabIndex={-1}>{children}</main><SiteFooter /></Analytics>
      </body>
    </html>
  );
}
