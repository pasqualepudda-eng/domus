"use client";

import clsx from "clsx";
import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { follow, spring, useScrollFrame, type Spring } from "@/lib/scrollFrame";
import styles from "./FloatingAssets.module.css";

type Asset = { color: string; shape: "coin" | "card" | "pill" | "star" };

const DEFAULT: Asset[] = [
  { color: "var(--orange)", shape: "coin" },
  { color: "var(--blue)", shape: "card" },
  { color: "var(--purple)", shape: "star" },
];

function AssetShape({ shape, color }: Asset) {
  switch (shape) {
    case "coin":
      return (
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill={color} />
          <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(0,0,0,.18)" strokeWidth="6" />
          <path d="M50 30v40M38 42h24M38 58h24" stroke="rgba(0,0,0,.35)" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    case "card":
      return (
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <rect x="6" y="22" width="88" height="56" rx="10" fill={color} />
          <rect x="16" y="34" width="18" height="13" rx="3" fill="rgba(255,255,255,.7)" />
          <rect x="16" y="60" width="44" height="6" rx="3" fill="rgba(255,255,255,.5)" />
        </svg>
      );
    case "pill":
      return (
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <rect x="8" y="30" width="84" height="40" rx="20" fill={color} />
          <circle cx="30" cy="50" r="12" fill="rgba(255,255,255,.75)" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 4 61 39l35 11-35 11-11 35-11-35L4 50l35-11L50 4Z" fill={color} />
        </svg>
      );
  }
}

/** Deeper objects react more: they lag further behind the scroll and turn more. */
const DEPTH = [0.7, 1.1, 1.5];
const REPEL_RADIUS = 260;
const clampShift = gsap.utils.clamp(-36, 36);
const clampSpin = gsap.utils.clamp(-28, 28);

type Body = { el: HTMLElement; shape: HTMLElement; ox: number; oy: number; h: number; x: Spring; y: Spring; r: Spring };

/**
 * Three decorative objects pinned to the corners of their parent. Each
 * drifts at its own speed while the parent scrolls through the viewport
 * and bobs gently on a loop. They also behave like physical objects: they
 * lag behind fast scrolling and swing back on a spring, and on desktop they
 * get pushed away by the pointer.
 */
export default function FloatingAssets({
  assets = DEFAULT,
  className,
  variant = "default",
}: {
  assets?: Asset[];
  className?: string;
  variant?: "default" | "inset" | "hero";
}) {
  const root = useRef<HTMLDivElement>(null);
  const bodies = useRef<Body[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const stale = useRef(true);

  useEffect(() => {
    const onResize = () => (stale.current = true);
    window.addEventListener("resize", onResize);
    if (!window.matchMedia("(pointer: fine)").matches) return () => window.removeEventListener("resize", onResize);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") pointer.current = { x: e.clientX, y: e.clientY };
    };
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) pointer.current = null;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  useScrollFrame(
    () => root.current?.parentElement,
    ({ vx, vy, dt, rect }) => {
      if (!root.current) return;
      if (stale.current || !bodies.current.length) {
        // Resting centres relative to the parent (the scroll parallax is added per frame).
        bodies.current = gsap.utils.toArray<HTMLElement>(`.${styles.asset}`, root.current).map((el, i) => ({
          el,
          shape: el.querySelector<HTMLElement>(`.${styles.inner} > *`)!,
          ox: el.offsetLeft + el.offsetWidth / 2,
          oy: el.offsetTop + el.offsetHeight / 2,
          h: el.offsetHeight,
          x: bodies.current[i]?.x ?? spring(),
          y: bodies.current[i]?.y ?? spring(),
          r: bodies.current[i]?.r ?? spring(),
        }));
        stale.current = false;
      }
      bodies.current.forEach((b, i) => {
        const depth = DEPTH[i % DEPTH.length];
        let tx = clampShift(-vx * 0.018 * depth);
        let ty = clampShift(-vy * 0.018 * depth);
        const p = pointer.current;
        if (p) {
          const cx = rect.left + b.ox;
          const cy = rect.top + b.oy + (Number(gsap.getProperty(b.el, "yPercent")) / 100) * b.h;
          const dx = cx - p.x;
          const dy = cy - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < REPEL_RADIUS) {
            const push = (1 - dist / REPEL_RADIUS) ** 2 * 70;
            tx += (dx / dist) * push;
            ty += (dy / dist) * push;
          }
        }
        follow(b.x, tx, dt, 120, 11);
        follow(b.y, ty, dt, 120, 11);
        follow(b.r, clampSpin(vy * 0.012 * depth * (i % 2 ? 1 : -1)), dt, 90, 8);
        b.shape.style.transform = `translate(${b.x.x.toFixed(1)}px, ${b.y.x.toFixed(1)}px) rotate(${b.r.x.toFixed(1)}deg)`;
      });
    },
  );

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const items = gsap.utils.toArray<HTMLElement>(`.${styles.asset}`);
      const speeds = [-18, 26, -32];
      items.forEach((item, i) => {
        const inner = item.firstElementChild;
        gsap.fromTo(
          item,
          { yPercent: -speeds[i % speeds.length], rotate: -8 * (i % 2 ? 1 : -1) },
          {
            yPercent: speeds[i % speeds.length],
            rotate: 8 * (i % 2 ? 1 : -1),
            ease: "none",
            scrollTrigger: {
              trigger: root.current?.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
        gsap.to(inner, {
          y: "random(-12, 12)",
          x: "random(-8, 8)",
          duration: "random(2.4, 3.6)",
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.3,
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={clsx(styles.floatingAssets, styles[variant], className)} aria-hidden="true">
      {assets.map((a, i) => (
        <div key={i} className={styles.asset}>
          <div className={styles.inner}>
            <AssetShape {...a} />
          </div>
        </div>
      ))}
    </div>
  );
}
