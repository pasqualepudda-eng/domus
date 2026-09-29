"use client";

import { useEffect, useState } from "react";

export const BP_TABLET = "(min-width: 768px)";
export const BP_DESKTOP = "(min-width: 1025px)";
export const BP_BELOW_DESKTOP = "(max-width: 1024px)";
export const BP_MOBILE = "(max-width: 767px)";

/** SSR-safe media query hook. Returns `fallback` until mounted. */
export function useMediaQuery(query: string, fallback = false) {
  const [matches, setMatches] = useState(fallback);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
