"use client";

import clsx from "clsx";
import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { ArrowIcon } from "@/components/Icons/Icons";
import { gsap, useGSAP } from "@/lib/gsap";
import { follow, spring, useScrollFrame } from "@/lib/scrollFrame";
import { sitePages } from "@/lib/site";
import styles from "./SiteMapGrid.module.css";

const clampTilt = gsap.utils.clamp(0, 1);

/**
 * One page card. Below the middle of the screen it lies tilted back and lowered;
 * it stands up as it scrolls toward the middle, on a spring, so it settles with a nod.
 */
function PageCard({ children, bg }: { children: React.ReactNode; bg: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const face = useRef<HTMLDivElement>(null);
  const tilt = useRef(spring());

  useScrollFrame(
    () => ref.current,
    ({ ny, dt }) => {
      const s = tilt.current;
      const target = clampTilt((ny - 0.25) * 1.8);
      if (dt === 0) s.x = target;
      else follow(s, target, dt, 150, 14);
      if (!face.current) return;
      face.current.style.transform = `perspective(1200px) rotateX(${(s.x * 28).toFixed(2)}deg) translateY(${(s.x * 60).toFixed(1)}px)`;
      face.current.style.opacity = (1 - s.x * 0.35).toFixed(3);
    },
  );

  return (
    <div ref={ref} className={styles.slot}>
      <div ref={face} className={styles.card} style={{ "--bg": bg } as CSSProperties}>
        {children}
      </div>
    </div>
  );
}

const COLORS = [
  "var(--green)",
  "var(--orange)",
  "var(--purple-light)",
  "var(--blue-light)",
  "var(--pink-light)",
  "var(--green-light)",
  "var(--gray-light)",
];

/** Human-readable site map: one card per page, with its sections. */
export default function SiteMapGrid() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(`.${styles.reveal}`, { y: 40, autoAlpha: 0, duration: 1, ease: "expo.out", stagger: 0.08, delay: 0.3 });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <header className={styles.hero}>
        <div className="container">
          <p className={clsx("type-eyebrow", styles.reveal)}>Navigazione</p>
          <h1 className={clsx("font-display type-display-l", styles.reveal)}>Mappa del sito</h1>
          <p className={clsx("type-paragraph-l", styles.reveal)}>Tutte le pagine e le sezioni di ARKADOMUS GEIE.</p>
        </div>
      </header>

      <div className={clsx("container", styles.grid)}>
        {sitePages.map((p, i) => (
          <PageCard key={p.path} bg={COLORS[i % COLORS.length]}>
            <Link href={p.path} className={styles.main}>
              <span className={styles.path}>{p.path === "/" ? "/" : `${p.path}/`}</span>
              <span className="type-heading-m">{p.title}</span>
              <span className={styles.desc}>{p.description}</span>
              <ArrowIcon className={styles.arrow} />
            </Link>
            {p.sections && (
              <ul className={styles.sections}>
                {p.sections.map((s) => (
                  <li key={s.hash}>
                    <Link href={`${p.path === "/" ? "" : p.path}/#${s.hash}`}>{s.label}</Link>
                  </li>
                ))}
              </ul>
            )}
          </PageCard>
        ))}
      </div>
    </div>
  );
}
