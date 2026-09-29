"use client";

import clsx from "clsx";
import { useRef, useState } from "react";
import { PlusIcon } from "@/components/Icons/Icons";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import { faq } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./Faq.module.css";

/**
 * Accordion. As the list scrolls in, each divider draws itself from the left,
 * then its question tips up into place and the toggle spins in.
 */
export default function Faq({ id }: { id?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const list = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          list.current,
          { "--line": 0 },
          {
            "--line": 1,
            ease: "power2.inOut",
            scrollTrigger: { trigger: list.current, start: "top 95%", end: "top 70%", scrub: true },
          },
        );
        gsap.utils.toArray<HTMLElement>(`.${styles.item}`).forEach((item) => {
          gsap
            .timeline({ scrollTrigger: { trigger: item, start: "top 96%", end: "top 66%", scrub: true } })
            .fromTo(item, { "--line": 0 }, { "--line": 1, duration: 1, ease: "power2.inOut" }, 0)
            .fromTo(
              item.querySelector(`.${styles.qText}`),
              { yPercent: 70, rotationX: -60, opacity: 0, transformPerspective: 600, transformOrigin: "50% 100%" },
              { yPercent: 0, rotationX: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
              0.15,
            )
            .fromTo(
              item.querySelector(`.${styles.iconWrap}`),
              { scale: 0, rotation: -180 },
              { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2)" },
              0.35,
            );
        });
      });
    },
    { scope: list },
  );

  return (
    <section id={id} className={styles.section}>
      <div className={clsx("container", styles.grid)}>
        <div className={styles.aside}>
          <SectionIntro eyebrow={faq.eyebrow} title={faq.title} />
        </div>
        <ul ref={list} className={styles.list}>
          {faq.items.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className={clsx(styles.item, isOpen && styles.open)}>
                <button
                  type="button"
                  className={styles.question}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className={clsx("type-heading-s", styles.qText)}>{f.q}</span>
                  <span className={styles.iconWrap}>
                    <span className={styles.icon}>
                      <PlusIcon />
                    </span>
                  </span>
                </button>
                <div className={styles.answer}>
                  <div>
                    <p className="type-paragraph-m">{f.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
