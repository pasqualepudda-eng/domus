"use client";

import clsx from "clsx";
import { useRef, type ElementType } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./RevealText.module.css";

/**
 * Words start as outlines and fill with ink one by one as the block scrolls
 * through the viewport (and empty again when scrolled back).
 */
export default function RevealText({
  as: Tag = "p",
  text,
  className,
}: {
  as?: ElementType;
  text: string;
  className?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current!;
        // The outline takes the text colour of wherever the block is placed.
        el.style.setProperty("--ink", getComputedStyle(el).color);
        el.dataset.ink = "";
        gsap.fromTo(
          `.${styles.word}`,
          { "--fill": 0 },
          {
            "--fill": 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 45%", scrub: true },
          },
        );
        return () => {
          delete el.dataset.ink;
        };
      });
    },
    { scope: root },
  );

  return (
    <Tag ref={root} className={clsx(styles.reveal, className)} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} className={styles.word} aria-hidden="true">
          {w}{" "}
        </span>
      ))}
    </Tag>
  );
}
