Original fox clips are in `fox/`; inspectable `.json` accompanies compressed
`.lottie`. Editable vector source and model/rights notes are in `assets/fox/`.

Use `LottieAnimation` from `@/components/animations/lottie-animation` with a
`src` such as `/animations/check.lottie`, a fixed-size `className`, and a static
`fallback`. It loads near the viewport, unmounts offscreen, and uses the fallback
when reduced motion is preferred. Clips play once and finish at the supplied
resting poster. Completion, offscreen cancellation and enabling reduced motion
settle to the poster without replay on re-entry. A new deliberate reaction needs
a new React `key` (for example the interaction counter); do not mount this helper
as an automatically recurring decoration. Hidden-tab visibility events pause and
resume an unfinished clip. Missing animation/runtime files retain the poster.

`bun run build:fox` recreates original exports and copies the exact locked
dotLottie WASM engine and MIT licence into `runtime/`. Dev/build run this step;
no LottieFiles CDN request is needed. That reproducible third-party runtime
directory is gitignored. Do not remove the runtime build step when deploying.
