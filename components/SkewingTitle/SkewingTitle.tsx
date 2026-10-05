"use client";

import clsx from "clsx";
import { useMemo, useRef } from "react";
import Button from "@/components/Button/Button";
import FloatingAssets from "@/components/FloatingAssets/FloatingAssets";
import PixelHeading from "@/components/PixelHeading/PixelHeading";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScrollReveal } from "@/lib/reveal";
import { follow, spring, useScrollFrame } from "@/lib/scrollFrame";
import styles from "./SkewingTitle.module.css";

type Props = {
  id?: string;
  title: string;
  text?: string;
  cta?: { label: string; href: string };
};

const clampLean = gsap.utils.clamp(-9, 9);

/**
 * Oversized uppercase title that sharpens from pixels as it scrolls in and
 * leans with the speed of the scroll, wobbling back upright when it stops.
 * On fine pointers each letter stretches and leans toward the cursor,
 * springing back when the pointer leaves.
 */
export default function SkewingTitle({ id, title, text, cta }: Props) {
  const root = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLElement>(null);
  const leanRef = useRef<HTMLDivElement>(null);
  const lean = useRef(spring());
  useScrollReveal(root);

  useScrollFrame(
    () => root.current,
    ({ vy, dt }) => {
      const s = lean.current;
      follow(s, clampLean(vy * 0.0035), dt, 110, 9);
      if (!leanRef.current) return;
      leanRef.current.style.transform = `skewY(${s.x.toFixed(2)}deg) scaleY(${(1 + Math.abs(s.x) * 0.015).toFixed(3)})`;
    },
  );

  const html = useMemo(
    () =>
      title
        .toUpperCase()
        .split(" ")
        .map(
          (word) =>
            `<span class="${styles.word}">${[...word]
              .map((c) => `<span class="${styles.char}">${c}</span>`)
              .join("")}</span>`,
        )
        .join(" "),
    [title],
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const chars = gsap.utils.toArray<HTMLElement>(`.${styles.char}`, headingRef.current);
        const setters = chars.map((c) => ({
          el: c,
          scaleY: gsap.quickTo(c, "scaleY", { duration: 0.6, ease: "power3.out" }),
          skewX: gsap.quickTo(c, "skewX", { duration: 0.6, ease: "power3.out" }),
          y: gsap.quickTo(c, "yPercent", { duration: 0.6, ease: "power3.out" }),
        }));

        let lastX = 0;
        const onMove = (e: PointerEvent) => {
          const velocity = gsap.utils.clamp(-30, 30, e.clientX - lastX);
          lastX = e.clientX;
          setters.forEach(({ el, scaleY, skewX, y }) => {
            const r = el.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            const dist = Math.hypot(dx, dy);
            const falloff = Math.max(0, 1 - dist / (window.innerWidth * 0.28));
            const eased = falloff * falloff * (3 - 2 * falloff);
            scaleY(1 + eased * 0.35);
            skewX(gsap.utils.clamp(-22, 22, -dx * 0.04 * eased - velocity * 0.4 * eased));
            y(-eased * 10);
          });
        };
        const onLeave = () => {
          setters.forEach(({ el }) =>
            gsap.to(el, { scaleY: 1, skewX: 0, yPercent: 0, duration: 1.2, ease: "elastic.out(1, 0.35)", overwrite: true }),
          );
        };

        const section = root.current!;
        section.addEventListener("pointermove", onMove);
        section.addEventListener("pointerleave", onLeave);
        return () => {
          section.removeEventListener("pointermove", onMove);
          section.removeEventListener("pointerleave", onLeave);
        };
      });

    },
    { scope: root },
  );

  return (
    <section ref={root} id={id} className={styles.skewingTitle}>
      <div className={styles.innerWrapper}>
        <div className={styles.background} />
        <FloatingAssets
          assets={[
            { color: "var(--orange)", shape: "coin" },
            { color: "var(--azure)", shape: "pill" },
            { color: "var(--purple)", shape: "star" },
          ]}
        />
        <div className={styles.content}>
          <div ref={leanRef} className={styles.lean}>
            <PixelHeading as="h2" ref={headingRef} html={html} className={clsx(styles.title, "type-display-xl")} />
          </div>
          {text && (
            <p className={clsx(styles.description, "type-paragraph-l")} data-reveal="lines">
              {text}
            </p>
          )}
          {cta && (
            <div data-reveal="up">
              <Button label={cta.label} href={cta.href} size="l" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
