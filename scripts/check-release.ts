import { readFileSync, writeFileSync, unlinkSync } from "node:fs";

// Local production builds only. Never deploy or call a newsletter provider.
if (process.env.NETLIFY === "true") throw new Error("Run test:release locally or in CI, outside an actual Netlify deployment");
const localOrigin = "http://127.0.0.1:3109";
const releaseOrigin = "https://www.mikilombardi.com";
const safeEnv = {
  ...process.env, CI: "true", NEXT_PUBLIC_GA_MEASUREMENT_ID: "", BREVO_API_KEY: "",
  BREVO_NEWSLETTER_LIST_ID: "", BREVO_DOI_TEMPLATE_ID: "",
  SEO_RELEASE_TEST: "false", SEO_CONTEXT_TEST: "false", PUBLISHING_TEST: "false",
};
const localEnv = { ...safeEnv, NETLIFY: "false", CONTEXT: "", SITE_INDEXING: "disabled", NEXT_PUBLIC_SITE_URL: localOrigin };
let child: ReturnType<typeof Bun.spawn> | undefined;
let interrupted = false;
const interrupt = () => { interrupted = true; child?.kill("SIGINT"); };
process.on("SIGINT", interrupt);
process.on("SIGTERM", interrupt);
async function run(args: string[], env: Record<string, string | undefined>, restoring = false) {
  if (interrupted && !restoring) throw new Error("Release checks interrupted");
  console.info(`\nRelease check: bun ${args.join(" ")}`);
  child = Bun.spawn([process.execPath, ...args], { env, stdout: "inherit", stderr: "inherit" });
  const code = await child.exited; child = undefined;
  if (code !== 0) throw new Error(`bun ${args.join(" ")} exited ${code}`);
}
const routesPath = "src/content/journal-routes.json";
const originalRoutes = readFileSync(routesPath);
const created: string[] = [];
try {
  for (const context of ["production", "deploy-preview", "branch-deploy"]) {
    const env = { ...safeEnv, NETLIFY: "true", CONTEXT: context, SITE_INDEXING: "enabled", NEXT_PUBLIC_SITE_URL: releaseOrigin,
      CHECK_NAME: context, SEO_RELEASE_TEST: String(context === "production"), SEO_CONTEXT_TEST: String(context !== "production") };
    await run(["run", "build"], env);
    await run(["run", "test:e2e", context === "production" ? "e2e/seo-release.spec.ts" : "e2e/seo-context.spec.ts"], env);
  }
  for (const [name, extra, date] of [["published", "", "2026-01-01"], ["draft", "draft: true\n", "2026-01-01"], ["future", "", "2999-01-01"]]) {
    const path = `content/journal/mic28-${name}-fixture.md`;
    writeFileSync(path, `---\ntitle: "MIC-28 ${name} publishing fixture"\ndescription: "Synthetic publishing regression fixture; never deploy."\ndate: ${date}\ntags: [mic28-fixture]\n${extra}---\n\n## Publishing proof\n\nSynthetic content confirms the Markdown build, readable HTML and discovery agree.\n\n[About the author](/about#contact)\n`, { flag: "wx" });
    created.push(path);
  }
  const env = { ...safeEnv, NETLIFY: "true", CONTEXT: "production", SITE_INDEXING: "enabled", NEXT_PUBLIC_SITE_URL: releaseOrigin, CHECK_NAME: "publishing", PUBLISHING_TEST: "published" };
  await run(["run", "build"], env);
  // A real new publication must also pass the regular code/content gates.
  await run(["run", "check"], env);
  await run(["run", "test:e2e", "e2e/publishing.spec.ts"], env);
} finally {
  for (const path of created) unlinkSync(path);
  writeFileSync(routesPath, originalRoutes);
  // Leave a normal, noindex build with no synthetic articles, even after failure.
  await run(["run", "build"], localEnv, true);
  process.removeListener("SIGINT", interrupt);
  process.removeListener("SIGTERM", interrupt);
}
await run(["run", "test:e2e", "e2e/publishing.spec.ts"], { ...localEnv, CHECK_NAME: "withdrawal", PUBLISHING_TEST: "withdrawn" });
