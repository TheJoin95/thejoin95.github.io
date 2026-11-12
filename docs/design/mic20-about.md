# MIC-20 — About, passions, contact and CV

The About page completes the approved editorial sequence: oversized white
introduction, career/community and selected talks, charcoal passions and
sketchbook navigation, then the shared contact/CV footer. It composes the existing
`PageIntro`, `Section`, shared styles and contact records. `CareerCommunity` and
`Passions` are server-rendered sections with clear responsibilities. There is no
new dependency, client behavior, global CSS, theme change or speculative UI API.

## Confirmed copy and destinations

Current role is the owner's confirmed **Senior Software Engineer at Adobe**.
The preserved `origin/old:src/views/About.vue` and MIC-10 handoff support the
historical employer names Aperion, Plansoft and Growens. The page deliberately
does not infer exact dates, present team/product duties, location, years of
experience, commercial availability, impact metrics or sole ownership of
community work. Schrödinger Hat is described as co-founded, not individually
owned, and links to the actual community destination used by the Work inventory.

Two selected talks use source-authentic titles and historical years:

- [cssday 2022 — Automatizzare la conversione in palette di icone e immagini](https://2022.cssday.it/talks_speakers/index.html).
  The official speaker/program page lists Miki and the ImageGoNord/palette topic.
  The Italian title has its own `lang="it"` annotation. The destination is a
  program page, not an asserted recording.
- [EuroPython 2021 — A crowdsourced map for checking supermarket wait times worldwide](https://ep2021.europython.eu/talks/BG87bCt-a-crowdsourced-map-for-checking-supermarket-wait-times-worldwide/).
  The official talk page identifies Miki and the archived project's architecture
  topic. Conflicting project metrics/shutdown timing remain omitted.

Both primary event pages and the community site were read on 2026-11-13.
Direct read-only HTTP requests returned 200 for the confirmed GitHub and LinkedIn
profiles; LinkedIn normalized its trailing slash. The browser search tool could
not retrieve those two profile pages, so the successful direct HTTP checks are
the verification evidence. No message or email was sent.

## Passions and authentic media boundary

Cycling, photography and learning to make comic books are confirmed interests.
No original cycling/photography selection or comic artwork has been supplied.
The approved responsive contract explicitly permits a text-only fallback, and
MIC-10 says to use text until a real photo is chosen. This implementation follows
that decision: strong editorial headings and honest short copy, without a fake
photo, diagram standing in for art, second portrait, blank frame or invented
learning outcome. Photos can replace the fallback when actual assets/captions
are selected. Original fox assets remain MIC-21/MIC-23.

The sketchbook CTA leads to the real `/blog#sketchbook` section, currently an
honest unpublished state. Play and Work links expose actual local destinations.
Passion text precedes the sketchbook link in DOM order at every width.

## Contact and CV

The intro's native `#contact` link reaches the single shared footer anchor.
Email, GitHub, LinkedIn and CV continue to use the confirmed shared contact list;
there is no second independently maintained About contact list. External links
retain the existing decorative Lucide arrow treatment and normal browsing.

The CV contact now includes a native `download` filename, used by the shared
footer across the site. Clicking or keyboard-activating **Download CV (PDF)**
downloads the original PDF rather than depending on a viewer's default behavior.
The public path remains `/miki-lombardi-resume.pdf`, with the exact preserved
3,275,765 bytes and SHA-256
`0880b936361edcde02a67c110a249218bb7aa80ee522fb419cc525f7a798cb0e`.
The PDF was not rewritten or represented as newly updated.

## SEO/GEO and sharing

The expanded accurate summary uses the shared metadata helper with canonical
`/about`, absolute branded default Open Graph image and Twitter large-image card.
ProfilePage JSON-LD references the same Person identity as Home (`/#miki`), with
the confirmed role, employer, profile links and public email. No invented profile
timestamps, address, awards or follower statistics are included. Schema describes
visible facts and does not promise search appearance or AI citations. The source
guidance checked was [Google's ProfilePage documentation](https://developers.google.com/search/docs/appearance/structured-data/profile-page).

## Verification and handoff

Automated coverage checks the confirmed professional copy, historical employers,
shared destinations, exact talk titles/years/languages, text-only media fallback,
real sketchbook link, CV preservation/download, schema identity and metadata.
Browser tests cover 320/390/834/1440px without JavaScript and with reduced motion,
native contact jumps, actual downloaded PDF hashes, keyboard activation, 200%
text, crawler-visible HTML and the real 1200×630 social PNG response.

Responsive captures: `/tmp/mic20-about-<width>.png`. Shared typography, white and
charcoal surfaces, reading measure and responsive spacing retain the existing
system. `DESIGN.md` and global tokens remain unchanged. Test counts and the scoped
independent review verdict are recorded on the Linear issue. The reviewer issued
a scoped ship verdict with no material findings. `bun run check` passed 111 unit
tests and the coverage gate; `bun run build` succeeded. The full browser suite
passed 71 tests, with two context-specific SEO checks intentionally skipped.
Two existing gallery/navigation dimension tests now wait through hydration's
fallback replacement rather than reading temporarily detached elements; their
original dimension assertions remain intact. The UI detector returned no
findings for the changed About/shared footer files.

The release sitemap remains 25 canonical URLs and the feed sixteen articles.
Successful builds still emit the pre-existing unknown article/project fallback
`CLIENT_HOOK_DYNAMIC` diagnostics documented under MIC-31. Hosted verification
of links, downloads and metadata remains MIC-31. No push, deployment, hosted
setting or domain cutover was performed.
