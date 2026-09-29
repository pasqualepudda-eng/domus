"use client";

import clsx from "clsx";
import { useRef, type CSSProperties } from "react";
import Button from "@/components/Button/Button";
import FloatingAssets from "@/components/FloatingAssets/FloatingAssets";
import type { TextImageItem } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScrollReveal } from "@/lib/reveal";
import styles from "./TextImage5050.module.css";

function MockCard({ mock }: { mock: TextImageItem["mock"] }) {
  return (
    <div className={styles.mock}>
      <b className={styles.mockTitle}>{mock.title}</b>
      {mock.rows.map((r) => (
        <div key={r.label} className={styles.mockRow}>
          <span className={styles.mockDot} />
          <span>
            <b>{r.label}</b>
            <small>{r.sub}</small>
          </span>
        </div>
      ))}
      {mock.chips && (
        <ul className={styles.chips}>
          {mock.chips.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      )}
      <div className={styles.mockBar}>
        <span />
      </div>
    </div>
  );
}

/**
 * Alternating text / media rows. As a row scrolls in, the media panel unfolds and
 * tilts up to face the reader, the mock card drifts through it, and the copy reveals
 * (eyebrow decodes, title words stand up, lines rise).
 */
export default function TextImage5050({ items }: { items: TextImageItem[] }) {
  const root = useRef<HTMLElement>(null);
  useScrollReveal(root);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(`.${styles.row}`).forEach((row) => {
        const media = row.querySelector(`.${styles.media}`);
        const mock = row.querySelector(`.${styles.mock}`);
        const mirrored = row.classList.contains(styles.mirrored);
        const turn = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1;

        gsap.fromTo(
          media,
          {
            clipPath: "inset(12% 12% 12% 12% round 4rem)",
            rotationX: 16 * turn,
            rotationY: (mirrored ? 10 : -10) * turn,
            transformPerspective: 1400,
          },
          {
            clipPath: "inset(0% 0% 0% 0% round 2.4rem)",
            rotationX: 0,
            rotationY: 0,
            ease: "none",
            scrollTrigger: { trigger: row, start: "top bottom", end: "center center", scrub: true },
          },
        );
        gsap.fromTo(
          mock,
          { yPercent: 30, rotate: -4 },
          {
            yPercent: -20,
            rotate: 3,
            ease: "none",
            scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.section}>
      <div className="container">
        {items.map((item, i) => (
          <div key={item.title} id={item.id} className={clsx(styles.row, i % 2 === 1 && styles.mirrored)}>
            <div className={styles.text}>
              <span className="type-eyebrow" data-reveal="eyebrow">
                {item.eyebrow}
              </span>
              <h2 className="font-display type-display-m" data-reveal="title">
                {item.title}
              </h2>
              {item.text.map((t) => (
                <p key={t} className="type-paragraph-m" data-reveal="lines">
                  {t}
                </p>
              ))}
              <div data-reveal="up">
                <Button label={item.cta.label} href={item.cta.href} variant="tertiary" icon="right" />
              </div>
            </div>
            <div className={styles.mediaWrap}>
              <div
                className={styles.media}
                style={{ "--media-bg": item.color, "--accent": item.accent } as CSSProperties}
              >
                <FloatingAssets
                  variant="inset"
                  assets={[
                    { color: item.accent, shape: i % 2 ? "coin" : "star" },
                    { color: "var(--ink)", shape: "card" },
                    { color: "var(--white)", shape: "pill" },
                  ]}
                />
                <MockCard mock={item.mock} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
