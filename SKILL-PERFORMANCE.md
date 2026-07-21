# Performance Amazfit — skill operativa

> **Quando usare:** ogni nuova sessione pubblicata con export Zepp; fine mese; aggiornamento grafici trimestre.

## Obiettivo

Uniformare **dati metabolici, zone FC, effetto allenamento e valutazione tecnica** su ogni pagina sessione. I numeri danno **autorità e competenza** al diario allenamenti — solo valori reali da Amazfit/Zepp, mai inventati.

## Flusso obbligatorio (ogni sessione)

1. Gino invia **screenshot Zepp** (minimo: riepilogo; ideale: riepilogo + zone/effetto + grafico FC + valutazione tecnica se presente).
2. Salva screenshot in `img/allenamenti/amazfit/YYYY-MM-DD-scheda-N-[tipo].png`:
   - `-riepilogo.png`
   - `-zone-effetto.png` (opzionale se ricostruibile in HTML)
   - `-fc-grafico.png` (opzionale)
   - `-tecnica.png` (valutazione movimento / radar Zepp)
3. Aggiorna **`data/performance-sessions.json`** — aggiungi o modifica la voce sessione con tutti i campi numerici.
4. Compila la pagina sessione — blocco `.metabolic-block` completo (vedi sotto).
5. Esegui **`node tools/aggiorna-performance.mjs`** → rigenera `data/performance-monthly.json`.
6. Aggiorna **tabella + grafici** in `/allenamenti/trimestre-…/#statistiche` (o lascia che `performance-charts.js` legga il JSON).
7. Aggiorna excerpt sessione in `/allenamenti/sessioni/` se cambiano metriche chiave.

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

## Blocco HTML sessione (ordine strip)

1. `.phone-shot` — screenshot riepilogo Zepp
2. `.amazfit-card` riepilogo — 6 celle fisse (durata highlight, recupero, FC media, FC max, kcal, carico) + badge `N gruppi`
3. `.amazfit-card` zone + effetto — barre `.hr-zones` + `.hr-effects`
4. `.phone-shot` — screenshot grafico FC (se disponibile)
5. `.phone-shot` — screenshot valutazione tecnica (se disponibile)
6. `.amazfit-card` testo tecnica — 5 righe se non solo screenshot
7. `.metabolic-note` — anomalie device
8. `.hr-log.hr-log--elevated` — sintesi 6 metriche

Valori mancanti: `—`. Sovrastime device: asterisco `*` + nota.

## Statistiche mensili e grafici

- **Fonte unica:** `data/performance-monthly.json` (generato dallo script).
- **Medie:** solo sessioni con `durata_sec` + `fc_media` e senza `partial`.
- **FC media mensile:** media **ponderata per durata** (non semplice media aritmetica).
- **Tabella** `.month-stats` nel trimestre — aggiornare righe mese.
- **Grafici** `#statistiche` — container `#perf-charts` popolato da `js/performance-charts.js` che legge il JSON.

Tipi grafico (barre CSS, accessibili):

| Grafico | Metrica | Unità |
|---------|---------|-------|
| Durata sessioni | `durata_min` | min |
| FC media | `fc_media` | bpm |
| Calorie | `calorie` | kcal |
| Carico | `carico` | load |
| Gruppi/set | `gruppi` | n |

## Checklist sessione

- [ ] Screenshot salvati in `img/allenamenti/amazfit/`
- [ ] Voce in `performance-sessions.json`
- [ ] Pagina sessione con `.metabolic-block` completo
- [ ] `node tools/aggiorna-performance.mjs` eseguito
- [ ] Trimestre `#statistiche` coerente
- [ ] `sitemap.xml` lastmod sessione

## Anomalie device

Se orologio lasciato acceso (es. 20/07): vedi § Anomalie in `SKILL.md` — durata corretta, asterisco su kcal/carico, omettere zone se contaminate.

## Riferimenti

- Layout HTML/CSS: `SKILL.md` §3 e § Formato pagina sessione
- Esempio completo: `/allenamenti/sessioni/2026-07-21-scheda-2/`
- Esempio con zone: `/allenamenti/sessioni/2026-07-16-scheda-1/`
