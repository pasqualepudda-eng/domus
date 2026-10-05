"use client";

import clsx from "clsx";
import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./ValuesGrid.module.css";

const COLORS = [
  ["var(--azure)", "var(--azure-dark)"],
  ["var(--orange)", "var(--orange-dark)"],
  ["var(--purple-light)", "var(--purple-dark)"],
  ["var(--blue-light)", "var(--ink)"],
  ["var(--pink-light)", "var(--orange-dark)"],
  ["var(--azure-light)", "var(--azure-dark)"],
];

function Glyph({ i }: { i: number }) {
  const shapes = [
    <g key="0"><circle cx="18" cy="24" r="10" /><circle cx="30" cy="24" r="10" fillOpacity=".55" /></g>,
    <path key="1" d="M24 6 40 13v10c0 10-7 17-16 20C15 40 8 33 8 23V13l16-7Z" />,
    <g key="2"><rect x="8" y="8" width="14" height="14" rx="3" /><rect x="26" y="8" width="14" height="14" rx="3" fillOpacity=".55" /><rect x="8" y="26" width="14" height="14" rx="3" fillOpacity=".55" /><rect x="26" y="26" width="14" height="14" rx="3" /></g>,
    <g key="3"><circle cx="24" cy="24" r="16" fillOpacity=".3" /><circle cx="24" cy="24" r="8" /></g>,
    <g key="4"><path d="M24 6 28 20h14l-11 8 4 14-11-9-11 9 4-14-11-8h14l4-14Z" /></g>,
    <g key="5"><path d="M8 38 20 24l8 8 12-16" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="40" cy="14" r="4" /></g>,
  ];
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true">
      {shapes[i % shapes.length]}
    </svg>
  );
}

/**
 * Grid of short statements, dealt by the scroll. On tablet and desktop the cards
 * start as a messy pile in the middle of the grid and fly out to their places one
 * after the other; on phones each card flips up as it arrives. Cards tilt on hover.
 */
export default function ValuesGrid({ items, className }: { items: string[]; className?: string }) {
  const root = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const cards = gsap.utils.toArray<HTMLElement>(`.${styles.card}`);

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const grid = root.current!;
        // Offset from a card's resting place to the middle of the grid (layout, not transforms).
        const toCentre = (card: HTMLElement) => ({
          x: grid.offsetWidth / 2 - (card.offsetLeft + card.offsetWidth / 2),
          y: grid.offsetHeight / 2 - (card.offsetTop + card.offsetHeight / 2),
        });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: grid,
            start: "top 85%",
            end: "center 50%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        cards.forEach((card, i) => {
          gsap.set(card, { zIndex: cards.length - i });
          tl.fromTo(
            card,
            {
              x: () => toCentre(card).x,
              y: () => toCentre(card).y + 60,
              rotation: (i % 2 ? 1 : -1) * (4 + ((i * 7) % 9)),
              scale: 0.82,
            },
            { x: 0, y: 0, rotation: 0, scale: 1, duration: 1, ease: "power3.inOut" },
            i * 0.14,
          );
        });
      });

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { rotationX: -50, y: 60, opacity: 0, transformPerspective: 900, transformOrigin: "50% 0%" },
            {
              rotationX: 0,
              y: 0,
              opacity: 1,
              ease: "power2.out",
              scrollTrigger: { trigger: card, start: "top 98%", end: "top 70%", scrub: true },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <ul ref={root} className={clsx(styles.grid, className)}>
      {items.map((item, i) => (
        <li
          key={item}
          className={styles.card}
          style={{ "--bg": COLORS[i % COLORS.length][0], "--fg": COLORS[i % COLORS.length][1] } as CSSProperties}
        >
          <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
          <span className={styles.icon}>
            <Glyph i={i} />
          </span>
          <span className="type-heading-s">{item}</span>
        </li>
      ))}
    </ul>
  );
}
