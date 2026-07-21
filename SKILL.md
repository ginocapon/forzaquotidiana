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
- Tabella `.month-stats` per ogni mese del trimestre:

| Mese | Sessioni | Durata totale | FC media | Calorie | Carico medio |
|------|----------|---------------|----------|---------|--------------|

Calcolare solo da log pubblicati — celle vuote `—` se mese non ancora iniziato.

---

## 4. Schede tipo del trimestre (2026-Q3)

**Non legate al giorno del calendario.** Gino fa Scheda N quando può (martedì invece di lunedì, ecc.). Input sessione: **data + scheda N** (+ pesi se cambiano).

| Scheda | Focus |
|--------|-------|
| **1** | Petto, spalle, dorsali (6 es.) + Catch Ball opzionale |
| **2** | Gambe, bicipiti (6 es.) |
| **3** | Spalle, dorsali (4 es.) |
| **4** | Gambe, petto, bicipiti (6 es.) |

Schema: **4×8** (salvo 3×8 / 3×8-10). RIR 0-2 multiarticolari.

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
**CSS:** `styles.css?v=8` (o versione corrente).

#### Ordine sezioni (non invertire)

| # | Blocco | Classe / elemento | Obbligatorio |
|---|--------|-------------------|--------------|
| 1 | Breadcrumb | `.breadcrumb` | Sì |
| 2 | Intestazione | `.session-head` | Sì |
| 3 | Nota sessione | `.session-note` | Se Gino lascia note |
| 4 | Foto | `.session-photos` + `.collage--scatter` | Se ci sono foto |
| 5 | Metabolico | `.metabolic-block` | Sì |
| 6 | Footer nav | `.session-footer` | Sì |
| 7 | Data aggiornamento | `<small>` | Sì |

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

1. **Titolo fisso:** `Dati metabolici · Amazfit`
2. **Device:** `Amazfit Active 2 NFC · sync app Zepp · Allenamento muscolare`
3. **Strip scorrevole** `.amazfit-strip` — sempre in questo ordine:
   - `.phone-shot` — solo se c’è screenshot Zepp export
   - `.amazfit-card` **Riepilogo** — griglia **6 celle fisse** (stesso ordine):
     1. Tempo allenamento (`.amazfit-card__cell--highlight` se durata corretta)
     2. Recupero tra set
     3. FC media · bpm
     4. FC max · bpm
     5. Calorie · kcal
     6. Carico allenamento
   - Badge in header card: `N gruppi` (o `— gruppi` se manca)
   - `.amazfit-card` **Zone + effetto** — se disponibili (zone `.hr-zones` + effetto `.hr-effects` nella stessa card)
4. **Nota** `.metabolic-note` — opzionale (anomalie device, dati parziali)
5. **Sintesi** `.hr-log.hr-log--elevated` — griglia **6 metriche fisse**:
   Durata · FC media · FC max · Calorie · Carico · Gruppi

Valori mancanti: `—`. Asterisco `*` se sovrastima device.

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

Nuovi movimenti (es. Catch Ball) → card in scheda giorno con tag **Opzionale**, nota “in prova”, link dal diario sessione. Non promuovere a fisso finché Gino non conferma ripetizione.

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

### Database iscritti

- **Email → solo Foglio Google** (mai su GitHub — repo pubblico)
- Accessi/stampe → foglio **Accessi scheda** (Apps Script)
- Conteggi anonimi → `data/site-stats.json`
- Venerdì → `SKILL-VENERDI.md` + workflow GitHub + `riepilogoVenerdi()` Gmail

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
- [ ] JSON-LD BlogPosting (+ FAQPage se articolo)
- [ ] ≥2500 parole (articoli diario)
- [ ] Box sintesi + FAQ
- [ ] 3+ link interni
- [ ] `sitemap.xml` + `llms.txt`
- [ ] `dateModified` aggiornato

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
