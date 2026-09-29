"use client";

import { useEffect, useState } from "react";
import { CHANGE_EVENT, getConsent, openCookiePreferences, type Consent } from "@/lib/consent";
import styles from "./CookieStatus.module.css";

/** Shows the current choices and re-opens the preferences (cookie policy page). */
export default function CookieStatus() {
  const [consent, setConsent] = useState<Consent | null>(null);

  useEffect(() => {
    setConsent(getConsent());
    const onChange = (e: Event) => setConsent((e as CustomEvent<Consent>).detail);
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CHANGE_EVENT, onChange);
  }, []);

  const rows = [
    { label: "Necessari", on: true },
    { label: "Statistici", on: Boolean(consent?.statistiche) },
    { label: "Marketing", on: Boolean(consent?.marketing) },
  ];

  return (
    <div className={styles.status}>
      <p className={styles.title}>
        {consent
          ? `Le tue scelte attuali (salvate il ${new Date(consent.timestamp).toLocaleDateString("it-IT")})`
          : "Non hai ancora espresso una scelta."}
      </p>
      <ul>
        {rows.map((r) => (
          <li key={r.label} className={r.on ? styles.on : undefined}>
            <i aria-hidden="true" />
            {r.label}: <b>{r.on ? "attivi" : "disattivati"}</b>
          </li>
        ))}
      </ul>
      <button type="button" className={styles.button} onClick={openCookiePreferences}>
        Preferenze cookie
      </button>
    </div>
  );
}
