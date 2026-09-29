"use client";

import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { ArrowIcon } from "@/components/Icons/Icons";
import ServiceArt from "./ServiceArt";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import { services } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { follow, spring, useScrollFrame } from "@/lib/scrollFrame";
import styles from "./HorizontalCards.module.css";

const clampTurn = gsap.utils.clamp(-32, 32);
const clampTilt = gsap.utils.clamp(-16, 16);

/**
 * The link keeps its layout box (it is what gets measured and snapped); the face inside it
 * turns toward the centre of the screen, so the row reads as a curved wall. Moving fast swings
 * it a little further, then it settles on a spring; coming up from below it tilts back.
 */
function ServiceCard({ item, index }: { item: (typeof services.items)[number]; index: number }) {
  const slot = useRef<HTMLAnchorElement>(null);
  const face = useRef<HTMLSpanElement>(null);
  const turn = useRef(spring());

  useScrollFrame(
    () => slot.current,
    ({ nx, ny, vx, dt }) => {
      // Gentler on touch layouts, so the neighbouring cards still peek in at the edges.
      const wide = window.innerWidth >= 1025;
      const s = turn.current;
      const target = clampTurn(-nx * (wide ? 24 : 12) - vx * 0.004);
      if (dt === 0) s.x = target;
      else follow(s, target, dt, 140, 16);
      const scale = 1 - (wide ? 0.08 : 0.03) * Math.min(1, Math.abs(nx));
      if (!face.current) return;
      face.current.style.transform =
        `perspective(1400px) rotateX(${clampTilt(ny * 16).toFixed(2)}deg) ` +
        `rotateY(${s.x.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    },
  );

  return (
    <Link ref={slot} href="/contatti" className={styles.slot}>
      <span ref={face} className={styles.card} style={{ "--bg": item.color } as CSSProperties}>
        <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
        <span className={styles.art} aria-hidden="true">
          <ServiceArt kind={item.art} accent={item.accent} />
        </span>
        <span className={styles.meta}>
          <span className="type-eyebrow">{item.tag}</span>
          <span className="type-heading-m">{item.title}</span>
        </span>
        <ArrowIcon className={styles.arrow} />
      </span>
    </Link>
  );
}

/**
 * Desktop: the section pins and vertical scroll drives the track sideways,
 * with a progress bar. Below 1025px it is a native scroll-snap row.
 */
export default function HorizontalCards({ id }: { id?: string }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1025px)", () => {
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .to(track.current, { x: () => -distance(), ease: "none" }, 0)
          .fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id={id} className={styles.section}>
      <div className={styles.inner}>
        <div className="container">
          <SectionIntro eyebrow={services.eyebrow} title={services.title} />
        </div>
        <div ref={track} className={styles.track} data-lenis-prevent-touch>
          {services.items.map((c, i) => (
            <ServiceCard key={c.title} item={c} index={i} />
          ))}
        </div>
        <div className="container">
          <div className={styles.progress}>
            <span ref={bar} />
          </div>
        </div>
      </div>
    </section>
  );
}
