"use client";

import type { RefObject } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

type Cleanup = () => void;

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&+<>/";

/** `text` typed out up to progress `p` (0 → 1), with a short tail of flickering glyphs ahead of the settled part. */
function decode(text: string, p: number) {
  const tail = 5;
  const front = p * (text.length + tail);
  const step = Math.floor(p * 60);
  let out = "";
  for (let i = 0; i < text.length && i < front; i++) {
    const c = text[i];
    out += i < front - tail || c === " " ? c : GLYPHS[(i * 31 + step * 17) % GLYPHS.length];
  }
  return out;
}

/**
 * Label: decodes from scrambled glyphs, left to right, when it scrolls in (and scrambles
 * away again when scrolled back out). It plays over time rather than following the scroll,
 * so it never stays frozen half-scrambled. Assistive tech gets the real text throughout.
 */
function eyebrow(el: HTMLElement): Cleanup {
  const text = el.textContent ?? "";
  const sr = document.createElement("span");
  sr.className = "sr-only";
  sr.textContent = text;
  const shown = document.createTextNode("");
  // The not-yet-decoded part stays in place, invisible, so the label keeps its width.
  const rest = document.createElement("span");
  rest.style.opacity = "0";
  const visible = document.createElement("span");
  visible.setAttribute("aria-hidden", "true");
  visible.append(shown, rest);
  el.replaceChildren(sr, visible);

  const state = { p: 0 };
  const render = () => {
    const out = decode(text, state.p);
    shown.nodeValue = out;
    rest.textContent = text.slice(out.length);
  };
  render();
  const tween = gsap.to(state, {
    p: 1,
    duration: 0.3 + text.length * 0.025,
    ease: "none",
    onUpdate: render,
    scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" },
  });
  return () => {
    tween.revert();
    el.textContent = text;
  };
}

/** Title: words stand up from their baseline in 3D, one after the other. */
function title(el: HTMLElement): Cleanup {
  const split = SplitText.create(el, { type: "words", tag: "span" });
  gsap.set(split.words, { transformOrigin: "50% 100%", transformPerspective: 800 });
  const tween = gsap.fromTo(
    split.words,
    { rotationX: -90, yPercent: 30, opacity: 0 },
    {
      rotationX: 0,
      yPercent: 0,
      opacity: 1,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: { trigger: el, start: "top 92%", end: "top 62%", scrub: true },
    },
  );
  return () => {
    tween.revert();
    split.revert();
  };
}

/** Paragraph: lines rise out of a mask. Re-split whenever the layout changes. */
function lines(el: HTMLElement): Cleanup {
  const split = SplitText.create(el, {
    type: "lines",
    mask: "lines",
    tag: "span",
    autoSplit: true,
    onSplit: (self) =>
      gsap.fromTo(
        self.lines,
        { yPercent: 105 },
        {
          yPercent: 0,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: { trigger: el, start: "top 96%", end: "top 72%", scrub: true },
        },
      ),
  });
  return () => split.revert();
}

/** Anything else: rises and fades in (several targets rise one after the other). */
function up(targets: Element | Element[], trigger: Element): Cleanup {
  const tween = gsap.fromTo(
    targets,
    { y: 36, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      ease: "power2.out",
      stagger: 0.15,
      scrollTrigger: { trigger, start: "top 96%", end: "top 80%", scrub: true },
    },
  );
  return () => tween.revert();
}

/**
 * Scroll-scrubbed reveals for everything marked `data-reveal` inside `scope`:
 * - "eyebrow": the label decodes from scrambled glyphs (triggered by the scroll, played over time)
 * - "title": words stand up from their baseline in 3D, one after the other
 * - "lines": lines rise out of a mask
 * - "stagger": the element's children rise one after the other
 * - "up" (or any other value): the element rises and fades in
 * Each element is driven by its own position, so it builds as it scrolls in and
 * unbuilds when scrolled back. Nothing happens with reduced motion.
 */
export function useScrollReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cleanups: Cleanup[] = [];
        // Skip elements a nested component already animates (children set up first).
        scope.current?.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealing])").forEach((el) => {
          el.dataset.revealing = "";
          const kind = el.dataset.reveal;
          const undo =
            kind === "eyebrow"
              ? eyebrow(el)
              : kind === "title"
                ? title(el)
                : kind === "lines"
                  ? lines(el)
                  : kind === "stagger"
                    ? up(Array.from(el.children), el)
                    : up(el, el);
          cleanups.push(() => {
            undo();
            delete el.dataset.revealing;
          });
        });
        return () => cleanups.forEach((c) => c());
      });
    },
    { scope },
  );
}
