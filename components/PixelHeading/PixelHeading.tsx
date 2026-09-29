"use client";

import clsx from "clsx";
import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type ElementType,
} from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "./PixelHeading.module.css";

/** Block size (px) for each resolution step 0 → 5. 0 = crisp text. */
const BLOCKS = [26, 17, 11, 7, 4, 0];

type Props = {
  as?: ElementType;
  html: string;
  className?: string;
  style?: CSSProperties;
  /**
   * When provided, the parent drives the reveal timeline (e.g. from a
   * scrubbed hero). Otherwise the heading reveals itself.
   */
  onTimeline?: (tl: gsap.core.Timeline) => void;
  /** Self reveal: scrubbed by scroll (default), or played once on page load (heroes). */
  reveal?: "scroll" | "load";
};

/**
 * Display heading that "resolves" from coarse pixels to crisp type in
 * five stepped frames while scaling from 0.9 to 1. On its own it follows
 * the scroll: the closer it gets to the middle of the screen, the sharper.
 */
const PixelHeading = forwardRef<HTMLElement, Props>(function PixelHeading(
  { as: Tag = "h2", html, className, style, onTimeline, reveal = "scroll" },
  ref,
) {
  const el = useRef<HTMLElement>(null);
  const flood = useRef<SVGFEFloodElement>(null);
  const comp = useRef<SVGFECompositeElement>(null);
  const morph = useRef<SVGFEMorphologyElement>(null);
  const tlRef = useRef<gsap.core.Timeline>(null);
  const filterId = `px-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  useImperativeHandle(ref, () => el.current as HTMLElement);

  const setReso = (reso: number) => {
    const node = el.current;
    if (!node) return;
    const b = BLOCKS[Math.max(0, Math.min(5, Math.round(reso)))];
    if (!b) {
      node.style.filter = "none";
      return;
    }
    const half = b / 2;
    flood.current?.setAttribute("x", String(half - 1));
    flood.current?.setAttribute("y", String(half - 1));
    comp.current?.setAttribute("width", String(b));
    comp.current?.setAttribute("height", String(b));
    morph.current?.setAttribute("radius", String(half));
    node.style.filter = `url(#${filterId})`;
  };

  useGSAP(
    () => {
      const state = { reso: 0 };
      setReso(0);
      const tl = gsap
        .timeline({ paused: true })
        .fromTo(el.current, { scale: 0.9 }, { scale: 1, duration: 1, ease: "power3.inOut" }, 0)
        .to(
          state,
          {
            reso: 5,
            duration: 0.7,
            ease: "steps(5)",
            onUpdate: () => setReso(state.reso),
          },
          0.3,
        );
      tlRef.current = tl;
      if (onTimeline) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        tl.progress(1);
      } else if (reveal === "load") {
        gsap.delayedCall(0.4, () => tl.play());
      } else {
        ScrollTrigger.create({ trigger: el.current, start: "top 92%", end: "top 45%", scrub: true, animation: tl });
      }
    },
    { scope: el },
  );

  useEffect(() => {
    if (onTimeline && tlRef.current) onTimeline(tlRef.current);
  }, [onTimeline]);

  return (
    <>
      <svg className={styles.defs} aria-hidden="true" focusable="false">
        <filter id={filterId} x="0" y="0" width="100%" height="100%">
          <feFlood ref={flood} x="12" y="12" width="2" height="2" />
          <feComposite ref={comp} width="26" height="26" />
          <feTile result="grid" />
          <feComposite in="SourceGraphic" in2="grid" operator="in" />
          <feMorphology ref={morph} operator="dilate" radius="13" />
        </filter>
      </svg>
      <Tag
        ref={el}
        className={clsx("font-display", styles.heading, className)}
        style={style}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
});

export default PixelHeading;
