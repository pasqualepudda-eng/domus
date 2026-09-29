/**
 * Legal texts.
 *
 * Text inside [[double brackets]] is a placeholder: it is rendered highlighted
 * on the page and MUST be completed (and the whole text reviewed by a legal
 * professional) before going live.
 */

export type LegalBlock = string | { list: string[] };
export type LegalSection = { id: string; title: string; body: LegalBlock[] };
export type LegalDoc = {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

const TITOLARE = "ARKADOMUS GEIE, Gruppo Europeo di Interesse Economico con sede in Bulgaria";

export const termini: LegalDoc = {
  eyebrow: "Informazioni legali",
  title: "Termini e condizioni",
  updated: "27 settembre 2026",
  intro:
    "I presenti Termini e condizioni disciplinano l’accesso e l’utilizzo di questo sito web. Navigando il sito dichiari di averli letti e di accettarli. Se non li accetti, ti invitiamo a non utilizzare il sito.",
  sections: [
    {
      id: "titolare",
      title: "Titolare del sito",
      body: [
        `Il sito è gestito da ${TITOLARE}.`,
        {
          list: [
            "Sede legale: [[indirizzo completo della sede in Bulgaria]]",
            "Numero di registrazione (UIC/EIK): [[numero di registrazione]]",
            "Partita IVA: [[partita IVA, se presente]]",
            "Email: [[indirizzo email di contatto]]",
            "PEC / telefono: [[facoltativo]]",
          ],
        },
      ],
    },
    {
      id: "oggetto",
      title: "Oggetto del sito",
      body: [
        "Il sito presenta ARKADOMUS GEIE, lo strumento del Gruppo Europeo di Interesse Economico, i servizi e i vantaggi della partecipazione, e consente di richiedere un primo contatto.",
        "Il sito non consente l’acquisto di prodotti o servizi online e non costituisce offerta al pubblico.",
      ],
    },
    {
      id: "informazioni",
      title: "Natura delle informazioni",
      body: [
        "I contenuti del sito hanno finalità esclusivamente informative e non costituiscono consulenza legale, fiscale, finanziaria o di altro tipo.",
        "La partecipazione ad ARKADOMUS GEIE e l’eventuale adozione di strumenti di tutela o di soluzioni organizzative devono essere valutate caso per caso, sulla base degli obiettivi concreti del membro, della struttura dell’attività e della normativa applicabile, attraverso valutazioni professionali personalizzate.",
        "Nessun contenuto del sito rappresenta una promessa di risultato. In particolare, i riferimenti all’efficienza fiscale e gestionale non implicano risultati automatici o garantiti.",
      ],
    },
    {
      id: "uso",
      title: "Utilizzo consentito",
      body: [
        "Ti impegni a utilizzare il sito in modo lecito e nel rispetto dei presenti Termini. È vietato in particolare:",
        {
          list: [
            "utilizzare il sito per finalità illecite o fraudolente;",
            "tentare di accedere senza autorizzazione a sistemi, server o dati collegati al sito;",
            "interferire con il funzionamento del sito o diffondere codice dannoso;",
            "inviare tramite il modulo di contatto dati di terzi senza averne titolo, o contenuti offensivi o illeciti.",
          ],
        },
      ],
    },
    {
      id: "contatto",
      title: "Richieste di contatto",
      body: [
        "L’invio di una richiesta tramite il modulo di contatto non comporta l’instaurazione di alcun rapporto contrattuale né l’obbligo, per ARKADOMUS GEIE, di accettare la partecipazione del richiedente.",
        "Ti impegni a fornire informazioni veritiere e aggiornate. I dati personali inviati sono trattati secondo l’informativa privacy: [[link all’informativa privacy]].",
      ],
    },
    {
      id: "proprieta",
      title: "Proprietà intellettuale",
      body: [
        "Testi, grafica, logo, marchi, illustrazioni, animazioni e ogni altro contenuto del sito sono di titolarità di ARKADOMUS GEIE o dei rispettivi aventi diritto e sono protetti dalle norme sul diritto d’autore e sulla proprietà industriale.",
        "È consentita la consultazione per uso personale. Ogni altra riproduzione, modifica, distribuzione o utilizzo commerciale richiede il preventivo consenso scritto del titolare.",
      ],
    },
    {
      id: "link",
      title: "Collegamenti a siti di terzi",
      body: [
        "Il sito può contenere collegamenti a siti gestiti da terzi. ARKADOMUS GEIE non esercita alcun controllo su tali siti e non è responsabile dei loro contenuti, servizi o trattamenti di dati.",
      ],
    },
    {
      id: "responsabilita",
      title: "Limitazione di responsabilità",
      body: [
        "ARKADOMUS GEIE si impegna a mantenere il sito accurato e aggiornato, ma non garantisce che i contenuti siano sempre completi, privi di errori o disponibili senza interruzioni.",
        "Nei limiti consentiti dalla legge applicabile, ARKADOMUS GEIE non è responsabile di danni derivanti dall’uso del sito o dall’affidamento sulle informazioni in esso contenute. Restano salvi i casi di dolo o colpa grave e le altre ipotesi in cui la responsabilità non può essere esclusa per legge.",
      ],
    },
    {
      id: "privacy",
      title: "Privacy e cookie",
      body: [
        "Il trattamento dei dati personali è descritto nell’informativa privacy: [[link all’informativa privacy]].",
        "L’uso dei cookie e degli strumenti analoghi è descritto nella Cookie policy, dalla quale puoi anche modificare in ogni momento le tue preferenze.",
      ],
    },
    {
      id: "modifiche",
      title: "Modifiche ai Termini",
      body: [
        "ARKADOMUS GEIE può aggiornare i presenti Termini in qualsiasi momento. La versione in vigore è quella pubblicata su questa pagina, con indicazione della data di ultimo aggiornamento.",
      ],
    },
    {
      id: "legge",
      title: "Legge applicabile e foro competente",
      body: [
        "I presenti Termini sono regolati dalla legge [[legge applicabile, es. bulgara]]. Per ogni controversia è competente il foro di [[foro competente]], fatte salve le norme inderogabili a tutela dei consumatori, che prevedono la competenza del giudice del luogo di residenza del consumatore.",
      ],
    },
    {
      id: "contatti",
      title: "Contatti",
      body: ["Per qualsiasi domanda sui presenti Termini puoi scriverci a [[indirizzo email di contatto]] o utilizzare la pagina Contatti."],
    },
  ],
};

export const cookiePolicy: LegalDoc = {
  eyebrow: "Informazioni legali",
  title: "Cookie policy",
  updated: "27 settembre 2026",
  intro:
    "Questa pagina spiega quali cookie e strumenti analoghi utilizza il sito, per quali finalità e come puoi gestire le tue preferenze in qualsiasi momento.",
  sections: [
    {
      id: "cosa-sono",
      title: "Cosa sono i cookie",
      body: [
        "I cookie sono piccoli file di testo che i siti salvano sul dispositivo dell’utente. Strumenti analoghi, come il localStorage del browser, permettono di memorizzare informazioni in modo simile. In questa pagina li chiamiamo genericamente “cookie”.",
      ],
    },
    {
      id: "utilizzati",
      title: "Cookie utilizzati da questo sito",
      body: [
        "Attualmente il sito utilizza esclusivamente strumenti tecnici necessari al suo funzionamento:",
        {
          list: [
            "arka-consent (localStorage, prima parte): memorizza le tue scelte sui cookie per non riproporti il banner a ogni visita. Durata: 6 mesi.",
          ],
        },
        "Il sito non utilizza al momento cookie statistici, di profilazione o di marketing, né servizi di terze parti che installano cookie. I caratteri tipografici sono ospitati direttamente sul sito.",
        "Se in futuro verranno introdotti strumenti statistici o di marketing, saranno attivati solo con il tuo consenso e questa pagina verrà aggiornata con l’elenco completo.",
      ],
    },
    {
      id: "categorie",
      title: "Categorie di cookie",
      body: [
        {
          list: [
            "Necessari: indispensabili per il funzionamento del sito e per ricordare le tue scelte. Non richiedono consenso e non possono essere disattivati.",
            "Statistici: servirebbero a capire in forma aggregata come viene utilizzato il sito. Attivati solo con il tuo consenso.",
            "Marketing: servirebbero a mostrarti contenuti in linea con i tuoi interessi, anche su altri siti. Attivati solo con il tuo consenso.",
          ],
        },
      ],
    },
    {
      id: "preferenze",
      title: "Gestire le preferenze",
      body: [
        "Alla prima visita un banner ti permette di accettare tutti i cookie, rifiutare quelli non necessari o scegliere le singole categorie. Chiudere il banner con la “X” equivale a rifiutare i cookie non necessari.",
        "Puoi modificare le tue scelte in qualsiasi momento con il pulsante “Preferenze cookie” qui sotto o nel footer del sito. Il banner ti verrà riproposto dopo 6 mesi o in caso di modifiche sostanziali.",
        "Puoi inoltre eliminare o bloccare i cookie dalle impostazioni del tuo browser.",
      ],
    },
    {
      id: "titolare",
      title: "Titolare del trattamento",
      body: [
        `${TITOLARE}. Sede legale: [[indirizzo completo]]. Email: [[indirizzo email di contatto]].`,
        "Per maggiori informazioni sul trattamento dei dati personali consulta l’informativa privacy: [[link all’informativa privacy]].",
      ],
    },
  ],
};
