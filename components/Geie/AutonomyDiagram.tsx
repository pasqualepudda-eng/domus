"use client";

import clsx from "clsx";
import { useLenis } from "lenis/react";
import { useRef, useState } from "react";
import { geie } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "./AutonomyDiagram.module.css";

const COLORS = ["#ff5c16", "#d075ff", "#89b0ff", "#baf24a"];
const SCATTERED = [
  [120, 120],
  [480, 130],
  [130, 480],
  [470, 470],
];
const GROUPED = [
  [205, 205],
  [395, 205],
  [205, 395],
  [395, 395],
];
const EDGES = [
  [0, 1],
  [1, 3],
  [3, 2],
  [2, 0],
  [0, 3],
  [1, 2],
];

/**
 * Four autonomous members are gathered into one GEIE frame, get connected,
 * and converge on shared goals — each step scrubbed by scroll.
 */
export default function AutonomyDiagram() {
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger>(null);
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const lenis = useLenis();
  const { eyebrow, title, members, steps } = geie.autonomy;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const nodes = q(`.${styles.member}`);
      nodes.forEach((n, i) => gsap.set(n, { x: SCATTERED[i][0], y: SCATTERED[i][1] }));

      // Resources travelling along the links, looping independently.
      q(`.${styles.particle}`).forEach((p, i) => {
        const [a, b] = EDGES[i];
        gsap.fromTo(
          p,
          { attr: { cx: GROUPED[a][0], cy: GROUPED[a][1] } },
          {
            attr: { cx: GROUPED[b][0], cy: GROUPED[b][1] },
            duration: 1.6 + i * 0.2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          },
        );
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
      tl.addLabel("s1", 1)
        .to(nodes, { x: (i) => GROUPED[i][0], y: (i) => GROUPED[i][1], duration: 1, stagger: 0.05 }, "s1")
        .fromTo(q(`.${styles.frame}`), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1 }, "s1")
        .fromTo(q(`.${styles.frameFill}`), { opacity: 0 }, { opacity: 1, duration: 0.6 }, "s1+=0.5")
        .fromTo(q(`.${styles.frameLabel}`), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 }, "s1+=0.6")
        .addLabel("s2", 2.2)
        .fromTo(q(`.${styles.edge}`), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, stagger: 0.08 }, "s2")
        .fromTo(q(`.${styles.particles}`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, "s2+=0.5")
        .addLabel("s3", 3.4)
        .fromTo(q(`.${styles.spoke}`), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.06 }, "s3")
        .fromTo(q(`.${styles.goal}`), { scale: 0, svgOrigin: "300 300" }, { scale: 1, duration: 0.7, ease: "back.out(1.8)" }, "s3+=0.3")
        .to(q(`.${styles.edge}`), { opacity: 0.25, duration: 0.5 }, "s3")
        .to({}, { duration: 0.5 });

      trigger.current = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        animation: tl,
        onUpdate: (self) => {
          const t = tl.duration() * self.progress;
          const next = t < 0.9 ? 0 : t < 2.1 ? 1 : t < 3.3 ? 2 : 3;
          if (next !== stepRef.current) {
            stepRef.current = next;
            setStep(next);
          }
        },
      });
    },
    { scope: root },
  );

  const goTo = (i: number) => {
    const st = trigger.current;
    if (!st || !lenis) return;
    const at = [0.05, 0.38, 0.62, 0.88][i];
    lenis.scrollTo(st.start + (st.end - st.start) * at, { duration: 1.4 });
  };

  return (
    <div ref={root} className={styles.scroll}>
      <div className={styles.stage}>
        <div className={clsx("container", styles.grid)}>
          <div className={styles.copy}>
            <p className="type-eyebrow">{eyebrow}</p>
            <h2 className="font-display type-display-m">{title}</h2>
            <ol className={styles.steps}>
              {steps.map((s, i) => (
                <li key={s.title}>
                  <button
                    type="button"
                    className={clsx(styles.step, i === step && styles.stepActive, i < step && styles.stepDone)}
                    onClick={() => goTo(i)}
                    aria-current={i === step}
                  >
                    <span className={styles.stepIndex}>{i + 1}</span>
                    <span>
                      <b className="type-heading-xs">{s.title}</b>
                      <span className={styles.stepText}>{s.text}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.diagram}>
            <svg viewBox="0 0 600 600" role="img" aria-label={steps.map((s) => s.title).join(", ")}>
              <rect className={styles.frameFill} x="100" y="100" width="400" height="400" rx="56" />
              <rect className={styles.frame} x="100" y="100" width="400" height="400" rx="56" pathLength={1} />
              <g className={styles.frameLabel}>
                <rect x="190" y="84" width="220" height="32" rx="16" />
                <text x="300" y="105" textAnchor="middle">
                  ARKADOMUS GEIE
                </text>
              </g>

              {EDGES.map(([a, b], i) => (
                <line
                  key={`e${i}`}
                  className={styles.edge}
                  x1={GROUPED[a][0]}
                  y1={GROUPED[a][1]}
                  x2={GROUPED[b][0]}
                  y2={GROUPED[b][1]}
                  pathLength={1}
                />
              ))}
              {GROUPED.map(([x, y], i) => (
                <line key={`s${i}`} className={styles.spoke} x1={x} y1={y} x2={300} y2={300} pathLength={1} />
              ))}
              <g className={styles.particles}>
                {EDGES.map(([a], i) => (
                  <circle key={i} className={styles.particle} r="6" cx={GROUPED[a][0]} cy={GROUPED[a][1]} />
                ))}
              </g>

              <g className={styles.goal}>
                <circle cx="300" cy="300" r="54" />
                <text x="300" y="295" textAnchor="middle">
                  Obiettivi
                </text>
                <text x="300" y="316" textAnchor="middle">
                  comuni
                </text>
              </g>

              {members.map((m, i) => (
                <g key={m} className={styles.member}>
                  <circle className={styles.orbit} r="68" style={{ stroke: COLORS[i] }} />
                  <circle r="48" fill={COLORS[i]} />
                  <text y="5" textAnchor="middle">
                    {m}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
