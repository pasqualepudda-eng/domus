import type { Metadata } from "next";
import Footer from "@/components/Footer/Footer";
import SiteMapGrid from "@/components/SiteMapGrid/SiteMapGrid";
import { pageMeta } from "@/lib/content";

export const metadata: Metadata = pageMeta({
  title: "Mappa del sito | ARKADOMUS GEIE",
  description: "Tutte le pagine e le sezioni del sito di ARKADOMUS GEIE.",
});

export default function MappaPage() {
  return (
    <>
      <main>
        <SiteMapGrid />
      </main>
      <Footer />
    </>
  );
}
