import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/whoami", destination: "/about", permanent: true },
      { source: "/blog/2021-04-16-covid19-supermarket-waiting-times-2020-recap", destination: "/blog/2021-04-17-covid19-supermarket-waiting-times-2020-recap", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/articles/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] }];
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
