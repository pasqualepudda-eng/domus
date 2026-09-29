/**
 * Site copy — texts taken from the ARKADOMUS GEIE website.
 */

export const hero = {
  title: "La tua impresa,<br>più forte <i>oltre</i><br>i confini.",
  secondary: "Proteggere il valore. Creare connessioni. Aprire possibilità.",
  cta: { label: "Scopri ARKADOMUS", href: "/chi-siamo" },
  ctaSecondary: { label: "Richiedi un contatto", href: "/contatti" },
};

export const phone = {
  home: {
    label: "La rete ARKADOMUS",
    amount: "27 Stati membri",
    note: "Sede in Bulgaria · tutta l’UE",
    stats: [
      { value: "27", label: "Stati" },
      { value: "100+", label: "GEIE" },
      { value: "25+", label: "Anni" },
      { value: "1", label: "Sede" },
    ],
    listTitle: "Capitali",
    list: [
      { name: "Sofia", sub: "Bulgaria", tag: "Sede" },
      { name: "Roma", sub: "Italia", tag: "UE" },
      { name: "Berlino", sub: "Germania", tag: "UE" },
      { name: "Parigi", sub: "Francia", tag: "UE" },
      { name: "Madrid", sub: "Spagna", tag: "UE" },
    ],
  },
  detail: {
    label: "Il GEIE",
    amount: "Cosa puoi fare",
    listTitle: "Con ARKADOMUS",
    list: [
      "Sviluppare progetti comuni",
      "Creare relazioni transnazionali",
      "Condividere competenze e risorse",
      "Coordinare attività e iniziative",
      "Rafforzare la propria presenza europea",
      "Valutare nuove opportunità di sviluppo",
    ],
  },
};

export type Bento = {
  id: string;
  title: string;
  hover: string;
  bg: string;
  fg: string;
  shape: "circles" | "stack" | "shield" | "bubble";
};

export const bentos: Bento[] = [
  {
    id: "sede",
    title: "Sede in Bulgaria, nel cuore dell’Unione Europea",
    hover: "ARKADOMUS GEIE nasce in Bulgaria per consentire di collaborare all’interno dell’Unione Europea.",
    bg: "var(--white)",
    fg: "var(--green-dark)",
    shape: "shield",
  },
  {
    id: "per-chi",
    title: "Per società, professionisti, investitori ed enti",
    hover: "Ogni membro resta autonomo, ma lavora dentro una struttura europea comune.",
    bg: "var(--orange)",
    fg: "var(--orange-dark)",
    shape: "stack",
  },
  {
    id: "ambito",
    title: "Tutti gli Stati membri dell’UE",
    hover: "Superare barriere territoriali, culturali e operative con una rete organizzata.",
    bg: "var(--purple-light)",
    fg: "var(--purple-dark)",
    shape: "circles",
  },
  {
    id: "insieme",
    title: "Insieme, le sfide diventano opportunità",
    hover: "Una rete per fare impresa con maggiore forza, consapevolezza e prospettiva.",
    bg: "var(--green)",
    fg: "var(--green-dark)",
    shape: "bubble",
  },
];

export const skewing = {
  title: "Perché insieme",
  text: "Oggi nessuna impresa cresce davvero restando isolata. I mercati cambiano, i confini economici diventano sempre più fluidi e le opportunità richiedono competenze, relazioni e una visione internazionale.",
  cta: { label: "Scopri ARKADOMUS", href: "/chi-siamo" },
};

export const pillars = {
  eyebrow: "I quattro pilastri",
  title: "Su cosa si fonda ARKADOMUS.",
  text: "ARKADOMUS GEIE nasce in Bulgaria per consentire a società, professionisti, investitori ed enti di collaborare all’interno dell’Unione Europea, superando barriere territoriali, culturali e operative.",
};

