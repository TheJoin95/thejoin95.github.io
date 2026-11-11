import { z } from "zod";

const positiveId = z.string().regex(/^[1-9]\d*$/).transform(Number)
  .refine(Number.isSafeInteger, "Must be a safe positive integer");

export const environmentSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().refine((value) => {
    const url = URL.parse(value);
    return url !== null && ["http:", "https:"].includes(url.protocol) && !url.username && !url.password &&
      url.pathname === "/" && !url.search && !url.hash;
  }, "Must be an HTTP(S) origin without credentials, path, query, or fragment"),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().regex(/^G-[A-Z0-9]+$/).optional()
    .or(z.literal("")),
  BREVO_API_KEY: z.string().trim().min(1),
  BREVO_NEWSLETTER_LIST_ID: positiveId,
  BREVO_DOI_TEMPLATE_ID: positiveId,
});

export function validateEnvironment(env: Record<string, string | undefined>) {
  return environmentSchema.safeParse(env);
}
