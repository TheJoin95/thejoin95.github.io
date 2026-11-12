# Project media provenance

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
