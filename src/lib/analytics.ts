export type AnalyticsAction = "contact_email_click" | "cv_download_click" | "newsletter_signup_requested";

export const umamiScriptUrl = "https://analytics.chromatique.cc/script.js";
export const umamiWebsiteId = "919eff20-33a5-4c0a-a86b-0b574960ecc9";

export function analyticsEnabled(origin: string, environment: Record<string, string | undefined>) {
  const deployment = environment.NEXT_PUBLIC_VERCEL_ENV;
  const configuredOrigin = environment.NEXT_PUBLIC_SITE_URL;
  let canonical: URL;
  try {
    canonical = new URL(configuredOrigin || "");
  } catch {
    return false;
  }
  const hostname = canonical.hostname;
  return (
    environment.NODE_ENV === "production" &&
    (!deployment || deployment === "production") &&
    canonical.origin === origin &&
    canonical.protocol === "https:" &&
    hostname !== "localhost" &&
    hostname !== "127.0.0.1" &&
    hostname !== "[::1]" &&
    !hostname.endsWith(".localhost") &&
    !hostname.endsWith(".netlify.app") &&
    !hostname.endsWith(".vercel.app")
  );
}

export function analyticsMeasurementId(origin: string, environment: Record<string, string | undefined>) {
  const measurementId = environment.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!analyticsEnabled(origin, environment) || !measurementId || !/^G-[A-Z0-9]+$/.test(measurementId)) return undefined;

  return measurementId;
}
