import { findCaseStudy } from "./content/case-studies";
import { NextRequest, NextResponse } from "next/server";
import { siteOrigin, siteIndexable } from "./lib/seo-config";
import publishedSlugs from "./content/journal-routes.json";

// Reject unknown/private articles before the cached page shell starts streaming.
// A streamed notFound() alone would retain HTTP 200 under Cache Components.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const slug = pathname.split("/")[2];
  // Netlify runs the proxy before Next config redirects. Resolve the preserved
  // alias here before the unpublished-article check.
  const supermarketAlias = pathname === "/blog/2021-04-16-covid19-supermarket-waiting-times-2020-recap";
  const unknownArticle = pathname.startsWith("/blog/") && !supermarketAlias && !publishedSlugs.includes(slug);
  const unknownStory = pathname.startsWith("/work/") && !findCaseStudy(slug);
  if (unknownArticle || unknownStory) {
    return NextResponse.rewrite(new URL("/not-found", request.url), { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  }
  const response = supermarketAlias
    ? NextResponse.redirect(new URL(`/blog/2021-04-17-covid19-supermarket-waiting-times-2020-recap${search}`, request.url), 308)
    : NextResponse.next();
  const requestHost = (request.headers.get("host") || request.nextUrl.host).toLowerCase();
  if (!siteIndexable() || requestHost !== new URL(siteOrigin()).host) response.headers.set("X-Robots-Tag", "noindex, follow");
  return response;
}
export const config = { matcher: ["/((?!_next/static|_next/image|media/previews/|favicon.ico).*)"] };
