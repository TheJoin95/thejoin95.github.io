# Portfolio visual review

MIC-123 covers the design refinement through `c16d2a8`. The owner’s visual
decision is pending. The review preview uses a local production build at
`http://127.0.0.1:3109` with indexing, analytics and email delivery disabled.

The review package contains 390, 834 and 1440 CSS pixel captures of Home,
Work, Journal, Play, About, Lab, a preserved Journal article and the
ImageGoNord case study. Detail captures cover the selected galleries,
Chromatique comparison and project collection. The captions identify which
earlier capture each comparison uses. The masonry before views are from a
fresh build of `2590c50`.

## Comparison

| Area | Current implementation and differences |
| --- | --- |
| Typography | Instrument Sans uses a regular weight and compact measure for the opening line. The Home introduction is about 28, 30 and 34 px at the review widths. Earlier reference measurements recorded 32 px. Work, Journal, Play and About retain oversized page titles with smaller supporting copy. |
| Layout and galleries | Home pairs a light surface with a narrow introduction and media-led project rows. Daniilch opens on a dark surface with tall device imagery across the row. On desktop, the first landscape frame in Miki’s galleries takes 64% of the Home track and 76% of the Work track. Both reveal part of the next frame. Captions, credits and full-size links add useful space below the media. |
| Photography and media | The Chromatique comparison displays a credited source photograph and the actual palette output. The 2× review selected 828, 2048 and 2880 px static WebP previews for the source photograph at the three widths. The ImageGoNord case study uses a 2400 px source capture. The supermarket illustration describes the documented architecture. |
| Masonry | The earlier Work index listed 27 projects in text. The current collection uses one, two and three columns and retains the 27 entries. Daniilch’s Explore uses a pannable canvas with compact labels. Work adapts the mixed cover proportions to document scrolling, with stable reading order and the status, description and attribution visible under each entry. |
| Motion | Page entrances and the active navigation underline use brief transitions. Reduced motion skips both. The palette comparison uses HTML controls. |

[Daniilch Work](https://www.daniilch.design/) ·
[Daniilch Explore](https://www.daniilch.design/explore) ·
[Media provenance](../content/media-provenance.md)

## Verification

`bun run check` passed with 128 unit tests. The noindex production build and
loopback server ran with local worker and socket access. All 36 current
captures returned HTTP 200 and fit their viewport widths.

The first browser run passed 111 tests, including keyboard navigation,
reduced motion, and the two accessibility scans. Six checks failed. The
updated tests open Firefox’s layout samples directly, scroll to the deferred
Lab controls and measure reader table columns against their rendered font-relative
minimum. All seven targeted reruns passed, including the additional WebKit
regression. Three simulated release and publishing tests were skipped in the
noindex review run.

## Remaining review items

- Six of 27 collection entries use source media. The other 21 have
  typographic covers. Six entries have no public destination. Comic learning
  has no published panels.
- The local production build completed with the existing partial-prerender
  `usePathname` diagnostics for the dynamic Journal and Work readers. The
  review captured the served reader routes.
- Hosted Netlify behavior and production domain behavior are outside this
  local review. The owner’s design decision remains open in MIC-123.
