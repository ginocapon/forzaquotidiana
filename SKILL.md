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

### Sezioni obbligatorie (ordine)

1. Hero trimestre (periodo, obiettivi, peso/partenza)
2. Intro emotiva + razionale (forza nella vita, non vetrina)
3. Tre pilastri: Forza · Ricomposizione · Salute articolare
4. **Monitoraggio cardiaco** (sezione fissa — vedi §3)
5. Struttura settimanale (4 giorni)
6. Schede giorno con **card esercizio** (SVG + esecuzione + serie/rep/recupero/RIR)
7. Regole d'oro + guida RIR
8. **Statistiche mensili** del trimestre (tabella riepilogo)
9. Disclaimer (non PT/medico) + FAQ

---

## 2. Card esercizio — template

Ogni esercizio ha una card autonoma:

| Campo | Contenuto |
|-------|-----------|
| **Nome** | Nomenclatura italiana palestra |
| **Muscoli** | Primario (accent) · secondario (muted) |
| **Serie×Rep** | es. 4×8 |
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
| `datetime` | 2026-07-17T15:24 | Data e ora inizio |
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

### Gerarchia pagina trimestre (ordine obbligatorio)

1. **Hero + organigramma** (`.org-chart`) — trimestre → Schede 1–4 → sessioni svolte (link anchor)
2. **Schede di riferimento** `#scheda-1` … `#scheda-4` — template esercizi (SVG, serie, RIR)
3. **Sessioni svolte** `#sessioni` — log per **data reale** + badge Scheda N + Amazfit + foto
4. **Statistiche mensili** `#statistiche`

URL sessione dedicata (opzionale):  
`/allenamenti/trimestre-[slug]/sessioni/YYYY-MM-DD-scheda-N/`

Riflessioni blog → `/diario/` (separate). Link incrociati sessione ↔ riflessione.

---

## 5. Tono e compliance

- Tono: professionale ma **dilettante autentico** — diario, non coaching commerciale.
- Disclaimer su ogni scheda: non PT, non medico.
- Dati numerici: **solo da log reali** (Amazfit, bilancia, metriche).
- **Privacy/GDPR:** banner cookie conforme Garante 2021, `/privacy/`, `/cookie/`, gate informativo su contenuti (`js/cookie-consent.js`). Email titolare: ginocapon@gmail.com

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

## 5b. Editoriale blog — qualità articoli (riflessioni)

Riferimenti di stile (armonizzare, non copiare): professionisti wellness/bodybuilding natural che scrivono da **esperienza vissuta** — es. voce da professionista impegnato + padre di famiglia (linea Federico Boldrin: wellness come purposeful living sostenibile), e blog natural diretti senza hype (chiarezza, numeri, niente miracoli).

### Struttura articolo riflessione

1. **Apertura scene-based** — giorno reale (sonno, orario palestra, ufficio), non tesi astratta.
2. **Un problema umano** — es. bilanciare famiglia / lavoro / sport a 50+.
3. **2–4 H2** con una sola idea ciascuno.
4. **Bridge al log** — link all’allenamento del giorno / scheda trimestre.
5. **Takeaway concreti** (3 bullet max) — azioni, non slogans.
6. **Chiusura identitaria** — target uomini maturi impegnati; niente coaching commerciale.

### Voce

| Fare | Evitare |
|------|---------|
| Prima persona onesta, età dichiarata | Motivazione da reel / emoji |
| Sport = struttura di serenità mentale | Promesse estetico-competitive |
| Settimana come unità di equilibrio | “Giornata perfetta” come standard |
| Link reciproci diario ↔ scheda | Articolo isolato senza log |

### SEO minimo articolo

- Title + meta description unici; `og:image` = foto reale della sessione se c’è.
- `BlogPosting` JSON-LD con `datePublished` / `dateModified`.
- Voce in `diario/index.html`, `sitemap.xml`, `llms.txt`.

---

## 6. Checklist pubblicazione nuovo trimestre

- [ ] URL trimestre creato, vecchio trimestre linkato come "archivio"
- [ ] Zero immagini copiate da PDF esterni
- [ ] SVG verificati per ogni esercizio
- [ ] Almeno 1 log cardiaco se disponibile
- [ ] Tabella statistiche mensili aggiornata
- [ ] `sitemap.xml` + voce Diario + `llms.txt`
- [ ] `og:image` = hero sito o grafica trimestre SVG (non screenshot Amazfit con dati personali sensibili oltre ciò che Gino approva)

### Checklist sessione + articolo (stesso giorno)

- [ ] Log `.hr-log` in scheda trimestre (più recente in alto)
- [ ] Pagina diario allenamento con foto + sintesi + correzione anomalie
- [ ] Se c’è riflessione: pagina dedicata + link crociati al log
- [ ] Catch Ball / esercizi nuovi: card opzionale in giorno scheda
- [ ] Statistiche mensili ricalcolate
- [ ] Feed `diario/index.html` + sitemap + llms.txt

---

## 7. Prossimi trimestri (roadmap)

| Trimestre | Periodo | URL slug |
|-----------|---------|----------|
| Q3 2026 | Giu–Lug–Ago | `trimestre-giugno-luglio-agosto-2026` |
| Q4 2026 | Set–Ott–Nov | `trimestre-settembre-ottobre-novembre-2026` |

Ripetere struttura §1–§6 identica; aggiornare solo contenuti e log.
