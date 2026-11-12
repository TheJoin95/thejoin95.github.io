import type { NextConfig } from "next";
import { seoConfiguration } from "./src/lib/seo-config";
const seo = seoConfiguration(process.env);

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_SITE_URL: seo.origin, PORTFOLIO_INDEXABLE: String(seo.indexable) },
  async redirects() {
    return [
      { source: "/whoami", destination: "/about", permanent: true },
      { source: "/blog/2021-04-16-covid19-supermarket-waiting-times-2020-recap", destination: "/blog/2021-04-17-covid19-supermarket-waiting-times-2020-recap", permanent: true },
    ];
  },
  async headers() {
    return [
      ...(!seo.indexable ? [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }] }] : []),
      { source: "/articles/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
      { source: "/rss.xml", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
