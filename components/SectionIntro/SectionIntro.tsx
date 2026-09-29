"use client";

import clsx from "clsx";
import { useRef } from "react";
import { useScrollReveal } from "@/lib/reveal";
import styles from "./SectionIntro.module.css";

/**
 * Eyebrow + heading block, revealed by scroll: the eyebrow decodes, the heading's
 * words stand up in 3D one after the other, the text rises line by line.
 */
export default function SectionIntro({
  eyebrow,
  title,
  text,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  useScrollReveal(root);

  return (
    <div ref={root} className={clsx(styles.intro, align === "center" && styles.center, className)}>
      {eyebrow && (
        <span className="type-eyebrow" data-reveal="eyebrow">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display type-display-m" data-reveal="title">
        {title}
      </h2>
      {text && (
        <p className={clsx("type-paragraph-l", styles.text)} data-reveal="lines">
          {text}
        </p>
      )}
    </div>
  );
}
