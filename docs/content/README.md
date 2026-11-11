# MIC-10 content handoff

Prepared 2026-11-11 for the senior engineering/architecture audience in MIC-8.
This is the editorial source pack for the page implementation tickets. It is
kept outside `public/` and is not automatically published by the current app.

- [Inventory](inventory.json): all ten requested projects plus comic learning;
  sourced facts, role boundaries, links, status, media briefs and explicit gaps.
- [Featured stories](featured-stories.md): three selected story drafts and
  evidence notes, ready to fit the reusable case-study template.
- [Personal/page copy](personal-copy.md): shared identity, page sections,
  project descriptions, metadata and contact/CV destinations.
- [Assets and verification](assets-and-verification.md): capture requirements,
  evidence quality, contact checks and remaining content decisions.

## What is confirmed

The owner confirmed in this chat that all work may be shown; the current title is
**Senior Software Engineer at Adobe**, the public email is
**miki.lombi@gmail.com**, and the CV should retain its current destination.
The meeting app is **Hop**; **Broskis** maps to `https://broski.substack.com/`.
Social post and comic drawings are in progress; Social post has no public link.
Do not ask for project publication permission again based only on an old note.

Keep confidential data out of screenshots: approval of the project does not
identify which customer/resident records, faces or third-party images can be
used as demonstration material. Prefer demo accounts and owned/licensed inputs.

## How to use the inventory

Each `facts` entry has text and source IDs. A `null` means that fact has not been
established; its corresponding `gaps` entry names what is needed. Other gaps may
be presentation choices or access checks. Preserve the distinction between
publication permission, a project's lifecycle and editorial review state.

Sources beginning `local:` describe read-only working-tree snapshots from the
matching Codex projects, not publicly accessible URLs or freshly tested builds.
The GitHub connector returned `Unknown tool` for repository discovery; public
GitHub/API reads and local Git remotes/readmes supplied the fallback evidence.
No other project was modified or its deployment exercised. Local commit history
supports specific contributions, but is not proof of sole authorship or adoption.
The source registry records that limitation and exact files/commits where useful.

Only use links marked HTTP 200 or public-source-read for immediate visitor-facing
CTAs. A remote identified in local Git may be private or not accessible yet;
render the project without that CTA until the destination is verified. Do not
invent repository links for Hop, Social post or comic learning.

## Featured selection

1. **ImageGoNord:** the strongest visual bridge into the approved palette/gallery
   design, with a reachable demo and credited collaboration.
2. **Supermarket waiting times:** a real architecture/scaling story with a
   first-person technical account. Present it clearly as archived.
3. **Chromatique:** a current engineering story with concrete Rust/binding and
   color-processing decisions, supported by ADRs and authored implementation
   commits. Public repo access and actual gallery outputs remain handoff checks.

Schrödinger Hat anchors the community/About story. HolyCard AI, CoproSync,
Alerting, Hop and Broskis extend the index/Play section. This selection is an
editorial recommendation, not a ranking of project impact or a claim of sole
ownership. Company experience appears in About; no unsupported Adobe project
case study or company metric is invented.

## Review and validation

`tests/content-inventory.test.ts` checks requested coverage, unique identities,
source references, gap disclosure, honest work-in-progress links/status, featured
coverage and byte-for-byte CV preservation. It does not certify historical facts,
copyright ownership or the availability of remote services.

Run `bun run check` and `bun run build` before handing off changes. The full
application build and existing tests remain relevant even though this pack adds
no page routes. Final gallery captures and visual/content review belong to the
implementation tickets; genuine gaps remain visible rather than blocking the
creation of an honest project index.
