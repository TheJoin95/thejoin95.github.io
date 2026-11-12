/** Build-time policy, independent of newsletter/service credentials. */
export function seoConfiguration(env: Record<string, string | undefined>) {
  const value = env.NEXT_PUBLIC_SITE_URL;
  if (!value && (env.NETLIFY === "true" || env.SITE_INDEXING === "enabled")) throw new Error("NEXT_PUBLIC_SITE_URL is required for hosted/release builds");
  let url: URL;
  try { url = new URL(value || "http://localhost:3000"); } catch { throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin"); }
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin");
  if (env.SITE_INDEXING && !["enabled", "disabled"].includes(env.SITE_INDEXING)) throw new Error("SITE_INDEXING must be enabled or disabled");
  const preview = Boolean((env.CONTEXT && env.CONTEXT !== "production") || (env.NETLIFY === "true" && env.CONTEXT !== "production"));
  const local = url.hostname === "localhost" || url.hostname.endsWith(".localhost") || url.hostname === "127.0.0.1" || url.hostname === "[::1]";
  const netlifyAlias = url.hostname.endsWith(".netlify.app");
  if (env.NETLIFY === "true" && (url.protocol !== "https:" || local || netlifyAlias)) throw new Error("Hosted builds require an HTTPS custom canonical origin");
  if (env.SITE_INDEXING === "enabled" && !preview && (url.protocol !== "https:" || local || netlifyAlias)) throw new Error("Release indexing requires an HTTPS custom canonical origin");
  return { origin: url.origin, indexable: env.SITE_INDEXING === "enabled" && !preview && !netlifyAlias };
}
// Next inlines these non-secret build decisions so Functions and static output agree.
export const siteOrigin = () => process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const siteIndexable = () => process.env.PORTFOLIO_INDEXABLE === "true";
