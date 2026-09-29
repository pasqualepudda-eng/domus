"use client";

import clsx from "clsx";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Wordmark from "@/components/Wordmark/Wordmark";
import { getConsent, OPEN_EVENT, saveConsent } from "@/lib/consent";
import { gsap } from "@/lib/gsap";
import styles from "./CookieConsent.module.css";

const CATEGORIES = [
  {
    key: "necessari" as const,
    title: "Necessari",
    text: "Indispensabili per il funzionamento del sito e per ricordare le tue scelte.",
    locked: true,
  },
  {
    key: "statistiche" as const,
    title: "Statistici",
    text: "Ci aiuterebbero a capire in forma aggregata come viene usato il sito.",
    locked: false,
  },
  {
    key: "marketing" as const,
    title: "Marketing",
    text: "Servirebbero a mostrarti contenuti in linea con i tuoi interessi.",
    locked: false,
  },
];

function Toggle({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={clsx(styles.toggle, checked && styles.toggleOn)}
      onClick={() => onChange?.(!checked)}
    >
      <span />
    </button>
  );
}

/**
 * Cookie banner following the Italian Garante guidelines: accept and reject
 * have equal weight, closing with X rejects, nothing is pre-ticked, and the
 * choice can be changed at any time (footer / cookie policy).
 */
export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [prefs, setPrefs] = useState({ statistiche: false, marketing: false });
  const card = useRef<HTMLDivElement>(null);
  const closing = useRef(false);

  // First visit (or expired consent): show after the page has settled.
  useEffect(() => {
    if (getConsent()) return;
    const t = window.setTimeout(() => setOpen(true), 1400);
    return () => window.clearTimeout(t);
  }, []);

  // Re-open from footer / cookie policy with the current choices.
  useEffect(() => {
    const onOpen = () => {
      const c = getConsent();
      setPrefs({ statistiche: Boolean(c?.statistiche), marketing: Boolean(c?.marketing) });
      setDetails(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open || !card.current) return;
    closing.current = false;
    gsap.fromTo(
      card.current,
      { yPercent: 120, rotate: 3, autoAlpha: 0 },
      { yPercent: 0, rotate: 0, autoAlpha: 1, duration: 0.9, ease: "back.out(1.4)" },
    );
    gsap.fromTo(
      card.current.querySelectorAll("[data-anim]"),
      { y: 16, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.6, ease: "expo.out", stagger: 0.05, delay: 0.25 },
    );
  }, [open]);

  const close = useCallback((choice: { statistiche: boolean; marketing: boolean }) => {
    if (closing.current) return;
    closing.current = true;
    saveConsent(choice);
    gsap.to(card.current, {
      yPercent: 120,
      rotate: -2,
      autoAlpha: 0,
      duration: 0.5,
      ease: "power3.in",
      onComplete: () => {
        setOpen(false);
        setDetails(false);
      },
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close({ statistiche: false, marketing: false });
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  const rejectAll = () => close({ statistiche: false, marketing: false });
  const acceptAll = () => close({ statistiche: true, marketing: true });

  return (
    <div
      ref={card}
      className={styles.card}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-text"
    >
      <button type="button" className={styles.close} onClick={rejectAll} aria-label="Chiudi e rifiuta i cookie non necessari">
        <span />
        <span />
      </button>

      <div className={styles.head} data-anim>
        <Wordmark className={styles.crest} />
        <h2 id="cookie-title" className="type-heading-xs">
          La tua privacy, le tue scelte
        </h2>
      </div>

      <p id="cookie-text" className={styles.text} data-anim>
        Usiamo cookie tecnici necessari al funzionamento del sito. Con il tuo consenso potremmo usare anche cookie
        statistici e di marketing. Puoi accettarli, rifiutarli o scegliere le singole categorie, e cambiare idea in
        qualsiasi momento. <Link href="/cookie-policy">Leggi la cookie policy</Link>.
      </p>

      <div className={clsx(styles.details, details && styles.detailsOpen)} aria-hidden={!details}>
        <ul>
          {CATEGORIES.map((c) => {
            const checked = c.locked ? true : prefs[c.key as "statistiche" | "marketing"];
            return (
              <li key={c.key} className={styles.category}>
                <div>
                  <b>
                    {c.title}
                    {c.locked && <em>Sempre attivi</em>}
                  </b>
                  <p>{c.text}</p>
                </div>
                <Toggle
                  label={c.title}
                  checked={checked}
                  disabled={c.locked || !details}
                  onChange={(v) => setPrefs((p) => ({ ...p, [c.key]: v }))}
                />
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.actions} data-anim>
        <button type="button" className={clsx(styles.btn, styles.btnOutline)} onClick={rejectAll}>
          Rifiuta
        </button>
        {details ? (
          <button type="button" className={clsx(styles.btn, styles.btnOutline, styles.btnMiddle)} onClick={() => close(prefs)}>
            Salva scelte
          </button>
        ) : (
          <button type="button" className={clsx(styles.btn, styles.btnGhost, styles.btnMiddle)} onClick={() => setDetails(true)}>
            Personalizza
          </button>
        )}
        <button type="button" className={clsx(styles.btn, styles.btnSolid)} onClick={acceptAll}>
          Accetta tutti
        </button>
      </div>
    </div>
  );
}
