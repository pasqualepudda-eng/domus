import CallToAction from "@/components/CallToAction/CallToAction";
import Faq from "@/components/Faq/Faq";
import Footer from "@/components/Footer/Footer";
import HeroHome from "@/components/HeroHome/HeroHome";
import HorizontalCards from "@/components/HorizontalCards/HorizontalCards";
import SectionPagination from "@/components/SectionPagination/SectionPagination";
import SkewingTitle from "@/components/SkewingTitle/SkewingTitle";
import Stats from "@/components/Stats/Stats";
import StickyCards from "@/components/StickyCards/StickyCards";
import TextImage5050 from "@/components/TextImage5050/TextImage5050";
import type { Metadata } from "next";
import { pageMeta, seo, skewing, textImages } from "@/lib/content";

export const metadata: Metadata = pageMeta(seo.home);

export default function Home() {
  return (
    <>
      <main className="page">
        <HeroHome />
        <SkewingTitle id="perche" {...skewing} />
        <StickyCards id="pilastri" />
        <Stats id="numeri" />
        <TextImage5050 items={textImages} />
        <HorizontalCards id="servizi" />
        <Faq id="geie" />
        <CallToAction id="contatti" />
      </main>
      <Footer />
      <SectionPagination />
    </>
  );
}
