import type { Metadata } from "next";
import CallToAction from "@/components/CallToAction/CallToAction";
import Footer from "@/components/Footer/Footer";
import Administrator from "@/components/Geie/Administrator";
import AutonomyDiagram from "@/components/Geie/AutonomyDiagram";
import EuMap from "@/components/Geie/EuMap";
import GovernanceFlow from "@/components/Geie/GovernanceFlow";
import PossibilitiesBuilder from "@/components/Geie/PossibilitiesBuilder";
import ScatterStructure from "@/components/Geie/ScatterStructure";
import PageHero from "@/components/PageHero/PageHero";
import PageToc from "@/components/PageToc/PageToc";
import RevealText from "@/components/RevealText/RevealText";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import ValuesGrid from "@/components/ValuesGrid/ValuesGrid";
import { geie } from "@/lib/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Il GEIE | ARKADOMUS GEIE",
  description: geie.hero.text[0],
};

export default function GeiePage() {
  const { hero, toc, perche, possibilita, governance } = geie;
  return (
    <>
      <main className="page">
        <PageHero {...hero} bg="var(--purple-dark)" fg="var(--purple-light)" accent="var(--orange)" />
        <PageToc items={toc} />

        <section id="cos-e">
          <AutonomyDiagram />
        </section>

        <section id="perche" className={styles.section}>
          <div className="container">
            <SectionIntro eyebrow={perche.eyebrow} title={perche.title} align="center" className={styles.intro} />
            <ScatterStructure />
            <RevealText
              as="h3"
              text={perche.capabilitiesTitle}
              className={`type-heading-m ${styles.capTitle}`}
            />
            <ValuesGrid items={perche.capabilities} />
          </div>
        </section>

        <section id="mappa" className={styles.section}>
          <div className="container">
            <EuMap />
          </div>
        </section>

        <section id="possibilita" className={`${styles.section} ${styles.tinted}`}>
          <div className="container">
            <div className={styles.split}>
              <SectionIntro eyebrow={possibilita.eyebrow} title={possibilita.title} />
              <div className={styles.splitText}>
                {possibilita.text.map((t) => (
                  <p key={t} className="type-paragraph-l">
                    {t}
                  </p>
                ))}
                <p className={styles.hint}>Seleziona settori e Paesi per vedere le connessioni.</p>
              </div>
            </div>
            <PossibilitiesBuilder />
          </div>
        </section>

        <section id="governance" className={styles.section}>
          <div className="container">
            <div className={styles.split}>
              <SectionIntro eyebrow={governance.eyebrow} title={governance.title} />
              <p className={`type-paragraph-l ${styles.splitText}`}>{governance.intro}</p>
            </div>
            <GovernanceFlow />
          </div>
        </section>

        <section id="amministratore" className={styles.section}>
          <div className="container">
            <Administrator />
          </div>
        </section>

        <div id="page-end" />
        <CallToAction id="contatti" cta={geie.cta} />
      </main>
      <Footer />
    </>
  );
}
