# SKILL — La Forza Quotidiana · Schede allenamento

> **Quando caricare:** nuova scheda trimestrale, log sessione, statistiche mensili, pagina allenamento nel sito.

---

## 0. Anima del sito — dedicato a Ginevra

**La Forza Quotidiana** è un **lascito per Ginevra**, unica figlia di Gino. Non è bodybuilding da vetrina né coaching commerciale.

### Messaggio centrale (sempre coerente)

- Papà **sempre presente**, alla ricerca di **equilibrio** tra lavoro, famiglia e sport.
- Lo **sport è il mezzo** per trovare la propria strada e misurarsi quotidianamente con avversità e difficoltà.
- Il culturismo amatoriale è **fatto di sacrifici** ed è **molto impegnativo** — va detto senza romanticismi.
- Il sito documenta un percorso **reale**, non perfetto.

### Nome in copy

Usare **Ginevra** esplicitamente in home, chi-sono, dedicatio e intro diario — non solo «mia figlia» generico.

### Due mondi separati (navigazione chiara)

| Sezione | Contenuto | Tono |
|---------|-----------|------|
| **`/diario/`** | Riflessioni, vita, equilibrio, famiglia | Umano, lascito |
| **`/allenamenti/`** | Trimestre, sessioni, dati Amazfit | Disciplina, log |

### 0.1 Estetica riquadri — Panel Relief 3D (obbligatoria)

**Tema scuro attivo.** Ogni riquadro/contenitore del sito pubblico deve usare il sistema **Panel Relief**: bordi ad alto contrasto + rilievo 3D con luce dall’alto.

#### Principio

- Sfondo: gradiente scuro `--panel-bg` (non piatto `#161616`).
- Bordo: **dorato discreto** — luce in alto (`--panel-border-light`), media (`--panel-border-mid`), ombra in basso (`--panel-border-dark`), anello interno `--panel-border-gold` via `::after`.
- Rilievo: `box-shadow` con highlight interno dorato + ombra esterna (`--panel-shadow`).
- Luce: pseudo `::before` con `--panel-highlight` (riflesso superiore ambrato).
- Hover (link-card): `--panel-shadow-hover` + `translateY(-2px)`.
- Spessore bordo: **1.5px** (non 1px piatto).

#### Classi già coperte in `css/styles.css` (non reinventare)

`.card` · `.hub-card` · `.diario-list__link` · `.entry` · `.exercise-card` · `.session-panel` · `.session-card` · `.session-kpis__item` · `.amazfit-card` · `.newsletter-cta` · `.scheda-pdf-promo` · `.photo-mosaic__item` · `.cookie-modal__panel` · `.page-veiled .prose`

Per nuovi componenti futuri: aggiungere la classe `.panel-raised` **oppure** estendere il blocco condiviso in `styles.css` (stesso blocco «Panel relief»).

#### Varianti accent (opzionali)

- `.card--highlight` · `.entry--riflessione` · `.entry--allenamento` · `.session-panel--metabolic` · `.session-kpis__item--accent` → mantengono il rilievo ma con tinta arancio/ambra sui bordi.
- Pagine velate (`.page-veiled`): usare `--panel-bg-glass` + `backdrop-filter`.

#### Regole agente

1. **Non** creare card con `border: 1px solid var(--line)` piatto — usare sempre il sistema Panel Relief.
2. Nuova pagina/sezione → riquadri con classi esistenti (`.card`, `.hub-card`, `.session-panel`, ecc.).
3. Se serve un contenitore nuovo → `.panel-raised` + eventuale modifica accent.
4. Dopo ogni modifica CSS: bump `styles.css?v=N` su **tutte** le pagine (versione corrente: **v=24**).

#### Cometa hero (solo `/` — sopra la foto)

Cometa con **nucleo piccolo** e **scia di polvere stellare rada** (particelle bianche/dorate + scintille). Si muove in **ellissi casuali** che cambiano forma e diametro nella parte alta dell'hero (zona foto). Scia ~30% più lunga, dissoluzione ~20% più lenta.

- Markup: `<canvas class="comet-sky" id="comet-sky">` **dentro** `.hero` (sopra overlay, sotto `.hero__content`)
- Script: `js/comet.js` **solo** in `index.html`
- Canvas ancorato all'hero (`position: absolute`), `mix-blend-mode: screen`
- Rispetta `prefers-reduced-motion`

#### Ritratto autorevolezza — chi-sono e diario

Foto reale Gino **fuori palestra** (camicia, contesto professionale), sfumata come hero home — classe `.portrait-hero`.

- File: `img/chi-sono/gino-affari.png`
- Pagine: `/chi-sono/` e `/diario/` — **entrambe** con banda `.portrait-hero`: foto sfumata sullo sfondo, overlay scuro, testo in pannello vetro con rilievo 3D leggero
- Upload da mobile: allega in chat → `node tools/copia-ritratto-affari.mjs`
- Tono: autorevolezza — non solo palestra, anche uomo d'affari

---

## 0b. Hub Allenamenti — tre blocchi visivi

La pagina `/allenamenti/` deve essere **immediata**: tre card con illustrazione + testo breve.

| Blocco | Link | Immagine hub | Cosa comunica |
|--------|------|--------------|---------------|
| Trimestre | `/allenamenti/trimestre-…/` | `img/allenamenti/hub/trimestre.png` | Schede 1–4 di riferimento, programma |
| Sessioni svolte | `/allenamenti/sessioni/` | `img/allenamenti/hub/sessioni.png` | Log per data, Amazfit, foto |
| Diario | `/diario/` | `img/allenamenti/hub/diario.png` | Riflessioni separate dai numeri |

**Markup:** `.hub-cards` > `a.hub-card` con `.hub-card__img`, `.hub-card__label`, `h3`, `p`, `.hub-card__cta`.

**Illustrazioni:** generate o aggiornate dall’agente — stile editoriale scuro, accento `#c9783a`, 16:9, **no volti reali**. File fissi in `img/allenamenti/hub/`.

