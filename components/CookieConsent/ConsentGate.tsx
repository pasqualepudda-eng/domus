"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CHANGE_EVENT, getConsent, type Consent, type ConsentCategory } from "@/lib/consent";

/**
 * Renders children only after the user consented to `category`.
 * Wrap any future analytics / marketing script with it, e.g.
 *   <ConsentGate category="statistiche"><Script src="…" /></ConsentGate>
 */
export default function ConsentGate({ category, children }: { category: ConsentCategory; children: ReactNode }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(Boolean(getConsent()?.[category]));
    const onChange = (e: Event) => setAllowed(Boolean((e as CustomEvent<Consent>).detail[category]));
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CHANGE_EVENT, onChange);
  }, [category]);

  return allowed ? <>{children}</> : null;
}
