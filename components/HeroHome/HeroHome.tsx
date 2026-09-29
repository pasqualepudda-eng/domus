"use client";

import clsx from "clsx";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import BentoGrid from "@/components/BentoGrid/BentoGrid";
import Button from "@/components/Button/Button";
import PhoneUI from "@/components/PhoneUI/PhoneUI";
import PixelHeading from "@/components/PixelHeading/PixelHeading";
import { hero } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { BP_BELOW_DESKTOP, BP_MOBILE, useMediaQuery } from "@/lib/hooks";
import styles from "./HeroHome.module.css";

let maxTextureSize: number | null = null;

/** Largest bitmap the GPU will happily rasterise the zoomed title into. */
function getMaxTexture() {
  if (maxTextureSize !== null) return maxTextureSize;
  let size = 4096;
  try {
    const gl = document.createElement("canvas").getContext("webgl");
    if (gl) size = gl.getParameter(gl.MAX_TEXTURE_SIZE) || size;
  } catch {
    size = 4096;
  }
  maxTextureSize = 0.85 * Math.min(size, 8192);
  return maxTextureSize;
}

/**
 * Pinned 700lvh hero. Scroll progress scrubs a single timeline:
 * 1. the title (knocked out over a moving gradient) zooms into its <i> word
 * 2. the page turns light and a phone rises into the centre
 * 3. the phone mask lifts, a pixel heading resolves, the screen swaps
 * 4. the phone re-masks and the bento grid slides up around it.
 */
