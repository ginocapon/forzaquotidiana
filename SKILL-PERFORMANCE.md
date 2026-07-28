# Performance Amazfit — skill operativa

> **Quando usare:** ogni nuova sessione pubblicata; Gino invia screenshot Zepp; fine mese; aggiornamento grafici trimestre.

## Obiettivo

Ogni pagina sessione mostra **due livelli complementari**:

1. **Impatto visivo** — screenshot originali app Zepp (grafici FC, zone, gauge, radar). Gino li considera fondamentali: «troppo belli per non metterli». Vanno **sempre** in pagina quando li fornisce.
2. **Dati estratti + analisi** — tabelle HTML accessibili, JSON per statistiche mensili, nota interpretativa che spiega cosa significano i numeri.

Solo valori reali da Amazfit/Zepp — mai inventati.

## Input Gino (ogni allenamento)

Dopo ogni sessione Gino invia **screenshot Zepp** via chat/WhatsApp. Tipicamente 4 schermate:

| Tipo | Suffisso file | Cosa mostra |
|------|---------------|-------------|
| Riepilogo | `-riepilogo.png` | Durata, recupero, FC media, kcal, carico, gruppi |
| Grafico FC | `-fc-grafico.png` | Linea FC con picchi tra set e in chiusura |
| Zone + effetto | `-zone-effetto.png` | 5 barre zone FC + gauge aerobico/anaerobico |
| Tecnica | `-tecnica.png` | Radar consistenza, stabilità, continuità, ritmo, speed decay |
| Modulo TSB (opz.) | `-tsb-grafico.png` | Fitness CTL, fatica ATL, stato riposo — se Gino lo invia |

