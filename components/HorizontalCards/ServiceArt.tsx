"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";
import { follow, spring, useScrollFrame, type ScrollFrame } from "@/lib/scrollFrame";
import styles from "./ServiceArt.module.css";

export type ServiceArtKind = "crossborder" | "protezione" | "efficienza" | "visibilita" | "influenza" | "responsabilita";

const INK = "#0a0a0a";
const WHITE = "#ffffff";

/* ---------- Geometry ---------- */

const SHIELD = "M120 22 176 42v44c0 38-24 64-56 78-32-14-56-40-56-78V42l56-20Z";
const STAR = "M178 64l8 17 18 3-13 13 3 18-16-9-16 9 3-18-13-13 18-3 8-17Z";
const HEART = "M120 118c-22-14-36-26-36-42 0-11 8-19 18-19 8 0 14 5 18 11 4-6 10-11 18-11 10 0 18 8 18 19 0 16-14 28-36 42Z";
const GEAR =
  "M196 104l5 1 2 7 6 2 5-3 6 6-3 5 2 6 7 2 1 5-1 5-7 2-2 6 3 5-6 6-5-3-6 2-2 7-5 1-5-1-2-7-6-2-5 3-6-6 3-5-2-6-7-2-1-5 1-5 7-2 2-6-3-5 6-6 5 3 6-2 2-7 5-1Z";
const NODES = [
  [46, 52],
  [196, 46],
  [206, 134],
  [38, 140],
] as const;
const round = (v: number) => Math.round(v * 100) / 100;
const PEOPLE = [0, 60, 120, 180, 240, 300].map((deg) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [round(120 + Math.cos(a) * 62), round(92 + Math.sin(a) * 62)] as const;
});

/** Point on the bridge (cubic Bézier M52 118 C80 40 160 40 188 118); t = 0 at the left member. */
function bridgeAt(t: number): [number, number] {
  const m = 1 - t;
  const [a, b, c, d] = [m * m * m, 3 * m * m * t, 3 * m * t * t, t * t * t];
  return [a * 52 + b * 80 + c * 160 + d * 188, a * 118 + b * 40 + c * 40 + d * 118];
}

/** Four-point sparkle centred on (x, y). */
const sparkle = (x: number, y: number, r: number) =>
  `M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`;

const origin = (transformOrigin: string, transformBox?: "view-box") => ({ transformOrigin, transformBox }) as CSSProperties;

/* ---------- Motion helpers ---------- */

const DEG = 180 / Math.PI;
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
/** Local 0 → 1 progress of `v` between `from` and `to`. */
const seg = (v: number, from: number, to: number) => clamp((v - from) / (to - from));
const smooth = (t: number) => t * t * (3 - 2 * t);
const outCubic = (t: number) => 1 - (1 - t) ** 3;
const inOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (2 - 2 * t) ** 3 / 2);
const inQuart = (t: number) => t ** 4;
const outBack = (t: number, s = 1.7) => 1 + (s + 1) * (t - 1) ** 3 + s * (t - 1) ** 2;
function outBounce(t: number) {
  const n = 7.5625;
  const d = 2.75;
  if (t < 1 / d) return n * t * t;
  if (t < 2 / d) return n * (t - 1.5 / d) ** 2 + 0.75;
  if (t < 2.5 / d) return n * (t - 2.25 / d) ** 2 + 0.9375;
  return n * (t - 2.625 / d) ** 2 + 0.984375;
}

/** Everything a rig needs for one frame. */
type Live = {
  /** Assembly: 0 exploded → 1 in place, scrubbed by how close the card is to the centre of the screen. */
  a: number;
  t: number;
  dt: number;
  /** Idle clock that runs faster while the card moves or is hovered. */
  phase: number;
  /** 0 → 1, how fast the card is moving on screen. */
  energy: number;
  /** Card position relative to the viewport centre (see ScrollFrame). */
  nx: number;
  ny: number;
  /** Hover/focus 0 → 1 and pointer position -1 → 1 across the card, on springs. */
  hover: number;
  px: number;
  py: number;
  /** Offset per unit of depth: parallax + pointer + inertia. */
  dx: number;
  dy: number;
  trail: [number, number][];
  beat: number;
};

