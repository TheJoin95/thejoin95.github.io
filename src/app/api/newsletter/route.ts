import { z } from "zod";

const subscription = z.object({ email: z.email().max(254), website: z.string().max(200).optional() });
const success = "Check your inbox to confirm your subscription.";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || request.url);
  if (origin !== siteUrl.origin) {
    return Response.json({ message: "Request not allowed." }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ message: "Expected JSON." }, { status: 415 });
  }
  // Bound streamed bodies as well as requests declaring Content-Length.
  let raw = "";
  if (request.body) {
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 2048) {
        await reader.cancel();
        return Response.json({ message: "Request too large." }, { status: 413 });
      }
      chunks.push(value);
    }
    raw = new TextDecoder().decode(Buffer.concat(chunks));
  }
  let body: unknown;
  try { body = JSON.parse(raw); } catch {
    return Response.json({ message: "Invalid JSON." }, { status: 400 });
  }
  const parsed = subscription.safeParse(body);
  if (!parsed.success) {
    return Response.json({ message: "Enter a valid email address." }, { status: 400 });
  }
  if (parsed.data.website) return Response.json({ message: success });

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_NEWSLETTER_LIST_ID);
  const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);
  if (!apiKey || !Number.isSafeInteger(listId) || listId <= 0 ||
      !Number.isSafeInteger(templateId) || templateId <= 0) {
    return Response.json({ message: "Newsletter signup is not available yet." }, { status: 503 });
  }
  try {
    const response = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
      method: "POST",
      headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        email: parsed.data.email, includeListIds: [listId], templateId,
        redirectionUrl: new URL("/newsletter/confirmed", siteUrl).href,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      return Response.json({ message: "Unable to subscribe right now. Please try again later." }, { status: 502 });
    }
    return Response.json({ message: success });
  } catch {
    return Response.json({ message: "Unable to subscribe right now. Please try again later." }, { status: 502 });
  }
}