**Standard fisso:** tutti e **4** screenshot metabolici vanno in pagina quando Gino li invia. Il radar tecnica (#4) è parte del pacchetto — **non ometterlo** se presente in chat.

**Modulo TSB:** oltre agli screenshot, ogni pagina sessione mostra il **grafico TSB** (fitness/fatica/riposo) con focus sulla data dell’allenamento — vedi § Modulo TSB sotto. Se Gino invia anche lo screenshot Zepp del modulo, salvarlo come `-tsb-grafico.png` e aggiungerlo in galleria o accanto al grafico.

**Minimo accettabile** (solo se Gino non ha l’export): riepilogo + almeno uno tra grafico FC o zone. **Normale / obbligatorio:** tutti e 4.

## Flusso obbligatorio (ogni sessione)

1. Gino invia screenshot Zepp (**4 schermate** — verificare che ci sia anche `-tecnica.png`).
2. **Salva** in `img/allenamenti/amazfit/YYYY-MM-DD-scheda-N-[tipo].png` (copia da assets con Node `fs.readFileSync` se PowerShell fallisce su file phantom).
3. Aggiorna **`data/performance-sessions.json`** — voce sessione con tutti i campi numerici.
4. Compila pagina sessione — blocco `.metabolic-block` (ordine sotto).
5. Scrivi **`.metabolic-note`** — analisi 2–3 frasi (zona dominante, FC max, legame con esercizi).
6. Esegui **`node tools/aggiorna-performance.mjs`** → rigenera `data/performance-monthly.json`.
7. Esegui **`node tools/aggiorna-training-load.mjs`** → rigenera `data/training-load.json` (CTL/ATL/TSB).
8. Verifica tabella + grafici in trimestre `#statistiche` + modulo TSB.
9. Aggiorna excerpt in `/allenamenti/sessioni/` se cambiano metriche chiave.

## Layout pagina sessione (ordine fisso)

```
.metabolic-block
├── h2 + device
├── .amazfit-gallery__lead          ← intro «export originali Zepp»
├── .amazfit-gallery                ← 4 screenshot in griglia (PRIMA, tutto visibile)
│   ├── .phone-shot riepilogo
│   ├── .phone-shot fc-grafico
│   ├── .phone-shot zone-effetto
│   └── .phone-shot tecnica
├── .amazfit-data                   ← tabelle HTML sotto la galleria
│   ├── .amazfit-card riepilogo
│   ├── .amazfit-card zone+effetto
│   └── .amazfit-card--wide tecnica
├── .metabolic-note                 ← analisi testuale
└── .hr-log.hr-log--elevated        ← sintesi 6 metriche
```

**Regola layout:** griglia CSS — **no scroll orizzontale**. Tutti gli screenshot devono essere visibili senza scorrere.

## Modulo TSB — fitness, fatica, riposo (obbligatorio)

Zepp calcola **CTL** (fitness), **ATL** (fatica) e **TSB** (Training Stress Balance = CTL − ATL). Stati tipici: **Rilassato · Energetico · Bilanciato · Ottimale**.

**Regola bloccante:** il **grafico** (linee CTL/ATL, barre carico, legenda zone) deve essere **sempre visibile** in HTML — SVG pre-renderizzato, **non** solo testo o solo JS. Il giudizio della singola giornata viene **sotto** il grafico.

| Dove | Cosa |
|------|------|
| **Ogni pagina sessione** | Sezione `.session-panel--tsb` in testa — **grafico SVG** + focus data allenamento + giudizio giornata |
| **Trimestre — ogni Scheda 1–4** | **Grafico SVG** sotto l’intestazione scheda (focus ultima sessione di quel tipo) |
| **Trimestre `#modulo-tsb`** | Vista `overview` — panoramica completa |

**Implementazione:**
- Dati: `data/training-load.json` (`node tools/aggiorna-training-load.mjs`)
- Renderer: `tools/tsb-render.mjs` → SVG statico in pagina
- Iniezione: `node tools/inietta-tsb-pagine.mjs` (anche automatico dopo aggiorna-training-load)
- JS opzionale: `js/training-load-chart.js` — solo se il grafico statico manca
- Override Zepp in `training-load.json` → `overrides`

**HTML sessione (obbligatorio — grafico già dentro):**

```html
<!-- TSB-START -->
<section class="session-panel session-panel--tsb" …>
  <div class="tsb-module tsb-module--static" data-training-load="YYYY-MM-DD">
    … SVG grafico CTL/ATL + KPI + giudizio …
  </div>
</section>
<!-- TSB-END -->
```

Dopo ogni nuova sessione: `node tools/aggiorna-training-load.mjs` (rigenera JSON + pagine).

## Campi JSON (`performance-sessions.json`)

| Campo | Tipo | Obbligatorio | Esempio 21/07 |
|-------|------|--------------|---------------|
| `id` | string | sì | `2026-07-21-scheda-2` |
| `datetime` | ISO | sì | `2026-07-21T15:38` |
| `scheda` | 1–4 | sì | `2` |
| `month` | YYYY-MM | sì | `2026-07` |
| `durata` / `durata_sec` | string / int | sì* | `01:28:48` / 5328 |
| `recupero` / `recupero_sec` | string / int | se disponibile | `50:49` |
| `gruppi` | int | sì | `30` |
| `fc_media`, `fc_max` | int | sì / se c’è | `105`, `138` |
| `calorie`, `carico` | int | sì | `609`, `46` |
| `zones` | object | se export completo | vedi sotto |
| `effetto_aerobico`, `effetto_anaerobico` | float | se disponibile | `2.4`, `1.8` |
| `effetto_*_label` | string | sì con effetto | `Medio`, `Basso` |
| `tecnica` | object | se radar Zepp | consistenza, stability, … |
| `duration_corrected` | bool | se anomalia device | `false` |
| `calorie_asterisk`, `carico_asterisk` | bool | se sovrastima | `false` |
| `partial` | bool | export incompleto | — |

\* Se device gonfiato: `duration_corrected: true`, durata reale in `durata`, grezzo in `durata_device`.

### Zone FC (5 livelli)

```json
"zones": {
  "vo2": { "pct": 0, "time": "00:00" },
  "anaerobica": { "pct": 0, "time": "00:44" },
  "aerobica": { "pct": 13, "time": "12:10" },
  "intensiva": { "pct": 61, "time": "54:55" },
  "leggera": { "pct": 23, "time": "20:57" }
}
```

### Valutazione tecnica (radar Zepp)

```json
"tecnica": {
  "consistenza": "ROM per lo più uniforme",
  "stability": "Movimenti stabili, lievi scosse",
  "continuity": "Fluidi con pause minori",
  "rhythm": "Tempi coerenti, ritmo uniforme",
  "speed_decay": "Decadimento velocità ragionevole"
}
```

## Analisi `.metabolic-note` (obbligatoria)

Breve paragrafo che interpreta i dati — esempio 21/07:

> Sessione gambe-bicipiti ~1h29 · dominanza zona intensiva (61%) coerente con pressa 140 kg e recuperi tra set. FC max 138 bpm in chiusura sessione.

Includere: durata percepita, zona % dominante, legame con esercizi/pesi, picchi FC se rilevanti.

## Statistiche mensili e grafici

- **Fonte unica:** `data/performance-monthly.json` (generato dallo script).
- **Medie:** solo sessioni con `durata_sec` + `fc_media` e senza `partial`.
- **FC media mensile:** media **ponderata per durata**.
- **Tabella** `.month-stats` nel trimestre.
- **Grafici** `#perf-charts` via `js/performance-charts.js`.

## Checklist sessione

- [ ] Screenshot Zepp salvati in `img/allenamenti/amazfit/` — **tutti e 4**: `-riepilogo`, `-fc-grafico`, `-zone-effetto`, `-tecnica`
- [ ] Galleria `.amazfit-gallery` con **4** `.phone-shot` in pagina (incluso radar tecnica)
- [ ] Card `.amazfit-card--wide` tecnica + oggetto `tecnica` in JSON
- [ ] Dati estratti `.amazfit-data` compilati
- [ ] Analisi `.metabolic-note` scritta
- [ ] Voce in `performance-sessions.json`
- [ ] `node tools/aggiorna-performance.mjs` eseguito
- [ ] `node tools/aggiorna-training-load.mjs` eseguito (rigenera anche grafici statici)
- [ ] **Grafico SVG TSB visibile** in sessione + Scheda 1–4 trimestre + `#modulo-tsb`
- [ ] Trimestre `#statistiche` coerente
- [ ] `sitemap.xml` lastmod sessione

## Anomalie device

Se orologio lasciato acceso (es. 20/07): vedi § Anomalie in `SKILL.md` — durata corretta, asterisco su kcal/carico, omettere zone se contaminate. Screenshot parziali ok con nota.

## Report sonno mensile (fine mese)

**Input Gino:** screenshot Zepp «Rapporto mensile sulle tendenze» (1–31 del mese) — REM, veglia, pisolini, FC sonno, ipopnea, respirazione, diario/umore.

**Flusso:**
1. Salvare screenshot in `img/allenamenti/amazfit/mensile/YYYY-MM/` (es. `2026-07-sonno-rem-veglia.png`).
2. Aggiornare `data/sleep-monthly.json` — medie + `delta_prev_month` + `analisi` testuale.
3. Pubblicare sezione `#report-sonno-[mese]` nel trimestre (tabella + galleria 4 screenshot + nota interpretativa incrociata con `performance-monthly.json`).
4. Eseguire **valutazione integrata** completa seguendo `SKILL.md` **§3e** (tabelle riferimento, semaforo, giudizio, cronologia).

## Analisi integrata mensile (§3e SKILL)

A fine mese, dopo sonno + performance:

1. Leggere §3e in `SKILL.md` — **non improvvisare** range clinici.
2. Compilare semaforo (volume, FC, sonno, pesi).
3. Scrivere `.metabolic-note` nel trimestre con giudizio 4–6 frasi + disclaimer medico.
4. Aggiornare riga cronologia in SKILL §3e.

**Riferimenti chiave da citare quando rilevante:** ACSM RT 2026 (frequenza, RIR); AASM AHI <5; Sleep Foundation WASO/FC sonno; TrainingPeaks/Vitruve TSB −10…0 build zone; PMC5421976 FC in RT over 60.

**Campi JSON sonno (`sleep-monthly.json`):**

| Campo | Esempio luglio 2026 |
|-------|---------------------|
| `rem.avg` | 1:21 (23%) |
| `veglia.avg` | 0:49 · 5 risvegli |
| `pisolini.avg` | 0:54 |
| `fc_sonno_bpm.avg` | 55 |
| `ipopnea_per_h.avg` | 2.2 |
| `freq_respiratoria_brpm.avg` | 11 |

**TSB (Training Stress Balance):** opzionale per sessione in `performance-sessions.json` (`tsb.value`, `fitness_ctl`, `fatigue_atl`) — screenshot extra `-tsb.png` se Gino lo invia.

## Copia screenshot da assets

Su Windows i file in `.cursor/.../assets/` possono essere «phantom» (visibili in listing ma non copiabili con PowerShell). Usare Node:

```js
const fs = require('fs');
const data = fs.readFileSync('path/to/assets/...png');
fs.writeFileSync('img/allenamenti/amazfit/YYYY-MM-DD-scheda-N-tipo.png', data);
```

## Riferimenti

- Layout HTML/CSS: `SKILL.md` § Formato pagina sessione
- Esempio completo: `/allenamenti/sessioni/2026-07-21-scheda-2/`
- CSS: `.amazfit-gallery`, `.amazfit-data`, `.phone-shot` in `styles.css?v=15`