export default function HeroHome() {
  const root = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleSolidRef = useRef<HTMLDivElement>(null);
  const solidWrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const ui1Ref = useRef<HTMLDivElement>(null);
  const ui2Ref = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);

  const isBelowDesktop = useMediaQuery(BP_BELOW_DESKTOP);
  const isMobile = useMediaQuery(BP_MOBILE);
  const [headingTl, setHeadingTl] = useState<gsap.core.Timeline | null>(null);
  const [bentoHeight, setBentoHeight] = useState(0);
  const [fontsReady, setFontsReady] = useState(false);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  const onHeadingTimeline = useCallback((tl: gsap.core.Timeline) => setHeadingTl(tl), []);

  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => !cancelled && setFontsReady(true));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const measure = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
      if (ui1Ref.current) setBentoHeight(ui1Ref.current.offsetHeight);
    };
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(measure, 150);
    };
    measure();
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useGSAP(
    () => {
      const title = titleRef.current;
      const word = title?.querySelector("i");
      if (!title || !word || !headingTl || !fontsReady) return;

      gsap.set(phoneRef.current, { opacity: 1, xPercent: -50, y: "100vh" });
      gsap.set(backgroundRef.current, { opacity: 0 });
      gsap.set(bentoRef.current, { autoAlpha: 1, y: "100vh" });

      // Rasterise the title big, then scale down, so the zoom stays sharp.
      const baseSize = isMobile ? 3.2 : isBelowDesktop ? 6.4 : 10;
      const titles = [title, titleSolidRef.current].filter(Boolean);
      const box = title.getBoundingClientRect();
      const wordBox = word.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const factor = Math.max(1, Math.min(9, getMaxTexture() / (Math.max(box.width, box.height) * dpr)));
      const u = (wordBox.left + wordBox.width / 2 - box.left) / box.width;
      const v = (wordBox.top + wordBox.height / 2 - box.top) / box.height;

      // Below desktop the heading can't share the screen with the phone:
      // the phone gets its moment, leaves, then the heading resolves.
      const headingAt = isBelowDesktop ? 0.9 : 0.75;

      const tl = gsap.timeline({ defaults: { ease: "expo.inOut" } });

      tl.set(titles, { fontSize: `${baseSize}rem`, scale: 1, x: 0, y: 0 }, 0)
        .set(solidWrapRef.current, { opacity: 0 }, 0)
        .set(titles, { fontSize: `${baseSize * factor}rem`, scale: 1 / factor, immediateRender: false }, 0.2)
        .to(
          titles,
          {
            scale: 5,
            x: `${-5 * (u - 0.5) * 100}%`,
            y: `${-5 * (v - 0.5) * 100}%`,
            duration: 0.35,
            force3D: true,
          },
          0.2,
        )
        .to(solidWrapRef.current, { opacity: 1, duration: 0.15, ease: "none" }, 0.2)
        .to(buttonRef.current, { autoAlpha: 0, duration: 0.15, ease: "expo.out" }, 0.2)
        .to(phoneRef.current, { y: "-50%", duration: 0.3, ease: "expo.out" }, 0.3)
        .to(backgroundRef.current, { opacity: 1, duration: 0.025, ease: "expo.out" }, 0.4)
        .fromTo(maskRef.current, { yPercent: 0 }, { yPercent: -101, duration: 0.22, ease: "power2.inOut" }, 0.6)
        .fromTo(
          headingRef.current,
          { autoAlpha: 0, scale: 0.9 },
          { autoAlpha: 1, scale: 1, duration: 0.1, ease: "power3.inOut" },
          headingAt,
        )
        .fromTo(root.current, { "--logo-color": "#cce7ff" }, { "--logo-color": "#013330", duration: 0.1, ease: "none" }, 0.4);

      // Drive the pixel heading's own timeline from the scroll.
      tl.fromTo(
        headingTl,
        { time: 0 },
        { time: headingTl.duration(), duration: 0.2, ease: "none", immediateRender: false },
        headingAt,
      );

      if (isBelowDesktop) {
        tl.to(phoneRef.current, { autoAlpha: 0, yPercent: -60, duration: 0.1, ease: "power2.in" }, 0.8)
          .to(headingRef.current, { autoAlpha: 0, duration: 0.1, ease: "expo.inOut" }, 1.15)
          .to(bentoRef.current, { y: 0, duration: 0.15, ease: "expo.out" }, 1.2);
      } else {
        tl.set(ui1Ref.current, { autoAlpha: 0 }, 0.85)
          .set(ui2Ref.current, { autoAlpha: 1 }, 0.85)
          .to(headingRef.current, { autoAlpha: 0, duration: 0.1, ease: "expo.inOut" }, 0.9)
          .to(maskRef.current, { yPercent: 0, duration: 0.2, ease: "power2.inOut" }, 0.9)
          .to(bentoRef.current, { y: 0, duration: 0.15, ease: "expo.out" }, 0.95);
      }

      // Hold the final state for a while before the section unpins.
      tl.addLabel("animation-end", ">").to({}, { duration: 0.25 }, ">");

      let scrolling = false;
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        animation: tl,
        onUpdate: (self) => {
          // Reveal the moving gradient through the title only while scrolling.
          const edge = self.progress <= 0.001 || self.progress >= 0.999;
          if (!edge && !scrolling) {
            scrolling = true;
            gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.4, ease: "power1.out" });
          } else if (edge && scrolling) {
            scrolling = false;
            gsap.to(overlayRef.current, { autoAlpha: 1, duration: 0.4, ease: "power1.in" });
          }
        },
      });
    },
    {
      scope: root,
      dependencies: [isBelowDesktop, isMobile, headingTl, fontsReady, viewport.w, viewport.h],
      revertOnUpdate: true,
    },
  );

  return (
    <section
      ref={root}
      id="hero"
      className={styles.scrollContainer}
      style={{ "--logo-color": "#cce7ff" } as CSSProperties}
    >
      <div className={styles.stickyWrapper}>
        <div className={styles.hero}>
          <div ref={backgroundRef} className={styles.background} aria-hidden="true" />

          {/* Stand-in for the original background video: drifting colour fields */}
          <div className={styles.videoBackground} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div ref={overlayRef} className={styles.videoOverlay} />

          <div className={styles.titleWrapper}>
            <div ref={titleRef} className={clsx(styles.title, "font-display")}>
              <h1 dangerouslySetInnerHTML={{ __html: hero.title }} />
            </div>
          </div>
          <div className={styles.titleRecolor} aria-hidden="true" />
          <div ref={solidWrapRef} className={styles.titleWrapperSolid} aria-hidden="true">
            <div ref={titleSolidRef} className={clsx(styles.title, "font-display")}>
              <div dangerouslySetInnerHTML={{ __html: hero.title }} />
            </div>
          </div>

          <div ref={buttonRef} className={styles.heroButton}>
            <Button label={hero.cta.label} href={hero.cta.href} variant="light" size="l" />
            <Button
              label={hero.ctaSecondary.label}
              href={hero.ctaSecondary.href}
              variant="secondary"
              size="l"
              icon="right"
            />
          </div>

          <div ref={phoneRef} className={styles.phoneWrapper}>
            <div ref={ui1Ref} className={styles.phoneUi}>
              <PhoneUI screen="home" />
            </div>
            <div ref={ui2Ref} className={styles.phoneUi} style={{ visibility: "hidden" }}>
              <PhoneUI screen="activity" />
            </div>
            <div ref={maskRef} className={styles.mobileMaskBackground} />
          </div>

          <PixelHeading
            as="h2"
            ref={headingRef}
            html={hero.secondary}
            onTimeline={onHeadingTimeline}
            className={clsx(styles.secondaryHeading, "type-display-m")}
          />

          <div
            ref={bentoRef}
            className={clsx(styles.bentoWrapper, !isBelowDesktop && "container")}
            style={{ "--bento-height": `${bentoHeight}px` } as CSSProperties}
          >
            <BentoGrid />
          </div>
        </div>
      </div>
    </section>
  );
}
