"use client";

import clsx from "clsx";
import { useRef } from "react";
import Odometer from "@/components/Odometer/Odometer";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import { stats } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScrollReveal } from "@/lib/reveal";
import styles from "./Stats.module.css";

/** Big figures whose digits roll into place as the band scrolls in, over a rule that draws itself. */
export default function Stats({ id }: { id?: string }) {
  const root = useRef<HTMLElement>(null);
  useScrollReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(`.${styles.item}`).forEach((item, i) => {
          gsap.fromTo(
            item.querySelector(`.${styles.rule}`),
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "power2.inOut",
              scrollTrigger: { trigger: item, start: `top ${94 - i * 4}%`, end: `top ${55 - i * 4}%`, scrub: true },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id={id} className={styles.section}>
      <div className="container">
        <SectionIntro eyebrow={stats.eyebrow} title={stats.title} className={styles.intro} />
        <ul className={styles.list}>
          {stats.items.map((s, i) => (
            <li key={s.label} className={styles.item}>
              <span className={styles.rule} />
              <span className={clsx("font-display", styles.figure)}>
                <Odometer value={`${s.value}${s.suffix}`} stagger={i} />
              </span>
              <p className="type-paragraph-m" data-reveal="lines">
                {s.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
