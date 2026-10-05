"use client";

import clsx from "clsx";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Button from "@/components/Button/Button";
import { ArrowRightIcon, ChevronIcon } from "@/components/Icons/Icons";
import { CONTACT_ENDPOINT, contatti, euCountries } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import styles from "./ContactForm.module.css";

type Answers = {
  nome: string;
  tipologia: string;
  societa: string;
  paese: string;
  email: string;
  telefono: string;
  progetto: string;
  consenso: boolean;
};

type Field = {
  key: keyof Answers;
  type: "text" | "choice" | "country" | "email" | "tel" | "textarea" | "consent";
  label: string;
  question: string;
  help?: string;
  required: boolean;
  bg: string;
};

const FIELDS: Field[] = [
  { key: "nome", type: "text", label: "Nome e cognome", question: "Iniziamo: come ti chiami?", required: true, bg: "var(--azure)" },
  { key: "tipologia", type: "choice", label: "Tipologia di soggetto", question: "Piacere, {nome}! Che tipo di soggetto rappresenti?", required: true, bg: "var(--orange)" },
  { key: "societa", type: "text", label: "Società o organizzazione", question: "Qual è la tua società o organizzazione?", help: "Facoltativo", required: false, bg: "var(--purple)" },
  { key: "paese", type: "country", label: "Paese", question: "In quale Paese operi?", help: "Inizia a scrivere e scegli dall’elenco, oppure inserisci un altro Paese.", required: true, bg: "var(--blue)" },
  { key: "email", type: "email", label: "Email", question: "Qual è la tua email?", help: "Ti ricontatteremo a questo indirizzo.", required: true, bg: "var(--azure)" },
  { key: "telefono", type: "tel", label: "Telefono", question: "Vuoi lasciarci anche un numero di telefono?", help: "Facoltativo", required: false, bg: "var(--orange)" },
  { key: "progetto", type: "textarea", label: "Il tuo progetto", question: "Raccontaci il tuo progetto.", help: "Chi sei, cosa fai e quali obiettivi vuoi raggiungere. Shift ⇧ + Invio ↵ per andare a capo.", required: true, bg: "var(--purple)" },
  { key: "consenso", type: "consent", label: "Consenso", question: "Un’ultima cosa.", required: true, bg: "var(--blue)" },
];

const LETTERS = "ABCDEFGHIJ";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const EMPTY: Answers = {
  nome: "",
  tipologia: "",
  societa: "",
  paese: "",
  email: "",
  telefono: "",
  progetto: "",
  consenso: false,
};

/**
 * Typeform-style contact flow: one question per screen, vertical slide
 * transitions, keyboard shortcuts, progress bar and a live recap.
 * step -1 = welcome, 0..n-1 = questions, n = thank-you.
 */
