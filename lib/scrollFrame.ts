"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Where an element sits on screen this frame, and how fast it is moving. */
export type ScrollFrame = {
  /** Centre offset from the viewport centre: 0 centred, ±1 once it is just past the left/right (top/bottom) edge. */
  nx: number;
  ny: number;
  /** 1 when centred, falling to 0 at the viewport edge. */
  presence: number;
  /** On-screen velocity, px/s. */
  vx: number;
  vy: number;
  /** Seconds since the previous frame; 0 on the first frame after the element comes into view. */
  dt: number;
  /** The element's box this frame (read before any callback writes). */
  rect: DOMRect;
};

type Target = {
  el: Element;
  callbacks: Set<(f: ScrollFrame) => void>;
  visible: boolean;
  rect: DOMRect | null;
  /** Centre on the previous frame, null until the element has been seen. */
  last: { x: number; y: number } | null;
};

const targets = new Map<Element, Target>();
let observer: IntersectionObserver | null = null;
let running = false;

function frameOf(rect: DOMRect, last: Target["last"], dt: number): ScrollFrame {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const nx = (cx - vw / 2) / (vw / 2 + rect.width / 2);
  const ny = (cy - vh / 2) / (vh / 2 + rect.height / 2);
  const moving = last !== null && dt > 0;
  return {
    nx,
    ny,
    presence: Math.max(0, 1 - Math.max(Math.abs(nx), Math.abs(ny))),
    vx: moving ? (cx - last.x) / dt : 0,
    vy: moving ? (cy - last.y) / dt : 0,
    dt: moving ? dt : 0,
    rect,
  };
}

function tick(_time: number, deltaMs: number) {
  const dt = Math.min(deltaMs / 1000, 0.05);
  // Read every rect first, then let the callbacks write: one style/layout pass per frame.
  // An element already removed from the page (React clears refs before effect cleanups
  // run) is skipped until its subscriber unsubscribes.
  targets.forEach((t) => {
    t.rect = t.visible && t.el.isConnected ? t.el.getBoundingClientRect() : null;
  });
  targets.forEach((t) => {
    if (!t.rect) return;
    const f = frameOf(t.rect, t.last, dt);
    t.last = { x: t.rect.left + t.rect.width / 2, y: t.rect.top + t.rect.height / 2 };
    t.callbacks.forEach((cb) => cb(f));
  });
}

/** Runs the ticker only while at least one target is on screen. */
function sync() {
  let any = false;
  targets.forEach((t) => (any ||= t.visible));
  if (any && !running) gsap.ticker.add(tick);
  if (!any && running) gsap.ticker.remove(tick);
  running = any;
}

function onIntersect(records: IntersectionObserverEntry[]) {
  records.forEach((r) => {
    const t = targets.get(r.target);
    if (!t) return;
    t.visible = r.isIntersecting;
    if (!t.visible) t.last = null;
  });
  sync();
}

function subscribe(el: Element, cb: (f: ScrollFrame) => void) {
  observer ??= new IntersectionObserver(onIntersect, { rootMargin: "15%" });
  let t = targets.get(el);
  if (!t) {
    t = { el, callbacks: new Set(), visible: false, rect: null, last: null };
    targets.set(el, t);
    observer.observe(el);
  }
  t.callbacks.add(cb);
  // Pose it straight away, so nothing shows its resting state before its first frame.
  cb(frameOf(el.getBoundingClientRect(), null, 0));

  const target = t;
  return () => {
    target.callbacks.delete(cb);
    if (!target.callbacks.size) {
      observer?.unobserve(el);
      targets.delete(el);
    }
    sync();
  };
}

/**
 * Calls `onFrame` on every animation frame while the element returned by `target` is on
 * (or near) the screen, with its position relative to the viewport and its velocity.
 * It works the same whatever moves the element: page scroll, a pinned horizontal track, a swipe.
 * Does nothing when the user prefers reduced motion.
 */
export function useScrollFrame(target: () => Element | null | undefined, onFrame: (f: ScrollFrame) => void) {
  const latest = useRef({ target, onFrame });

  useEffect(() => {
    latest.current = { target, onFrame };
  });

  useEffect(() => {
    const el = latest.current.target();
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return subscribe(el, (f) => latest.current.onFrame(f));
  }, []);
}

export type Spring = { x: number; v: number };

export const spring = (x = 0): Spring => ({ x, v: 0 });

/** Moves a damped spring toward `target`. With the defaults it overshoots a little, then settles. */
export function follow(s: Spring, target: number, dt: number, stiffness = 170, damping = 14) {
  s.v += (stiffness * (target - s.x) - damping * s.v) * dt;
  s.x += s.v * dt;
}
