import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm/ContactForm";
import { contatti } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contatti | ARKADOMUS GEIE",
  description: contatti.intro.text,
};

export default function ContattiPage() {
  return (
    <main>
      <ContactForm />
    </main>
  );
}
