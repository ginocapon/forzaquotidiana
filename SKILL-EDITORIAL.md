---
name: forzaquotidiana-editorial-goliardia
description: >-
  Pipeline editoriale settimanale — 3 articoli diario goliardici, culturismo
  dilettante, newsletter only, zero vendita. Sequenza CONTEXT→…→NEXT CHECK.
---

# SKILL-EDITORIAL — Culturismo goliardico (newsletter only)

> **Quando caricare:** generazione articoli diario, venerdì editoriale, discovery keyword, immagini fumetto/surreali.
>
> **Entry point:** `node tools/editorial-weekly.mjs run [--friday|--generate|--publish|--autopilot]`
>
> **NON ricreare Guardian** — usa `guardian/` esistente + questa skill.

## Obiettivo unico

- Aumentare **visite organiche** e **iscrizioni newsletter**
- **ZERO** vendita, prodotti, funnel aggressivo, sponsor integratori

## Regole bloccanti

1. **Numeri** (kg, PR, %): solo da `data/my-stats.json` o fonte verificabile — mai inventare.
2. **Finzione/goliardia:** banner `.banner-goliardia` + disclaimer; non fingere cronaca reale.
3. **Immagini:** 1 hero 19:9 WebP + ≥2 figure **nuove** per articolo; hash unico in `img/`; stile **fumetto surreale** quando generate da IA; **marchio «Foto AI»** sull’immagine (`.ai-photo-mark`) + didascalia «Immagine elaborata / scena di finzione» + `data-ai="generated"` + `.ai-badge` + link `/trasparenza-ai/`.
4. **Anti-doppioni:** `node scripts/check-doppioni.mjs` prima di pubblicare.
5. **CTA:** solo newsletter (`from=articolo-{slug}`), dopo ~40% scroll o fine articolo — template `templates/partials/newsletter-cta-diario.html`.
6. **Autonomia:** GREEN = discovery/bozze/report · YELLOW = publish HTML se GEO≥8 · RED = DNS/email/DB.

## Sequenza obbligatoria

`CONTEXT → OBSERVE → VERIFY → ASSUMPTIONS → PREMORTEM → ANTI-DOPPIONI → PRIORITIZE (max 3) → ACT → VERIFY AGAIN → LEARN → NEXT CHECK`

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

Leggere: `guardian/AGENT.md`, `guardian/policy/autonomy.yaml`, `data/editorial-queue.json`, `data/my-stats.json`, `guardian/reports/guardian-latest.md`.

## FASE 5 — ACT contenuto (per articolo)

- 1500–2500 parole utili; tono da queue (`goliardico` | `tecnico` | `riflessione`)
- Title ≤60, meta ≤160, H1 ≠ title
- 8–12 H2/H3; box iniziale «Risposta breve» (AEO)
- FAQ 4–6 + JSON-LD FAQPage + BlogPosting + Person
- Internal links min 3: `/diario/`, `/allenamenti/`, `/chi-sono/`
- Path: `diario/{slug}/index.html` — slug con `-57-anni` quando pertinente

## Immagini — stile goliardico (BLOCCANTE)

| Asset | Path | Spec |
|-------|------|------|
| Hero | `img/diario/YYYY-MM-DD/{slug}-hero.webp` | 1900×900, 19:9, <150KiB target |
| Figura 1–2 | `img/diario/YYYY-MM-DD/{slug}-*.webp` | Fumetto, surreal, JoJo/manga light |
| **Miniatura indice** | `paths.figures[0]` → `diario/index.html` | **Obbligatoria** — `.diario-list__thumb` 120×120, fig1 (o hero fallback). NO marchio Foto AI sul thumb (`main.js` lo salta). |

**Brief visivo:** Gino cartoon stropicciato ma dignitoso; palette scura sito; umorismo italiano; NO stock palestra identico; NO riuso hero altri articoli.

**IA:** `data-ai="generated"` + marchio visivo **«Foto AI»** (`.ai-photo-wrap` / `.ai-photo-mark`) + `.fig-credit` con `.ai-badge` + link `/trasparenza-ai/`. Vedi `data/editorial-image-skin.json` → `watermark`.

Template banner: `templates/partials/banner-goliardia.html`

## Articolo pianificato — creatina (prossimo venerdì)

Slug: `creatina-meme-universita-57-anni` · bozza scientifica: `data/editorial-drafts/creatina-dossier-scientifico-2026-08.md`

Angolo: parodia «Facoltà di Creatina Applicata» + sintesi prudente del dossier (meta-analisi 2024–2026, tabella verdetto, **zero vendita**). Collegare a `proteine-shake-universita-57-anni`. Immagini **elaborate da zero** con marchio Foto AI.

## Venerdì mattina — comando utente → agente (modalità consigliata)

**Nessuna API a consumo.** Tu dai il comando; l’agente Cursor fa tutto il resto.

### Cosa scrivi (copia-incolla)

```
Venerdì editoriale: genera e pubblica i 3 articoli goliardici del diario secondo la skin.
```

Oppure usa il comando Cursor: **venerdi-editoriale** (file `.cursor/commands/venerdi-editoriale.md`).

### Cosa fa l’agente (automatico)

1. Legge questa skill + `data/editorial-skin.json` + `data/editorial-image-skin.json`
2. `node tools/editorial-weekly.mjs run --friday` — trend RSS, keyword, max 3 in `scheduled`
3. Per ogni slug: HTML in `diario/{slug}/` + 3 WebP in `img/diario/YYYY-MM-DD/` (stile skin, disclosure IA)
4. `node tools/editorial-weekly.mjs run --publish` — index **con miniatura fig1**, sitemap, llms.txt, check GEO/AEO
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
| `data/editorial-skin.json` | Voce, struttura, articoli riferimento (autopilot) |
| `data/editorial-image-skin.json` | Stile immagini fumetto/surreale (autopilot) |
| `data/my-stats.json` | Solo numeri reali |
| `data/skimm-catalog.json` | Cluster keyword |
| `guardian/config/web-sources.yaml` | Gap keyword statici + RSS trend |

## Output fine run

- Fino a 3 articoli in `diario/` (o `needs_generation` in queue)
- `guardian/reports/weekly-{date}.md`
- Lista esplicita: REALE vs FINIZIONE vs IMMAGINE IA
