---
name: forzaquotidiana-editorial-goliardia
description: >-
  Pipeline editoriale settimanale — venerdì: 2 articoli tecnici + 1 goliardico
  da trend RSS bodybuilding, newsletter only, zero vendita.
---

# SKILL-EDITORIAL — Venerdì: 2 tecnici + 1 goliardico

> **Quando caricare:** generazione articoli diario, venerdì editoriale, discovery RSS bodybuilding, immagini tecniche o fumetto.
>
> **Entry point:** `node tools/editorial-weekly.mjs run [--friday|--generate|--publish|--autopilot]`

## Obiettivo unico

- Aumentare **visite organiche** e **iscrizioni newsletter**
- **ZERO** vendita, prodotti, funnel aggressivo, sponsor integratori

## Mix settimanale (BLOCCANTE — dal venerdì 29/08/2026)

Ogni venerdì, da **RSS r/bodybuilding** (+ r/Fitness fallback):

| # | Tipo | Quantità | Lingua | Tono | Immagini |
|---|------|----------|--------|------|----------|
| 1–2 | **Serio / tecnico** | 2 | **Italiano** | Chiaro, performance, zero parodia | Illustrazioni **tecniche** bodybuilding (periodizzazione, volume, ipertrofia) — `style_serio` in `editorial-image-skin.json` |
| 3 | **Goliardico** | 1 | Italiano | Satira calda, schema attuale | Fumetto surreale JoJo — `style_goliardico` |

- **Escludere** da candidati seri: Daily Discussion Thread, Newbie Tuesday, megathread generici
- Badge articolo serio: `entry__type--tec` → **Tecnico** · niente `.banner-goliardia`
- Badge goliardia: `entry__type--goliardia` → **Goliardia** · banner obbligatorio

## Regole bloccanti

1. **Numeri** (kg, PR, %): solo da `data/my-stats.json` o fonte verificabile — mai inventare.
2. **Finzione/goliardia:** solo l’articolo #3 — banner `.banner-goliardia` + disclaimer; non fingere cronaca reale.
3. **Immagini:** 1 hero 19:9 WebP + ≥2 figure **nuove** per articolo; stile da `tone` (`tecnico` → `style_serio`, `goliardico` → `style_goliardico`); **marchio «Foto AI»** + `data-ai` + link `/trasparenza-ai/`.
4. **Anti-doppioni:** `node scripts/check-doppioni.mjs` prima di pubblicare.
5. **CTA:** solo newsletter (`from=articolo-{slug}`).
6. **Autonomia:** GREEN = discovery/bozze · YELLOW = publish se GEO≥8 · RED = DNS/email/DB.

## Sequenza obbligatoria

`CONTEXT → OBSERVE → VERIFY → ASSUMPTIONS → PREMORTEM → ANTI-DOPPIONI → **CONTINUITÀ (editorial-memory)** → PRIORITIZE (max 3) → ACT → VERIFY AGAIN → LEARN → NEXT CHECK`

**Continuità (BLOCCANTE pre-scrittura):**
1. Leggi `SKILL-MEMORIA-PROGRESSI.md` + `data/editorial-memory.json`
2. `node tools/build-editorial-memory.mjs` se memoria >7 giorni o dopo publish precedente
3. Se cluster già ≥2 negli ultimi 8 → altro angolo o `update_reason` in coda
4. `node tools/build-editorial-memory.mjs --check eq-XXX` opzionale prima di scrivere

## Comandi (unici entry point)

```bash
node tools/sync-my-stats.mjs
node scripts/web-keyword-discovery.mjs --count 3
node scripts/check-doppioni.mjs --slug SLUG --kw "kw" --cluster CLUSTER
node scripts/build-skimm.mjs --check SLUG "kw" CLUSTER
node tools/editorial-weekly.mjs run --friday       # venerdì: discovery + briefing agente (CONSIGLIATO)
node tools/editorial-weekly.mjs run --generate    # solo coda + schedule (no LLM)
node tools/editorial-weekly.mjs run --publish     # dopo HTML+hero pronti dall'agente
node tools/editorial-weekly.mjs run --autopilot   # opzionale: richiede OPENAI_API_KEY (API a consumo)
node tools/generate-diario-assets.mjs --slug SLUG # singolo articolo
node scripts/geo-aeo-formula.mjs --slug SLUG
node scripts/verify-article-hero.mjs --slug SLUG
node scripts/validate-page.js --file diario/SLUG/index.html
node guardian/scripts/guardian.mjs run --job weekly_editorial
```

