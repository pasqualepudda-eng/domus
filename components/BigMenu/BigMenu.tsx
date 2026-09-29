"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Button from "@/components/Button/Button";
import CookiePreferencesButton from "@/components/CookieConsent/CookiePreferencesButton";
import { ArrowIcon, ChevronIcon } from "@/components/Icons/Icons";
import { bigMenu, bigMenuLegal, footer } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./BigMenu.module.css";

const normalize = (p: string) => (p.length > 1 ? p.replace(/\/$/, "") : p);

/**
 * Full-screen menu opened by the hamburger. The panel drops in with rounded
 * corners, the oversized links rise out of their masks, and hovering a link
 * swaps the preview card on the right. Below 1025px each link expands to
 * show its sections.
 */
export default function BigMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);
  const pathname = normalize(usePathname() || "/");
  const currentIndex = Math.max(0, bigMenu.findIndex((i) => normalize(i.href) === pathname));
  const [hover, setHover] = useState(currentIndex);
  const [expanded, setExpanded] = useState<number | null>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .set(root.current, { autoAlpha: 1 })
        .fromTo(
          q(`.${styles.bg}`),
          { clipPath: "inset(0% 0% 100% 0% round 0 0 50% 50%)" },
          { clipPath: "inset(0% 0% 0% 0% round 0 0 0% 0%)", duration: 0.9, ease: "expo.inOut" },
          0,
        )
        .fromTo(q(`.${styles.line}`), { yPercent: 115 }, { yPercent: 0, duration: 1, stagger: 0.06 }, 0.35)
        .fromTo(q(`.${styles.num}`), { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.06 }, 0.5)
        .fromTo(
          q(`.${styles.preview}`),
          { autoAlpha: 0, y: 60, rotate: 3 },
          { autoAlpha: 1, y: 0, rotate: 0, duration: 1, ease: "back.out(1.3)" },
          0.5,
        )
        .fromTo(q(`.${styles.bottom} > *`), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05 }, 0.7);
    },
    { scope: root },
  );

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (open) {
      setHover(currentIndex);
      t.timeScale(1).play();
    } else {
      setExpanded(null);
      t.timeScale(1.8).reverse();
    }
  }, [open, currentIndex]);

  const item = bigMenu[hover];

  return (
    <div ref={root} className={styles.menu} aria-hidden={!open} data-lenis-prevent>
      <div className={styles.bg} />

      <div className={clsx("container", styles.inner)}>
        <nav className={styles.primary} aria-label="Menu principale">
          <ol className={styles.list}>
            {bigMenu.map((it, i) => {
              const isCurrent = i === currentIndex && normalize(it.href) === pathname;
              return (
                <li
                  key={it.label}
                  className={clsx(styles.row, i === hover && styles.rowHover, expanded === i && styles.rowOpen)}
                  style={{ "--accent": it.bg } as CSSProperties}
                  onMouseEnter={() => setHover(i)}
                >
                  <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                  <Link
                    href={it.href}
                    className={styles.bigLink}
                    onClick={onClose}
                    onFocus={() => setHover(i)}
                    tabIndex={open ? 0 : -1}
                    aria-current={isCurrent ? "page" : undefined}
                  >
                    <span className={styles.mask}>
                      <span className={clsx("font-display", styles.line)}>
                        <span className={styles.roll} data-text={it.label}>
                          {it.label}
                        </span>
                      </span>
                    </span>
                    {isCurrent && <span className={styles.here} aria-hidden="true" />}
                    <ArrowIcon className={styles.arrow} />
                  </Link>
                  <button
                    type="button"
                    className={styles.expand}
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    aria-expanded={expanded === i}
                    aria-label={`Sezioni di ${it.label}`}
                    tabIndex={open ? 0 : -1}
                  >
                    <ChevronIcon />
                  </button>
                  <div className={styles.sub}>
                    <ul>
                      {it.links.map((l) => (
                        <li key={l.label}>
                          <Link href={l.href} onClick={onClose} tabIndex={open ? 0 : -1}>
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>

        <aside className={styles.preview} style={{ "--bg": item.bg, "--fg": item.fg } as CSSProperties}>
          <div key={item.label} className={styles.previewInner}>
            <span className={styles.shapes} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            {item.eyebrow && <p className="type-eyebrow">{item.eyebrow}</p>}
            <p className={clsx("type-heading-s", styles.previewTitle)}>{item.description}</p>
            <ul className={styles.previewLinks}>
              {item.links.map((l, i) => (
                <li key={l.label} style={{ "--i": i } as CSSProperties}>
                  <Link href={l.href} onClick={onClose} tabIndex={open ? 0 : -1}>
                    {l.label}
                    <ArrowIcon />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className={styles.bottom}>
          <p className={styles.tagline}>{footer.tagline}</p>
          <ul className={styles.legal}>
            {bigMenuLegal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={onClose} tabIndex={open ? 0 : -1}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <CookiePreferencesButton />
            </li>
          </ul>
          <div className={styles.cta}>
            <Button label="Parla con noi" href="/contatti" variant="light" icon="right" />
          </div>
        </div>
      </div>
    </div>
  );
}