type Parts = Record<string, SVGElement | undefined>;
type Pose = { x?: number; y?: number; r?: number; s?: number; sy?: number; o?: number };

/** Writes a part's transform, shifted by its depth, and optionally its opacity. */
function pose(el: SVGElement | undefined, p: Pose, depth: number, L: Live) {
  if (!el) return;
  const s = p.s ?? 1;
  el.style.transform =
    `translate(${((p.x ?? 0) + L.dx * depth).toFixed(2)}px,${((p.y ?? 0) + L.dy * depth).toFixed(2)}px) ` +
    `rotate(${(p.r ?? 0).toFixed(2)}deg) scale(${s.toFixed(3)},${(p.sy ?? s).toFixed(3)})`;
  if (p.o !== undefined) el.style.opacity = clamp(p.o).toFixed(3);
}

/** Draws a stroke (pathLength 1, dasharray 1) up to `progress`. */
function draw(el: SVGElement | undefined, progress: number, depth: number, L: Live) {
  if (!el) return;
  pose(el, {}, depth, L);
  el.style.strokeDashoffset = (1 - progress).toFixed(4);
  el.style.visibility = progress > 0.001 ? "" : "hidden";
}

/* ---------- Choreographies ---------- */

type Rig = (q: Parts, L: Live) => void;

