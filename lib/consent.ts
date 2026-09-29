/**
 * Cookie consent state, persisted in localStorage.
 * - Expires after 6 months (Italian Garante guidance), then the banner returns.
 * - Bump CONSENT_VERSION when the cookie list changes substantially.
 * Other code can read `getConsent()` or listen for the `arka:consent` event.
 */

export type ConsentCategory = "statistiche" | "marketing";
export type Consent = {
  necessari: true;
  statistiche: boolean;
  marketing: boolean;
  timestamp: number;
  version: number;
};

export const CONSENT_KEY = "arka-consent";
export const CONSENT_VERSION = 1;
const MAX_AGE = 1000 * 60 * 60 * 24 * 182; // ~6 months

export const OPEN_EVENT = "arka:cookie-open";
export const CHANGE_EVENT = "arka:consent";

export function getConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    if (c.version !== CONSENT_VERSION || Date.now() - c.timestamp > MAX_AGE) return null;
    return c;
  } catch {
    return null;
  }
}

export function saveConsent(choice: { statistiche: boolean; marketing: boolean }): Consent {
  const consent: Consent = { necessari: true, ...choice, timestamp: Date.now(), version: CONSENT_VERSION };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: consent }));
  return consent;
}

/** Re-open the banner with the detailed preferences (footer link, cookie page). */
export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}
