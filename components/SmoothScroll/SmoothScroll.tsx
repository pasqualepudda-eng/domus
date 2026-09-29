"use client";

import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

function ScrollTriggerSync() {
  useLenis(() => ScrollTrigger.update());
  return null;
}

/** On client-side navigation: jump to the top (or the hash) and re-measure triggers. */
function RouteChange() {
  const pathname = usePathname();
  const lenis = useLenis();
  const first = useRef(true);

  useEffect(() => {
    if (!lenis) return;
    if (first.current) {
      first.current = false;
      return;
    }
    lenis.scrollTo(0, { immediate: true, force: true });
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      const hash = window.location.hash;
      if (hash && document.querySelector(hash)) lenis.scrollTo(hash, { duration: 1.2 });
    }, 120);
    return () => window.clearTimeout(id);
  }, [pathname, lenis]);

  return null;
}

/**
 * Lenis smooth scroll driven by the GSAP ticker (lerp 0.2), so that
 * ScrollTrigger scrubs and the smoothed scroll stay in the same frame.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.2, anchors: { offset: -100 } }}>
      <ScrollTriggerSync />
      <RouteChange />
      {children}
    </ReactLenis>
  );
}