export default function ContactForm() {
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [countryIndex, setCountryIndex] = useState(0);
  const screen = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const lenis = useLenis();

  const n = FIELDS.length;
  const field = step >= 0 && step < n ? FIELDS[step] : null;
  const firstName = answers.nome.trim().split(" ")[0] || "";

  // Full-screen app: no page scroll while the form is open.
  useEffect(() => {
    lenis?.stop();
    return () => lenis?.start();
  }, [lenis]);

  // Entrance for each new screen, direction-aware.
  const dir = useRef(1);
  useEffect(() => {
    const el = screen.current;
    if (!el) return;
    gsap.fromTo(
      el.querySelectorAll("[data-anim]"),
      { y: 70 * dir.current, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.7, ease: "expo.out", stagger: 0.05 },
    );
    const input = el.querySelector<HTMLElement>("input:not([type=checkbox]), textarea");
    if (input) window.setTimeout(() => input.focus({ preventScroll: true }), 250);
  }, [step]);

  const goTo = useCallback((next: number) => {
    if (busy.current) return;
    busy.current = true;
    dir.current = next > step ? 1 : -1;
    setError("");
    const el = screen.current;
    const done = () => {
      setStep(next);
      busy.current = false;
    };
    if (!el) return done();
    gsap.to(el.querySelectorAll("[data-anim]"), {
      y: -50 * dir.current,
      autoAlpha: 0,
      duration: 0.35,
      ease: "power2.in",
      stagger: 0.02,
      onComplete: done,
    });
  }, [step]);

  const validate = (f: Field): string => {
    const v = answers[f.key];
    if (f.type === "consent") return v ? "" : "Per continuare è necessario il consenso.";
    const s = String(v).trim();
    if (f.required && !s) return f.type === "choice" ? "Seleziona un’opzione." : "Compila questo campo.";
    if (f.type === "email" && s && !EMAIL_RE.test(s)) return "Inserisci un indirizzo email valido.";
    if (f.type === "tel" && s && !/^[+\d\s().-]{6,}$/.test(s)) return "Inserisci un numero valido.";
    return "";
  };

  const submit = async () => {
    setStatus("sending");
    try {
      if (CONTACT_ENDPOINT) {
        const res = await fetch(CONTACT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(answers),
        });
        if (!res.ok) throw new Error(String(res.status));
      }
      setStatus("idle");
      goTo(n);
    } catch {
      setStatus("error");
    }
  };

  const next = () => {
    if (step === -1) return goTo(0);
    if (!field) return;
    const msg = validate(field);
    if (msg) {
      setError(msg);
      gsap.fromTo(`.${styles.error}`, { x: -8 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
      return;
    }
    if (step === n - 1) return submit();
    goTo(step + 1);
  };

  const prev = () => step > 0 && step < n && goTo(step - 1);

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    setError("");
  };

  const choose = (value: string) => {
    set("tipologia", value);
    window.setTimeout(() => goTo(step + 1), 450);
  };

  const countryMatches = useMemo(() => {
    const q = answers.paese.trim().toLowerCase();
    if (!q) return euCountries;
    return euCountries.filter((c) => c.toLowerCase().includes(q));
  }, [answers.paese]);

  // Global keys: Enter to continue, letters for choices.
  const onKey = (e: KeyboardEvent) => {
    if (status === "sending") return;
    const target = e.target as HTMLElement | null;
    // A focused button handles Enter itself via click.
    if (e.key === "Enter" && target?.tagName === "BUTTON") return;
    const typing = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";
    if (field?.type === "choice" && !typing && !e.metaKey && !e.ctrlKey) {
      const idx = LETTERS.indexOf(e.key.toUpperCase());
      if (idx >= 0 && idx < contatti.types.length) {
        e.preventDefault();
        return choose(contatti.types[idx]);
      }
    }
    if (field?.type === "country" && countryMatches.length) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        return setCountryIndex((i) => Math.min(countryMatches.length - 1, i + 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        return setCountryIndex((i) => Math.max(0, i - 1));
      }
      if (e.key === "Enter" && answers.paese.trim() && !euCountries.includes(answers.paese)) {
        const pick = countryMatches[countryIndex];
        if (pick) {
          e.preventDefault();
          set("paese", pick);
          return;
        }
      }
    }
    if (e.key === "Enter" && !(field?.type === "textarea" && e.shiftKey)) {
      e.preventDefault();
      next();
    }
  };

  const keyHandler = useRef(onKey);
  keyHandler.current = onKey;
  useEffect(() => {
    const listener = (e: KeyboardEvent) => keyHandler.current(e);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  const progress = step < 0 ? 0 : Math.min(1, step / n);
  const accent = field?.bg ?? "var(--azure)";
  const question = field?.question.replace("{nome}", firstName || "piacere di conoscerti") ?? "";

  return (
    <div className={styles.app} style={{ "--accent": accent } as CSSProperties}>
      <div className={styles.progress} aria-hidden="true">
        <span style={{ transform: `scaleX(${step >= n ? 1 : progress})` }} />
      </div>

      <div className={styles.layout}>
        <div ref={screen} className={styles.screen} key={step} aria-live="polite" data-lenis-prevent>
          {step === -1 && (
            <div className={styles.welcome}>
              <p data-anim className="type-eyebrow">
                {contatti.intro.eyebrow}
              </p>
              <h1 data-anim className="font-display type-display-m">
                {contatti.intro.title}
              </h1>
              <p data-anim className={clsx("type-paragraph-l", styles.muted)}>
                {contatti.intro.text}
              </p>
              <div data-anim className={styles.actions}>
                <Button label={contatti.intro.start} onClick={next} size="l" icon="right" />
                <span className={styles.hintKey}>
                  oppure premi <b>Invio ↵</b>
                </span>
              </div>
              <dl data-anim className={styles.facts}>
                {contatti.intro.facts.map((f) => (
                  <div key={f.label}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {field && (
            <div className={styles.question}>
              <p data-anim className={styles.qLabel}>
                <span className={styles.qNum}>
                  {step + 1}
                  <ArrowRightIcon />
                </span>
                {field.label}
                {field.required && " *"}
              </p>
              <h2 data-anim className="font-display type-display-s">
                {question}
              </h2>
              {field.help && (
                <p data-anim className={styles.help}>
                  {field.help}
                </p>
              )}

              <div data-anim className={styles.control}>
                {(field.type === "text" || field.type === "email" || field.type === "tel") && (
                  <input
                    className={styles.input}
                    type={field.type}
                    inputMode={field.type === "tel" ? "tel" : field.type === "email" ? "email" : "text"}
                    autoComplete={
                      field.key === "nome" ? "name" : field.key === "societa" ? "organization" : field.type
                    }
                    placeholder="Scrivi qui la tua risposta…"
                    value={String(answers[field.key])}
                    onChange={(e) => set(field.key, e.target.value as never)}
                    aria-label={field.label}
                  />
                )}

                {field.type === "textarea" && (
                  <textarea
                    className={clsx(styles.input, styles.textarea)}
                    rows={4}
                    placeholder="Scrivi qui la tua risposta…"
                    value={answers.progetto}
                    onChange={(e) => set("progetto", e.target.value)}
                    aria-label={field.label}
                    data-lenis-prevent
                  />
                )}

                {field.type === "country" && (
                  <div className={styles.combo}>
                    <input
                      className={styles.input}
                      placeholder="Scrivi il Paese…"
                      value={answers.paese}
                      onChange={(e) => {
                        set("paese", e.target.value);
                        setCountryIndex(0);
                      }}
                      aria-label={field.label}
                      aria-autocomplete="list"
                      autoComplete="country-name"
                    />
                    <ul className={styles.options} role="listbox" data-lenis-prevent>
                      {countryMatches.map((c, i) => (
                        <li key={c}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={answers.paese === c}
                            className={clsx(
                              styles.option,
                              i === countryIndex && styles.optionFocus,
                              answers.paese === c && styles.optionOn,
                            )}
                            onClick={() => set("paese", c)}
                          >
                            {c}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {field.type === "choice" && (
                  <ul className={styles.choices}>
                    {contatti.types.map((t, i) => (
                      <li key={t}>
                        <button
                          type="button"
                          className={clsx(styles.choice, answers.tipologia === t && styles.choiceOn)}
                          onClick={() => choose(t)}
                          aria-pressed={answers.tipologia === t}
                        >
                          <span className={styles.key}>{LETTERS[i]}</span>
                          {t}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {field.type === "consent" && (
                  <label className={clsx(styles.consent, answers.consenso && styles.consentOn)}>
                    <input
                      type="checkbox"
                      checked={answers.consenso}
                      onChange={(e) => set("consenso", e.target.checked)}
                    />
                    <span className={styles.box} aria-hidden="true" />
                    <span>{contatti.consent}</span>
                  </label>
                )}
              </div>

              {error && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}
              {status === "error" && (
                <p className={styles.error} role="alert">
                  Invio non riuscito. Controlla la connessione e riprova.
                </p>
              )}

              <div data-anim className={styles.actions}>
                {step === n - 1 ? (
                  <Button
                    label={status === "sending" ? "Invio in corso…" : contatti.submit}
                    onClick={next}
                    size="l"
                    icon="right"
                  />
                ) : (
                  field.type !== "choice" && <Button label="OK" onClick={next} icon="none" />
                )}
                {field.type !== "choice" && (
                  <span className={styles.hintKey}>
                    premi <b>Invio ↵</b>
                  </span>
                )}
              </div>
            </div>
          )}

          {step === n && (
            <div className={styles.welcome}>
              <p data-anim className="type-eyebrow">
                Richiesta inviata
              </p>
              <h1 data-anim className="font-display type-display-m">
                {contatti.done.title}
              </h1>
              <p data-anim className={clsx("type-paragraph-l", styles.muted)}>
                {contatti.done.text.replace("{nome}", firstName)}
              </p>
              <div data-anim className={styles.actions}>
                <Button label={contatti.done.back} href="/" icon="right" />
                <Button label={contatti.done.more} href="/chi-siamo" variant="secondary" icon="right" />
              </div>
            </div>
          )}
        </div>

        {/* Live recap (desktop) */}
        <aside className={styles.recap} aria-label="La tua richiesta">
          <div className={styles.recapCard}>
            <span className={clsx("font-display", styles.recapStep)}>
              {step < 0 ? "Ciao" : step >= n ? "Grazie" : `${step + 1}/${n}`}
            </span>
            <p className="type-eyebrow">La tua richiesta</p>
            <dl className={styles.recapList}>
              {FIELDS.filter((f) => f.type !== "consent").map((f, i) => {
                const v = String(answers[f.key] || "");
                return (
                  <div key={f.key} className={clsx(v && styles.filled, i === step && styles.current)}>
                    <dt>{f.label}</dt>
                    <dd>{v ? (v.length > 60 ? v.slice(0, 60) + "…" : v) : "—"}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </aside>
      </div>

      {field && (
        <div className={styles.nav}>
          <button type="button" onClick={prev} disabled={step === 0} aria-label="Domanda precedente">
            <ChevronIcon className={styles.up} />
          </button>
          <button type="button" onClick={next} aria-label="Domanda successiva">
            <ChevronIcon />
          </button>
        </div>
      )}

      <p className={styles.back}>
        <Link href="/">← Torna al sito</Link>
      </p>
    </div>
  );
}