export const stickyCards = [
  {
    eyebrow: "01 — Struttura",
    title: "Una struttura, non un accordo",
    text: "Il GEIE dà forma alla collaborazione: ogni membro resta autonomo, ma lavora dentro una struttura europea comune.",
    bg: "var(--green-dark)",
    fg: "var(--green-light)",
  },
  {
    eyebrow: "02 — Cooperazione",
    title: "Cooperazione transfrontaliera",
    text: "Creiamo un ambiente nel quale realtà provenienti da diversi Stati membri dell’UE possono unire competenze, risorse e relazioni per sviluppare obiettivi comuni.",
    bg: "var(--orange)",
    fg: "var(--orange-dark)",
  },
  {
    eyebrow: "03 — Protezione",
    title: "Protezione degli asset",
    text: "Supportiamo i membri nella valutazione e nell’implementazione di strumenti comuni destinati a proteggere gli asset e a ridurre i rischi connessi alla gestione delle attività.",
    bg: "var(--purple)",
    fg: "var(--purple-dark)",
  },
  {
    eyebrow: "04 — Efficienza",
    title: "Efficienza operativa e fiscale",
    text: "La struttura del GEIE può contribuire a rendere più efficienti le operazioni e la gestione di patrimoni e investimenti, inclusi quelli immobiliari, sempre nel rispetto della normativa applicabile.",
    bg: "var(--blue)",
    fg: "var(--ink)",
  },
  {
    eyebrow: "05 — Visibilità",
    title: "Visibilità e influenza",
    text: "La partecipazione ad ARKADOMUS rafforza il posizionamento dei membri e può contribuire a dare maggiore visibilità alle loro attività in contesti europei e internazionali.",
    bg: "var(--green)",
    fg: "var(--green-dark)",
  },
];

export const stats = {
  eyebrow: "In numeri",
  title: "L’esperienza dietro ARKADOMUS.",
  items: [
    { value: 27, suffix: "", label: "Stati membri dell’Unione Europea in cui il GEIE può operare" },
    { value: 100, suffix: "+", label: "GEIE fondati e gestiti dal nostro amministratore" },
    { value: 25, suffix: "+", label: "Anni di attività di ATPC, la rete internazionale che guida" },
  ],
};

export type TextImageItem = {
  id?: string;
  eyebrow: string;
  title: string;
  text: string[];
  cta: { label: string; href: string };
  color: string;
  accent: string;
  mock: { title: string; rows: { label: string; sub: string }[]; chips?: string[] };
};

export const textImages: TextImageItem[] = [
  {
    id: "chi-siamo",
    eyebrow: "Chi siamo",
    title: "Una casa per attraversare le tempeste.",
    text: [
      "Il nome ARKADOMUS nasce dall’unione di due concetti fondamentali.",
      "ARKADOMUS unisce questi due significati in una visione precisa: offrire ai propri membri un ambiente organizzato nel quale affrontare le complessità della vita e del mondo degli affari con il supporto della collaborazione europea.",
    ],
    cta: { label: "Scopri chi siamo", href: "/chi-siamo" },
    color: "var(--pink-light)",
    accent: "var(--orange)",
    mock: {
      title: "ARKA + DOMUS",
      rows: [
        { label: "Arka", sub: "Rifugio, protezione e salvaguardia" },
        { label: "Domus", sub: "Stabilità, appartenenza, continuità" },
      ],
    },
  },
  {
    eyebrow: "Responsabilità",
    title: "Appartenere a una rete europea è una scelta di responsabilità.",
    text: [
      "ARKADOMUS GEIE promuove un modello fondato sulla cooperazione, sulla trasparenza e sulla responsabilità condivisa.",
      "Partecipare a un progetto europeo significa valorizzare relazioni corrette, sostenere lo sviluppo comune e contribuire a una cultura imprenditoriale più consapevole, inclusiva e orientata alla sostenibilità.",
    ],
    cta: { label: "Scopri la governance", href: "/il-geie#governance" },
    color: "var(--blue-light)",
    accent: "var(--blue)",
    mock: {
      title: "La nostra missione si fonda su",
      rows: [],
      chips: [
        "Collaborazione internazionale",
        "Tutela degli interessi dei membri",
        "Condivisione di competenze e risorse",
        "Trasparenza nelle relazioni",
        "Responsabilità sociale e corporativa",
        "Sviluppo di opportunità sostenibili",
      ],
    },
  },
];

