# Chromatique — decision record extracts

Source repository revision: 79a1c5b2a37439f3731113b58b4c3265e5777df7.
These are verbatim extracts of the named project decision records, not a benchmark report. The complete ADR-0010 is partly superseded by ADR-0025 for structure preservation; the extract below concerns lightness selection only.

## Rust core — ADR-0001 (2026-09-09)

## Decision

**Rust** is the reference core engine (`crates/chromatique-core`).

The claim is based on ecosystem fit, not novelty:

- performance and memory safety for high-resolution/batch/video workloads;
- a mature image ecosystem (`image`, `imagequant`);
- first-class WASM support for privacy-first browser processing;
- a C ABI path for Python, Go, and C/C++ bindings;
- deterministic, well-controlled numerics.

## Alternatives

- **Go / Node** — pleasant for the engines' *consumers*, not for
  performance-critical numeric kernels.
- **C/C++** — viable for interoperability/GPU work but not the safest
  default for a security-conscious color engine.
- **Python as core** — rejected for runtime performance and distribution;
  Python stays first-class for research/prototyping via `chromatique-python`.



## Lightness selection — ADR-0010 (2026-09-17)

### 1. `preserve.luminance: true` = lightness-first selection

Mapping chooses the palette entry whose OKLab `L` is **closest to the
pixel's**, using chroma distance (`Δa² + Δb²`) only to break ties, and
finally palette order (lowest index). This is lexicographic, not a weighted
sum, because it makes a guarantee a weighting cannot: the per-pixel
lightness error is *minimal over the palette* — no pixel is ever made less
faithful in tonality. Asserted by
`luminance_preservation_never_worsens_lightness`.

The palette itself is never modified, so output stays strictly on-palette
and the requested color language is intact (§21). Selection still runs in
the recipe's working space and composes with every dithering strategy: error
diffusion diffuses the true quantization error of the *selected* entry.

### 2. Luminance preservation is OKLab-only

`transform.space: srgb` + `luminance: true` is rejected
(`RecipeError::LuminancePreserveRequiresOklab`), and
`chromatique map --preserve-luminance --space srgb` fails as a usage error
(exit 2). "Luminance" is an OKLab channel; the sRGB path measures non-linear
R/G/B and has no lightness term, so honoring the flag there would be
meaningless. The alternative — silently mapping as if the flag were absent —
is forbidden by §15.


