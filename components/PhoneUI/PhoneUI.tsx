import clsx from "clsx";
import { phone } from "@/lib/content";
import styles from "./PhoneUI.module.css";

function StatusBar() {
  return (
    <div className={styles.status}>
      <span>9:41</span>
      <span className={styles.island} />
      <span className={styles.statusIcons}>
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}

function TabBar({ active }: { active: number }) {
  return (
    <div className={styles.tabs}>
      {["Rete", "GEIE", "Servizi", "Contatti"].map((t, i) => (
        <span key={t} className={clsx(styles.tab, i === active && styles.tabActive)}>
          <i />
          {t}
        </span>
      ))}
    </div>
  );
}

const DOT_COLORS = ["var(--orange)", "var(--blue)", "var(--purple)", "var(--azure)", "var(--gray-mid)"];

export default function PhoneUI({ screen = "home" }: { screen?: "home" | "activity" }) {
  const { home, detail } = phone;
  return (
    <div className={styles.phone}>
      <StatusBar />
      {screen === "home" ? (
        <div className={styles.body}>
          <div className={styles.header}>
            <span className={styles.avatar}>A</span>
            <span className={styles.pillSmall}>GEIE</span>
          </div>
          <div className={styles.balance}>
            <span className={styles.label}>{home.label}</span>
            <span className={styles.amount}>{home.amount}</span>
            <span className={clsx(styles.change, styles.up)}>{home.note}</span>
          </div>
          <div className={styles.actions}>
            {home.stats.map((a) => (
              <span key={a.label} className={styles.action}>
                <i>{a.value}</i>
                {a.label}
              </span>
            ))}
          </div>
          <div className={styles.listTitle}>{home.listTitle}</div>
          <ul className={styles.list}>
            {home.list.map((a, i) => (
              <li key={a.name}>
                <span className={styles.icon} style={{ background: DOT_COLORS[i % DOT_COLORS.length] }} />
                <span className={styles.meta}>
                  <b>{a.name}</b>
                  <small>{a.sub}</small>
                </span>
                <span className={styles.value}>
                  <small className={i === 0 ? styles.up : undefined}>{a.tag}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className={styles.body}>
          <div className={styles.balance}>
            <span className={styles.label}>{detail.label}</span>
            <span className={styles.amount}>{detail.amount}</span>
          </div>
          <svg className={styles.chart} viewBox="0 0 300 110" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="phone-chart" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#3fc3ff" stopOpacity="0.45" />
                <stop offset="1" stopColor="#3fc3ff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 90 C40 85 60 70 90 66 S150 50 180 38 S250 20 300 10 V110 H0 Z" fill="url(#phone-chart)" />
            <path d="M0 90 C40 85 60 70 90 66 S150 50 180 38 S250 20 300 10" fill="none" stroke="#3fc3ff" strokeWidth="3" />
          </svg>
          <div className={styles.listTitle}>{detail.listTitle}</div>
          <ul className={styles.list}>
            {detail.list.map((item, i) => (
              <li key={item}>
                <span className={styles.icon} style={{ background: DOT_COLORS[i % DOT_COLORS.length] }} />
                <span className={styles.meta}>
                  <b className={styles.wrap}>{item}</b>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <TabBar active={screen === "home" ? 0 : 1} />
    </div>
  );
}
