/**
 * Public URL of the site, used for the sitemap, robots.txt and Open Graph.
 * Set NEXT_PUBLIC_SITE_URL at build time, or change the fallback below
 * to the production domain.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://arka-domus.vercel.app").replace(/\/$/, "");

export type SitePage = {
  path: string;
  title: string;
  description: string;
  priority: number;
  sections?: { label: string; hash: string }[];
};

/** Single source for the XML sitemap and the "Mappa del sito" page. */
export const sitePages: SitePage[] = [
  {
    path: "/",
    title: "Home",
    description: "La casa europea per società, professionisti, investitori ed enti.",
    priority: 1,
    sections: [
      { label: "Perché insieme", hash: "perche" },
      { label: "I quattro pilastri", hash: "pilastri" },
      { label: "In numeri", hash: "numeri" },
      { label: "Servizi e vantaggi", hash: "servizi" },
      { label: "Il GEIE in breve", hash: "geie" },
    ],
  },
  {
    path: "/chi-siamo",
    title: "Chi siamo",
    description: "Un’identità nata per proteggere e connettere.",
    priority: 0.8,
    sections: [
      { label: "Il significato di ARKADOMUS", hash: "significato" },
      { label: "La nostra missione", hash: "missione" },
      { label: "La nostra visione", hash: "visione" },
    ],
  },
  {
    path: "/il-geie",
    title: "Il GEIE",
    description: "Che cos’è un Gruppo Europeo di Interesse Economico.",
    priority: 0.8,
    sections: [
      { label: "Come funziona", hash: "cos-e" },
      { label: "Perché un GEIE?", hash: "perche" },
      { label: "27 Stati, 1 sede", hash: "mappa" },
      { label: "Una struttura, molte possibilità", hash: "possibilita" },
      { label: "Governance", hash: "governance" },
      { label: "Il nostro amministratore", hash: "amministratore" },
    ],
  },
  {
    path: "/contatti",
    title: "Contatti",
    description: "Richiedi un primo contatto.",
    priority: 0.7,
  },
  {
    path: "/termini-e-condizioni",
    title: "Termini e condizioni",
    description: "Condizioni d’uso del sito.",
    priority: 0.3,
  },
  {
    path: "/cookie-policy",
    title: "Cookie policy",
    description: "Quali cookie usa il sito e come gestire le preferenze.",
    priority: 0.3,
  },
  {
    path: "/mappa-del-sito",
    title: "Mappa del sito",
    description: "Tutte le pagine e le sezioni del sito.",
    priority: 0.2,
  },
];

/** Canonical URL with trailing slash (the static export uses trailingSlash). */
export const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "/" : `${path}/`}`;
