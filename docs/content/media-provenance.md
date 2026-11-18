# Project media provenance

## MIC-121 media refresh — 2026-11-18

The [design reference](https://www.daniilch.design/) gives real product
screens room to read against quiet frames. This refresh applies that approach
to the existing landscape media and keeps the original project assets available.

| Prominent media | Audit and treatment |
| --- | --- |
| Home and Play palette stage | The old 1024×846 raster included the glass-slide mount and stretched across a 1440px panorama. The new 3200×2172 pair removes the mount and draws from the same scan. Both layers share the same frame and focal point. The phone shows a near-full 3:2 composition, the tablet uses 16:9, and the desktop uses a taller 5:2 panorama capped at 560 CSS pixels. |
| Chromatique project gallery and story | The same high-resolution pair appears uncropped in the gallery. Both full-size study files are available, and the historical 1024px pair remains at its original URLs. |
| ImageGoNord project gallery and story | The 1200×870 empty converter and 1200×363 intro were recaptured in Chromium at 2×. The 261×710 controls-only slide is now an archive link in the case study. The new lead image shows the complete converter with a local preview, and a wider capture of the Python guide makes a third distinct slide. The gallery contains the captures to keep the text and controls intact. |
| Supermarket and featured journal diagrams | Both are vector SVG and scale without raster upsampling. The supermarket diagram remains explicitly identified as a source-derived diagram. A verified period screenshot of the supermarket map is still missing. |
| Personal photography | `public/images/miki.jpg` (2073×2008) and `miki_old.jpg` (256×256) exist on `origin/old` and remain in the current repository. The main pages do not display a portrait. No newly approved portrait or owner-supplied photograph was identified for this refresh. |

### Chromatique input and output

The [Library of Congress catalogue](https://www.loc.gov/pictures/item/2007686318/)
credits Frances Benjamin Johnston and gives the rights advisory as no known
restrictions on publication. The [6090×5032 TIFF master](https://cdn.loc.gov/master/pnp/ppmsca/16300/16318u.tif)
has SHA-256 `e78630710ad2872b18252f9528930fc3974f925a6685d86bd0cc4bff7ca69878`.
The study crops the master from left/top/right/bottom
`(1000, 1160, 5170, 3990)`, converts the embedded profile to sRGB, and
downsamples with Lanczos to 3200×2172. The input is JPEG quality 91 with full
chroma resolution. Chromatique generates the matching indexed PNG directly
from that JPEG, with no further crop or resampling.

```sh
chromatique map --palette nord --palette-dir /path/to/chromatique/palettes \
  --space oklab --dither none --backend cpu --indexed \
  public/media/chromatique/irises-study-original.jpg \
  -o public/media/chromatique/irises-study-nord.png
```

| File under `public/media/chromatique/` | Dimensions | SHA-256 |
| --- | --- | --- |
| `irises-study-original.jpg` | 3200×2172 | `9f40a3088d6059fd8639688cd9e21e48cd8c7015b2b965bf06193d30ed7a7262` |
| `irises-study-nord.png` | 3200×2172 | `55a69c93f2131b020a6225aae277e1b4491159bcca58bc635fb4ba0199cacc84` |

The on-page comparison uses Next.js responsive derivatives at quality 75 for
the scan and 70 for the mapped layer. The 2880px and 3200px candidates cover
1440px and 1600px displays at 2×. The stage reserves its layout space before
either image loads. The downloadable indexed PNG preserves the exact Nord
palette credited to Sven Greb.

The local production optimizer served 146 KB combined for the two 640px WebP
derivatives and 1.38 MB combined for the two 2880px derivatives.

### ImageGoNord captures

Source and attribution are the [public ImageGoNord demo](https://ign.schroedinger-hat.org/)
and [Python documentation](https://ign.schroedinger-hat.org/documentation/python),
ImageGoNord / Schrödinger Hat. The converter displays the credited Johnston
crop in its local browser preview. HTTP requests were blocked during file
selection, and no conversion was submitted. The photo preview is rendered
by the app’s own canvas. Chromium captured the surrounding interface at
device scale 2; there was no post-capture enlargement.

| File under `public/media/imagegonord/` | Region and dimensions | SHA-256 |
| --- | --- | --- |
| `converter-preview-2x.png` | `.demo-wrapper`, 2400×1420 | `33537a49241a01e6036b7e227c4529dd394a123e0e96730df3178283c1dead31` |
| `introduction-2x.png` | `.main`, 2000×916 | `cd7c84845ca88caa2cbdec85b7b04a88265d1045c7e79096681cd6e6f02c6498` |
| `python-documentation-2x.png` | Opening of `.guide.python`, 1720×1032 | `345375caabcce8b7edd1b8117953cc11d7b5813018eac7702a1ffc89f92e61e3` |

## ImageGoNord interface captures — 2026-11-12

Captured from the [live ImageGoNord website](https://ign.schroedinger-hat.org/)
at a 1440×1000 Chromium viewport. Each PNG is a screenshot of the named DOM
region, not generated artwork or an invented product interface. The owner's
publication approval covers project material; keep ImageGoNord / Schrödinger Hat
attribution with these images. Do not claim Miki alone authored the whole interface.

| Local file under `public/media/imagegonord/` | Captured region | Intrinsic dimensions | SHA-256 |
| --- | --- | --- | --- |
| `conversion-interface.png` | `.demo.container`: upload area and conversion settings | 1200×870 | `cfae0e743a202a4595e1608d133ba63fe77667e644132e7f527ad97a190b9c07` |
| `introduction.png` | `.main`: introduction and documentation/palette links | 1200×363 | `5ba3e065eccb2d900682d58a70cd30ffff23eba7ab9d7bd0d6dd74c95f69b895` |
| `palette-controls.png` | `.demo .params`: palette groups and options | 261×710 | `3dd2da1b97526335c9d08fdef87f31c1d240dc2321d6e872922bdb13bbe5339a` |

The interface-detail captures exclude the site's counter. No screenshot is
evidence of usage, conversion accuracy, deployment architecture or an outcome.
No upload or conversion was submitted to capture them. The images remain
uncropped in the site's gallery frames (`contain`); full-size links allow reading
small controls. The tall palette detail is not stretched to fill a landscape frame.

The local ImageGoNord checkout was consulted read-only for source structure
(`src/ign-frontend/src/views/Home.vue`, `components/Demo.vue`, ref
`9a22d72b4d2687dd1549583ca011165affdc49ec`). This identifies the capture regions;
it does not assert that the current live deploy matches that exact source commit.

## Browser-only video fixture

`e2e/fixtures/clip.webm` is a 160×90, one-second silent solid-colour VP9 clip,
generated with FFmpeg's `color` source (`0x263445`, 5 fps). It tests native media
playback without a third-party film or audio dependency. It is test material,
not portfolio/project evidence, and is never served as website content. Recreate:

```sh
ffmpeg -f lavfi -i color=c=0x263445:s=160x90:d=1:r=5 -an -c:v libvpx-vp9 clip.webm
```

## Chromatique static study — 2026-11-12

Input: Frances Benjamin Johnston's 1921 *West Potomac Park, Washington, D.C.
Irises along the embankment*, [Library of Congress item 2007686318](https://www.loc.gov/pictures/item/2007686318/).
The catalogue's rights advisory says “No known restrictions on publication.”
The unchanged JPEG was copied from Chromatique's documented licensed test corpus;
the palette-mapped output was generated by its existing CLI, not an image model.

| File under `public/media/chromatique/` | Dimensions | SHA-256 |
| --- | --- | --- |
| `irises-original.jpg` | 1024×846 | `c3f2d8af54d13e5c2744d24fab9975aebdbd51f1a3bdd94a6e8df76fc3676a14` |
| `irises-nord.png` | 1024×846 | `98308ebc65af201aaea8e44b7e338c91b4cdfc098b38ec987aff75fa0edb9884` |

Actual recipe, using the existing `chromatique 0.2.0` binary:

```sh
chromatique map --palette nord --palette-dir /path/to/chromatique/palettes \
  --space oklab --dither none --indexed \
  public/media/chromatique/irises-original.jpg \
  -o public/media/chromatique/irises-nord.png
```

The command reported the CPU backend and 16-colour Nord palette. Source checkout
examined read-only: `79a1c5b2a37439f3731113b58b4c3265e5777df7`; this identifies
the local context, not a claim that the existing binary was freshly built from
that exact commit. Nord's registry credits Sven Greb and links to
[Nord](https://www.nordtheme.com/) under MIT. Preserve both palette and photo credits.
Tests check the unchanged input hash and indexed PNG dimensions/palette size.

Home shows a fixed 50/50 comparison with matched responsive cropping; it has no
slider or fake hover controls. Full gallery frames contain the uncropped files.
The final indexed output is about 158KB; an exploratory 521KB WebP was discarded.
This is project-processing evidence, not a photograph taken by Miki or a released
interactive website feature. The Three.js implementation remains MIC-22.

Chromatique's GitHub repository returned anonymous HTTP 404 and `chromatique.dev`
did not resolve during this task. Home links to the real local output, not either
unavailable destination. Those public-link gaps remain with the project/content work.

## Supermarket architecture diagram — 2026-11-12

`public/media/supermarket/architecture.svg` is a new, explicitly labelled
source-derived diagram, not a period map capture. It describes GitHub Pages,
Flask/uWSGI, Redis geospatial lookup/expiring caches and the Raspberry Pi → regional
VPS progression documented in Miki's preserved technical article:
`origin/old:public/articles/2021-04-16-covid19-supermarket-waiting-times-2020-recap.md`.
The project stays visibly archived. No traffic or adoption figures are claimed.
The diagram is 1200×480 and its SHA-256 is
`064885b918393d6cafc5f11d492d30445e02d831344c5800b53af5de76561048`.

Two remote images referenced by the old articles were inspected but were analytics
graphs, not map captures. They were not included in the portfolio. The SVG's
editable geometry and labels are the source asset; there is no generated product
screenshot or imitation of Miki's drawings.

## Chromatique decision extracts — MIC-16, 2026-11-12

`public/media/chromatique/decision-extracts.md` contains verbatim selected sections
from the owner-approved project source at revision
`79a1c5b2a37439f3731113b58b4c3265e5777df7`:

- `docs/adr/ADR-0001-rust-core.md`, Decision and Alternatives (dated 2026-09-09).
- `docs/adr/ADR-0010-preserve-semantics.md`, sections 1 and 2 (dated 2026-09-17).

The framing explicitly identifies this as an extract and notes that ADR-0010 is
partly superseded for structure preservation. It does not publish an unverified
performance result or imply a current public repository URL. No local machine
path or credentials are included. Owner permission to show all project work was
already recorded in MIC-10. SHA-256:
`3251ad17947d5e4221f36cf464d9a783efbefdd0a82daca82f4bcea730887c41`.

The case studies reuse the existing screenshots, palette output and labelled
supermarket architecture diagram above. No new image was generated as product
evidence. The supermarket period-map screenshot remains unavailable; the page
shows the diagram honestly and links to the preserved articles and official talk.
Chromatique's example is ordinary OKLab mapping with no dithering, and is labelled
separately from the story's optional lightness-preservation discussion.

## MIC-18 featured Journal diagram

`public/media/journal/microfrontends.svg` is an explanatory vector authored for
the new Journal in 2026. It illustrates the school-administration example in the
preserved `2019-12-21-microfrontend-from-00-to-20s.md` article: staff, subjects and
register frontends composed into one application shell. It is not a period
screenshot, original project architecture evidence or comic artwork. That
distinction is visible in the caption and SVG description. There is no external
asset dependency or third-party photograph. Dimensions: 1200 × 630. SHA-256:
`f7d6e846eedf5850c9e5d3935c0da7065ba822cf14e10716bd4d6a27d628cbe3`.
