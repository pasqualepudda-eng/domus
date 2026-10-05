"use client";

import clsx from "clsx";
import { useRef, type CSSProperties } from "react";
import FloatingAssets from "@/components/FloatingAssets/FloatingAssets";
import PixelHeading from "@/components/PixelHeading/PixelHeading";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./PageHero.module.css";

type Props = {
  eyebrow: string;
  title: string;
  text: string[];
  bg?: string;
  fg?: string;
  accent?: string;
};

/**
 * Inner-page hero. Copy rises in on load; on scroll the panel folds into a
 * rounded card and the content drifts up, tips back and fades, handing over to the page.
 */
export default function PageHero({
  eyebrow,
  title,
  text,
  bg = "var(--azure-dark)",
  fg = "var(--azure-light)",
  accent = "var(--azure)",
}: Props) {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(`.${styles.reveal}`, {
        y: 40,
        autoAlpha: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.1,
        delay: 0.5,
      });

      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        })
        .to(panel.current, { clipPath: "inset(0% 2.4% 6% 2.4% round 4rem)", ease: "none" }, 0)
        // The copy tips back into the page as it leaves.
        .to(
          content.current,
          {
            yPercent: -18,
            autoAlpha: 0,
            scale: 0.94,
            rotationX: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 28,
            transformPerspective: 1200,
            transformOrigin: "50% 100%",
            ease: "none",
          },
          0,
        );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className={styles.hero}
      style={{ "--hero-bg": bg, "--hero-fg": fg, "--hero-accent": accent } as CSSProperties}
    >
      <div ref={panel} className={styles.panel}>
        <div className={styles.assets}>
          <FloatingAssets
            variant="hero"
            assets={[
              { color: "var(--orange)", shape: "star" },
              { color: "var(--purple)", shape: "coin" },
              { color: "var(--blue)", shape: "pill" },
            ]}
          />
        </div>
        <div ref={content} className={clsx("container", styles.content)}>
          <p className={clsx("type-eyebrow", styles.reveal)}>{eyebrow}</p>
          <PixelHeading as="h1" html={title} reveal="load" className={clsx("type-display-l", styles.title)} />
          <div className={styles.text}>
            {text.map((t) => (
              <p key={t} className={clsx("type-paragraph-l", styles.reveal)}>
                {t}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