export const services = {
  eyebrow: "Servizi e vantaggi",
  title: "Cosa significa far parte di ARKADOMUS",
  items: [
    { tag: "Cooperazione cross-border", title: "Le distanze non devono più essere un limite.", color: "var(--blue-light)", accent: "var(--blue)", art: "crossborder" as const },
    { tag: "Protezione degli asset", title: "Proteggere il valore costruito è parte della strategia.", color: "var(--orange-light)", accent: "var(--orange)", art: "protezione" as const },
    { tag: "Efficienza fiscale e gestionale", title: "Operare meglio significa anche organizzare meglio.", color: "var(--green-light)", accent: "var(--green)", art: "efficienza" as const },
    { tag: "Visibilità europea", title: "La tua attività merita di essere vista.", color: "var(--purple-light)", accent: "var(--purple)", art: "visibilita" as const },
    { tag: "Influenza positiva", title: "La reputazione si costruisce attraverso le relazioni.", color: "var(--pink-light)", accent: "var(--orange)", art: "influenza" as const },
    { tag: "Responsabilità corporativa e sociale", title: "Appartenere significa contribuire.", color: "var(--gray-light)", accent: "var(--green)", art: "responsabilita" as const },
  ],
};

export const faq = {
  eyebrow: "Il GEIE",
  title: "Che cos’è un Gruppo Europeo di Interesse Economico?",
  items: [
    {
      q: "Che cos’è un GEIE?",
      a: "Il Gruppo Europeo di Interesse Economico, conosciuto come GEIE, è uno strumento europeo pensato per facilitare la cooperazione tra imprese, professionisti e altri soggetti di Paesi diversi. Consente ai partecipanti di coordinare attività, condividere risorse e perseguire obiettivi comuni, preservando l’autonomia giuridica ed economica dei singoli membri.",
    },
    {
      q: "Perché un GEIE?",
      a: "Per collaborare in modo strutturato. Un conto è avere contatti internazionali. Un altro è costruire una struttura comune attraverso la quale organizzare e sviluppare la collaborazione.",
    },
    {
      q: "Una struttura, molte possibilità",
      a: "ARKADOMUS GEIE può essere utilizzato come piattaforma organizzativa per favorire la cooperazione tra realtà appartenenti a settori e Paesi diversi. La partecipazione deve essere valutata sulla base degli obiettivi concreti del membro, della struttura dell’attività e della normativa applicabile.",
    },
    {
      q: "Assemblea dei membri",
      a: "L’Assemblea dei Membri rappresenta il principale organo decisionale del GEIE. Attraverso l’Assemblea, i partecipanti possono contribuire alla definizione delle linee strategiche, alle decisioni sulle attività comuni e agli aspetti organizzativi del Gruppo, secondo le competenze previste.",
    },
    {
      q: "Amministratori",
      a: "Gli Amministratori curano la gestione e la rappresentanza del GEIE nei limiti dei poteri conferiti dalla legge, dagli atti costitutivi e dalle deliberazioni degli organi competenti. Sono responsabili del coordinamento delle attività, dei rapporti con interlocutori e partner e dell’attuazione delle decisioni adottate.",
    },
    {
      q: "Il nostro amministratore: Moreno Zucchetti",
      a: "Imprenditore italiano con esperienza internazionale, Moreno Zucchetti opera stabilmente a Malta dal 2004. Ha contribuito alla fondazione e alla gestione di oltre 100 Gruppi Europei di Interesse Economico ed è alla guida di ATPC Ltd, una rete internazionale attiva da oltre venticinque anni nella consulenza personalizzata in ambito legale, finanziario e marketing aziendale.",
    },
  ],
};

export const cta = {
  title: "Il futuro non si costruisce <i>da soli</i>.",
  text: "Entra in una rete europea pensata per collegare persone, imprese e opportunità. Scopri se ARKADOMUS GEIE è il progetto giusto per te.",
  primary: { label: "Parla con ARKADOMUS", href: "/contatti" },
  secondary: { label: "Scopri il GEIE", href: "/il-geie" },
};