const RIGS: Record<ServiceArtKind, Rig> = {
  // The members come in from the card edges, the border grows out from the point where the
  // bridge will cross it, the bridge draws between them and a traveller shuttles across,
  // faster while scrolling. The border opens to let it through.
  crossborder(q, L) {
    const { a } = L;
    const live = seg(a, 0.8, 0.95);
    const u = 0.5 - 0.5 * Math.cos(L.phase * 1.1);
    const [tx, ty] = bridgeAt(u);
    const gap = 8 * live * smooth(clamp(1 - Math.abs(u - 0.5) / 0.16));
    const border = outCubic(seg(a, 0, 0.35));
    const flow = ((L.phase * 8) % 14).toFixed(2);
    pose(q.borderTop, { y: -gap, sy: border }, 0.2, L);
    pose(q.borderBottom, { y: gap, sy: border }, 0.2, L);
    q.dashTop?.style.setProperty("stroke-dashoffset", `-${flow}`);
    q.dashBottom?.style.setProperty("stroke-dashoffset", flow);

    const l = outBack(seg(a, 0.05, 0.5));
    pose(q.left, { x: -85 * (1 - l) + 8 * L.hover, r: -8 * L.hover, s: 0.6 + 0.4 * l, o: seg(a, 0.05, 0.1) }, 0.6, L);
    const r = outBack(seg(a, 0.12, 0.58));
    const rx = 85 * (1 - r);
    // The square tumbles in: a quarter turn per side length travelled.
    pose(q.right, { x: rx - 8 * L.hover, r: (rx / 56) * 90 + 8 * L.hover, s: 0.6 + 0.4 * r, o: seg(a, 0.12, 0.17) }, 0.6, L);
    draw(q.bridge, inOutCubic(seg(a, 0.45, 0.85)), 0.6, L);

    L.trail.unshift([tx, ty]);
    L.trail.length = Math.min(L.trail.length, 8);
    pose(q.traveller, { x: tx - 120, y: ty - 59.5, s: outBack(live, 2.2) }, 0.6, L);
    [3, 6].forEach((lag, i) => {
      const [x, y] = L.trail[Math.min(lag, L.trail.length - 1)];
      const o = clamp(Math.hypot(x - tx, y - ty) / 14) * (0.5 - i * 0.2) * live;
      pose(q[`trail${i}`], { x: x - 120, y: y - 59.5, o }, 0.6, L);
    });
  },

  // The halo opens, the shield rises, the house drops in with a bounce and the padlock swings
  // over, clicking shut at the very end. A glint slides across the shield as the card moves.
  protezione(q, L) {
    const { a } = L;
    pose(q.halo, { s: outBack(seg(a, 0, 0.35)) * (1 + 0.035 * Math.sin(L.t * 1.8)) }, 0.1, L);
    const sh = outBack(seg(a, 0.1, 0.55), 1.4);
    pose(
      q.shield,
      { y: 50 * (1 - sh), r: -18 * (1 - sh) - 3 * L.hover, s: (0.5 + 0.5 * sh) * (1 + 0.05 * L.hover), o: seg(a, 0.1, 0.15) },
      0.5,
      L,
    );
    pose(q.glint, { x: 131 - clamp(L.nx / 0.45, -1, 1) * 100 + L.px * 30 }, 0, L);
    pose(q.house, { y: -60 * (1 - outBounce(seg(a, 0.4, 0.8))), o: seg(a, 0.4, 0.45) }, 0.4, L);
    const lk = outBack(seg(a, 0.55, 0.85));
    pose(
      q.lock,
      {
        x: 40 * (1 - lk) - 6 * L.hover,
        y: -20 * (1 - lk) - 6 * L.hover,
        r: 40 * (1 - lk) - 10 * L.hover,
        s: 0.6 + 0.4 * lk,
        o: seg(a, 0.55, 0.6),
      },
      1,
      L,
    );
    pose(q.shackle, { y: -9 * (1 - inQuart(seg(a, 0.85, 0.97))) - 7 * L.hover }, 0, L);
  },

  // The baseline draws, the bars spring up one by one, the trend line draws over them and the
  // arrow pops; the gear rolls in along the baseline. Scrolling pumps the bars and spins the gear.
  efficienza(q, L) {
    const { a } = L;
    draw(q.base, outCubic(seg(a, 0, 0.3)), 0.5, L);
    for (let i = 0; i < 3; i++) {
      const grow = outBack(seg(a, 0.15 + i * 0.1, 0.5 + i * 0.1), 1.6);
      const pump = 1 + L.energy * 0.16 * (0.5 + 0.5 * Math.sin(L.phase * 5 + i * 2.1));
      pose(q[`bar${i}`], { sy: grow * pump * (1 + (0.15 + 0.05 * i) * L.hover) }, 0.5, L);
    }
    draw(q.trend, inOutCubic(seg(a, 0.5, 0.85)), 0.9, L);
    const ar = outBack(seg(a, 0.82, 0.97), 2);
    pose(q.arrow, { x: -10 * (1 - ar), y: 10 * (1 - ar), s: ar }, 0.9, L);
    // Rolling: the angle turned is the distance travelled over the radius.
    const gx = 90 * (1 - outCubic(seg(a, 0.25, 0.75)));
    pose(q.gear, { x: gx, r: (gx / 25) * DEG + L.phase * 40, o: seg(a, 0.25, 0.3) }, 0.5, L);
  },

  // The stand rises, the lamp swings up and flickers on. Where the light points follows the card
  // across the screen: the star lights up only when the beam finds it (hovering aims it there).
  visibilita(q, L) {
    const { a } = L;
    pose(q.stand, { y: 30 * (1 - outBack(seg(a, 0, 0.3))), o: seg(a, 0, 0.06) }, 0.3, L);
    const aim = clamp(-(L.nx * 55 + L.ny * 35), -42, 42) + Math.sin(L.t * 0.9) * 3;
    const theta = aim + (-4 - aim) * L.hover;
    pose(q.head, { r: 70 + (theta - 70) * outBack(seg(a, 0.1, 0.5)), o: seg(a, 0.1, 0.16) }, 0.3, L);
    const on = seg(a, 0.45, 0.75);
    const flicker = on < 0.5 && Math.sin(on * 60) < 0 ? 0.3 : 1;
    pose(q.beam, { s: outCubic(on), sy: 0.4 + 0.6 * outCubic(on), o: on > 0 ? flicker : 0 }, 0, L);
    const found = (1 - smooth(seg(Math.abs(theta + 4), 8, 24))) * on;
    const st = outBack(seg(a, 0.6, 0.9), 2);
    pose(q.star, { r: -120 * (1 - st) + Math.sin(L.t * 2) * 6 * found, s: st * (0.85 + 0.2 * found), o: 0.35 + 0.65 * found }, 0.9, L);
    pose(q.glow, { s: st * (0.6 + 0.45 * found + 0.04 * Math.sin(L.t * 3)), o: 0.55 * found }, 0.9, L);
    for (let i = 0; i < 2; i++) {
      const twinkle = Math.max(0, Math.sin(L.t * 2.4 + i * Math.PI)) ** 2;
      pose(q[`sparkle${i}`], { s: found * st * twinkle, r: L.t * 90 }, 1.1, L);
    }
  },

  // The core pops, the rings ripple out into place, links reach out and the nodes fly in to meet
  // them. Waves keep leaving the core (faster while scrolling) and each node blinks as one reaches it.
  influenza(q, L) {
    const { a } = L;
    const on = seg(a, 0.6, 0.9);
    const waves = [0, 1, 2].map((i) => (L.phase * 0.4 + i / 3) % 1);
    const reach = (d: number) =>
      on * Math.max(...waves.map((w) => Math.exp(-(((32 + w * 72 - d) / 9) ** 2)) * (1 - 0.5 * w)));
    waves.forEach((w, i) => pose(q[`wave${i}`], { s: 1 + w * 2.25, o: (1 - w) ** 1.2 * 0.9 * on }, 0.5, L));
    pose(q.core, { s: outBack(seg(a, 0, 0.3), 2) }, 0.9, L);
    pose(q.ring2, { s: (0.4 + 0.6 * outBack(seg(a, 0.12, 0.45))) * (1 + 0.05 * reach(52)), o: seg(a, 0.12, 0.18) }, 0.5, L);
    pose(q.ring3, { s: (0.4 + 0.6 * outBack(seg(a, 0.22, 0.55))) * (1 + 0.05 * reach(72)), o: seg(a, 0.22, 0.28) }, 0.3, L);
    NODES.forEach(([x, y], i) => {
      const d = Math.hypot(x - 120, y - 92);
      const n = outBack(seg(a, 0.5 + i * 0.05, 0.8 + i * 0.05), 2);
      const out = 36 * (1 - n);
      draw(q[`link${i}`], outCubic(seg(a, 0.4 + i * 0.05, 0.7 + i * 0.05)), 0.6, L);
      pose(
        q[`node${i}`],
        { x: ((x - 120) / d) * out, y: ((y - 92) / d) * out, s: n * (1 + 0.35 * reach(d) + 0.3 * L.hover) },
        0.6,
        L,
      );
    });
  },

  // People spiral in from all around and take their place on the ring; the heart grows in the
  // middle. Scrolling makes them walk around the ring and the heart beat faster; hover turns the ring.
  responsabilita(q, L) {
    const { a } = L;
    const ring = outCubic(seg(a, 0, 0.4));
    pose(q.ring, { s: 0.3 + 0.7 * ring, r: -120 * (1 - ring) + L.phase * 8, o: ring }, 0.3, L);
    const orbit = L.phase * 10 + L.hover * 60;
    PEOPLE.forEach(([bx, by], i) => {
      const g = outBack(seg(a, 0.1 + i * 0.06, 0.5 + i * 0.06));
      const angle = (i * 60 - 90 + orbit + 50 * (1 - g)) / DEG;
      const radius = 62 + 80 * (1 - g);
      const walk = Math.sin(L.phase * 3.5 + i * 1.3);
      pose(
        q[`person${i}`],
        {
          x: 120 + Math.cos(angle) * radius - bx,
          y: 92 + Math.sin(angle) * radius - by - Math.abs(walk) * 3 * L.energy,
          r: walk * 9 * L.energy,
          s: 0.4 + 0.6 * g,
          o: seg(a, 0.1 + i * 0.06, 0.16 + i * 0.06),
        },
        0.7,
        L,
      );
    });
    L.beat += L.dt * (0.9 + 1.4 * L.energy + 0.6 * L.hover);
    const b = L.beat % 1;
    const thump = 0.12 * Math.exp(-(((b - 0.1) / 0.06) ** 2)) + 0.07 * Math.exp(-(((b - 0.3) / 0.06) ** 2));
    pose(q.heart, { s: outBack(seg(a, 0.5, 0.95), 2.4) * (1 + thump + 0.08 * L.hover) }, 1, L);
  },
};