---

## 0c. Diario — navigazione smart

Il diario deve restare **semplice e fruibile**:

- Intro corta: titolo «Pensieri e vita», menzione Ginevra, link ad Allenamenti.
- Elenco **`.diario-list`**: una riga per articolo (data · titolo · excerpt), tap-friendly, niente muri di testo in indice.
- **Non** mischiare log palestra nell’indice diario.

---

Ogni scheda copre **3 mesi** con titolo impattante:

```
Trimestre [Mese] – [Mese] [Anno]
Esempio: Trimestre Giugno – Luglio – Agosto 2026
```

**URL:** `/allenamenti/trimestre-[mese1]-[mese2]-[mese3]-[anno]/`  
**Non** incollare PDF/foto di schede esterne. Tutto **HTML + SVG originali** del sito.

### Sezioni obbligatorie trimestre (ordine)

1. Hero trimestre (periodo, obiettivi, peso corporeo partenza)
2. Intro emotiva + razionale
3. Tre pilastri + organigramma (link a `/allenamenti/sessioni/`)
4. Schede 1–4 con card esercizio (SVG, serie, **peso iniziale**, RIR)
5. Statistiche mensili + regole + disclaimer

I log sessione **non** vanno nel trimestre — solo in `/allenamenti/sessioni/`.

---

## 2. Card esercizio — template

Ogni esercizio ha una card autonoma:

| Campo | Contenuto |
|-------|-----------|
| **Nome** | Nomenclatura italiana palestra |
| **Muscoli** | Primario (accent) · secondario (muted) |
| **Serie×Rep** | es. 4×8 |
| **Peso iniziale** | es. 22 kg ×2 manubri · stack macchina · 8 kg kettlebell |
| **Recupero** | es. 2' |
| **RIR** | 0-2 fondamentali · 1-2 accessori |
| **SVG** | Figura **originale** sito — mai foto stock incoerenti |
| **Esecuzione** | 3-5 bullet: setup, movimento, errori da evitare, respirazione |

### Figure SVG (realizzate da zero)

File simboli condivisi: inline `<symbol id="ex-*">` nella pagina trimestre.

| ID simbolo | Esercizi |
|------------|----------|
| `ex-press-inclinata` | Panca inclinata manubri/bilanciere |
| `ex-croci` | Farfalla / croci |
| `ex-lento` | Lento avanti seduto |
| `ex-alzate` | Alzate laterali |
| `ex-lat` | Lat machine |
| `ex-rematore` | Rematore / trazioni |
| `ex-polpacci` | Polpacci in piedi |
| `ex-pressa` | Pressa 45° |
| `ex-legcurl` | Leg curl |
| `ex-rdl` | Stacco rumeno |
| `ex-adduttori` | Adduttori |
| `ex-curl` | Curl Scott / martello |
| `ex-squat` | Squat multipower |
| `ex-catchball` | Catch Ball / kettlebell balistico |
| `ex-halo` | Clean Halo / rotazione kettlebell attorno alla testa |