export const footer = {
  tagline: "Proteggere il valore. Creare connessioni. Aprire possibilità.",
  description:
    "Gruppo Europeo di Interesse Economico con sede in Bulgaria, aperto a società, professionisti, investitori ed enti degli Stati membri dell’Unione Europea.",
  columns: [
    { title: "Chi siamo", links: [{ label: "Il significato", href: "/chi-siamo#significato" }, { label: "La missione", href: "/chi-siamo#missione" }, { label: "La visione", href: "/chi-siamo#visione" }] },
    { title: "Il GEIE", links: [{ label: "Che cos’è un GEIE", href: "/il-geie#cos-e" }, { label: "Perché un GEIE", href: "/il-geie#perche" }, { label: "27 Stati, 1 sede", href: "/il-geie#mappa" }, { label: "Governance", href: "/il-geie#governance" }] },
    { title: "Servizi e vantaggi", links: [{ label: "Cooperazione cross-border", href: "/#servizi" }, { label: "Protezione degli asset", href: "/#servizi" }, { label: "Efficienza fiscale", href: "/#servizi" }, { label: "Visibilità europea", href: "/#servizi" }] },
    { title: "Contatti", links: [{ label: "Richiedi un primo contatto", href: "/contatti" }, { label: "Home", href: "/" }] },
  ],
  copyright: "ARKADOMUS GEIE. Tutti i diritti riservati.",
  wordmark: "ARKADOMUS",
};

export const sections = [
  { id: "hero", label: "Home" },
  { id: "perche", label: "Perché insieme" },
  { id: "pilastri", label: "Pilastri" },
  { id: "numeri", label: "In numeri" },
  { id: "chi-siamo", label: "Chi siamo" },
  { id: "servizi", label: "Servizi" },
  { id: "geie", label: "Il GEIE" },
  { id: "contatti", label: "Contatti" },
];

/* ------------------------------------------------------------------
   Chi siamo
------------------------------------------------------------------- */
export const chiSiamo = {
  hero: {
    eyebrow: "Chi siamo",
    title: "Un’identità nata per <i>proteggere</i> e connettere",
    text: [
      "Il Gruppo Europeo di Interesse Economico ARKADOMUS GEIE è un’organizzazione intergovernativa che consente ad aziende e professionisti provenienti da diversi Stati membri dell’Unione Europea di collaborare e unire le forze per perseguire obiettivi comuni.",
      "Il GEIE ha sede in Bulgaria e si rivolge a società, professionisti, investitori ed enti interessati a sviluppare relazioni e attività in una dimensione europea.",
    ],
  },
  toc: [
    { id: "significato", label: "Il significato di ARKADOMUS" },
    { id: "missione", label: "La nostra missione" },
    { id: "visione", label: "La nostra visione" },
  ],
  significato: {
    eyebrow: "Il significato di ARKADOMUS",
    title: "Una casa per attraversare le tempeste.",
    intro: "Il nome ARKADOMUS nasce dall’unione di due concetti fondamentali.",
    arka: {
      word: "Arka",
      claim: "Simbolo di rifugio, protezione e salvaguardia durante le avversità.",
      text: "L’arka rappresenta ciò che mette al sicuro le persone e ciò che conta di più quando le condizioni esterne diventano difficili.",
    },
    domus: {
      word: "Domus",
      claim: "La casa, intesa come stabilità, appartenenza, continuità e protezione del valore.",
      text: "La domus rappresenta invece il luogo nel quale costruire, custodire e tramandare.",
    },
    outro:
      "ARKADOMUS unisce questi due significati in una visione precisa: offrire ai propri membri un ambiente organizzato nel quale affrontare le complessità della vita e del mondo degli affari con il supporto della collaborazione europea.",
  },
  missione: {
    eyebrow: "La nostra missione",
    title: "Proteggere il valore. Creare connessioni. Aprire possibilità.",
    text: [
      "ARKADOMUS GEIE mira a proteggere e aiutare i propri membri ad affrontare le avversità e le difficoltà che la vita e il mondo degli affari possono comportare.",
      "Lo fa promuovendo la cooperazione tra realtà diverse, creando sinergie e favorendo la nascita di obiettivi comuni.",
    ],
    listTitle: "La nostra missione si fonda su:",
    list: [
      "Collaborazione internazionale",
      "Tutela degli interessi dei membri",
      "Condivisione di competenze e risorse",
      "Trasparenza nelle relazioni",
      "Responsabilità sociale e corporativa",
      "Sviluppo di opportunità sostenibili",
    ],
  },
  visione: {
    eyebrow: "La nostra visione",
    title: "Un’Europa in cui collaborare sia un vantaggio concreto.",
    text: [
      "Immaginiamo un ecosistema nel quale imprese, professionisti, investitori ed enti possano collaborare con maggiore semplicità, superando le distanze e trasformando le differenze in valore.",
      "ARKADOMUS GEIE vuole essere un punto di riferimento per chi cerca una struttura europea, una rete qualificata e una nuova prospettiva per il proprio futuro professionale e imprenditoriale.",
    ],
  },
  cta: {
    title: "Il futuro non si costruisce <i>da soli</i>.",
    text: "Entra in una rete europea pensata per collegare persone, imprese e opportunità.",
    primary: { label: "Parla con noi", href: "/contatti" },
    secondary: { label: "Scopri il GEIE", href: "/il-geie" },
  },
};

