"use client";

import { useRef } from "react";
import Button from "@/components/Button/Button";
import FloatingAssets from "@/components/FloatingAssets/FloatingAssets";
import PixelHeading from "@/components/PixelHeading/PixelHeading";
import { cta as homeCta } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScrollReveal } from "@/lib/reveal";
import styles from "./CallToAction.module.css";

type Cta = typeof homeCta;

/**
 * Full-bleed closing panel that grows from an inset card as it scrolls in; the
 * heading sharpens from pixels and the copy rises with the scroll.
 */
export default function CallToAction({ id, cta = homeCta }: { id?: string; cta?: Cta }) {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useScrollReveal(root);

  useGSAP(
    () => {
      gsap.fromTo(
        panel.current,
        { clipPath: "inset(8% 6% 8% 6% round 4rem)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0rem)",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "top top", scrub: true },
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id={id} className={styles.section}>
      <div ref={panel} className={styles.panel}>
        <FloatingAssets
          assets={[
            { color: "var(--orange)", shape: "star" },
            { color: "var(--purple)", shape: "coin" },
            { color: "var(--azure)", shape: "card" },
          ]}
        />
        <div className={styles.content}>
          <PixelHeading as="h2" html={cta.title} className="type-display-xl" />
          <p className="type-paragraph-l" data-reveal="lines">
            {cta.text}
          </p>
          <div className={styles.buttons} data-reveal="stagger">
            <Button label={cta.primary.label} href={cta.primary.href} variant="light" size="l" />
            <Button label={cta.secondary.label} href={cta.secondary.href} variant="secondary" size="l" icon="right" />
          </div>
        </div>
      </div>
    </section>
  );
}
