"use client";

import clsx from "clsx";
import { useRef, type CSSProperties } from "react";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import { pillars, stickyCards } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { follow, spring, useScrollFrame } from "@/lib/scrollFrame";
import styles from "./StickyCards.module.css";

const clampLag = gsap.utils.clamp(-40, 40);

/** Three stacked shapes that separate with the scroll speed and wobble back together. */
function Visual({ variant }: { variant: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const lag = useRef([spring(), spring(), spring()]);

  useScrollFrame(
    () => ref.current,
    ({ vy, dt }) => {
      const shapes = ref.current?.children;
      if (!shapes) return;
      lag.current.forEach((s, k) => {
        follow(s, clampLag(-vy * 0.012 * (k + 1)), dt, 140, 10);
        (shapes[k] as HTMLElement).style.transform = `translateY(${s.x.toFixed(1)}px)`;
      });
    },
  );

  return (
    <div ref={ref} className={clsx(styles.visual, styles[`v${variant % 4}`])}>
      <span />
      <span />
      <span />
    </div>
  );
}

/**
 * Cards pin under the header one after another. Each card stands up in 3D as it
 * arrives; as the next one slides over, the cards beneath tip back, shrink and
 * dim, forming a stack.
 */
export default function StickyCards({ id }: { id?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(`.${styles.card}`);
        cards.forEach((card, i) => {
          const inner = card.firstElementChild;
          gsap.fromTo(
            inner,
            { "--in": 1 },
            {
              "--in": 0,
              ease: "power2.out",
              scrollTrigger: { trigger: card, start: "top bottom", end: "top 35%", scrub: true },
            },
          );
          const next = cards[i + 1];
          if (!next) return;
          gsap.fromTo(
            inner,
            { "--back": 0 },
            {
              "--back": 1,
              ease: "none",
              scrollTrigger: { trigger: next, start: "top bottom", end: "top top+=120", scrub: true },
            },
          );
        });

        // Visual inside each card counter-rotates while it is on screen.
        cards.forEach((card) => {
          gsap.fromTo(
            card.querySelector(`.${styles.visual}`),
            { rotate: -12, scale: 0.85 },
            {
              rotate: 12,
              scale: 1.05,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
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
        <SectionIntro
          eyebrow={pillars.eyebrow}
          title={pillars.title}
          text={pillars.text}
          className={styles.intro}
        />
        <ol className={styles.list}>
          {stickyCards.map((c, i) => (
            <li
              key={c.title}
              className={styles.card}
              style={
                {
                  "--bg": c.bg,
                  "--fg": c.fg,
                  "--i": i,
                  "--shrink": 0.04 * (stickyCards.length - 1 - i),
                } as CSSProperties
              }
            >
              <div className={styles.cardInner}>
                <div className={styles.text}>
                  <span className="type-eyebrow">{c.eyebrow}</span>
                  <h3 className="font-display type-display-m">{c.title}</h3>
                  <p className="type-paragraph-l">{c.text}</p>
                </div>
                <div className={styles.visualWrap} aria-hidden="true">
                  <Visual variant={i} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