/* ------------------------------------------------------------------
   Il GEIE
------------------------------------------------------------------- */
export const geie = {
  hero: {
    eyebrow: "Il GEIE",
    title: "Che cos’è un Gruppo Europeo di <i>Interesse Economico</i>?",
    text: [
      "Il Gruppo Europeo di Interesse Economico, conosciuto come GEIE, è uno strumento europeo pensato per facilitare la cooperazione tra imprese, professionisti e altri soggetti di Paesi diversi.",
      "Consente ai partecipanti di coordinare attività, condividere risorse e perseguire obiettivi comuni, preservando l’autonomia giuridica ed economica dei singoli membri.",
    ],
  },
  toc: [
    { id: "cos-e", label: "Come funziona" },
    { id: "perche", label: "Perché un GEIE?" },
    { id: "mappa", label: "27 Stati, 1 sede" },
    { id: "possibilita", label: "Una struttura, molte possibilità" },
    { id: "governance", label: "Governance" },
    { id: "amministratore", label: "Il nostro amministratore" },
  ],
  autonomy: {
    eyebrow: "Come funziona",
    title: "Autonomi, ma dentro una struttura comune.",
    members: ["Società", "Professionista", "Investitore", "Ente"],
    steps: [
      { title: "Ogni membro resta autonomo", text: "Il GEIE preserva l’autonomia giuridica ed economica dei singoli membri." },
      { title: "Una struttura europea comune", text: "Il GEIE dà forma alla collaborazione: ogni membro lavora dentro una struttura europea comune." },
      { title: "Coordinare e condividere", text: "I partecipanti coordinano attività e condividono risorse, competenze e relazioni." },
      { title: "Obiettivi comuni", text: "Insieme perseguono obiettivi comuni, superando barriere territoriali, culturali e operative." },
    ],
  },
  perche: {
    eyebrow: "Perché un GEIE?",
    title: "Per collaborare in modo strutturato.",
    scattered: { label: "Contatti sparsi", text: "Un conto è avere contatti internazionali." },
    structured: {
      label: "Con il GEIE",
      text: "Un altro è costruire una struttura comune attraverso la quale organizzare e sviluppare la collaborazione.",
    },
    capabilitiesTitle: "ARKADOMUS GEIE offre un contesto nel quale i membri possono:",
    capabilities: [
      "Sviluppare progetti comuni",
      "Creare relazioni transnazionali",
      "Condividere competenze e risorse",
      "Coordinare attività e iniziative",
      "Rafforzare la propria presenza europea",
      "Valutare nuove opportunità di sviluppo",
    ],
  },
  mappa: {
    title: "Sede in Bulgaria, nel cuore dell’Unione Europea.",
    text: "Il GEIE può operare in tutti gli Stati membri dell’UE. Passa sopra una capitale per scoprirla.",
    hub: "Sofia",
  },
  possibilita: {
    eyebrow: "Una struttura, molte possibilità",
    title: "Una piattaforma per settori e Paesi diversi.",
    text: [
      "ARKADOMUS GEIE può essere utilizzato come piattaforma organizzativa per favorire la cooperazione tra realtà appartenenti a settori e Paesi diversi.",
      "La partecipazione deve essere valutata sulla base degli obiettivi concreti del membro, della struttura dell’attività e della normativa applicabile.",
    ],
    sectorsLabel: "Settore",
    sectors: ["Immobiliare", "Consulenza legale", "Finanza", "Tecnologia", "Commercio", "Marketing"],
    countriesLabel: "Paese",
    countries: ["Italia", "Bulgaria", "Germania", "Francia", "Spagna", "Malta"],
  },
  governance: {
    eyebrow: "Governance",
    title: "Chi decide e chi rappresenta.",
    intro:
      "La governance di ARKADOMUS GEIE è progettata per garantire chiarezza decisionale, responsabilità definite e partecipazione dei membri, secondo le regole applicabili ai GEIE e quanto previsto dagli atti del Gruppo.",
    nodes: [
      {
        id: "membri",
        title: "Membri",
        text: "Società, professionisti, investitori ed enti degli Stati membri dell’UE partecipano alla vita del Gruppo.",
      },
      {
        id: "assemblea",
        title: "Assemblea dei membri",
        text: "L’Assemblea dei Membri rappresenta il principale organo decisionale del GEIE. Attraverso l’Assemblea, i partecipanti possono contribuire alla definizione delle linee strategiche, alle decisioni sulle attività comuni e agli aspetti organizzativi del Gruppo, secondo le competenze previste.",
      },
      {
        id: "amministratori",
        title: "Amministratori",
        text: "Gli Amministratori curano la gestione e la rappresentanza del GEIE nei limiti dei poteri conferiti dalla legge, dagli atti costitutivi e dalle deliberazioni degli organi competenti.",
      },
      {
        id: "attivita",
        title: "Attività e partner",
        text: "Sono responsabili del coordinamento delle attività, dei rapporti con interlocutori e partner e dell’attuazione delle decisioni adottate.",
      },
    ],
  },
  amministratore: {
    eyebrow: "Il nostro amministratore",
    name: "Moreno Zucchetti",
    initials: "MZ",
    claim: "Visione imprenditoriale, esperienza transnazionale, attenzione alle relazioni professionali affidabili.",
    facts: [
      { value: "2004", label: "Opera stabilmente a Malta" },
      { value: "100+", label: "GEIE fondati e gestiti" },
      { value: "25+", label: "Anni di attività di ATPC" },
    ],
    bio: [
      "Imprenditore italiano con esperienza internazionale, Moreno Zucchetti opera stabilmente a Malta dal 2004.",
      "Nel corso della sua carriera ha avviato e consolidato attività in Italia, Regno Unito, Bulgaria, Stati Uniti e Malta, sviluppando competenze nei settori tecnologico, commerciale e manageriale.",
      "Ha maturato una significativa esperienza nell’utilizzo dello strumento europeo del GEIE, contribuendo alla fondazione e alla gestione di oltre 100 Gruppi Europei di Interesse Economico.",
      "È inoltre alla guida di ATPC Ltd, una rete internazionale attiva da oltre venticinque anni nella consulenza personalizzata in ambito legale, finanziario e marketing aziendale.",
      "Il suo impegno professionale è affiancato dalla promozione dei principi di legalità, integrità ed etica commerciale, anche attraverso il ruolo di Presidente per Malta dell’International AntiCorruption Assembly (IACA).",
    ],
  },
  cta: {
    title: "La prossima opportunità potrebbe nascere da una <i>connessione</i>.",
    text: "Entra in una rete europea pensata per chi vuole collaborare, proteggere il valore e costruire nuove prospettive.",
    primary: { label: "Inizia una conversazione", href: "/contatti" },
    secondary: { label: "Scopri i vantaggi", href: "/#servizi" },
  },
};

