Place optimized `.lottie` files here; the player also accepts Lottie `.json`.

Use `LottieAnimation` from `@/components/animations/lottie-animation` with a
`src` such as `/animations/check.lottie`, a fixed-size `className`, and a static
`fallback`. It loads near the viewport, unmounts offscreen, and uses the fallback
when reduced motion is preferred. The player loads its WASM runtime from the
LottieFiles CDN by default; self-host it before introducing a restrictive CSP.
