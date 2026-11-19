export type AnalyticsAction = "contact_email_click" | "cv_download_click" | "newsletter_signup_requested";

export function analyticsMeasurementId(origin: string, environment: Record<string, string | undefined>) {
  const measurementId = environment.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const deployment = environment.NEXT_PUBLIC_VERCEL_ENV;

  if (
    environment.NODE_ENV !== "production" ||
    (deployment && deployment !== "production") ||
    origin !== environment.NEXT_PUBLIC_SITE_URL ||
    !measurementId ||
    !/^G-[A-Z0-9]+$/.test(measurementId)
  ) return undefined;

  return measurementId;
}
