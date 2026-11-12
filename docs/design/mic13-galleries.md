# Accessible project galleries — MIC-13

Implemented 2026-11-12 against the MIC-11 gallery contract.

## Use

Use the server `ProjectGallery` component on Home, Work or a case study. The
project description remains server-rendered; gallery controls are a client
enhancement. Work includes the first real ImageGoNord gallery. This ticket does
not complete Home, the full Work inventory or case-study publishing.

```tsx
import { ProjectGallery } from "@/components/gallery/project-gallery";
import { imageGoNordMedia } from "@/content/featured-media";

<ProjectGallery
  id="imagegonord"
  title="ImageGoNord"
  href="https://github.com/Schroedinger-Hat/ImageGoNord-Web"
  linkLabel="Explore ImageGoNord on GitHub"
  media={imageGoNordMedia}
>
  <p>An open-source tool for converting images into a chosen palette.</p>
</ProjectGallery>
```

`id` must be unique on the page. Media IDs must be stable and unique within the
gallery. `GalleryMedia` in `src/lib/gallery.ts` requires intrinsic dimensions,
caption and credit. Images require meaningful alt text and use `contain` unless
the author explicitly selects `cover` with a reviewed focal point. Use local
versioned assets; remote images need an explicitly configured Next image host.
Video uses native controls, `preload="none"`, an optional poster, a required
transcript and caption tracks for spoken audio. Never auto-play. A missing source
has an honest unavailable state. Credits must describe actual provenance.

An empty media list leaves the title, summary and optional link without a fake
image frame. A single item fills the strip and has no previous/next buttons.
With multiple items, frames occupy 88%/76%/48% of phone/tablet/desktop strip width,
with 4:3 phone and 5:3 larger frames. The next media peeks into view; scrolling is
local to the strip. Descriptions stack above tablet/phone media and use a narrow
2/12 column beside desktop media. Captions and credits remain normal HTML.

## Interaction and failure behaviour

- Labelled region and ordered list; focusable native scrolling and ordinary media
  links. No tablist, lightbox, global arrow-key handler or drag-only action.
- Previous/next controls are labelled, retain focus and stop at endpoints. No
  automatic advance or looping. Counter plus settled-button live announcement;
  manual scrolling does not announce every scroll event.
- Native touch/wheel scrolling; vertical gestures over the strip still scroll the
  page. Reduced motion uses immediate programmatic scrolling. The setting is
  checked on each navigation action, including changes during a session.
- Image dimensions are reserved before loading. A slow image has a loading label;
  failed images preserve the frame, alt description, caption and credit. The
  project link stays outside the gallery. Full-size links make small UI text
  available without forced cropping or zoom gestures.
- Native video play is opt-in; navigation pauses videos, as does manually moving
  a video fully outside the strip. Failed video retains its transcript and credit.
- An inner Suspense boundary renders `StaticGallery` while the client gallery
  loads. This native image/video list keeps Work's content visible without scripts
  instead of leaving the whole page behind Next's loading boundary. It has no
  inoperative navigation buttons or permanent loading label. Native alt text is
  the fallback for failed images when scripts are unavailable.

## Verification

- `bun run check`: **57 unit tests** pass (6 added); lint/type generation/TypeScript
  pass. Unit coverage measures the pure navigation model, server rendering and
  media metadata plus the previously exercised modules. The stateful client
  gallery is explicitly excluded from Bun's unit-coverage denominator because its
  interaction proof runs in Playwright; this is not whole-application coverage.
- `bun run build`: production Turbopack build passes, with GA/Brevo disabled.
- `bun run test:e2e`: **19 Chromium browser tests** pass (9 gallery tests added).
  Covers 390/834/1440px gallery proportions and next-frame previews, keyboard focus
  and endpoints, reduced motion, manual browsing, slow/broken images, zero/one/
  missing media, video playback/pause/error/transcript, no-script scrolling and
  captions, plus native horizontal/vertical touch-scroll synthesis. The existing
  shell suite checks body overflow at 320/390/768/1024/1200/1440px.
- Captured and inspected Work at 390, 834 and 1440px, including credits and honest
  empty-media presentation. Mechanical design detector returned no findings.
- Media provenance and dimensions are recorded in
  [media-provenance.md](../content/media-provenance.md); PNG dimensions are tested.

Browser fixtures are isolated in `e2e/fixtures`. Bun builds them to ignored
`.test-fixtures`; Playwright injects them into a temporary document, not a public
test route. No FFmpeg installation is needed in CI: the tiny silent clip is
committed as test data. No new dependency was installed for this ticket.

Physical iOS/Android gestures, real screen-reader speech and cross-engine review
remain MIC-26. Chromium touch synthesis proves browser behaviour, not hardware
testing. Further project media belongs to the page/content tickets; no mockup
screenshots or generated project imagery were substituted. No push, deployment,
domain change, live newsletter action or modification of other repositories.

## Reuse review before MIC-14

`MediaSurface` and `MediaCaption` are shared presentation atoms;
`GalleryCaption` composes credits, full-size links and transcripts for both the
enhanced and static galleries. `MediaFrame` uses those same presentation atoms.
The native fallback and enhanced image renderer remain separate because their
server/failure responsibilities differ.

The [shadcn Carousel source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/carousel.tsx)
was reviewed: it uses Embla with an `overflow-hidden` viewport and captures arrow
keys. It is not a drop-in match for this project's native scrolling, ordered-list
semantics and no-script access. Retain browser scrolling plus the existing
Radix/shadcn Button; no additional carousel engine is needed for this contract.
