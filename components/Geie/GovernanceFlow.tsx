"use client";

import clsx from "clsx";
import { useRef, useState } from "react";
import { geie } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "./GovernanceFlow.module.css";

const COLORS = ["var(--blue)", "var(--orange)", "var(--purple)", "var(--green)"];

/**
 * Vertical chain of the Group's bodies. Steps swing in as they scroll up, the
 * connector fills with the scroll and the step it reaches becomes active; any
 * step can also be clicked.
 */
export default function GovernanceFlow() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const pinnedByUser = useRef(false);
  const activeRef = useRef(0);
  const { nodes } = geie.governance;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      ScrollTrigger.create({
        trigger: q(`.${styles.chain}`)[0],
        start: "top 65%",
        end: "bottom 55%",
        scrub: true,
        onUpdate: (self) => {
          gsap.set(q(`.${styles.fill}`), { scaleY: self.progress });
          const next = Math.min(nodes.length - 1, Math.floor(self.progress * nodes.length));
          if (!pinnedByUser.current && next !== activeRef.current) {
            activeRef.current = next;
            setActive(next);
          }
        },
      });
      // Each step swings in from the connector as it scrolls up (on the list item:
      // the button's own opacity belongs to the active/past states).
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        q(`.${styles.chain} > li`).forEach((li) => {
          gsap.fromTo(
            li,
            { x: -48, rotationY: 35, opacity: 0, transformPerspective: 900, transformOrigin: "0% 50%" },
            {
              x: 0,
              rotationY: 0,
              opacity: 1,
              ease: "power3.out",
              scrollTrigger: { trigger: li, start: "top 94%", end: "top 70%", scrub: true },
            },
          );
        });
      });
    },
    { scope: root },
  );

  const node = nodes[active];

  return (
    <div ref={root} className={styles.flow}>
      <ol className={styles.chain}>
        <span className={styles.track}>
          <span className={styles.fill} />
        </span>
        {nodes.map((n, i) => (
          <li key={n.id}>
            <button
              type="button"
              className={clsx(styles.node, i === active && styles.nodeActive, i < active && styles.nodePast)}
              style={{ "--c": COLORS[i] } as React.CSSProperties}
              onClick={() => {
                pinnedByUser.current = true;
                setActive(i);
              }}
              aria-expanded={i === active}
            >
              <span className={styles.bullet}>{i + 1}</span>
              <span className="type-heading-s">{n.title}</span>
            </button>
            <div className={styles.inlineDetail} aria-hidden={i !== active}>
              <p className="type-paragraph-m">{n.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className={styles.detail} style={{ "--c": COLORS[active] } as React.CSSProperties}>
        <div key={node.id} className={styles.detailInner}>
          <span className={styles.detailIndex}>
            {String(active + 1).padStart(2, "0")} / {String(nodes.length).padStart(2, "0")}
          </span>
          <h3 className="font-display type-display-s">{node.title}</h3>
          <p className="type-paragraph-l">{node.text}</p>
        </div>
      </div>
    </div>
  );
}
