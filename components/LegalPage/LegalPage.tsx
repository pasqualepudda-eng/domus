"use client";

import clsx from "clsx";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { Fragment, useRef, useState, type ReactNode } from "react";
import type { LegalBlock, LegalDoc } from "@/lib/legal";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "./LegalPage.module.css";

const LINKS: [string, string][] = [
  ["Cookie policy", "/cookie-policy"],
  ["pagina Contatti", "/contatti"],
];

/** [[placeholder]] → highlighted mark; known page names → internal links. */
function rich(text: string): ReactNode[] {
  return text.split(/(\[\[[^\]]+\]\])/g).flatMap((part, i) => {
    if (part.startsWith("[[")) {
      return [
        <mark key={i} className={styles.todo} title="Da completare prima della pubblicazione">
          {part.slice(2, -2)}
        </mark>,
      ];
    }
    const pattern = new RegExp(`(${LINKS.map(([t]) => t).join("|")})`, "g");
    return part.split(pattern).map((chunk, j) => {
      const link = LINKS.find(([t]) => t === chunk);
      return link ? (
        <Link key={`${i}-${j}`} href={link[1]}>
          {chunk}
        </Link>
      ) : (
        <Fragment key={`${i}-${j}`}>{chunk}</Fragment>
      );
    });
  });
}

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") return <p>{rich(block)}</p>;
  return (
    <ul>
      {block.list.map((item) => (
        <li key={item}>{rich(item)}</li>
      ))}
    </ul>
  );
}

export default function LegalPage({
  doc,
  extras = {},
}: {
  doc: LegalDoc;
  /** Extra UI rendered at the end of a section, keyed by section id. */
  extras?: Record<string, ReactNode>;
}) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const lenis = useLenis();
  const hasTodo = JSON.stringify(doc).includes("[[");

  useGSAP(
    () => {
      gsap.from(`.${styles.reveal}`, { y: 40, autoAlpha: 0, duration: 1, ease: "expo.out", stagger: 0.08, delay: 0.3 });
      const links = gsap.utils.toArray<HTMLElement>(`.${styles.indexLink}`);
      gsap.utils.toArray<HTMLElement>(`.${styles.section}`).forEach((el, i) => {
        // Each index entry fills up as its section is read.
        ScrollTrigger.create({
          trigger: el,
          start: "top 40%",
          end: "bottom 40%",
          onToggle: (self) => self.isActive && setActive(i),
          onUpdate: (self) => links[i]?.style.setProperty("--read", self.progress.toFixed(3)),
          onRefresh: (self) => links[i]?.style.setProperty("--read", self.progress.toFixed(3)),
        });
        gsap.fromTo(
          el,
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: "expo.out",
            clearProps: "transform,opacity,visibility",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <article ref={root} className={styles.page}>
      <header className={styles.hero}>
        <div className="container">
          <p className={clsx("type-eyebrow", styles.reveal)}>{doc.eyebrow}</p>
          <h1 className={clsx("font-display type-display-l", styles.reveal)}>{doc.title}</h1>
          <p className={clsx(styles.updated, styles.reveal)}>Ultimo aggiornamento: {doc.updated}</p>
        </div>
      </header>

      <div className={clsx("container", styles.body)}>
        <nav className={styles.index} aria-label="Indice">
          <p className="type-eyebrow">Indice</p>
          <ol>
            {doc.sections.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={clsx(styles.indexLink, i === active && styles.indexActive)}
                  onClick={() => lenis?.scrollTo(`#${s.id}`, { offset: -120, duration: 1.2 })}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className={styles.content}>
          {hasTodo && (
            <p className={styles.notice} role="note">
              <b>Bozza.</b> Le parti <mark className={styles.todo}>evidenziate</mark> vanno completate e l’intero testo
              va verificato da un consulente legale prima della pubblicazione.
            </p>
          )}
          <p className={clsx("type-paragraph-l", styles.intro)}>{rich(doc.intro)}</p>

          {doc.sections.map((s, i) => (
            <section key={s.id} id={s.id} className={styles.section}>
              <h2 className="type-heading-m">
                <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
              {s.body.map((b, j) => (
                <Block key={j} block={b} />
              ))}
              {extras[s.id]}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