/* ---------- Engine ---------- */

function createEngine(svg: SVGSVGElement, rig: Rig) {
  const q: Parts = {};
  svg.querySelectorAll<SVGElement>("[data-part]").forEach((el) => {
    q[el.dataset.part!] = el;
  });
  const L: Live = { a: 0, t: 0, dt: 0, phase: 0, energy: 0, nx: 0, ny: 0, hover: 0, px: 0, py: 0, dx: 0, dy: 0, trail: [], beat: 0 };
  const hover = spring();
  const px = spring();
  const py = spring();
  const jx = spring();
  const jy = spring();
  const input = { hover: 0, x: 0, y: 0 };

  function frame(f: ScrollFrame) {
    const { dt } = f;
    const target = smooth(seg(f.presence, 0.02, 0.45));
    L.a = dt === 0 ? target : L.a + (target - L.a) * (1 - Math.exp(-dt * 9));
    const speed = Math.min(1, Math.hypot(f.vx, f.vy) / 2400);
    L.energy += (speed - L.energy) * (1 - Math.exp(-dt * (speed > L.energy ? 10 : 2.5)));
    follow(hover, input.hover, dt, 180, 17);
    follow(px, input.x * input.hover, dt, 120, 15);
    follow(py, input.y * input.hover, dt, 120, 15);
    // Inertia: parts lag behind the card's motion, then spring back when it stops.
    follow(jx, clamp(-f.vx * 0.005, -14, 14), dt);
    follow(jy, clamp(-f.vy * 0.005, -14, 14), dt);
    L.t += dt;
    L.dt = dt;
    L.phase += dt * (1 + L.energy * 5 + hover.x * 1.5);
    L.nx = f.nx;
    L.ny = f.ny;
    L.hover = hover.x;
    L.px = px.x;
    L.py = py.x;
    L.dx = jx.x - f.nx * 10 + px.x * 8;
    L.dy = jy.x - f.ny * 6 + py.x * 6;
    rig(q, L);
  }

  return { frame, input };
}

