# ARKADOMUS GEIE — Next.js

Homepage in Next.js (App Router) con smooth scroll Lenis e animazioni GSAP/ScrollTrigger.

```bash
npm install
npm run dev      # sviluppo con hot reload: http://localhost:3000
npm run build    # genera il sito statico in out/
```

**Go Live (Live Server):** `.vscode/settings.json` punta Live Server alla cartella `out/`.
Dopo ogni modifica lancia `npm run build`, poi clicca "Go Live".

## Dove cambiare le cose

- **Testi, link, colori delle card** → `lib/content.ts` (testi dal sito ARKADOMUS)
- **Palette (valori MetaMask), scala tipografica, breakpoint** → `app/globals.css` (`:root`)
- **Font** → `app/layout.tsx`: Inter (lo stesso di revolut.com) + Geist al posto di Aeonik Pro (licenza commerciale)
- **Logo** → `public/logo.svg`, `public/crest.svg`, `app/icon.svg`

## Pagine

| Pagina | Contenuto |
|---|---|
| `/` | Home |
| `/chi-siamo` | Significato (ARKA + DOMUS che si fondono allo scroll), missione, visione (cerchio che si espande) |
| `/il-geie` | Schemi interattivi: autonomia → struttura comune (4 step allo scroll), contatti sparsi vs GEIE, mappa delle 27 capitali, costruttore settori × Paesi, governance, amministratore |
| `/contatti` | Form a step stile Typeform (tastiera: Invio, lettere A–E, Shift+Invio) |
| `/termini-e-condizioni` | Termini d’uso (testi in `lib/legal.ts`) |
| `/cookie-policy` | Cookie policy + stato delle scelte e pulsante “Preferenze cookie” |
| `/mappa-del-sito` | Mappa del sito (generata da `lib/site.ts`) |

**Invio del form:** imposta `CONTACT_ENDPOINT` in `lib/content.ts` (es. un endpoint Formspree o una funzione serverless). Finché è vuoto, il form mostra la conferma **senza inviare nulla**.

## Testi legali, cookie e SEO

- **Testi legali** → `lib/legal.ts`. Le parti tra `[[doppie parentesi]]` sono dati mancanti: sul sito appaiono evidenziate in arancio. Vanno completate e il testo va fatto verificare da un legale prima della pubblicazione.
- **Banner cookie** → `components/CookieConsent`. Le scelte sono salvate in `localStorage` (`arka-consent`) per 6 mesi. Per caricare script solo con consenso: `<ConsentGate category="statistiche">…</ConsentGate>`. Se cambi i cookie usati, incrementa `CONSENT_VERSION` in `lib/consent.ts` e aggiorna la cookie policy.
- **Dominio** per sitemap, robots e Open Graph → `SITE_URL` in `lib/site.ts` (o variabile `NEXT_PUBLIC_SITE_URL`).
- `sitemap.xml` e `robots.txt` sono generati a ogni build dalle pagine in `lib/site.ts`.

## Animazioni

Quasi tutto è guidato dallo scroll: gli elementi si costruiscono mentre entrano nello schermo e si smontano se torni indietro. Tre mattoni condivisi:

- **`lib/reveal.ts`** → `useScrollReveal(ref)` anima ogni elemento con `data-reveal` dentro il componente:
  `eyebrow` (l’etichetta si decodifica da lettere casuali), `title` (le parole si alzano in 3D una dopo l’altra),
  `lines` (le righe salgono da una maschera), `stagger` (i figli entrano uno alla volta), `up` (sale e appare).
  Per animare un nuovo testo basta aggiungere l’attributo e chiamare l’hook nel componente.
- **`lib/scrollFrame.ts`** → `useScrollFrame(target, callback)` chiama la callback a ogni frame con posizione
  dell’elemento rispetto al centro dello schermo e velocità, qualunque cosa lo muova (scroll, binario pinnato, swipe).
  Contiene anche le molle (`spring`, `follow`) usate per inerzia e oscillazioni.
- **`components/Odometer`** → numeri con le cifre a rulli, scorrono con lo scroll.

Con `prefers-reduced-motion` tutto resta fermo nello stato finale.

## Componenti

| Componente | Animazione |
|---|---|
| `HeroHome` | Sezione da 700lvh pinnata: titolo in knock-out sul gradiente, zoom dentro la parola `<i>`, telefono che sale, maschera, pixel heading, bento che entra |
| `Header` | Pill con megamenu; allo scroll si minimizza in tre pill con ritardi scalati; menu mobile fullscreen con accordion |
| `SectionIntro` | Etichetta che si decodifica, parole del titolo che si alzano in 3D, righe del testo che salgono |
| `PixelHeading` | Titolo che passa da pixel grossi a nitido in 5 step (filtro SVG), seguendo lo scroll (nelle hero: al caricamento) |
| `SkewingTitle` | Titolo gigante che si inclina con la velocità dello scroll; le lettere si allungano verso il mouse |
| `FloatingAssets` | Oggetti decorativi con inerzia (restano indietro e oscillano) e respinti dal puntatore |
| `BentoGrid` | Griglia 16 colonne su desktop, carosello scroll-snap sotto i 1025px |
| `StickyCards` | Card sticky che si alzano in 3D arrivando e si inclinano all’indietro quando vengono coperte; forme interne che oscillano |
| `TextImage5050` | Pannello che si apre in clip-path girandosi verso chi legge + asset in parallax |
| `HorizontalCards` | Scroll orizzontale pinnato con barra di progresso (desktop); le card formano una parete curva in 3D e le illustrazioni si montano man mano che la card arriva al centro |
| `Stats` | Cifre a rulli e linee che si disegnano |
| `Faq` | Divisori che si disegnano, domande che si alzano, icone che ruotano in ingresso |
| `ValuesGrid` | Card che partono da un mazzo al centro e si distribuiscono (su telefono: si ribaltano in ingresso) |
| `RevealText` | Parole che passano da contorno a pieno |
| `ScatterStructure` | I contatti sparsi si organizzano attorno al GEIE mentre scorri |
| `CallToAction`, `Footer`, `SectionPagination` | Pannello che si espande; wordmark che sale con lo scroll e si allunga a onda con la velocità; dot fissi |
| `LegalPage` | Nell’indice, una barra per sezione mostra quanto hai letto |
