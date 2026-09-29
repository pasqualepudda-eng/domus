"use client";

import { openCookiePreferences } from "@/lib/consent";

export default function CookiePreferencesButton({
  className,
  label = "Preferenze cookie",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <button type="button" className={className} onClick={openCookiePreferences}>
      {label}
    </button>
  );
}
