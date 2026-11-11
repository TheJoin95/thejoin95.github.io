import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { POST } from "../src/app/api/newsletter/route";

const originalFetch = globalThis.fetch;
const keys = ["NEXT_PUBLIC_SITE_URL", "BREVO_API_KEY", "BREVO_NEWSLETTER_LIST_ID", "BREVO_DOI_TEMPLATE_ID"] as const;
let previous: Record<string, string | undefined>;
function request(body: unknown, origin = "https://example.com") {
  return new Request("https://example.com/api/newsletter", {
    method: "POST", headers: { origin, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}
beforeEach(() => {
  previous = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
  process.env.BREVO_API_KEY = "test-key";
  process.env.BREVO_NEWSLETTER_LIST_ID = "12";
  process.env.BREVO_DOI_TEMPLATE_ID = "34";
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const key of keys) {
    if (previous[key] === undefined) delete process.env[key];
    else process.env[key] = previous[key];
  }
});
describe("newsletter", () => {
  test("rejects requests without an origin", async () => {
    const req = request({ email: "hello@example.com" });
    req.headers.delete("origin");
    expect((await POST(req)).status).toBe(403);
  });
  test("requires JSON content type", async () => {
    const req = request({ email: "hello@example.com" });
    req.headers.set("content-type", "text/plain");
    expect((await POST(req)).status).toBe(415);
  });
  test("handles an empty body", async () => {
    const req = request({});
    expect((await POST(new Request(req.url, { method: "POST", headers: req.headers }))).status).toBe(400);
  });
  test("rejects foreign origins", async () => {
    expect((await POST(request({ email: "hello@example.com" }, "https://elsewhere.com"))).status).toBe(403);
  });
  test("rejects invalid email", async () => {
    expect((await POST(request({ email: "invalid" }))).status).toBe(400);
  });
  test("rejects malformed JSON", async () => {
    const req = request({});
    expect((await POST(new Request(req.url, { method: "POST", headers: req.headers, body: "{" }))).status).toBe(400);
  });
  test("bounds request size", async () => {
    expect((await POST(request({ email: "x".repeat(3000) }))).status).toBe(413);
  });
  test("fails closed when unconfigured", async () => {
    delete process.env.BREVO_API_KEY;
    expect((await POST(request({ email: "hello@example.com" }))).status).toBe(503);
  });
  test.each(["0", "-1", "1.5", "not-a-number", "9007199254740992"])(
    "rejects invalid list configuration: %s", async (value) => {
      process.env.BREVO_NEWSLETTER_LIST_ID = value;
      expect((await POST(request({ email: "hello@example.com" }))).status).toBe(503);
    },
  );
  test("rejects missing template configuration", async () => {
    delete process.env.BREVO_DOI_TEMPLATE_ID;
    expect((await POST(request({ email: "hello@example.com" }))).status).toBe(503);
  });
  test("honeypot does not contact Brevo", async () => {
    const fetcher = mock(async () => new Response(null, { status: 201 }));
    globalThis.fetch = fetcher as unknown as typeof fetch;
    expect((await POST(request({ email: "hello@example.com", website: "spam" }))).status).toBe(200);
    expect(fetcher).not.toHaveBeenCalled();
  });
  test("requests double opt in with server-side configuration", async () => {
    const fetcher = mock(async () => new Response(null, { status: 201 }));
    globalThis.fetch = fetcher as unknown as typeof fetch;
    expect((await POST(request({ email: "hello@example.com" }))).status).toBe(200);
    const [url, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.brevo.com/v3/contacts/doubleOptinConfirmation");
    expect(JSON.parse(init.body as string)).toEqual({
      email: "hello@example.com", includeListIds: [12], templateId: 34,
      redirectionUrl: "https://example.com/newsletter/confirmed",
    });
  });
  test("does not expose provider failures", async () => {
    globalThis.fetch = mock(async () => new Response("private provider detail", { status: 400 })) as unknown as typeof fetch;
    const response = await POST(request({ email: "hello@example.com" }));
    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain("private provider detail");
  });
  test("handles network failures", async () => {
    globalThis.fetch = mock(async () => { throw new Error("offline"); }) as unknown as typeof fetch;
    expect((await POST(request({ email: "hello@example.com" }))).status).toBe(502);
  });
});