## FASE 0 — CONTEXT

Leggere: `SKILL-MEMORIA-PROGRESSI.md`, `data/editorial-memory.json`, `guardian/AGENT.md`, `guardian/policy/autonomy.yaml`, `data/editorial-queue.json`, `data/my-stats.json`, `guardian/reports/guardian-latest.md`.

## FASE 5 — ACT contenuto (per articolo)

- 1500–2500 parole utili; tono da queue (`tecnico` | `goliardico` | `riflessione`)
- **Serio:** niente parodia, niente università immaginaria, niente meme Reddit — traduzione/adattamento **in italiano** del trend RSS
- Title ≤60, meta ≤160, H1 ≠ title
- 8–12 H2/H3; box iniziale «Sintesi Articolo» (AEO)
- FAQ 4–6 + JSON-LD FAQPage + BlogPosting + Person
- Internal links min 3: `/diario/`, `/allenamenti/`, `/chi-sono/`
- Path: `diario/{slug}/index.html` — slug con `-57-anni` quando pertinente

### Box «Sintesi Articolo» — regola aggiornata (BLOCCANTE)

- **2–3 frasi massimo**, tono diretto; prima persona nelle riflessioni
- Risponde al titolo in modo scorrevole — **non** paragrafo legale né elenco difese
- **Vietato nel box e nel corpo:** affiliazioni, codici sconto, «zero interesse commerciale», «spezzare una lancia», ripetizioni difensive su brand terzi
- **Vietato in qualsiasi articolo:** sezione H2 «Trasparenza totale», «Riepilogo secco» o equivalenti riassunti legali
- **Titoli H1 diretti** — niente parentesi difensive tipo «(senza venderti nulla)»
- Menzioni brand terzi: elogio genuino nel corpo; disclaimer minimo solo nel footer `.disclaimer` (opinione personale, non consulenza medica)
- FAQ: domande sul **contenuto**, non «Gino è pagato da X?»

## Indice diario — miniatura obbligatoria (BLOCCANTE)

Ogni nuovo articolo in `diario/index.html` deve usare la **card con thumb a sinistra** (come gli articoli dal 11 agosto in poi):

```html
<a class="diario-list__link" href="/diario/{slug}/">
  <span class="diario-list__thumb" aria-hidden="true">
    <img src="../img/diario/YYYY-MM-DD/{slug-base}-fig1.webp" alt="" width="120" height="120" loading="lazy">
  </span>
  <span class="diario-list__body">
    <div class="diario-list__meta">…</div>
    <h3 class="diario-list__title">…</h3>
    <p class="diario-list__excerpt">…</p>
  </span>
</a>
```

- **Thumb:** prima figura (`paths.figures[0]`) o hero se manca fig1 — stesso file WebP già in articolo.
- **NO** marchio «Foto AI» sul thumb (eccezione `.diario-list__thumb` in `main.js` e regole trasparenza).
- `node tools/editorial-weekly.mjs run --publish` inserisce la miniatura via `addToDiarioIndex()` — verificare visivamente `/diario/` prima del commit.

## Immagini — due skin (BLOCCANTE)

| Tono | Skin JSON | Stile |
|------|-----------|-------|
| `tecnico` | `style_serio` | Performance, periodizzazione, diagrammi bodybuilding — **NO fumetto** |
| `goliardico` | `style_goliardico` | Fumetto surreale JoJo/manga light |

