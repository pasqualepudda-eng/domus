"use client";

import clsx from "clsx";
import { useLenis } from "lenis/react";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "./PageToc.module.css";

/**
 * "In questa pagina": a pill nav that docks at the top once the hero has
 * scrolled away, highlights the section in view and shows page progress.
 */
export default function PageToc({ items }: { items: { id: string; label: string }[] }) {
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(-1);
  const lenis = useLenis();

  useGSAP(
    () => {
      const first = document.getElementById(items[0].id);
      if (!first) return;
      gsap.set(root.current, { autoAlpha: 0, yPercent: -120 });
      ScrollTrigger.create({
        trigger: first,
        start: "top 60%",
        endTrigger: "#page-end",
        end: "top 80%",
        onToggle: (self) =>
          gsap.to(root.current, {
            autoAlpha: self.isActive ? 1 : 0,
            yPercent: self.isActive ? 0 : -120,
            duration: 0.6,
            ease: "expo.out",
          }),
        onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
      });
      items.forEach((item, i) => {
        const el = document.getElementById(item.id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    },
    { dependencies: [items] },
  );

  // Keep the active pill in view on narrow screens.
  useGSAP(() => {
    const list = root.current?.querySelector("ul");
    const pill = list?.children[active] as HTMLElement | undefined;
    if (list && pill) list.scrollTo({ left: pill.offsetLeft - 16, behavior: "smooth" });
  }, [active]);

  return (
    <nav ref={root} className={styles.toc} aria-label="In questa pagina">
      <span className={clsx("type-eyebrow", styles.label)}>In questa pagina</span>
      <ul>
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              className={clsx(styles.pill, i === active && styles.active)}
              onClick={() => lenis?.scrollTo(`#${item.id}`, { offset: -110, duration: 1.4 })}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
      <span className={styles.progress}>
        <span ref={bar} />
      </span>
    </nav>
  );
}
