"use client";

import clsx from "clsx";
import { useRef } from "react";
import { chiSiamo } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./NameMerge.module.css";

/**
 * Pinned scroll story: ARKA arrives from the left, DOMUS from the right,
 * then the two halves fuse into a single ARKADOMUS panel.
 */
export default function NameMerge() {
  const root = useRef<HTMLDivElement>(null);
  const { arka, domus, outro } = chiSiamo.significato;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const [wordA] = q(`.${styles.wordA} span`);
      const [wordD] = q(`.${styles.wordD} span`);
      const vw = () => window.innerWidth;

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(q(`.${styles.panelA}`), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 50% 0% 0%)", duration: 1 })
        .fromTo(q(`.${styles.wordA}`), { xPercent: -60, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 1 }, "<")
        .fromTo(q(`.${styles.claimA}`), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, "-=0.4")
        .fromTo(q(`.${styles.panelD}`), { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 50%)", duration: 1 }, "+=0.3")
        .fromTo(q(`.${styles.wordD}`), { xPercent: 60, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 1 }, "<")
        .fromTo(q(`.${styles.claimD}`), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, "-=0.4")
        .addLabel("merge", "+=0.4")
        .to(q(`.${styles.claim}`), { y: -30, autoAlpha: 0, duration: 0.5 }, "merge")
        .to(
          q(`.${styles.wordA}`),
          { x: () => vw() / 4 - (wordD as HTMLElement).offsetWidth / 2, duration: 1.2 },
          "merge",
        )
        .to(
          q(`.${styles.wordD}`),
          { x: () => (wordA as HTMLElement).offsetWidth / 2 - vw() / 4, duration: 1.2 },
          "merge",
        )
        .to(q(`.${styles.panel}`), { backgroundColor: "#ff5c16", duration: 1.2 }, "merge")
        .to(q(`.${styles.word}`), { color: "#0a0a0a", duration: 1.2 }, "merge")
        .fromTo(q(`.${styles.outro}`), { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, "-=0.3")
        .to({}, { duration: 0.4 });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={styles.scroll}>
      <div className={styles.stage}>
        <div className={clsx(styles.panel, styles.panelA)} />
        <div className={clsx(styles.panel, styles.panelD)} />

        <div className={styles.words} aria-label="ARKADOMUS">
          <span className={clsx(styles.word, styles.wordA)} aria-hidden="true">
            <span className="font-display">ARKA</span>
          </span>
          <span className={clsx(styles.word, styles.wordD)} aria-hidden="true">
            <span className="font-display">DOMUS</span>
          </span>
        </div>

        <div className={clsx(styles.claim, styles.claimA)}>
          <b className="type-heading-s">{arka.claim}</b>
          <p className="type-paragraph-m">{arka.text}</p>
        </div>
        <div className={clsx(styles.claim, styles.claimD)}>
          <b className="type-heading-s">{domus.claim}</b>
          <p className="type-paragraph-m">{domus.text}</p>
        </div>

        <p className={clsx(styles.outro, "type-heading-s")}>{outro}</p>
      </div>
    </div>
  );
}
