"use client";

import clsx from "clsx";
import { useMemo, useRef, useState } from "react";
import { capitals, geie } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScrollReveal } from "@/lib/reveal";
import styles from "./EuMap.module.css";

// Equirectangular projection tuned for Europe (cos 50° horizontal scale).
const LON0 = -11;
const LAT0 = 62;
const K = 22;
const KX = K * Math.cos((50 * Math.PI) / 180);
const project = (lon: number, lat: number) => ({ x: (lon - LON0) * KX + 20, y: (LAT0 - lat) * K + 20 });

/**
 * The 27 capitals plotted at their real coordinates. Links from the seat in
 * Sofia draw themselves on scroll; hovering, focusing or tapping a capital
 * shows its name and highlights its link.
 */
export default function EuMap() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const { title, text, hub } = geie.mappa;
  useScrollReveal(root);

  const points = useMemo(() => capitals.map((c) => ({ ...c, ...project(c.lon, c.lat) })), []);
  const hubPt = points.find((p) => p.city === hub)!;
  const width = Math.ceil(Math.max(...points.map((p) => p.x)) + 20);
  const height = Math.ceil(Math.max(...points.map((p) => p.y)) + 20);

  // Curved link from the hub, bowing away from the straight line.
  const arc = (p: { x: number; y: number }) => {
    const mx = (hubPt.x + p.x) / 2;
    const my = (hubPt.y + p.y) / 2;
    const dx = p.x - hubPt.x;
    const dy = p.y - hubPt.y;
    return `M${hubPt.x} ${hubPt.y} Q${mx - dy * 0.2} ${my + dx * 0.2} ${p.x} ${p.y}`;
  };

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const counter = { v: 0 };
      const count = q(`.${styles.count}`)[0];
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top 75%", end: "center 45%", scrub: true },
        })
        .from(q(`.${styles.dot}`), { scale: 0, transformOrigin: "50% 50%", stagger: 0.02, duration: 0.3, ease: "back.out(2)" }, 0)
        .fromTo(q(`.${styles.link}`), { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.02, duration: 0.5 }, 0.1)
        .to(counter, { v: 27, duration: 0.8, onUpdate: () => count && (count.textContent = String(Math.round(counter.v))) }, 0);
    },
    { scope: root },
  );

  const current = active !== null ? points[active] : null;

  return (
    <div ref={root} className={styles.wrap}>
      <div className={styles.copy}>
        <h2 className="font-display type-display-m" data-reveal="title">
          {title}
        </h2>
        <p className="type-paragraph-l" data-reveal="lines">
          {text}
        </p>
        <div className={styles.stat}>
          <span className={clsx("font-display", styles.count)}>27</span>
          <span>
            Stati membri
            <br />
            <b>1 sede a Sofia</b>
          </span>
        </div>
        <ul className={styles.legend}>
          <li>
            <i className={styles.legendHub} /> Sede
          </li>
          <li>
            <i /> Capitale di uno Stato membro
          </li>
        </ul>
      </div>

      <div className={styles.map} onMouseLeave={() => setActive(null)}>
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Mappa delle 27 capitali dell’Unione Europea">
          <defs>
            <pattern id="eu-grid" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" className={styles.gridDot} />
            </pattern>
          </defs>
          <rect width={width} height={height} fill="url(#eu-grid)" rx="24" />

          {points.map((p, i) =>
            p.city === hub ? null : (
              <path
                key={`l-${p.city}`}
                d={arc(p)}
                pathLength={1}
                className={clsx(styles.link, active === i && styles.linkActive)}
              />
            ),
          )}

          {points.map((p, i) => {
            const isHub = p.city === hub;
            return (
              <g
                key={p.city}
                className={clsx(styles.dot, isHub && styles.hub, active === i && styles.dotActive)}
                transform={`translate(${p.x} ${p.y})`}
                tabIndex={0}
                role="button"
                aria-label={`${p.city}, ${p.country}${isHub ? " — sede" : ""}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(active === i ? null : i)}
              >
                <circle className={styles.hit} r="16" />
                {isHub && <circle className={styles.pulse} r="10" />}
                <circle className={styles.core} r={isHub ? 9 : 5.5} />
              </g>
            );
          })}
        </svg>

        {current && (
          <div
            className={styles.tooltip}
            style={{ left: `${(current.x / width) * 100}%`, top: `${(current.y / height) * 100}%` }}
          >
            <b>{current.city}</b>
            <span>
              {current.country}
              {current.city === hub ? " · Sede" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