/**
 * Flat vector illustrations for the "Servizi e vantaggi" cards (ink + white + one accent).
 *
 * Driven by scroll: each illustration is scattered while its card is off-centre and assembles
 * as the card reaches the middle of the screen, in either direction and on any axis (pinned
 * horizontal track on desktop, swipe and page scroll on touch). Moving fast adds energy: parts
 * lag behind with inertia and settle with a wobble, loops speed up. Pointer and keyboard focus
 * on the card add parallax and a gesture. The markup is the assembled, static state, which is
 * what shows without JavaScript or with reduced motion.
 */
export default function ServiceArt({ kind, accent }: { kind: ServiceArtKind; accent: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const engine = useRef<ReturnType<typeof createEngine> | null>(null);
  const clipId = `shield${useId().replace(/[^\w-]/g, "")}`;

  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const eng = createEngine(el, RIGS[kind]);
    engine.current = eng;
    const card = el.closest("a");
    if (!card) return;

    const { input } = eng;
    const enter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") input.hover = 1;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = card.getBoundingClientRect();
      input.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      input.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const leave = () => {
      input.hover = 0;
    };
    const focus = () => {
      if (card.matches(":focus-visible")) input.hover = 1;
    };
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", leave);
    card.addEventListener("focus", focus);
    card.addEventListener("blur", leave);
    return () => {
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", leave);
      card.removeEventListener("focus", focus);
      card.removeEventListener("blur", leave);
    };
  }, [kind]);

  // Measure the card link rather than the svg: the card face is itself transformed in 3D.
  useScrollFrame(
    () => svg.current?.closest("a") ?? svg.current,
    (f) => engine.current?.frame(f),
  );

  return (
    <svg ref={svg} className={styles.art} viewBox="0 0 240 180" fill="none" aria-hidden="true" focusable="false">
      {kind === "crossborder" && (
        <>
          {/* border, split where the bridge crosses it */}
          <g data-part="borderTop" style={origin("50% 100%")}>
            <path data-part="dashTop" d="M120 18V59.5" stroke={INK} strokeWidth="3" strokeDasharray="6 8" />
          </g>
          <g data-part="borderBottom" style={origin("50% 0%")}>
            <path data-part="dashBottom" d="M120 59.5V168" stroke={INK} strokeWidth="3" strokeDasharray="6 8" />
          </g>
          <path
            data-part="bridge"
            d="M52 118C80 40 160 40 188 118"
            stroke={INK}
            strokeWidth="6"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
          />
          <circle data-part="trail1" cx="120" cy="59.5" r="4" fill={accent} opacity="0" />
          <circle data-part="trail0" cx="120" cy="59.5" r="5.5" fill={accent} opacity="0" />
          <circle data-part="traveller" cx="120" cy="59.5" r="7" fill={accent} stroke={INK} strokeWidth="3" />
          {/* two members */}
          <g data-part="left">
            <circle cx="52" cy="128" r="28" fill={accent} stroke={INK} strokeWidth="4" />
            <circle cx="52" cy="128" r="10" fill={WHITE} stroke={INK} strokeWidth="3" />
          </g>
          <g data-part="right">
            <rect x="160" y="100" width="56" height="56" rx="14" fill={WHITE} stroke={INK} strokeWidth="4" />
            <rect x="178" y="118" width="20" height="20" rx="5" fill={INK} />
          </g>
        </>
      )}

      {kind === "protezione" && (
        <>
          <defs>
            <clipPath id={clipId}>
              <path d={SHIELD} />
            </clipPath>
          </defs>
          <circle data-part="halo" cx="120" cy="92" r="74" fill={WHITE} opacity="0.55" />
          <g data-part="shield" style={origin("120px 93px", "view-box")}>
            <path d={SHIELD} fill={accent} />
            {/* glint: sits outside the shield (clipped away) until the engine moves it */}
            <g clipPath={`url(#${clipId})`}>
              <path data-part="glint" d="M-4 14h18L-18 172h-18Z" fill={WHITE} opacity="0.45" />
            </g>
            <path d={SHIELD} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            {/* domus */}
            <g data-part="house">
              <path d="M92 104 120 80l28 24v34H92v-34Z" fill={WHITE} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
              <rect x="112" y="116" width="16" height="22" rx="3" fill={INK} />
            </g>
          </g>
          {/* padlock */}
          <g data-part="lock" style={origin("190px 132px", "view-box")}>
            <path data-part="shackle" d="M178 118v-8a12 12 0 0 1 24 0v8" stroke={INK} strokeWidth="5" strokeLinecap="round" />
            <rect x="170" y="116" width="40" height="32" rx="8" fill={WHITE} stroke={INK} strokeWidth="4" />
            <circle cx="190" cy="131" r="4" fill={INK} />
          </g>
        </>
      )}

      {kind === "efficienza" && (
        <>
          <path data-part="base" d="M28 156H212" stroke={INK} strokeWidth="4" strokeLinecap="round" pathLength={1} strokeDasharray="1" />
          {(
            [
              [40, 116, 40, WHITE],
              [84, 92, 64, WHITE],
              [128, 64, 92, accent],
            ] as const
          ).map(([x, y, h, fill], i) => (
            <g key={x} data-part={`bar${i}`} style={origin("50% 100%")}>
              <rect x={x} y={y} width="30" height={h} rx="6" fill={fill} stroke={INK} strokeWidth="4" />
            </g>
          ))}
          <path
            data-part="trend"
            d="M42 100 92 72l30 14 60-52"
            stroke={INK}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1"
          />
          <path data-part="arrow" d="M162 30h22v22" stroke={INK} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <g data-part="gear" style={origin("196px 129px", "view-box")}>
            <path d={GEAR} fill={WHITE} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <circle cx="196" cy="129" r="8" fill={INK} />
          </g>
        </>
      )}

      {kind === "visibilita" && (
        <>
          <g data-part="stand" style={origin("50% 100%")}>
            <path d="M58 146v16M40 164h36" stroke={INK} strokeWidth="5" strokeLinecap="round" />
          </g>
          {/* lamp head pivots on the stand and carries the beam with it */}
          <g data-part="head" style={origin("58px 146px", "view-box")}>
            <g data-part="beam" style={origin("80px 120px", "view-box")}>
              <path d="M80 120 196 40v100Z" fill={accent} opacity="0.55" />
              <path d="M80 120 196 40M80 120l116 20" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeDasharray="4 7" />
            </g>
            <path d="M34 132 60 96l36 20-22 38Z" fill={WHITE} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <circle cx="80" cy="120" r="11" fill={accent} stroke={INK} strokeWidth="4" />
          </g>
          <circle data-part="glow" cx="178" cy="91" r="28" fill={WHITE} opacity="0" />
          <g data-part="star">
            <path d={STAR} fill={WHITE} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          </g>
          <path data-part="sparkle0" d={sparkle(146, 104, 7)} fill={WHITE} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <path data-part="sparkle1" d={sparkle(212, 128, 6)} fill={WHITE} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        </>
      )}

      {kind === "influenza" && (
        <>
          {NODES.map(([x, y], i) => (
            <path
              key={`link${x}`}
              data-part={`link${i}`}
              d={`M120 92L${x} ${y}`}
              stroke={INK}
              strokeWidth="2"
              opacity="0.35"
              pathLength={1}
              strokeDasharray="1"
            />
          ))}
          {[0, 1, 2].map((i) => (
            <circle
              key={`wave${i}`}
              data-part={`wave${i}`}
              cx="120"
              cy="92"
              r="32"
              stroke={accent}
              strokeWidth="4"
              vectorEffect="non-scaling-stroke"
              opacity="0"
            />
          ))}
          <g data-part="ring3">
            <circle cx="120" cy="92" r="72" stroke={INK} strokeWidth="3" />
          </g>
          <g data-part="ring2">
            <circle cx="120" cy="92" r="52" stroke={INK} strokeWidth="3" />
          </g>
          <g data-part="core">
            <circle cx="120" cy="92" r="32" fill={WHITE} stroke={INK} strokeWidth="4" />
            <circle cx="120" cy="92" r="14" fill={accent} stroke={INK} strokeWidth="4" />
          </g>
          {/* reached nodes */}
          {NODES.map(([x, y], i) => (
            <g key={`node${x}`} data-part={`node${i}`}>
              <circle cx={x} cy={y} r="9" fill={i % 2 ? WHITE : accent} stroke={INK} strokeWidth="3" />
            </g>
          ))}
        </>
      )}

      {kind === "responsabilita" && (
        <>
          {/* community ring */}
          <g data-part="ring" style={origin("120px 92px", "view-box")}>
            <circle cx="120" cy="92" r="62" stroke={INK} strokeWidth="3" strokeDasharray="5 8" />
          </g>
          {PEOPLE.map(([x, y], i) => (
            <g key={i} data-part={`person${i}`}>
              <circle cx={x} cy={y - 5} r="7" fill={i % 2 ? WHITE : accent} stroke={INK} strokeWidth="3" />
              <path d={`M${x - 10} ${y + 12}a10 9 0 0 1 20 0`} fill={i % 2 ? WHITE : accent} stroke={INK} strokeWidth="3" />
            </g>
          ))}
          <g data-part="heart">
            <path d={HEART} fill={accent} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          </g>
        </>
      )}
    </svg>
  );
}
