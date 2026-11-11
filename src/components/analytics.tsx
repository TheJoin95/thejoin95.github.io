"use client";

import { GoogleAnalytics } from "@next/third-parties/google";

export function Analytics({ children }: { children: React.ReactNode }) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;
  const enabled = measurementId && /^G-[A-Z0-9]+$/.test(measurementId) &&
    process.env.NODE_ENV === "production" && (!vercelEnv || vercelEnv === "production");

  return (
    <>
      {children}
      {enabled && <GoogleAnalytics gaId={measurementId} />}
    </>
  );
}
