import type { Metadata } from "next";
import Footer from "@/components/Footer/Footer";
import LegalPage from "@/components/LegalPage/LegalPage";
import { pageMeta } from "@/lib/content";
import { termini } from "@/lib/legal";

export const metadata: Metadata = pageMeta({
  title: "Termini e condizioni | ARKADOMUS GEIE",
  description: "Termini e condizioni d’uso del sito di ARKADOMUS GEIE.",
});

export default function TerminiPage() {
  return (
    <>
      <main>
        <LegalPage doc={termini} />
      </main>
      <Footer />
    </>
  );
}