/** Real coordinates (lon, lat) of the 27 EU capitals. */
export const capitals = [
  { city: "Sofia", country: "Bulgaria", lon: 23.32, lat: 42.7 },
  { city: "Vienna", country: "Austria", lon: 16.37, lat: 48.21 },
  { city: "Bruxelles", country: "Belgio", lon: 4.35, lat: 50.85 },
  { city: "Zagabria", country: "Croazia", lon: 15.98, lat: 45.81 },
  { city: "Nicosia", country: "Cipro", lon: 33.38, lat: 35.19 },
  { city: "Praga", country: "Repubblica Ceca", lon: 14.42, lat: 50.08 },
  { city: "Copenaghen", country: "Danimarca", lon: 12.57, lat: 55.68 },
  { city: "Tallinn", country: "Estonia", lon: 24.75, lat: 59.44 },
  { city: "Helsinki", country: "Finlandia", lon: 24.94, lat: 60.17 },
  { city: "Parigi", country: "Francia", lon: 2.35, lat: 48.86 },
  { city: "Berlino", country: "Germania", lon: 13.4, lat: 52.52 },
  { city: "Atene", country: "Grecia", lon: 23.73, lat: 37.98 },
  { city: "Budapest", country: "Ungheria", lon: 19.04, lat: 47.5 },
  { city: "Dublino", country: "Irlanda", lon: -6.26, lat: 53.35 },
  { city: "Roma", country: "Italia", lon: 12.5, lat: 41.9 },
  { city: "Riga", country: "Lettonia", lon: 24.11, lat: 56.95 },
  { city: "Vilnius", country: "Lituania", lon: 25.28, lat: 54.69 },
  { city: "Lussemburgo", country: "Lussemburgo", lon: 6.13, lat: 49.61 },
  { city: "La Valletta", country: "Malta", lon: 14.51, lat: 35.9 },
  { city: "Amsterdam", country: "Paesi Bassi", lon: 4.9, lat: 52.37 },
  { city: "Varsavia", country: "Polonia", lon: 21.01, lat: 52.23 },
  { city: "Lisbona", country: "Portogallo", lon: -9.14, lat: 38.72 },
  { city: "Bucarest", country: "Romania", lon: 26.1, lat: 44.43 },
  { city: "Bratislava", country: "Slovacchia", lon: 17.11, lat: 48.15 },
  { city: "Lubiana", country: "Slovenia", lon: 14.51, lat: 46.06 },
  { city: "Madrid", country: "Spagna", lon: -3.7, lat: 40.42 },
  { city: "Stoccolma", country: "Svezia", lon: 18.07, lat: 59.33 },
];

