"use client";

import { createContext, useContext, type ComponentProps, type ReactNode } from "react";
import { GoogleAnalytics, sendGAEvent } from "@next/third-parties/google";
import { useHydrated } from "@/hooks/use-hydrated";
import { analyticsMeasurementId, type AnalyticsAction } from "@/lib/analytics";

const AnalyticsEnabled = createContext(false);

export function useAnalyticsAction() {
  const enabled = useContext(AnalyticsEnabled);
  return (action: AnalyticsAction) => {
    if (!enabled) return;
    const browser = window as Window & { dataLayer?: unknown[] };
    // Keep an early click queued if Google's tag is still loading.
    browser.dataLayer ??= [];
    sendGAEvent("event", action);
  };
}

export function AnalyticsActionLink({ action, ...props }: Omit<ComponentProps<"a">, "onClick"> & { action: AnalyticsAction }) {
  const track = useAnalyticsAction();
  return <a {...props} onClick={() => track(action)} />;
}

export function Analytics({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const measurementId = hydrated ? analyticsMeasurementId(window.location.origin, {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  }) : undefined;

  return (
    <AnalyticsEnabled value={Boolean(measurementId)}>
      {children}
      {measurementId && <GoogleAnalytics gaId={measurementId} />}
    </AnalyticsEnabled>
  );
}
