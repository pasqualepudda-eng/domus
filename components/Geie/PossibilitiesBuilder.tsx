"use client";

import clsx from "clsx";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { geie } from "@/lib/content";
import styles from "./PossibilitiesBuilder.module.css";

type Link = { id: string; d: string; side: "s" | "c" };

/**
 * Pick sectors and countries: each selection is wired to the GEIE hub with
 * an animated curve, and the hub counts the resulting combinations.
 */
export default function PossibilitiesBuilder() {
  const { sectorsLabel, sectors, countriesLabel, countries } = geie.possibilita;
  const root = useRef<HTMLDivElement>(null);
  const hub = useRef<HTMLDivElement>(null);
  const [selS, setSelS] = useState<string[]>([sectors[0]]);
  const [selC, setSelC] = useState<string[]>([countries[0], countries[1]]);
  const [links, setLinks] = useState<Link[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const measure = useCallback(() => {
    const box = root.current?.getBoundingClientRect();
    const h = hub.current?.getBoundingClientRect();
    if (!box || !h) return;
    const vertical = window.innerWidth < 1025;
    const hx = h.left + h.width / 2 - box.left;
    const hy = h.top + h.height / 2 - box.top;
    const next: Link[] = [];
    root.current!.querySelectorAll<HTMLButtonElement>("[data-chip][aria-pressed='true']").forEach((chip) => {
      const r = chip.getBoundingClientRect();
      const side = chip.dataset.side as "s" | "c";
      let x: number;
      let y: number;
      let d: string;
      if (vertical) {
        x = r.left + r.width / 2 - box.left;
        y = side === "s" ? r.bottom - box.top : r.top - box.top;
        const my = (y + hy) / 2;
        d = `M${x} ${y} C${x} ${my} ${hx} ${my} ${hx} ${hy}`;
      } else {
        x = side === "s" ? r.right - box.left : r.left - box.left;
        y = r.top + r.height / 2 - box.top;
        const mx = (x + hx) / 2;
        d = `M${x} ${y} C${mx} ${y} ${mx} ${hy} ${hx} ${hy}`;
      }
      next.push({ id: `${side}-${chip.dataset.chip}`, d, side });
    });
    setLinks(next);
    setSize({ w: box.width, h: box.height });
  }, []);

  useLayoutEffect(measure, [selS, selC, measure]);

  useEffect(() => {
    const ro = new ResizeObserver(measure);
    if (root.current) ro.observe(root.current);
    return () => ro.disconnect();
  }, [measure]);

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const combos = selS.length * selC.length;

  return (
    <div ref={root} className={styles.builder}>
      <svg className={styles.wires} width={size.w} height={size.h} aria-hidden="true">
        {links.map((l) => (
          <path key={l.id} d={l.d} pathLength={1} className={clsx(styles.wire, l.side === "c" && styles.wireC)} />
        ))}
      </svg>

      <fieldset className={styles.group}>
        <legend className="type-eyebrow">{sectorsLabel}</legend>
        {sectors.map((s) => (
          <button
            key={s}
            type="button"
            data-chip={s}
            data-side="s"
            aria-pressed={selS.includes(s)}
            className={styles.chip}
            onClick={() => toggle(selS, setSelS, s)}
          >
            {s}
          </button>
        ))}
      </fieldset>

      <div ref={hub} className={clsx(styles.hub, combos > 0 && styles.hubOn)}>
        <b>ARKADOMUS GEIE</b>
        <span key={combos} className={styles.combos}>
          {combos}
        </span>
        <small>{combos === 1 ? "combinazione" : "combinazioni"}</small>
        <small className={styles.hubMeta}>
          {selS.length} {selS.length === 1 ? "settore" : "settori"} · {selC.length}{" "}
          {selC.length === 1 ? "Paese" : "Paesi"}
        </small>
      </div>

      <fieldset className={clsx(styles.group, styles.groupRight)}>
        <legend className="type-eyebrow">{countriesLabel}</legend>
        {countries.map((c) => (
          <button
            key={c}
            type="button"
            data-chip={c}
            data-side="c"
            aria-pressed={selC.includes(c)}
            className={clsx(styles.chip, styles.chipC)}
            onClick={() => toggle(selC, setSelC, c)}
          >
            {c}
          </button>
        ))}
      </fieldset>
    </div>
  );
}
