"use client";

import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { geie } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./ScatterStructure.module.css";

const W = 640;
const H = 420;
const N = 16;
const COLORS = ["#ff5c16", "#d075ff", "#89b0ff", "#3fc3ff"];

/** Deterministic pseudo-random so server and client render the same layout. */
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

type Pt = { x: number; y: number };

const clamp01 = gsap.utils.clamp(0, 1);
const seg = (v: number, from: number, to: number) => clamp01((v - from) / (to - from));
const easeInOut = gsap.parseEase("power3.inOut");
const backOut = gsap.parseEase("back.out(1.6)");

/**
 * Loose contacts vs. a GEIE. Scrolling through the diagram organises it: the
 * scattered members travel one by one onto a ring around the GEIE hub, the
 * random links fade and the structure's links appear (scroll back to undo it).
 * The toggle takes over as soon as it is used.
 */
export default function ScatterStructure() {
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [structured, setStructured] = useState(false);
  const structuredRef = useRef(false);
  const mix = useRef({ m: 0 });
  const scrollTween = useRef<gsap.core.Tween | null>(null);
  const { scattered, structured: struct } = geie.perche;

  const layouts = useMemo(() => {
    const scatter: Pt[] = Array.from({ length: N + 1 }, (_, i) => ({
      x: 40 + rand(i + 1) * (W - 80),
      y: 40 + rand(i + 101) * (H - 80),
    }));
    const ring: Pt[] = [{ x: W / 2, y: H / 2 }];
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2 - Math.PI / 2;
      ring.push({ x: W / 2 + Math.cos(a) * 250, y: H / 2 + Math.sin(a) * 160 });
    }
    return { scatter, ring };
  }, []);

  // A few random, unrelated links vs. hub-and-ring structure.
  const edges = useMemo(() => {
    const loose: [number, number][] = [
      [1, 5], [3, 9], [6, 12], [2, 14], [10, 15], [7, 4], [11, 16],
    ];
    const hub: [number, number][] = Array.from({ length: N }, (_, i) => [0, i + 1]);
    const ring: [number, number][] = Array.from({ length: N }, (_, i) => [i + 1, ((i + 1) % N) + 1]);
    return { loose, hub, ring };
  }, []);

  /** Draws the diagram for the current mix (0 scattered → 1 structured). */
  const draw = useCallback(() => {
    const el = svg.current;
    if (!el) return;
    const m = mix.current.m;
    // Members set off one after the other.
    const pos = layouts.scatter.map((a, i) => {
      const b = layouts.ring[i];
      const t = easeInOut(clamp01(m * 1.3 - i * 0.018));
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    });
    el.querySelectorAll<SVGGElement>("[data-node]").forEach((g) => {
      const p = pos[Number(g.dataset.node)];
      g.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
    });
    el.querySelectorAll<SVGLineElement>("[data-edge]").forEach((l) => {
      const [a, b] = l.dataset.edge!.split("-").map(Number);
      l.setAttribute("x1", pos[a].x.toFixed(1));
      l.setAttribute("y1", pos[a].y.toFixed(1));
      l.setAttribute("x2", pos[b].x.toFixed(1));
      l.setAttribute("y2", pos[b].y.toFixed(1));
    });
    const loose = String(1 - seg(m, 0, 0.45));
    const linked = String(seg(m, 0.55, 0.95));
    el.querySelectorAll(`.${styles.loose}`).forEach((l) => l.setAttribute("opacity", loose));
    el.querySelectorAll(`.${styles.hubEdge}, .${styles.ringEdge}`).forEach((l) => l.setAttribute("opacity", linked));
    const hub = el.querySelector(`.${styles.hub}`);
    hub?.setAttribute("transform", `scale(${(0.4 + 0.6 * backOut(seg(m, 0.3, 0.8))).toFixed(3)})`);
    hub?.setAttribute("opacity", String(0.25 + 0.75 * seg(m, 0.3, 0.6)));

    const next = m > 0.5;
    if (next !== structuredRef.current) {
      structuredRef.current = next;
      setStructured(next);
    }
  }, [layouts]);

  useEffect(draw, [draw]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        scrollTween.current = gsap.fromTo(
          mix.current,
          { m: 0 },
          {
            m: 1,
            ease: "none",
            onUpdate: draw,
            scrollTrigger: { trigger: root.current, start: "top 80%", end: "center 45%", scrub: 0.8 },
          },
        );
        draw();
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        mix.current.m = 1;
        draw();
      });
    },
    { scope: root },
  );

  // The toggle takes over from the scroll for good.
  const choose = (v: boolean) => {
    scrollTween.current?.scrollTrigger?.kill();
    scrollTween.current?.kill();
    scrollTween.current = null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(mix.current, { m: v ? 1 : 0, duration: reduced ? 0 : 1.4, ease: "none", onUpdate: draw, overwrite: true });
  };

  return (
    <div ref={root} className={styles.wrap}>
      <div className={styles.toggle} role="tablist" aria-label="Confronto">
        <span className={clsx(styles.thumb, structured && styles.thumbRight)} />
        <button type="button" role="tab" aria-selected={!structured} onClick={() => choose(false)}>
          {scattered.label}
        </button>
        <button type="button" role="tab" aria-selected={structured} onClick={() => choose(true)}>
          {struct.label}
        </button>
      </div>

      <div className={styles.canvas}>
        <svg ref={svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={structured ? struct.text : scattered.text}>
          {edges.loose.map(([a, b]) => (
            <line key={`l${a}-${b}`} data-edge={`${a}-${b}`} className={styles.loose} />
          ))}
          {edges.ring.map(([a, b]) => (
            <line key={`r${a}-${b}`} data-edge={`${a}-${b}`} className={styles.ringEdge} opacity={0} />
          ))}
          {edges.hub.map(([a, b]) => (
            <line key={`h${a}-${b}`} data-edge={`${a}-${b}`} className={styles.hubEdge} opacity={0} />
          ))}
          <g data-node={0}>
            <g className={styles.hub}>
              <circle r="44" />
              <text y="5" textAnchor="middle">
                GEIE
              </text>
            </g>
          </g>
          {Array.from({ length: N }, (_, i) => (
            <g key={i} data-node={i + 1}>
              <circle r="13" fill={COLORS[i % COLORS.length]} className={styles.node} />
            </g>
          ))}
        </svg>
      </div>

      <p key={String(structured)} className={clsx("type-heading-s", styles.caption)}>
        {structured ? struct.text : scattered.text}
      </p>
    </div>
  );
}
