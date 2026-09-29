import clsx from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon, ArrowRightIcon } from "@/components/Icons/Icons";
import styles from "./Button.module.css";

type Props = {
  label?: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "tertiary" | "light";
  size?: "m" | "l";
  icon?: "oblique" | "right" | "none";
  className?: string;
  children?: ReactNode;
  ariaLabel?: string;
};

export default function Button({
  label,
  href,
  onClick,
  variant = "primary",
  size = "m",
  icon = "oblique",
  className,
  ariaLabel,
}: Props) {
  const Icon = icon === "right" ? ArrowRightIcon : ArrowIcon;
  const cls = clsx(
    styles.button,
    styles[variant],
    size === "l" && styles.large,
    !label && styles.noLabel,
    icon === "right" && styles.iconRight,
    className,
  );

  const inner = (
    <>
      {label && (
        <span className={styles.label} data-label={label}>
          <span>{label}</span>
        </span>
      )}
      {icon !== "none" && (
        <span className={styles.iconWrap} aria-hidden="true">
          <Icon className={styles.icon} />
          <Icon className={styles.iconHover} />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick} aria-label={ariaLabel}>
      {inner}
    </button>
  );
}
