# Project context

- Use Bun for all package installs and scripts.
- Use Conventional Commits for commit messages, for example
  `feat(newsletter): add double opt-in signup`. Never commit environment files.
- Use the latest stable Bun; keep `.bun-version`, `packageManager`, and
  Netlify's `BUN_VERSION` aligned when upgrading. Pin the verified version in CI.
- Bun is the local runtime, package manager, shell, test runner, and tooling
  bundler. Next.js application builds use Turbopack; Netlify controls the
  deployed server runtime. Do not replace these with unsupported Bun settings.
- The previous website is preserved on the remote `old` branch (`origin/old`).
  Refer to that branch for old articles, titles, text, assets, and URL structure
  in all chats for this project. Use `git show origin/old:<path>` or
  `git ls-tree -r origin/old` without switching the current checkout.
  Fetch `origin old` if the reference is missing.
- Do not restore the old Vue implementation into the new Next.js application.
- Stack: Next.js App Router, TypeScript, Tailwind, Radix-based shadcn/ui,
  Google Analytics 4, Brevo newsletter, Three.js with React Three Fiber/drei,
  and dotLottie for small animations.
- Keep credentials server-side. Document configuration in `.env.example`.
- Keep Three.js and Lottie behind client boundaries and lazy imports; respect
  reduced motion. Server Components are the default.
- Run `bun run check` and `bun run build` before handing off code changes.
- Every implementation or feature must have automated tests covering its behavior.
  Include regression tests for fixes and preservation checks for migrated content.
- The blog uses repository Markdown and Next.js page routes. Backfill articles
  from `origin/old`, preserving published URLs, dates, titles and content.
- SEO and GEO are requirements: serve readable HTML, accurate metadata and
  structured data, and test crawlability and discovery routes.
- Social sharing is required across public pages: provide accurate Open Graph
  and Twitter card metadata, absolute image URLs, a branded default OG image,
  and article/project-specific share images with a reliable fallback. Test image
  responses and metadata, including crawler-visible HTML and long-title layouts.
- Apply relevant installed skills for the topic being worked on, including
  SEO audit, AI SEO/GEO and schema guidance for blog/search features.
- Netlify deployment is configured; the custom domain still serves the old site.
  Keep the domain cutover separate from implementation and preview verification.
- The newsletter API requires a Next.js server. GitHub Pages alone cannot run it.
  Do not switch to static export without addressing that route.

<!-- BEGIN:nextjs-agent-rules -->
Read relevant guides in `node_modules/next/dist/docs/` before changing Next.js
code. This version may differ from APIs remembered from older versions.
<!-- END:nextjs-agent-rules -->
