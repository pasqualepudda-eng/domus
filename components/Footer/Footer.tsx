"use client";

import clsx from "clsx";
import Link from "next/link";
import { useRef, useState } from "react";
import CookiePreferencesButton from "@/components/CookieConsent/CookiePreferencesButton";
import { ChevronIcon } from "@/components/Icons/Icons";
import Wordmark from "@/components/Wordmark/Wordmark";
import { footer } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { follow, spring, useScrollFrame } from "@/lib/scrollFrame";
import styles from "./Footer.module.css";

const clampStretch = gsap.utils.clamp(0, 0.35);

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const big = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const stretch = useRef(footer.wordmark.split("").map(() => spring()));

  // The oversized wordmark rises letter by letter with the scroll, completing
  // exactly as the page reaches its end.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          `.${styles.bigChar}`,
          { yPercent: 110 },
          {
            yPercent: 0,
            ease: "power3.out",
            stagger: 0.06,
            scrollTrigger: { trigger: big.current, start: "top bottom", end: "bottom bottom", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  // Scroll speed stretches the letters; each one follows its neighbour on a
  // spring, so the stretch travels along the word as a wave and wobbles out.
  useScrollFrame(
    () => big.current,
    ({ vy, dt }) => {
      const masks = big.current?.children;
      if (!masks) return;
      stretch.current.forEach((s, i) => {
        const target = i === 0 ? clampStretch(Math.abs(vy) * 0.00012) : stretch.current[i - 1].x;
        follow(s, target, dt, 260, 13);
        (masks[i] as HTMLElement).style.transform = `scaleY(${(1 + s.x).toFixed(3)})`;
      });
    },
  );

  return (
    <footer ref={root} className={styles.footer}>
      <div className={clsx("container", styles.top)}>
        <div className={styles.brand}>
          <Link href="/" aria-label="ARKADOMUS GEIE — home">
            <Wordmark className={styles.wordmark} />
          </Link>
          <p className={clsx("type-heading-xs", styles.tagline)}>{footer.tagline}</p>
          <p className="type-paragraph-m">{footer.description}</p>
        </div>

        <div className={styles.columns}>
          {footer.columns.map((col, i) => (
            <div key={col.title} className={clsx(styles.column, open === i && styles.columnOpen)}>
              <button
                type="button"
                className={styles.label}
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="type-eyebrow">{col.title}</span>
                <ChevronIcon className={styles.chevron} />
              </button>
              <div className={styles.links}>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={clsx("container", styles.bottom)}>
        <span>
          © {new Date().getFullYear()} {footer.copyright}
        </span>
        <ul className={styles.legal}>
          <li>
            <Link href="/termini-e-condizioni">Termini e condizioni</Link>
          </li>
          <li>
            <Link href="/cookie-policy">Cookie policy</Link>
          </li>
          <li>
            <CookiePreferencesButton />
          </li>
          <li>
            <Link href="/mappa-del-sito">Mappa del sito</Link>
          </li>
        </ul>
      </div>

      <div ref={big} className={styles.big} aria-hidden="true">
        {footer.wordmark.split("").map((c, i) => (
          <span key={i} className={styles.bigMask}>
            <span className={clsx(styles.bigChar, "font-display")}>{c}</span>
          </span>
        ))}
      </div>
    </footer>
  );
}