| Asset | Path | Spec |
|-------|------|------|
| Hero | `img/diario/YYYY-MM-DD/{slug-base}-hero.webp` | 1600×760, 19:9, <180KiB |
| Figura 1–2 | `img/diario/YYYY-MM-DD/{slug-base}-fig*.webp` | 1200px larghezza |

**Serio:** `data-ai="illustrative"` · didascalia «Illustrazione tecnica editoriale»
**Goliardia:** `data-ai="generated"` · didascalia «Scena di finzione / immagine elaborata»

Template banner goliardia: `templates/partials/banner-goliardia.html` — **solo** articolo #3

## Prova articolo tecnico (26/08/2026)

Slug: `gareggiare-natural-senza-farmaci-57-anni` · trend RSS «compete = steroids» · **primo test** linea 2+1 (solo serio oggi; venerdì tutti e 3)

## Venerdì mattina — comando utente → agente (modalità consigliata)

**Nessuna API a consumo.** Tu dai il comando; l’agente Cursor fa tutto il resto.

### Cosa scrivi (copia-incolla)

```
Venerdì editoriale: genera e pubblica i 3 articoli del diario (2 tecnici + 1 goliardico) secondo la skin RSS bodybuilding.
```

Oppure usa il comando Cursor: **venerdi-editoriale**.

### Cosa fa l’agente (automatico)

1. Legge questa skill + `data/editorial-skin.json` + `data/editorial-image-skin.json`
2. `node tools/editorial-weekly.mjs run --friday` — trend RSS r/bodybuilding, coda **2 tecnico + 1 goliardico**
3. Per ogni slug: HTML in `diario/{slug}/` + 3 WebP in `img/diario/YYYY-MM-DD/` (skin seria o goliardica)
4. `node tools/editorial-weekly.mjs run --publish` — index, sitemap, llms.txt
5. Commit e push

### Cron GitHub (opzionale, alle 07:00)

Il workflow prepara solo la **coda** (`--generate`). La generazione vera resta al comando venerdì mattina.

## Autopilot API (futuro — opzionale)

Con `OPENAI_API_KEY` in GitHub Actions il cron può generare tutto senza agente (**API a consumo**, ~2–5 €/settimana). Vedi `docs/EDITORIAL-AUTOPILOT-SETUP.md`. Non necessario se usi l’agente Cursor.

1. **Trend** — `scripts/lib/trending-rss.mjs`
2. **Skin** — `data/editorial-skin.json`, `data/editorial-image-skin.json`
3. **Generazione** — `tools/generate-diario-assets.mjs` (OpenAI + DALL-E)
4. **Publish** — automatico in CI

## Cron venerdì

- **05:00 UTC (07:00 CEST):** workflow prepara coda (`--generate`) — **nessuna API**
- **Mattina:** tu → comando agente → 3 articoli pubblicati
- **Autopilot CI:** solo se aggiungi secret + `workflow_dispatch` con `autopilot: true`
- **07:00 UTC:** `venerdi-forza-quotidiana.yml` + Guardian `weekly_strategy`

## File dati

| File | Ruolo |
|------|-------|
| `data/editorial-queue.json` | Coda proposed/scheduled/published |
| `data/editorial-memory.json` | Ultimi 8 publish, saturazione cluster, risks |
| `SKILL-MEMORIA-PROGRESSI.md` | KPI, log, prossimi passi, trigger `"FQ"` |
| `data/editorial-skin.json` | Voce, struttura, articoli riferimento (autopilot) |
| `data/editorial-image-skin.json` | Stile immagini fumetto/surreale (autopilot) |
| `data/my-stats.json` | Solo numeri reali |
| `data/skimm-catalog.json` | Cluster keyword |
| `guardian/config/web-sources.yaml` | Gap keyword statici + RSS trend |

## Output fine run

- Fino a 3 articoli in `diario/` (o `needs_generation` in queue)
- `data/editorial-memory.json` rigenerato (`node tools/build-editorial-memory.mjs`)
- `guardian/reports/weekly-{date}.md`
- Lista esplicita: REALE vs FINIZIONE vs IMMAGINE IA
