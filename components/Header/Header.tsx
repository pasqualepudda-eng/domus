"use client";

import clsx from "clsx";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BigMenu from "@/components/BigMenu/BigMenu";
import Button from "@/components/Button/Button";
import Wordmark from "@/components/Wordmark/Wordmark";
import styles from "./Header.module.css";

const MINIMIZE_AT = 80;

function Hamburger({ open, onClick, label }: { open: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      className={clsx(styles.hamburger, open && styles.hamburgerOpen)}
      onClick={onClick}
      aria-label={label}
      aria-expanded={open}
    >
      <span className={styles.hamburgerInner}>
        <span />
        <span />
      </span>
    </button>
  );
}

export default function Header() {
  const [minimized, setMinimized] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lenis = useLenis();
  const pathname = usePathname();

  // Minimize the bar once the page scrolls. Only set state on change:
  // this runs on every scroll frame, and redundant updates would keep
  // interrupting route transitions.
  const minimizedRef = useRef(false);
  useLenis(({ scroll }) => {
    const next = scroll > MINIMIZE_AT;
    if (next === minimizedRef.current) return;
    minimizedRef.current = next;
    setMinimized(next);
  });

  // Any navigation closes the big menu.
  useEffect(() => setMenuOpen(false), [pathname]);

  // Mirror state on <html> so page elements can react.
  useEffect(() => {
    document.documentElement.classList.toggle("header-minimized", minimized);
  }, [minimized]);

  // Freeze page scrolling behind the big menu.
  useEffect(() => {
    if (!lenis) return;
    if (menuOpen) lenis.stop();
    else lenis.start();
  }, [menuOpen, lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleMenu = () => setMenuOpen((v) => !v);

  return (
    <header
      id="header"
      className={clsx(styles.header, (minimized || menuOpen) && styles.minimized, menuOpen && styles.menuOpen)}
    >
      <BigMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className={clsx("container", styles.container)}>
        {/* Full bar (desktop, top of page) */}
        <div className={styles.holder}>
          <div className={styles.bar}>
            <Link href="/" className={styles.logo} aria-label="ARKADOMUS GEIE — home">
              <Wordmark className={styles.wordmark} />
            </Link>
            <div className={styles.actions}>
              <Button label="Parla con noi" href="/contatti" icon="right" />
              <button
                type="button"
                className={styles.menuBtn}
                onClick={toggleMenu}
                aria-expanded={menuOpen}
                aria-label="Apri il menu"
              >
                <span className={styles.menuLabel}>Menu</span>
                <span className={styles.hamburgerInner} aria-hidden="true">
                  <span />
                  <span />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Secondary layer: minimized desktop + mobile bar */}
        <div className={styles.secLayer}>
          <Link href="/" className={clsx(styles.pill, styles.secLogo)} aria-label="ARKADOMUS GEIE — home">
            <Wordmark className={styles.secWordmark} />
          </Link>
          <div className={styles.secRight}>
            <div className={styles.secDownload}>
              <Button label="Contatti" href="/contatti" icon="right" />
            </div>
            <div className={styles.secHamburger}>
              <Hamburger open={menuOpen} label={menuOpen ? "Chiudi il menu" : "Apri il menu"} onClick={toggleMenu} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
