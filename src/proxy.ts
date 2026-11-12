import { NextRequest, NextResponse } from "next/server";
import publishedSlugs from "./content/journal-routes.json";

// Reject unknown/private articles before the cached page shell starts streaming.
// A streamed notFound() alone would retain HTTP 200 under Cache Components.
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (!publishedSlugs.includes(slug)) {
    return NextResponse.rewrite(new URL("/not-found", request.url), { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  }
  return NextResponse.next();
}
export const config = { matcher: ["/blog/:slug", "/blog/:slug/share"] };
