"use client";

import { createContext, useContext, useEffect, type ComponentProps, type ReactNode } from "react";
import { GoogleAnalytics, sendGAEvent } from "@next/third-parties/google";
import Script from "next/script";
import { useHydrated } from "@/hooks/use-hydrated";
import {
  analyticsEnabled,
  analyticsMeasurementId,
  umamiScriptUrl,
  umamiWebsiteId,
  type AnalyticsAction,
} from "@/lib/analytics";

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string>) => void };
  }
}

type AnalyticsProviders = { google: boolean; umami: boolean };
const AnalyticsEnabled = createContext<AnalyticsProviders>({ google: false, umami: false });

export function useAnalyticsAction() {
  const providers = useContext(AnalyticsEnabled);
  return (action: AnalyticsAction) => {
    if (providers.google) {
      const browser = window as Window & { dataLayer?: unknown[] };
      browser.dataLayer ??= [];
      sendGAEvent("event", action);
    }
    if (providers.umami) window.umami?.track(action);
  };
}

export function AnalyticsActionLink({ action, ...props }: Omit<ComponentProps<"a">, "onClick"> & { action: AnalyticsAction }) {
  const track = useAnalyticsAction();
  return <a {...props} data-analytics-action onClick={() => track(action)} />;
}

export function Analytics({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const environment = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  };
  const origin = hydrated ? window.location.origin : "";
  const googleMeasurementId = hydrated ? analyticsMeasurementId(origin, environment) : undefined;
  const umamiEnabled = hydrated && analyticsEnabled(origin, environment);

  useEffect(() => {
    if (!umamiEnabled) return;

    function trackClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest("a, button, [role='button']");
      if (!element || element.closest("form") || element.hasAttribute("data-analytics-action")) return;

      window.umami?.track("element_clicked", {
        element_kind: element.getAttribute("role") || element.tagName.toLowerCase(),
        page_path: window.location.pathname,
      });
    }

    document.addEventListener("click", trackClick);
    return () => document.removeEventListener("click", trackClick);
  }, [umamiEnabled]);

  return (
    <AnalyticsEnabled value={{ google: Boolean(googleMeasurementId), umami: umamiEnabled }}>
      {children}
      {googleMeasurementId && <GoogleAnalytics gaId={googleMeasurementId} />}
      {umamiEnabled && (
        <Script
          src={umamiScriptUrl}
          defer
          data-website-id={umamiWebsiteId}
          strategy="afterInteractive"
        />
      )}
    </AnalyticsEnabled>
  );
}
