"use client";

import clsx from "clsx";
import { useLenis } from "lenis/react";
import { useState } from "react";
import { sections } from "@/lib/content";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "./SectionPagination.module.css";

/** Fixed dot navigation on the right edge (desktop only). */
export default function SectionPagination() {
  const [active, setActive] = useState(0);
  const lenis = useLenis();

  useGSAP(() => {
    sections.forEach((s, i) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => self.isActive && setActive(i),
      });
    });
  });

  return (
    <nav className={styles.pagination} aria-label="Sezioni">
      <ul>
        {sections.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              className={clsx(styles.dot, i === active && styles.active)}
              onClick={() => lenis?.scrollTo(`#${s.id}`, { duration: 1.6 })}
              aria-label={s.label}
              aria-current={i === active}
            >
              <span className={styles.tooltip}>{s.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
