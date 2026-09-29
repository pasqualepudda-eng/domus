import type { Metadata } from "next";
import CallToAction from "@/components/CallToAction/CallToAction";
import NameMerge from "@/components/ChiSiamo/NameMerge";
import VisionReveal from "@/components/ChiSiamo/VisionReveal";
import Footer from "@/components/Footer/Footer";
import PageHero from "@/components/PageHero/PageHero";
import PageToc from "@/components/PageToc/PageToc";
import RevealText from "@/components/RevealText/RevealText";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import ValuesGrid from "@/components/ValuesGrid/ValuesGrid";
import { chiSiamo, pageMeta, seo } from "@/lib/content";
import styles from "./page.module.css";

export const metadata: Metadata = pageMeta(seo.chiSiamo);

export default function ChiSiamoPage() {
  const { hero, toc, significato, missione } = chiSiamo;
  return (
    <>
      <main className="page">
        <PageHero {...hero} />
        <PageToc items={toc} />

        <section id="significato" className={styles.significato}>
          <div className="container">
            <SectionIntro eyebrow={significato.eyebrow} title={significato.title} text={significato.intro} />
          </div>
          <NameMerge />
        </section>

        <section id="missione" className={styles.missione}>
          <div className={`container ${styles.missioneGrid}`}>
            <p className="type-eyebrow">{missione.eyebrow}</p>
            <RevealText as="h2" text={missione.title} className={`font-display type-display-l ${styles.bigTitle}`} />
            <div className={styles.missioneText}>
              {missione.text.map((t) => (
                <p key={t} className="type-paragraph-l">
                  {t}
                </p>
              ))}
            </div>
            <h3 className={`type-heading-m ${styles.listTitle}`}>{missione.listTitle}</h3>
            <ValuesGrid items={missione.list} />
          </div>
        </section>

        <section id="visione">
          <VisionReveal />
        </section>

        <div id="page-end" />
        <CallToAction id="contatti" cta={chiSiamo.cta} />
      </main>
      <Footer />
    </>
  );
}
