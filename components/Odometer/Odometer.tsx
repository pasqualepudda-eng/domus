"use client";

import clsx from "clsx";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { BP_DESKTOP } from "@/lib/hooks";
import styles from "./Odometer.module.css";

type Props = {
  /** Final value, digits plus any symbols ("100+", "2004"). */
  value: string;
  /** Starting digits, same count as the value's digits (defaults to all zeros). */
  from?: string;
  /** Delays this counter relative to others triggered at the same height. */
  stagger?: number;
  className?: string;
};

/**
 * A number whose digits roll into place like an odometer: the lower digits spin more
 * turns than the higher ones, symbols pop in at the end. On desktop the roll is scrubbed
 * by scroll; below desktop it plays once on entry (see the timeline below).
 * The final value is what renders without JavaScript and what assistive tech reads.
 */
export default function Odometer({ value, from, stagger = 0, className }: Props) {
  const root = useRef<HTMLSpanElement>(null);
  const chars = [...value];
  const digits = chars.filter((c) => /\d/.test(c)).length;

  let seen = 0;
  const columns = chars.map((c) => {
    if (!/\d/.test(c)) return { symbol: c };
    const place = digits - 1 - seen; // 0 = rightmost digit
    const start = from ? Number(from[seen]) || 0 : 0;
    seen += 1;
    const turns = place === 0 ? 2 : place === 1 ? 1 : 0;
    const steps = turns * 10 + ((Number(c) - start + 10) % 10);
    return { digit: c, cells: Array.from({ length: steps + 1 }, (_, i) => (start + i) % 10), steps };
  });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: BP_DESKTOP }, (ctx) => {
        const { motion, desktop } = ctx.conditions!;
        if (!motion) return;
        const shift = stagger * 4;
        // Below desktop the figures sit in the lower part of the screen while the text above
        // is read, so a scrub would leave them frozen mid-roll with half-cut digits: there the
        // roll plays once when the number enters and rewinds when scrolled back above it.
        const tl = gsap.timeline({
          delay: desktop ? 0 : stagger * 0.12,
          scrollTrigger: desktop
            ? { trigger: root.current, start: `top ${96 - shift}%`, end: `top ${68 - shift}%`, scrub: 0.6 }
            : { trigger: root.current, start: "top 85%", toggleActions: "play none none reverse" },
        });
        gsap.utils.toArray<HTMLElement>(`.${styles.strip}`).forEach((strip, i) => {
          const end = (-100 * Number(strip.dataset.steps)) / strip.children.length;
          // The strip renders at its final offset; start it from the top.
          tl.fromTo(
            strip,
            { y: 0, yPercent: 0 },
            { yPercent: end, duration: 1, ease: desktop ? "power2.inOut" : "power3.out" },
            i * 0.08,
          );
        });
        const symbols = gsap.utils.toArray<HTMLElement>(`.${styles.sym}`);
        if (symbols.length) {
          tl.fromTo(symbols, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(3)" }, ">-0.2");
        }
        if (!desktop) tl.duration(1.6);
      });
    },
    { scope: root },
  );

  return (
    <span ref={root} className={clsx(styles.odometer, className)}>
      <span className="sr-only">{value}</span>
      <span className={styles.digits} aria-hidden="true">
        {columns.map((col, i) =>
          col.cells ? (
            <span key={i} className={styles.col}>
              <span className={styles.sizer}>{col.digit}</span>
              <span
                className={styles.strip}
                data-steps={col.steps}
                style={{ transform: `translateY(${(-100 * col.steps) / col.cells.length}%)` }}
              >
                {col.cells.map((d, j) => (
                  <span key={j}>{d}</span>
                ))}
              </span>
            </span>
          ) : (
            <span key={i} className={styles.sym}>
              {col.symbol}
            </span>
          ),
        )}
      </span>
    </span>
  );
}
