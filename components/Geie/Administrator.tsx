"use client";

import clsx from "clsx";
import { useRef } from "react";
import Odometer from "@/components/Odometer/Odometer";
import { geie } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScrollReveal } from "@/lib/reveal";
import styles from "./Administrator.module.css";

/**
 * Profile of the administrator. With the scroll the card opens out of a pill
 * and its rings turn faster, the facts roll into place, the bio rises line by line.
 */
export default function Administrator() {
  const root = useRef<HTMLDivElement>(null);
  const { eyebrow, name, initials, claim, facts, bio } = geie.amministratore;
  useScrollReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const card = root.current!.querySelector(`.${styles.card}`);
        gsap.fromTo(
          card,
          { clipPath: "inset(20% 20% 20% 20% round 20rem)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 3.2rem)",
            ease: "power2.inOut",
            scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 30%", scrub: true },
          },
        );
        gsap.fromTo(
          card,
          { "--spin": 0 },
          {
            "--spin": 240,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={styles.admin}>
      <div className={styles.card}>
        <span className={styles.ring} />
        <span className={clsx(styles.ring, styles.ring2)} />
        <span className={clsx("font-display", styles.monogram)}>{initials}</span>
        <div className={styles.cardText}>
          <p className="type-eyebrow">{eyebrow}</p>
          <h2 className="font-display type-display-m">{name}</h2>
          <p className="type-paragraph-m">{claim}</p>
        </div>
      </div>

      <div className={styles.side}>
        <dl className={styles.facts}>
          {facts.map((f, i) => (
            <div key={f.label}>
              <dt className={clsx("font-display", styles.factValue)}>
                <Odometer value={f.value} from={/^\d{4}$/.test(f.value) ? String(Number(f.value) - 40) : undefined} stagger={i} />
              </dt>
              <dd>{f.label}</dd>
            </div>
          ))}
        </dl>
        <div className={styles.bio}>
          {bio.map((p) => (
            <p key={p} className="type-paragraph-m" data-reveal="lines">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
