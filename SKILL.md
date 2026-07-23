# SKILL — La Forza Quotidiana · Schede allenamento

> **Quando caricare:** nuova scheda trimestrale, log sessione, statistiche mensili, pagina allenamento nel sito.

---

## 1. Struttura editoriale trimestre

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

### Formato pagina sessione (obbligatorio — sempre uguale)

**URL:** `/allenamenti/sessioni/YYYY-MM-DD-scheda-N/`  
**CSS:** `styles.css?v=14` (o versione corrente — tieni tutte le pagine allineate).

#### Ordine sezioni (non invertire)

| # | Blocco | Classe / elemento | Obbligatorio |
|---|--------|-------------------|--------------|
| 1 | Breadcrumb | `.breadcrumb` | Sì |
| 2 | Intestazione | `.session-head` | Sì |
| 3 | Nota sessione | `.session-note` | Se Gino lascia note |
| 4 | Foto / video | `.session-photos` + `.collage--scatter` | Se ci sono foto/video |
| 5 | Metabolico | `.metabolic-block` | Sì |
| 6 | Footer nav | `.session-footer` | Sì |
| 7 | Data aggiornamento | `<small>` | Sì |

#### Blocco foto e video `.session-photos`

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

#### Intestazione `.session-head`

```html
<header class="session-head">
  <p class="entry__meta"><span class="entry__type--all">Sessione</span> · <time datetime="YYYY-MM-DDTHH:MM">…</time></p>
  <h1>DD mese YYYY — Scheda N</h1>
  <p class="session-log__cal">giorno · gruppi muscolari</p>
  <p>Scheda di riferimento: <a href="…/#scheda-N"><strong>Scheda N</strong> · trimestre Giu–Lug–Ago 2026</a></p>
</header>
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
   | 4 | `-tecnica.png` | Radar valutazione movimento (se presente) |
   Ogni figura: `.phone-shot` + `.phone-shot__frame` + `figcaption` descrittiva.
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

**Input Gino ad ogni sessione:** invia screenshot Zepp (WhatsApp/chat). L’agente li salva in `img/allenamenti/amazfit/`, compila galleria + dati + analisi.

**Layout:** griglia visibile — **mai** scroll orizzontale che taglia i dati a destra. Vedi `SKILL-PERFORMANCE.md`.

Valori mancanti: `—`. Asterisco `*` se sovrastima device. Sessioni senza screenshot: solo `.amazfit-data` + nota «export Zepp non disponibile».

#### Footer `.session-footer`

Sempre: `← Tutte le sessioni` · `Scheda N di riferimento`  
Opzionale stesso giorno: `Riflessione del giorno` → `/diario/[slug]/`

**Non** usare stili inline su `.amazfit-card` nella strip — usare classi CSS condivise.

---

## 5. Tono e compliance

- Tono: professionale ma **dilettante autentico** — diario, non coaching commerciale.
- Disclaimer su ogni scheda: non PT, non medico.
- Dati numerici: **solo da log reali** (Amazfit, bilancia, metriche).
- **Privacy/GDPR:** banner cookie conforme Garante 2021, `/privacy/`, `/cookie/`, gate informativo su contenuti (`js/cookie-consent.js`). Email titolare: ginocapon@gmail.com
- **Newsletter + scheda PDF:** Google Apps Script + Gmail (`ginocapon@gmail.com`) + Foglio Google. Setup: `NEWSLETTER-SETUP.md` · script in `newsletter/google-apps-script.gs`

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
- [ ] **`?v=N` CSS/JS uniforme** su tutte le pagine (attuale: `styles.css?v=14`)

### Igiene tecnica (obbligatoria)

- **Cache-busting coerente:** quando cambi `css/styles.css` o un JS, incrementa `?v=N` **su tutte le pagine insieme** (non lasciare pagine a versioni vecchie). Versione corrente: CSS `v=9`, `newsletter.js v=3`.
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
