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

    const entrance = main.animate(
      [{ opacity: 0.78, translate: "0 6px" }, { opacity: 1, translate: "none" }],
      { duration: 220, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)" },
    );
    const respectPreference = () => {
      if (preference.matches) entrance.cancel();
    };
    preference.addEventListener("change", respectPreference);
    return () => {
      preference.removeEventListener("change", respectPreference);
      entrance.cancel();
    };
  }, [pathname]);

  return null;
}
