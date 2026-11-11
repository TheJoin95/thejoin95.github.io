import type { Metadata } from "next";
import { Analytics } from "@/components/analytics";
import { SiteFooter, SiteHeader } from "@/components/site/shell";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Miki Lombardi", template: "%s | Miki Lombardi" },
  description: "Ideas, writing, and experiments by Miki Lombardi.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="group/site min-h-full bg-background font-sans text-foreground">
        <a className="absolute -top-32 left-4 z-50 bg-(--paper) px-4 py-3 text-(--ink) focus:top-4" href="#main-content">Skip to content</a>
        <Analytics><SiteHeader /><main className="min-h-[45svh]" id="main-content" tabIndex={-1}>{children}</main><SiteFooter /></Analytics>
      </body>
    </html>
  );
}
