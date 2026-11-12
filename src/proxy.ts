import { NextRequest, NextResponse } from "next/server";
import { siteOrigin, siteIndexable } from "./lib/seo-config";
import publishedSlugs from "./content/journal-routes.json";

// Reject unknown/private articles before the cached page shell starts streaming.
// A streamed notFound() alone would retain HTTP 200 under Cache Components.
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (request.nextUrl.pathname.startsWith("/blog/") && !publishedSlugs.includes(slug)) {
    return NextResponse.rewrite(new URL("/not-found", request.url), { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  }
  const response = NextResponse.next();
  const requestHost = (request.headers.get("host") || request.nextUrl.host).toLowerCase();
  if (!siteIndexable() || requestHost !== new URL(siteOrigin()).host) response.headers.set("X-Robots-Tag", "noindex, follow");
  return response;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
