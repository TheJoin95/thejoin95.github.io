# Authentic assets, supporting content and verification

## Asset delivery brief

The record-level media requirements in `inventory.json` are the capture brief.
Each gallery asset needs its source, creator/credit, permission/license, capture
date, dimensions, descriptive alt text and project/version context. Use real
screenshots, owned/licensed image inputs and source-derived diagrams. A diagram
is an explanation, not proof of a live product. Keep before/after conversions
reproducible with the exact palette/recipe. Do not present generated mockups as
product screenshots or generated fox sketches as Miki's comic drawings.

All project publication is owner-approved. Project-specific demo accounts and
clean datasets still matter: CoproSync should not reveal resident addresses or
email; Hop captures should use test accounts; HolyCard AI portrait inputs need
appropriate permission. Do not use placeholder social posts or a finished comic
page while both activities are still in progress.

One authentic portrait already exists at `origin/old:public/images/miki.jpg`.
It is available for optional About use; keep portrait repetition minimal. The
fox/original motion artwork remains MIC-21. Cycling and photography need selected
original photos and captions; none has been supplied in this task. Use text
until a real photo is chosen. No stock photo is presented as Miki's photography.

## CV and contacts

| Destination | Check on 2026-11-11 | Implementation handling |
| --- | --- | --- |
| `mailto:miki.lombi@gmail.com` | Owner supplied; valid address format; no email sent | Primary contact |
| `https://github.com/TheJoin95` | HTTP 200 | Public source/profile link |
| `https://www.linkedin.com/in/miki-lombardi/` | HTTP 200 | Professional profile link |
| `https://broski.substack.com/` | HTTP 200; public description is a personal Substack | Broskis destination |
| `https://ign.schroedinger-hat.org/` | HTTP 200 | ImageGoNord demo; visual/functional review still separate |
| `https://schroedinger-hat.org/` | HTTP 200 | Community destination |
| `/miki-lombardi-resume.pdf` | Live response 200, PDF signature/content type; matches `origin/old` | Restored unchanged in `public/` |

CV SHA-256: `0880b936361edcde02a67c110a249218bb7aa80ee522fb419cc525f7a798cb0e`.
Size: 3,275,765 bytes. `pdfinfo` reports one unencrypted page and no JavaScript.
The owner's request preserves the current destination and file; this task does
not claim to have refreshed its career wording. If its content needs updating,
replace the asset deliberately in a later CV edit while preserving the URL.

HTTP success establishes that a destination responds, not that account ownership,
email delivery or every application feature has been independently verified.

## Supporting career/community inventory

| Material | Evidence | Safe use / remaining gap |
| --- | --- | --- |
| Adobe | Owner confirms Senior Software Engineer; old About mentions joining in September 2022 | Current role ready; current team, location and product assignment not reconfirmed |
| Aperion, Plansoft, Growens (formerly Mailup) | Preserved About page | Past company names ready; precise role chronology should come from a reviewed CV |
| Schrödinger Hat co-founder | Public speaker bio and owner-approved portfolio context | Use co-founder; do not claim sole ownership of collective results |
| EuroPython 2021 | [Official talk page](https://ep2021.europython.eu/talks/BG87bCt-a-crowdsourced-map-for-checking-supermarket-wait-times-worldwide/) | Named speaker and supermarket architecture story verified |
| cssday 2022 | [Official program](https://2022.cssday.it/talks_speakers/index.html) | Miki's image/palette automation talk verified |
| Python Day / JavaScript Congress 2021 | Old Home lists titles and organizer links | Keep as historical inventory; resolve exact recording/talk URLs before launch links |
| Containerday 2021 | Old Home lists performance/observability talk | Official page could not be fetched in this audit; verify recording/destination before use |
| FEVR 2020 | Old Home lists microfrontend talk and original URL | Treat as historical lead until destination checked |
| Community/Plansoft talks | Old Home | Select specific talks; do not turn a broad old claim into a new schedule |

Public source references are also indexed in `inventory.json`. Old featured
press links are leads, not automatic endorsement badges or proof of current
traffic. Preserve historical publication attribution when migrated articles
mention external coverage.

## Remaining decisions, with safe implementation defaults

- Broskis topics/editorial angle: use the supplied name, link and factual
  “personal publication” description until Miki supplies a longer introduction.
- Social post/comic learning: in-progress text entries, no external links,
  invented completion dates or finished-example images.
- Hop: confirmed display name; source is the local prototype. No GitHub remote
  was configured there, so do not guess a public repo/demo URL.
- HolyCard AI/CoproSync/Chromatique/Alerting repository origins: identified from
  local Git; public access needs checking before visitor-facing source CTAs.
- Project dates: omit unknown ranges; use the documented 2020 year for the
  archived supermarket project, with its exact shutdown month unresolved.
- Metrics: omit conflicting visits/users/sessions and undated adoption numbers.
  Add only after the owner supplies the matching original evidence.
- Company case study: publication is approved, but project-specific facts and
  artifacts are still needed. Keep current employer/career copy without inventing
  a company project outcome.
- Gallery photos/screenshots: media requirements are ready for the page teams;
  final capture, alt text and responsive asset exports remain implementation work.

These gaps are intentionally represented in the records as MIC-10 requires.
They do not require misleading filler or prevent implementing an honest index.

## Validation record

Content integrity and CV preservation are covered by
`tests/content-inventory.test.ts`. The tests run offline under the existing Bun
test setup; remote URL checks above were a separate read-only audit. Page-level
rendering, accessibility and metadata tests belong to the page implementations.
No source repository outside this portfolio was modified, no email was sent,
and no deployment or DNS setting was changed.

Final verification on 2026-11-11: `bun run check` passed lint, generated route
types, TypeScript and all **41 tests**, including six new content/CV tests.
`bun run build` passed with analytics/Brevo disabled. A local production request
to `/miki-lombardi-resume.pdf` returned HTTP 200, `application/pdf` and the exact
preserved SHA-256. The local preview server was stopped after verification.
Coverage remains 100% for the two application modules exercised by the existing
unit tests; that is not full-site UI coverage. Final copy review checked clarity,
voice, source support, project status, CTA destinations and unsupported claims.

## MIC-10 acceptance audit

1. All ten requested projects and comic learning have records with sourced known
   facts and explicit gaps; company/career/community/talks are also inventoried.
2. Three featured drafts explain contribution and engineering choices using
   first-person legacy writing, public credits and authored local implementation
   history. No invented metrics or company results are included.
3. Home/Work/Journal/Play/About copy, metadata drafts, authentic-media briefs,
   confirmed contact destinations and the preserved working CV are ready for
   the implementation tickets. Owner permission to show the work is recorded.

This completes content preparation. It does not claim the redesigned pages,
gallery captures, article migration or production release are implemented.