/* ------------------------------------------------------------------
   Contatti — step-by-step form
------------------------------------------------------------------- */

/**
 * Where the contact form is POSTed (JSON). Leave empty until a backend or a
 * form service (e.g. Formspree, Basin, a serverless function) is ready:
 * the form then shows the confirmation screen without sending anything.
 */
export const CONTACT_ENDPOINT = "";

export const contatti = {
  intro: {
    eyebrow: "Contatti",
    title: "Portiamo la tua visione oltre i confini.",
    text: "Vuoi sapere come ARKADOMUS GEIE può supportare il tuo progetto? Raccontaci chi sei, cosa fai e quali obiettivi vuoi raggiungere. Il nostro team valuterà con te il possibile percorso di collaborazione.",
    start: "Richiedi un primo contatto",
    facts: [
      { label: "Sede", value: "Bulgaria, nel cuore dell’Unione Europea" },
      { label: "Ambito", value: "Tutti gli Stati membri dell’UE" },
      { label: "Per chi", value: "Società, professionisti, investitori ed enti" },
    ],
  },
  types: ["Società", "Professionista", "Investitore", "Ente", "Altro"],
  consent: "Acconsento al trattamento dei miei dati personali per essere ricontattato in merito a questa richiesta.",
  submit: "Richiedi un primo contatto",
  done: {
    title: "La prossima opportunità potrebbe nascere da una connessione.",
    text: "Grazie, {nome}. Abbiamo ricevuto la tua richiesta: il nostro team valuterà con te il possibile percorso di collaborazione.",
    back: "Torna alla home",
    more: "Scopri ARKADOMUS GEIE",
  },
};

export const euCountries = capitals.map((c) => c.country).sort((a, b) => a.localeCompare(b, "it"));

/* ------------------------------------------------------------------
   SEO — meta title / description per page
------------------------------------------------------------------- */
export const seo = {
  home: {
    title: "ARKADOMUS GEIE | Cooperazione europea per imprese e professionisti",
    description:
      "ARKADOMUS GEIE facilita la cooperazione tra società, professionisti, investitori ed enti degli Stati membri dell’UE. Una rete europea per condividere risorse, proteggere il valore e sviluppare nuove opportunità.",
  },
  chiSiamo: {
    title: "Chi è ARKADOMUS GEIE | Una rete europea per collaborare",
    description:
      "Scopri ARKADOMUS GEIE, organizzazione con sede in Bulgaria dedicata alla cooperazione transfrontaliera tra imprese, professionisti, investitori ed enti europei.",
  },
};

