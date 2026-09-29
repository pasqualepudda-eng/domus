"use client";

import clsx from "clsx";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { bentos, type Bento } from "@/lib/content";
import styles from "./BentoGrid.module.css";

function Shape({ type }: { type: Bento["shape"] }) {
  switch (type) {
    case "circles":
      return (
        <svg viewBox="0 0 200 160" aria-hidden="true">
          <circle className={styles.float1} cx="70" cy="90" r="46" fill="currentColor" />
          <circle className={styles.float2} cx="128" cy="78" r="46" fill="none" stroke="currentColor" strokeWidth="6" />
          <circle className={styles.float3} cx="160" cy="36" r="12" fill="currentColor" />
        </svg>
      );
    case "stack":
      return (
        <svg viewBox="0 0 200 160" aria-hidden="true">
          <rect className={styles.float1} x="40" y="104" width="120" height="30" rx="15" fill="currentColor" />
          <rect className={styles.float2} x="52" y="68" width="96" height="30" rx="15" fill="currentColor" opacity="0.75" />
          <rect className={styles.float3} x="64" y="32" width="72" height="30" rx="15" fill="currentColor" opacity="0.5" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 200 160" aria-hidden="true">
          <path className={styles.float1} d="M100 18 150 36v38c0 32-22 56-50 68-28-12-50-36-50-68V36l50-18Z" fill="currentColor" />
          <path className={styles.float2} d="m78 80 16 16 30-32" fill="none" stroke="var(--card-bg)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "bubble":
      return (
        <svg viewBox="0 0 200 160" aria-hidden="true">
          <rect className={styles.float1} x="28" y="30" width="104" height="70" rx="26" fill="currentColor" />
          <rect className={styles.float2} x="86" y="74" width="92" height="58" rx="24" fill="none" stroke="currentColor" strokeWidth="6" />
          <circle className={styles.float3} cx="62" cy="65" r="6" fill="var(--card-bg)" />
          <circle className={styles.float3} cx="80" cy="65" r="6" fill="var(--card-bg)" />
          <circle className={styles.float3} cx="98" cy="65" r="6" fill="var(--card-bg)" />
        </svg>
      );
  }
}

function BentoCard({ data }: { data: Bento }) {
  const [active, setActive] = useState(false);
  return (
    <button
      type="button"
      className={clsx(styles.card, active && styles.active)}
      style={{ "--card-bg": data.bg, "--card-fg": data.fg } as CSSProperties}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => setActive((v) => !v)}
      aria-pressed={active}
    >
      <span className={clsx("type-heading-s", styles.heading)}>{data.title}</span>
      <span className={clsx("type-paragraph-m", styles.subHeading)}>{data.hover}</span>
      <span className={styles.shape}>
        <Shape type={data.shape} />
      </span>
    </button>
  );
}

/**
 * Four cards around a central slot. On desktop the slot is left empty so
 * the hero phone sits in the middle; below 1025px the cards become a
 * scroll-snapped carousel with pagination.
 */
export default function BentoGrid({ className }: { className?: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const left = bentos.slice(0, 2);
  const right = bentos.slice(2);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onScroll = () => {
      const cards = Array.from(el.querySelectorAll<HTMLElement>(`.${styles.card}`));
      const center = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setIndex(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (i: number) => {
    const el = scroller.current;
    const card = el?.querySelectorAll<HTMLElement>(`.${styles.card}`)[i];
    if (!el || !card) return;
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: "smooth" });
  };

  return (
    <div className={clsx(styles.bentoGrid, className)}>
      <div ref={scroller} className={styles.content} data-lenis-prevent-touch>
        <div className={clsx(styles.column, styles.columnLeft)}>
          {left.map((b) => (
            <BentoCard key={b.id} data={b} />
          ))}
        </div>
        <div className={styles.centerSlot} aria-hidden="true" />
        <div className={clsx(styles.column, styles.columnRight)}>
          {right.map((b) => (
            <BentoCard key={b.id} data={b} />
          ))}
        </div>
      </div>
      <div className={styles.pagination} role="tablist" aria-label="Carte">
        {bentos.map((b, i) => (
          <button
            key={b.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={b.title}
            className={clsx(styles.dot, i === index && styles.dotActive)}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
