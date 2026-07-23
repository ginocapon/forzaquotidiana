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

**Standard fisso:** tutti e **4** screenshot vanno in pagina quando Gino li invia. Il radar tecnica (#4) è parte del pacchetto — **non ometterlo** se presente in chat.

**Minimo accettabile** (solo se Gino non ha l’export): riepilogo + almeno uno tra grafico FC o zone. **Normale / obbligatorio:** tutti e 4.

## Flusso obbligatorio (ogni sessione)

1. Gino invia screenshot Zepp (**4 schermate** — verificare che ci sia anche `-tecnica.png`).
2. **Salva** in `img/allenamenti/amazfit/YYYY-MM-DD-scheda-N-[tipo].png` (copia da assets con Node `fs.readFileSync` se PowerShell fallisce su file phantom).
3. Aggiorna **`data/performance-sessions.json`** — voce sessione con tutti i campi numerici.
4. Compila pagina sessione — blocco `.metabolic-block` (ordine sotto).
5. Scrivi **`.metabolic-note`** — analisi 2–3 frasi (zona dominante, FC max, legame con esercizi).
6. Esegui **`node tools/aggiorna-performance.mjs`** → rigenera `data/performance-monthly.json`.
7. Verifica tabella + grafici in trimestre `#statistiche`.
8. Aggiorna excerpt in `/allenamenti/sessioni/` se cambiano metriche chiave.

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

Esempio completo: `/allenamenti/sessioni/2026-07-21-scheda-2/`

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
- [ ] Trimestre `#statistiche` coerente
- [ ] `sitemap.xml` lastmod sessione

## Anomalie device

Se orologio lasciato acceso (es. 20/07): vedi § Anomalie in `SKILL.md` — durata corretta, asterisco su kcal/carico, omettere zone se contaminate. Screenshot parziali ok con nota.

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