Muscoli evidenziati: `--muscle-hot` (#c9783a) primario, `--muscle-warm` (#8b7355) secondario.

---

## 3. Monitoraggio cardiaco — METRO fisso

**Obbligatorio** in ogni scheda trimestre e in **ogni log sessione** futuro.  
Fonte dati: **Amazfit** (o equivalente) — solo valori reali, mai inventati.

### Blocco log sessione (`.hr-log`)

```html
<article class="hr-log" data-session="YYYY-MM-DDTHH:MM">
  <header>
    <time datetime="...">17 luglio 2026 · 15:24</time>
    <span class="hr-log__day">Lunedì · Petto/spalle/dorsali</span>
  </header>
  <!-- metriche + zone + effetto -->
</article>
```

### Campi obbligatori per sessione

| Campo | Esempio | Note |
|-------|---------|------|
| `datetime` | 2026-07-16T15:24 | Data e ora inizio |
| `tipo` | Allenamento muscolare | |
| `durata` | 01:09:50 | hh:mm:ss |
| `gruppi` | 21 | Set totali |
| `intervalli_set` | 49:34 | Recupero tra set |
| `fc_media` | 115 bpm | |
| `fc_max` | 152 bpm | |
| `calorie` | 564 kcal | |
| `carico` | 85 | Training load device |
| **Zone FC** | vedi sotto | % + tempo |
| **Effetto** | aerobico / anaerobico | punteggio + etichetta |

### Zone frequenza cardiaca (5 livelli)

| Zona | Range bpm | % | Durata |
|------|-----------|---|--------|
| VO₂ max | 146–163 | | mm:ss |
| Anaerobica | 130–145 | | |
| Aerobica | 114–129 | | |
| Intensiva | 97–113 | | |
| Leggera | 81–96 | | |

Visualizzazione: barre `.hr-zone-bar` con `--pct` CSS.

### Effetto allenamento

| Tipo | Scala | Etichette |
|------|-------|-----------|
| Aerobico | 0–5 | Basso · Medio · Buono · Alto |
| Anaerobico | 0–5 | Basso · Medio · Buono · Alto |

Gauge SVG semicircolare `.hr-effect-gauge`.

### Cronostoria e statistiche mensili

- Sessioni ordinate **cronologicamente** (più recente in alto).
- **Database:** `data/performance-sessions.json` (ogni sessione) + `data/performance-monthly.json` (medie e grafici).
- **Skill dedicata:** `SKILL-PERFORMANCE.md` — flusso screenshot Zepp, JSON, grafici, checklist.
- **Script:** `node tools/aggiorna-performance.mjs` dopo ogni aggiornamento sessioni.
- Tabella `.month-stats` + grafici `#perf-charts` (JS: `performance-charts.js`) nel trimestre `#statistiche`.

| Mese | Sessioni | Con export | Durata totale | FC media | Calorie | Carico medio | Gruppi ø |
|------|----------|------------|---------------|----------|---------|--------------|----------|

Calcolare solo da log pubblicati — medie da `performance-monthly.json`. Celle vuote `—` se mese non ancora iniziato.

---

## 4. Schede tipo del trimestre (2026-Q3)

**Non legate al giorno del calendario.** Gino fa Scheda N quando può (martedì invece di lunedì, ecc.). Input sessione: **data + scheda N** (+ pesi se cambiano).

| Scheda | Focus |
|--------|-------|
| **1** | Petto, spalle, dorsali (6 es.) + Catch Ball opzionale **in chiusura** |
| **2** | Gambe, bicipiti (6 es.) |
| **3** | Spalle, dorsali (5 es.) + Clean Halo kettlebell **in chiusura** |
| **4** | Gambe, petto, bicipiti (6 es.) |

Schema: **4×8** (salvo 3×8 / 3×8-10). RIR 0-2 multiarticolari.

### Regola kettlebell (obbligatoria)

Qualsiasi esercizio con **kettlebell** (Catch Ball, Clean Halo, futuri) va **sempre per ultimo** nella scheda del giorno — finisher in chiusura, dopo multiarticolari e isolamenti. Non aprire la sessione con kettlebell: il lavoro pesante resta fresco, la FC sale solo alla fine.

### Gerarchia sezione Allenamenti (3 livelli — ordine obbligatorio)

1. **`/allenamenti/`** — Hub motivazionale: titolo energico, galleria foto Gino, link a trimestre e sessioni. Nessun log misto.
2. **`/allenamenti/trimestre-[slug]/`** — Solo riferimento: Schede 1–4 con esercizi, serie, **pesi iniziali concordati**, SVG, statistiche mensili. **Niente** log sessioni inline.
3. **`/allenamenti/sessioni/`** — Elenco per **data** (più recente in alto), **non** per numero scheda.
4. **`/allenamenti/sessioni/YYYY-MM-DD-scheda-N/`** — Pagina singola sessione: data, Scheda N di riferimento, foto, note, `.hr-log` Amazfit.

Input sessione: **data + scheda N** (+ pesi se cambiano). Aggiornare la pagina sessione, non il trimestre.

URL legacy `/allenamenti/YYYY-MM-DD/` → redirect alla pagina sessione canonica.

Riflessioni → `/diario/` (separate). Opzionale: link «Riflessione del giorno» nel footer sessione se esiste articolo stesso giorno.

### Formato pagina sessione (obbligatorio — layout pro v2)

**URL:** `/allenamenti/sessioni/YYYY-MM-DD-scheda-N/`  
**CSS:** `styles.css?v=24` (o versione corrente — tieni tutte le pagine allineate).

#### Struttura HTML (due zone)

1. **`.session-hero`** — banda in testa fuori da `.prose`: breadcrumb, badge Scheda N, data/ora, titolo, sottotitolo, **6 KPI** (`.session-kpis`), link scheda trimestre + diario.
2. **`.session-body`** — contenuto in `.wrap.prose.prose--wide`: pannelli `.session-panel`, nav pill `.session-nav`, footer data.

#### Ordine sezioni nel body (non invertire)

| # | Blocco | Classe | Obbligatorio |
|---|--------|--------|--------------|
| 1 | Nota Gino | `.session-panel` + `.session-note` | Se note disponibili |
| 2 | Tecnica / figure guida | `.session-panel` | Se esercizio nuovo |
| 3 | Log esercizi | `.session-panel` + `.scheda-table` | Se pesi annotati |
| 4 | Galleria | `.session-panel` + `.collage--scatter` | Se foto/video |
| 5 | Metabolico | `.session-panel.session-panel--metabolic` | Sì |
| 6 | Navigazione | `.session-nav` | Sì |
| 7 | Data aggiornamento | `.session-meta-footer` | Sì |

#### Hero `.session-hero` + KPI `.session-kpis`

```html
<main id="contenuto">
  <header class="session-hero">
    <div class="wrap">
      <nav class="breadcrumb">…</nav>
      <div class="session-hero__top">
        <span class="session-hero__badge">Scheda N</span>
        <time class="session-hero__time" datetime="YYYY-MM-DDTHH:MM">DD mese YYYY · ore HH:MM · giorno</time>
      </div>
      <h1>Gruppi muscolari · aggettivo sessione</h1>
      <p class="session-hero__sub">Una riga di contesto</p>
      <dl class="session-kpis" aria-label="Metriche principali sessione">
        <div class="session-kpis__item session-kpis__item--accent"><dt>Durata</dt><dd>00:50:33</dd></div>
        <!-- FC media, FC max, Calorie, Carico, Gruppi -->
      </dl>
      <p class="session-hero__refs">Scheda di riferimento: … · Riflessione: …</p>
    </div>
  </header>
  <div class="wrap prose prose--wide session-body">…</div>
</main>
```

- **6 KPI fissi** in hero (stessi della `.hr-log` finale).
- Valori mancanti: `—`. Asterisco `*` se sovrastima device.
- **Sfondo velato sessioni:** `<main class="session-page">` + `/img/allenamenti/session-hero-bg.png` (atleta Technogym). Preload in `<head>`.
- **Sfondo velato altre pagine:** `<main class="page-veiled">` + `/img/allenamenti/page-bg-dumbbells.png` (manubri 30 kg). Hero band su `.allenamenti-hero`, `.trimestre-hero`; ritratto sfumato su `.portrait-hero` (chi-sono, diario). Home: sezioni sotto hero → `.page-veiled-band`. Non applicare a pagine stampa PDF né redirect.

#### Pannelli e navigazione

- Ogni sezione body → `.session-panel` con `.session-panel__label` (Nota di Gino · Log · Galleria · Tecnica).
- Metabolico → `.session-panel.session-panel--metabolic`.
- Footer → `.session-nav` con pill (prima pill = `.session-nav__primary` «← Tutte le sessioni»).
- Elenco `/allenamenti/sessioni/` → `.session-cards` / `.session-card` (non `.entry`).

#### Blocco foto e video (dentro `.session-panel`)

Galleria `.collage.collage--scatter` con una `figure.polaroid` per ogni foto reale della sessione (spogliatoio, palestra, dettagli attrezzi). Se Gino invia anche un **video** (es. l'esecuzione di un esercizio), va aggiunto come elemento in più nella stessa galleria, stesso standard:

```html
<figure class="polaroid polaroid--video">
  <video controls playsinline preload="metadata" width="464" height="832" poster="/img/allenamenti/YYYY-MM-DD/nome-poster.jpg">
    <source src="/img/allenamenti/YYYY-MM-DD/nome-video.mp4" type="video/mp4">
    Il tuo browser non supporta il video. <a href="/img/allenamenti/YYYY-MM-DD/nome-video.mp4">Scarica il video</a>.
  </video>
  <figcaption>Esercizio · dettaglio breve</figcaption>
</figure>
```

- **File:** salvato in `img/allenamenti/YYYY-MM-DD/` come `.mp4` (h264/aac — compatibile browser, niente conversioni extra se già in questo formato).
- **Poster:** frame estratto via `ffmpeg -ss 00:00:02 -i video.mp4 -frames:v 1 -q:v 3 nome-poster.jpg` — evita riquadro nero prima del play.
- **Attributi fissi:** `controls playsinline preload="metadata"` — mai `autoplay`.
- **Aspect ratio:** verticale 9:16 (tipico WhatsApp) via CSS `.polaroid--video video { aspect-ratio: 9/16; }`; adattare se il video è orizzontale.
- Stesso `figcaption` descrittivo delle foto, stesso stile polaroid (rotazione leggera, cornice crema).

#### Intestazione (deprecata: `.session-head`)

**Usare `.session-hero` + `.session-kpis`** (vedi sopra). Il vecchio `.session-head` resta solo per retrocompatibilità — non usarlo in pagine nuove.

```html
<!-- DEPRECATO — non usare -->
<header class="session-head">…</header>
```

#### Blocco metabolico `.metabolic-block`

**Principio:** gli **screenshot originali Zepp** sono il cuore visivo della sessione — grafici FC, barre zone, gauge effetto, radar tecnica. Gino li invia ad ogni allenamento; vanno **sempre pubblicati** quando disponibili, non solo le tabelle HTML. Le card con numeri servono a SEO, accessibilità e ricerca; le foto danno **autorità e impatto**.

1. **Titolo fisso:** `Dati metabolici · Amazfit`
2. **Device:** `Amazfit Active 2 NFC · sync app Zepp · Allenamento muscolare`
3. **Intro galleria** `.amazfit-gallery__lead` — una riga che spiega che sono export originali app
4. **Galleria screenshot** `.amazfit-gallery` — **sempre per prima**, griglia 2×2 (mobile) / 4 colonne (desktop). Ordine fisso:
   | # | File | Contenuto |
   |---|------|-----------|
   | 1 | `-riepilogo.png` | Card riepilogo Zepp (durata, kcal, FC, carico) |
   | 2 | `-fc-grafico.png` | Grafico linea FC con picchi e valli |
   | 3 | `-zone-effetto.png` | Barre zone FC + gauge effetto aerobico/anaerobico |
   | 4 | `-tecnica.png` | Radar valutazione movimento — **obbligatorio** se Gino lo invia (quasi sempre) |
   Ogni figura: `.phone-shot` + `.phone-shot__frame` + `figcaption` descrittiva.

   **Regola agente (non dimenticare):** quando Gino manda gli screenshot Zepp, sono **sempre 4** (riepilogo, grafico FC, zone+effetto, **radar tecnica**). Se ne manca uno in chat, chiedere; se c’è, **pubblicarlo tutti e 4** — galleria + card testo tecnica + JSON `tecnica`. Non fermarsi a 3/4.
5. **Dati estratti** `.amazfit-data` — griglia 2 colonne (desktop) con `.amazfit-card`:
   - **Riepilogo** — griglia **6 celle fisse** (stesso ordine):
     1. Tempo allenamento (`.amazfit-card__cell--highlight`)
     2. Recupero tra set
     3. FC media · bpm
     4. FC max · bpm
     5. Calorie · kcal
     6. Carico allenamento
   - Badge in header: `N gruppi`
   - **Zone + effetto** — `.hr-zones` + `.hr-effects` nella stessa card
   - **Tecnica testo** — `.amazfit-card--wide` con 5 righe (se radar Zepp)
6. **Analisi sessione** `.metabolic-note` — **obbligatoria** con export completo: 2–3 frasi che interpretano i dati (zona dominante, FC max, coerenza con esercizi/pesi). Non solo numeri — racconto breve.
7. **Sintesi** `.hr-log.hr-log--elevated` — griglia **6 metriche fisse**:
   Durata · FC media · FC max · Calorie · Carico · Gruppi

**Input Gino ad ogni sessione:** invia screenshot Zepp (WhatsApp/chat) — **4 schermate fisse**: riepilogo, grafico FC, zone+effetto, radar tecnica. L’agente li salva in `img/allenamenti/amazfit/`, compila galleria (tutti e 4) + dati + card tecnica + analisi. **Checklist rapida:** `[ ] riepilogo  [ ] fc-grafico  [ ] zone-effetto  [ ] tecnica`

**Layout:** griglia visibile — **mai** scroll orizzontale che taglia i dati a destra. Vedi `SKILL-PERFORMANCE.md`.

Valori mancanti: `—`. Asterisco `*` se sovrastima device. Sessioni senza screenshot: solo `.amazfit-data` + nota «export Zepp non disponibile».

#### Footer (deprecato: `.session-footer`)

**Usare `.session-nav`** (vedi sopra). `.session-footer` con link separati da `·` è deprecato.

**Non** usare stili inline su `.amazfit-card` nella strip — usare classi CSS condivise.

---

## 5. Tono e compliance

- Tono: professionale ma **dilettante autentico** — diario, non coaching commerciale.
- Disclaimer su ogni scheda: non PT, non medico.
- Dati numerici: **solo da log reali** (Amazfit, bilancia, metriche).
- **Privacy/GDPR:** banner cookie conforme Garante 2021, `/privacy/`, `/cookie/`, gate informativo su contenuti (`js/cookie-consent.js`). Email titolare: ginocapon@gmail.com
- **Banner cookie:** `<div role="dialog">` — **mai** `<aside role="dialog">` (conflitto ARIA, fallisce Navigazione agentica Lighthouse).
- **Newsletter + scheda PDF:** Google Apps Script + Gmail (`ginocapon@gmail.com`) + Foglio Google. Setup: `NEWSLETTER-SETUP.md` · script in `newsletter/google-apps-script.gs`

### Navigazione agentica (Lighthouse 13+)

Punteggio frazionario **n/3** (non 0–100). Audit applicabili su sito statico:

| Audit | Requisito |
|-------|-----------|
| Accessibility tree | Contrasto link `.prose a` ≥ 4.5:1 su sfondo scuro; colori `.amazfit-card__*` accessibili; ARIA validi (cookie banner) |
| CLS | ≤ 0.1 (già ok) |
| llms.txt | H1 + blockquote + link Markdown `[testo](url)` — **non** URL nudi |

### Anomalie device (obbligatorio)

Se Amazfit/Zepp gonfia durata (orologio lasciato acceso):

1. Pubblica **durata corretta** dichiarata da Gino (es. ~01:15:00).
2. Conserva in nota i valori grezzi device (durata, intervalli set).
3. **Non inventare** zone FC / effetto se contaminati dall’idle — ometti o marca `non affidabili`.
4. Calorie e carico device: pubblicabili con asterisco *possibile sovrastima*.
5. Attributo HTML: `data-duration-corrected="true"` sul `.hr-log`.

### Esercizi sperimentali

Nuovi movimenti kettlebell (es. Catch Ball, Clean Halo) → card **in chiusura** scheda giorno, tag **Opzionale** o **Finisher**, nota “in prova” se applicabile. **Mai** in apertura sessione. Non promuovere a fisso finché Gino non conferma ripetizione.

---

## 5a. Newsletter e scheda pesi PDF

### Flusso

1. Link **Scarica scheda** da `/allenamenti/` o trimestre → `/allenamenti/newsletter/?from=schede-peso`
2. Iscrizione (consenso privacy) → Google Apps Script + Gmail
3. Redirect `/allenamenti/schede-peso/` — **1 foglio A4 orizzontale** (griglia 2×2)
4. `localStorage` `fq_newsletter_ok` sblocca visite successive (stesso browser)

### Scheda A4

- 4 quadranti (Scheda 1–4) su **un solo foglio** orizzontale
- Colonne: Esercizio · S×R · kg · Note + riga log per quadrante
- Stampa: orizzontale, margini minimi, 100%

### Database iscritti + consenso (GDPR)

- **Email → solo Foglio Google** (mai su GitHub — repo pubblico)
- **Doppio opt-in:** iscrizione → stato `da confermare` → email conferma → click → `confermato`. Newsletter inviata **solo ai confermati**.
- **Disiscrizione un click:** link `?action=unsub` in ogni email → stato `disiscritto`.
- Colonne foglio Iscritti: Data · Nome · Email · Consenso · Origine · **Stato** · **Token**
- Accessi/stampe → foglio **Accessi scheda** (Apps Script `doGet?action=log`)
- Conteggi anonimi → `data/site-stats.json`
- Venerdì → `SKILL-VENERDI.md` + workflow GitHub + `riepilogoVenerdi()` Gmail (conta confermati/da confermare/disiscritti)

### File

| Path | Ruolo |
|------|--------|
| `/allenamenti/newsletter/` | Landing + form |
| `/allenamenti/schede-peso/` | Catalogo schede per periodo |
| `/allenamenti/schede-peso/trimestre-…/` | Scheda A4 del periodo |
| `js/newsletter.js` | Submit, gate, demo test |
| `SKILL-VENERDI.md` | Checklist settimanale |

### Promozione

- Box scheda in hub allenamenti + callout nel trimestre
- Sezione newsletter in fondo a `/allenamenti/`

### Nuovo trimestre / nuovo periodo

Per ogni arco temporale creare:

1. **Programma** → `/allenamenti/trimestre-[mesi]-[anno]/` (obiettivo nel titolo, es. *Ipertrofia natural*)
2. **Scheda PDF A4** → `/allenamenti/schede-peso/trimestre-[mesi]-[anno]/`
3. **Voce catalogo** in `/allenamenti/schede-peso/index.html` e sezione hub `/allenamenti/#schede-periodo`
4. **Generare il PDF allegato alla newsletter** (lo faccio io, non l'utente):
   - Dopo il push della pagina scheda: `node tools/genera-pdf-scheda.mjs <slug> scheda-forza-quotidiana-<periodo>.pdf`
   - Produce **A4 orizzontale, 1 pagina** (Puppeteer + Chrome, apre la pagina con `?sub=1` per superare il gate)
   - Committare il PDF nella cartella della scheda
   - Aggiornare in `newsletter/google-apps-script.gs` le variabili `SCHEDA_URL`, `SCHEDA_PDF_URL`, `SCHEDA_PDF_NOME` → poi ricordare all'utente di **ripubblicare** lo script

Ogni scheda deve indicare chiaramente:

| Campo | Esempio Q3 2026 |
|-------|-----------------|
| **Obiettivo / tipo** | Ipertrofia natural |
| **Periodo (date)** | 1 giu – 31 ago 2026 |
| **Badge** | Q3 · 2026 |
| **Focus** | Forza · ricomposizione · articolazioni |

- Aggiornare contenuto scheda PDF (esercizi, pesi iniziali)
- Inviare email agli iscritti quando il trimestre è online

---

## 5b. Editoriale Diario vs Allenamenti

**Separazione netta:**

| Diario `/diario/` | Allenamenti `/allenamenti/` |
|-------------------|----------------------------|
| Solo **riflessioni** e articoli | Log sessioni, trimestre, Amazfit |
| Momenti catartici, foto, racconti, anche scherzosi | Schede 1–4, pesi, dati metabolici |
| **Nessun link** a pagine sessione/trimestre nel corpo articoli | Può linkare riflessioni del giorno |
| Un solo pulsante generico → `/allenamenti/` | — |

Non pubblicare log allenamento sotto `/diario/`. URL legacy → redirect a sessione.

### Struttura articolo riflessione

1. **Box sintesi GEO** — prime 150 parole, frase dichiarativa auto-contenuta
2. **Apertura scene-based** — giorno reale (sonno, orario palestra, ufficio)
3. **10–15 H2/H3** — spesso come domanda (AEO); primo paragrafo = risposta 40–60 parole
4. **≥ 2500 parole** utili (no riempimento)
5. **FAQ** — min 5 domande + schema `FAQPage`
6. **Takeaway concreti** (3 bullet max)
7. **Chiusura identitaria** + bio autore E-E-A-T

### Voce

| Fare | Evitare |
|------|---------|
| Prima persona onesta, età dichiarata | Motivazione da reel / emoji |
| Sport = struttura di serenità mentale | Promesse estetico-competitive |
| Settimana come unità di equilibrio | “Giornata perfetta” come standard |
| Menzionare palestra senza linkare log | Link a `/allenamenti/sessioni/` o trimestre |
| Pulsante «Vai agli Allenamenti» solo in `diario/index.html` | Log misti nel feed diario |

### SEO minimo articolo

- Title + meta description unici; `og:image` = foto reale della sessione se c’è.
- `BlogPosting` JSON-LD con `datePublished` / `dateModified`.
- Voce in `diario/index.html`, `sitemap.xml`, `llms.txt`.

---

## 8. SEO · GEO · AEO · contenuti (da template operativo)

> Riferimento esteso: `SKILL-SEO-GEO.md`. Regole **bloccanti** per ogni articolo diario.

### Claim consentiti (Forza Quotidiana)

| Dato | Valore verificabile |
|------|---------------------|
| Autore | Gino Capon, 57 anni |
| Allenamento | Da 10+ anni, dilettante autentico |
| Sito | forzaquotidiana.it |
| Target | Uomini 40–65, vita impegnata |
| Obiettivo sito | Diario + allenamento reale, non coaching commerciale |

**Regola d’oro:** niente «miglior PT», percentuali risultati clienti, promesse estetiche. Solo dati e storie verificabili.

### Regole operative sito

1. Leggere il file prima di modificarlo
2. **Mobile-first** (375px)
3. URL pulite — canonical coerente, `sitemap.xml` aggiornata
4. Dominio canonico: `https://forzaquotidiana.it` (apex, no www)
5. Cache-busting CSS/JS: `?v=N` incrementato a ogni modifica
6. WCAG AA — contrasto CTA ≥ 4,5:1
7. No `loading="lazy"` su hero/LCP
8. Commit solo se richiesto; push solo se esplicito

### Title e meta (BLOCCANTE)

| Campo | Target | Max |
|-------|--------|-----|
| `<title>` | ≤60 caratteri | 70 |
| `meta description` | 120–155 caratteri | 160 |

- Title, H1 e meta = **varianti diverse**
- Verificare conteggio caratteri prima di pubblicare

### Standard articolo diario (BLOCCANTE)

| Requisito | Valore |
|-----------|--------|
| **Lunghezza minima** | **≥ 2500 parole** (salvo istruzione diversa esplicita) |
| **H2/H3** | 10–15 sezioni |
| **Box sintesi GEO** | Prime 150 parole — frase dichiarativa auto-contenuta |
| **GEO sezioni** | Prime 2 righe di ogni H2 = frase dichiarativa con fatto |
| **AEO** | H2 spesso in forma di domanda; primo paragrafo = risposta 40–60 parole |
| **FAQ** | Min **5** domande visibili + schema `FAQPage` JSON-LD |
| **Link interni** | Min 3 (es. `/chi-sono/`, `/diario/`, `/allenamenti/`, newsletter) |
| **E-E-A-T** | Bio autore a fine articolo; link `/chi-sono/` |
| **Schema** | `BlogPosting` + `FAQPage` (`@graph`) |
| **Separazione** | **Nessun link** a pagine sessione/trimestre nel corpo (§5b) |

### Checklist ogni nuova pagina

- [ ] Title/meta §8 OK
- [ ] H1 unico
- [ ] Alt text immagini
- [ ] Canonical + OG
- [ ] JSON-LD BlogPosting (+ FAQPage se articolo) + **BreadcrumbList**
- [ ] ≥2500 parole (articoli diario)
- [ ] Box sintesi + FAQ
- [ ] 3+ link interni
- [ ] `sitemap.xml` + `llms.txt`
- [ ] `dateModified` aggiornato
- [ ] **`?v=N` CSS/JS uniforme** su tutte le pagine (attuale: `styles.css?v=24`, `cookie-consent.js?v=2`)

### Igiene tecnica (obbligatoria)

- **Cache-busting coerente:** quando cambi `css/styles.css` o un JS, incrementa `?v=N` **su tutte le pagine insieme** (non lasciare pagine a versioni vecchie). Versione corrente: CSS `v=24`, `newsletter.js v=3`.
- **`404.html`** presente in root (noindex, follow) — mantenere link a Home/Diario/Allenamenti.
- **BreadcrumbList** su ogni pagina interna (Home → sezione → pagina).
- Dominio canonico unico: `https://forzaquotidiana.it` (apex, no www).

### GEO + AEO (sintesi)

**GEO:** ogni sezione inizia con una frase che un motore generativo può citare da sola.  
*Es.: «Gino Capon, 57 anni, allena 4 volte a settimana conciliando lavoro e famiglia — non come influencer, ma come dilettante documentato.»*

**AEO:** H2 = domanda; risposta diretta sotto; FAQ schema allineato al testo visibile.

### Search Console — venerdì

Integrato in `SKILL-VENERDI.md`. URL chiave da ispezionare:

```
https://forzaquotidiana.it/
https://forzaquotidiana.it/chi-sono/
https://forzaquotidiana.it/diario/
https://forzaquotidiana.it/allenamenti/
https://forzaquotidiana.it/allenamenti/trimestre-giugno-luglio-agosto-2026/
https://forzaquotidiana.it/diario/sport-lavoro-famiglia-a-57-anni/
https://forzaquotidiana.it/diario/perche-forza-quotidiana/
https://forzaquotidiana.it/allenamenti/newsletter/
```

### PAGE SCORE (priorità settimanale)

| Etichetta | Azione |
|-----------|--------|
| **SOSTENERE** | Impressioni GSC, 0 click → rifare title/meta + sezione |
| **GEO** | Manca FAQ/box sintesi → aggiungere |
| **AGGIUNGERE** | Keyword gap → 1 articolo (anti-doppioni) |
| **MANTENERE** | Winner → solo `dateModified` |

### Cosa NON copiare (template Righetto)

Claim immobiliari, schema `RealEstateAgent`, cluster zone locali commerciali, Supabase annunci.

---

## 6. Checklist pubblicazione nuovo trimestre

- [ ] URL trimestre creato, vecchio trimestre linkato come "archivio"
- [ ] Zero immagini copiate da PDF esterni
- [ ] SVG verificati per ogni esercizio
- [ ] Almeno 1 log cardiaco se disponibile
- [ ] Tabella statistiche mensili aggiornata
- [ ] `sitemap.xml` + voce Diario + `llms.txt`
- [ ] `og:image` = hero sito o grafica trimestre SVG (non screenshot Amazfit con dati personali sensibili oltre ciò che Gino approva)
- [ ] Scheda pesi PDF aggiornata in `/allenamenti/schede-peso/`
- [ ] Email newsletter agli iscritti (funzione `inviaAggiornamentoATutti` in Apps Script)

### Checklist sessione + articolo (stesso giorno)

- [ ] Log `.hr-log` in pagina sessione dedicata (non nel trimestre)
- [ ] Se c’è riflessione: pagina in `/diario/` **senza link** al log sessione
- [ ] Catch Ball / esercizi nuovi: card opzionale in giorno scheda
- [ ] Statistiche mensili ricalcolate
- [ ] Feed `diario/index.html` (solo riflessioni) + sitemap + llms.txt

---

## 7. Prossimi trimestri (roadmap)

| Trimestre | Periodo | URL slug |
|-----------|---------|----------|
| Q3 2026 | Giu–Lug–Ago | `trimestre-giugno-luglio-agosto-2026` |
| Q4 2026 | Set–Ott–Nov | `trimestre-settembre-ottobre-novembre-2026` |

Ripetere struttura §1–§6 identica; aggiornare solo contenuti e log.

---

## 8. Admin — Periodizzazione e macrociclo

> **Quando caricare:** nuovo macrociclo annuale, modifica fasi, pesi ipotizzati, prototipi admin, rigenerazione `macrociclo-2026-2027.json`.

### 8.1 Area admin (non pubblica)

| Risorsa | Path |
|---------|------|
| Dashboard sessioni | `/admin/` |
| Scheda singola sessione | `/admin/sessione/?ciclo=<id>&sessione=a1\|b1\|a2\|b2` |
| **PDF scheda sessione** | `/admin/sessione/pdf/?ciclo=<id>&sessione=a1` — A4 verticale, sidebar log |
| Teoria mesocicli | `/admin/prototipi/periodizzazione/` |
| Schede pratiche | `/admin/prototipi/periodizzazione/schede/` |
| PDF stampabili | `/admin/prototipi/periodizzazione/pdf/` |
| Dati macrociclo Gino | `admin/data/macrociclo-2026-2027.json` |
| Teoria generica mesocicli | `admin/data/mesocicli.json` |
| Rigenera macrociclo | `node tools/genera-macrociclo.mjs` |

- `noindex` + `robots.txt` → `Disallow: /admin/`
- **Non** linkare dall’hub pubblico `/allenamenti/`
- Password admin: da implementare in seguito

### 8.2 Gerarchia periodizzazione

```
MACROCICLO  = anno intero (~52 settimane)
MESOCICLO   = singola fase (6–10 sett. ipertrofia per Gino)
MICROCICLO  = settimana (4 sessioni A1-B1-A2-B2)
```

**Regola d’oro per Gino Capon (57 anni, natural, ~10 anni palestra):** cambiare schema ogni **2–3 mesi**, non ogni mese. Il trimestre Q3 2026 (12 settimane stessa scheda) è il modello corretto.

### 8.3 Linee guida da fonti americane (sintesi)

| Fonte | Mesociclo ipertrofia | Note |
|-------|---------------------|------|
| **Mike Israetel** (Renaissance Periodization) | 4–8 sett. (+ deload) | Principianti fino a 8–12 sett.; avanzati 3–6 sett. Sweet spot molti: 4–6 sett. accumulo |
| **Eric Helms** (3DMJ) | 4–8 sett. | Deload/diet break ogni 4–8 sett.; progressione graduale |
| **Jeff Nippard** | 4–8 sett. (intermedi) | «Se progredisci, continua 8–12 sett.»; programmi con blocchi da 6–8 sett. |

**Adattamento per Gino:** profilo **intermedio maturo** → mesocicli ipertrofia **8–10 settimane**, deload ogni **10–11 settimane** di accumulo, blocco forza/tensione **6–8 settimane** unificato.

### 8.4 Split settimanale A1–B2 (invariato tutto l’anno)

| Sessione | Origine scheda Q3 | Focus | Progressione (*) |
|----------|-------------------|-------|------------------|
| **A1** | Scheda 1 | Petto · Schiena · Spalle | Panca inclinata manubri |
| **B1** | Scheda 2 | Gambe accosciata · Braccia | Doktor / pressa |
| **A2** | Scheda 3 | Schiena · Spalle · Petto | Rematore / lento avanti |
| **B2** | Scheda 4 | Gambe anca · Braccia | Stacco omega |

\* = esercizio principale con progressione a carico fisso e schema RIR.

**Finisher kettlebell (regola fissa):** Catch Ball in A1, Clean Halo in A2 — **sempre ultimo esercizio**, mai all’inizio.

### 8.5 Macrociclo 2026–2027 (52 settimane)

**Inizio:** 1 settembre 2026 · **Fine:** 31 agosto 2027 · **Peso partenza:** 67,0 kg

| # | Fase | Durata | Periodo | Obiettivo |
|---|------|--------|---------|-----------|
| 1 | Adattamento anatomico | 4 sett. | Set 2026 | Transizione da Q3, RIR 2–3 |
| 2 | Ipertrofia classica | **10 sett.** | Ott–Dic 2026 | Accumulo principale 8–12 rep |
| 3 | Deload | 1 sett. | Fine dic | Volume −40% |
| 4 | Tensione + Forza | **8 sett.** | Dic–Feb 2027 | 4 sett. tensione → 4 sett. forza |
| 5 | Deload | 1 sett. | Metà feb | Recupero post-forza |
| 6 | Ipertrofia classica II | **10 sett.** | Feb–Apr 2027 | Secondo blocco, +2,5 kg fondamentali |
| 7 | Ipertrofia alto volume | **6 sett.** | Apr–Giu 2027 | +1 serie multiarticolari |
| 8 | Deload | 1 sett. | Inizio giu | Pre-estate |
| 9 | Ricondizionamento | **11 sett.** | Giu–Ago 2027 | Mantenimento 10–12 rep |

**Totale:** 9 fasi · 52 settimane · 3 deload

### 8.6 Pesi base (da trimestre Giu–Lug–Ago 2026)

Usare come riferimento per ipotizzare carichi nel macrociclo. Aggiornare da log sessioni reali.

| Sessione | Esercizio | Peso riferimento |
|----------|-----------|------------------|
| B1 | Pressa 45° | 140 / 120 kg |
| B1 | Leg extension | 65 / 55 kg |
| B1 | Doktor PRIMO | 60 → 50 kg |
| B1 | Curl Scott | 35 / 30 kg |
| B1 | Polpacci drop | 140→110→80 kg |
| B2 | Squat multipower | 60 / 55 kg |
| B2 | Stacco omega | 60 kg |
| B2 | Chest press | 70 kg |
| B2 | Leg curl | 45 kg |
| B2 | Polpacci multipower | 80 kg |
| B2 | Curl martello | 18 kg/manubrio |
| A1/A2 | Catch Ball / Clean Halo | 8 kg kettlebell |

### 8.7 Regole modifica mesociclo

1. **Non accorciare** un mesociclo ipertrofico sotto 6 settimane per Gino senza motivo (infortunio, viaggio lungo).
2. **Deload** dopo ogni 10–11 settimane di lavoro duro — non saltare.
3. **Stessi esercizi** per tutta la fase; cambia solo serie/reps/RIR/peso.
4. **Progressione:** quando 2 sessioni consecutive al limite superiore reps con RIR target → +2,5–5 kg sul movimento *.
5. **Log reale** resta in `/allenamenti/sessioni/` — l’admin è prototipo/mappa, non sostituisce il log.

### 8.8 PDF scheda sessione (palestra)

Ogni sessione A1–B2 ha un **PDF dedicato** con:

- **Intestazione:** macrociclo, nome fase/ciclo, periodo date, RIR, obiettivo
- **Colonna principale:** esercizio + SVG + gruppi muscolari + note tecniche sintetiche (setup, movimento, errori)
- **Sidebar destra:** spazi per data/durata/RPE + per ogni esercizio righe **S1–Sn kg/rep** e campo **Note**

**Path:** `/admin/sessione/pdf/?ciclo=<id-fase>&sessione=a1`  
**Dati tecnici:** `admin/data/esercizi-catalogo.json`  
**CSS print:** `admin/css/admin-pdf-sessione.css`  
**Pulsante:** su pagina sessione e badge «PDF» su ogni card dashboard

Stampa: **A4 verticale**, margini standard, «Salva come PDF» dal browser.

### 8.9 Checklist nuovo macrociclo admin

- [ ] Aggiornare date e durate in `admin/data/macrociclo-2026-2027.json` (o rigenerare con `tools/genera-macrociclo.mjs`)
- [ ] Allineare `periodizzazioneAnnuale` in `admin/data/mesocicli.json`
- [ ] Verificare pesi da ultimo trimestre / ultime sessioni loggate
- [ ] Dashboard `/admin/` mostra tutte le fasi con link A1–B2
- [ ] Ogni sessione apre tabella peso/serie/RIR in `/admin/sessione/`
- [ ] Aggiornare questa sezione §8 se cambiano le linee guida

### 8.10 Errori da evitare

| Errore | Perché è sbagliato |
|--------|-------------------|
| Cambiare scheda ogni 4 settimane | Troppo frequente per un natural 57 anni che progredisce ancora |
| Saltare il deload | Fatica accumulata maschera i guadagni (Israetel) |
| 16 micro-fasi in un anno | Troppi cambi schema — confusione e zero adattamento |
| Copiare mesocicli da atleti avanzati giovani | Recovery diversa; servono blocchi più lunghi |
| Pubblicare `/admin/` nel sitemap | Area riservata, solo prototipi interni |