/** Page metadata with matching Open Graph / Twitter tags. */
export function pageMeta({ title, description }: { title: string; description: string }) {
  return {
    title,
    description,
    openGraph: { title, description, siteName: "ARKADOMUS GEIE", locale: "it_IT", type: "website" as const },
    twitter: { card: "summary" as const, title, description },
  };
}

/* ------------------------------------------------------------------
   Big menu (hamburger)
------------------------------------------------------------------- */
export type BigMenuItem = {
  label: string;
  href: string;
  eyebrow?: string;
  description: string;
  bg: string;
  fg: string;
  links: { label: string; href: string }[];
};

export const bigMenu: BigMenuItem[] = [
  {
    label: "Home",
    href: "/",
    description: "La tua impresa, più forte oltre i confini.",
    bg: "var(--green)",
    fg: "var(--green-dark)",
    links: [
      { label: "Perché insieme", href: "/#perche" },
      { label: "I quattro pilastri", href: "/#pilastri" },
      { label: "In numeri", href: "/#numeri" },
      { label: "Il GEIE in breve", href: "/#geie" },
    ],
  },
  {
    label: "Chi siamo",
    href: "/chi-siamo",
    eyebrow: "Arka + Domus",
    description: "Un’identità nata per proteggere e connettere.",
    bg: "var(--orange)",
    fg: "var(--orange-dark)",
    links: [
      { label: "Il significato di ARKADOMUS", href: "/chi-siamo#significato" },
      { label: "La nostra missione", href: "/chi-siamo#missione" },
      { label: "La nostra visione", href: "/chi-siamo#visione" },
    ],
  },
  {
    label: "Il GEIE",
    href: "/il-geie",
    eyebrow: "Gruppo Europeo di Interesse Economico",
    description: "Uno strumento europeo pensato per facilitare la cooperazione tra imprese, professionisti e altri soggetti di Paesi diversi.",
    bg: "var(--purple)",
    fg: "var(--purple-dark)",
    links: [
      { label: "Come funziona", href: "/il-geie#cos-e" },
      { label: "Perché un GEIE?", href: "/il-geie#perche" },
      { label: "27 Stati, 1 sede", href: "/il-geie#mappa" },
      { label: "Governance", href: "/il-geie#governance" },
      { label: "Il nostro amministratore", href: "/il-geie#amministratore" },
    ],
  },
  {
    label: "Servizi e vantaggi",
    href: "/#servizi",
    eyebrow: "Cosa significa far parte di ARKADOMUS",
    description: "Cooperazione cross-border, protezione degli asset, efficienza fiscale e gestionale, visibilità europea.",
    bg: "var(--blue)",
    fg: "var(--ink)",
    links: [
      { label: "Cooperazione cross-border", href: "/#servizi" },
      { label: "Protezione degli asset", href: "/#servizi" },
      { label: "Efficienza fiscale e gestionale", href: "/#servizi" },
      { label: "Visibilità europea", href: "/#servizi" },
      { label: "Responsabilità corporativa e sociale", href: "/#servizi" },
    ],
  },
  {
    label: "Contatti",
    href: "/contatti",
    eyebrow: "Richiedi un primo contatto",
    description: "Portiamo la tua visione oltre i confini. Raccontaci chi sei, cosa fai e quali obiettivi vuoi raggiungere.",
    bg: "var(--pink-light)",
    fg: "var(--orange-dark)",
    links: [
      { label: "Sede: Bulgaria, nel cuore dell’UE", href: "/contatti" },
      { label: "Ambito: tutti gli Stati membri", href: "/il-geie#mappa" },
      { label: "Per società, professionisti, investitori ed enti", href: "/contatti" },
    ],
  },
];

export const bigMenuLegal = [
  { label: "Termini e condizioni", href: "/termini-e-condizioni" },
  { label: "Cookie policy", href: "/cookie-policy" },
  { label: "Mappa del sito", href: "/mappa-del-sito" },
];
