import type { Metadata } from "next";
import CookieStatus from "@/components/CookieConsent/CookieStatus";
import Footer from "@/components/Footer/Footer";
import LegalPage from "@/components/LegalPage/LegalPage";
import { pageMeta } from "@/lib/content";
import { cookiePolicy } from "@/lib/legal";

export const metadata: Metadata = pageMeta({
  title: "Cookie policy | ARKADOMUS GEIE",
  description: "Quali cookie utilizza il sito di ARKADOMUS GEIE e come gestire le tue preferenze.",
});

export default function CookiePolicyPage() {
  return (
    <>
      <main>
        <LegalPage doc={cookiePolicy} extras={{ preferenze: <CookieStatus /> }} />
      </main>
      <Footer />
    </>
  );
}
