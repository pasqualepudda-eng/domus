"use client";

import clsx from "clsx";
import { useCallback, useRef, useState } from "react";
import PixelHeading from "@/components/PixelHeading/PixelHeading";
import { chiSiamo } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./VisionReveal.module.css";

/** A circle grows from the centre to flood the screen, revealing the vision. */
export default function VisionReveal() {
  const root = useRef<HTMLDivElement>(null);
  const { eyebrow, title, text } = chiSiamo.visione;
  const [headingTl, setHeadingTl] = useState<gsap.core.Timeline | null>(null);
  const onTimeline = useCallback((tl: gsap.core.Timeline) => setHeadingTl(tl), []);

  useGSAP(
    () => {
      if (!headingTl) return;
      const q = gsap.utils.selector(root);
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: true },
        })
        .fromTo(q(`.${styles.circle}`), { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", ease: "power2.inOut", duration: 1 })
        .fromTo(q(`.${styles.ring}`), { scale: 0.2, autoAlpha: 1 }, { scale: 2.4, autoAlpha: 0, ease: "power1.out", duration: 1 }, 0)
        .fromTo(headingTl, { time: 0 }, { time: headingTl.duration(), duration: 0.5, ease: "none" }, 0.6)
        .from(q(`.${styles.line}`), { y: 50, autoAlpha: 0, stagger: 0.12, duration: 0.5, ease: "expo.out" }, 0.75)
        .to({}, { duration: 0.4 });
    },
    { scope: root, dependencies: [headingTl], revertOnUpdate: true },
  );

  return (
    <div ref={root} className={styles.scroll}>
      <div className={styles.stage}>
        <span className={styles.ring} />
        <span className={clsx(styles.ring, styles.ring2)} />
        <div className={styles.circle}>
          <div className={clsx("container", styles.content)}>
            <p className={clsx("type-eyebrow", styles.line)}>{eyebrow}</p>
            <PixelHeading as="h2" html={title} onTimeline={onTimeline} className={clsx("type-display-m", styles.title)} />
            {text.map((t) => (
              <p key={t} className={clsx("type-paragraph-l", styles.line)}>
                {t}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
