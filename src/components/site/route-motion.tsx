"use client";

import { useLayoutEffect, useRef } from "react";

export function RouteMotion({ pathname }: { pathname: string }) {
  const previousPath = useRef(pathname);

  useLayoutEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const main = document.getElementById("main-content");
    if (preference.matches || !main?.animate) return;

    const easing = "cubic-bezier(0.2, 0.7, 0.3, 1)";
    const entrance = main.animate(
      [{ opacity: 0.64, translate: "0 12px" }, { opacity: 1, translate: "none" }],
      { duration: 280, easing },
    );
    const indicator = document.querySelector<HTMLElement>("[data-nav-indicator]")?.animate(
      [{ opacity: 0.45, scale: "0.35 1" }, { opacity: 1, scale: "1 1" }],
      { duration: 220, easing },
    );
    const cancel = () => {
      entrance.cancel();
      indicator?.cancel();
    };
    const respectPreference = () => {
      if (preference.matches) cancel();
    };
    preference.addEventListener("change", respectPreference);
    return () => {
      preference.removeEventListener("change", respectPreference);
      cancel();
    };
  }, [pathname]);

  return null;
}
