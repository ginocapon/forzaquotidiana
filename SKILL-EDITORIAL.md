---
name: forzaquotidiana-editorial-goliardia
description: >-
  Pipeline editoriale settimanale — 3 articoli diario goliardici, culturismo
  dilettante, newsletter only, zero vendita. Sequenza CONTEXT→…→NEXT CHECK.
---

# SKILL-EDITORIAL — Culturismo goliardico (newsletter only)

> **Quando caricare:** generazione articoli diario, venerdì editoriale, discovery keyword, immagini fumetto/surreali.
>
> **Entry point:** `node tools/editorial-weekly.mjs run [--generate|--publish|--autopilot]`
>
> **NON ricreare Guardian** — usa `guardian/` esistente + questa skill.

## Obiettivo unico

- Aumentare **visite organiche** e **iscrizioni newsletter**
- **ZERO** vendita, prodotti, funnel aggressivo, sponsor integratori

## Regole bloccanti

1. **Numeri** (kg, PR, %): solo da `data/my-stats.json` o fonte verificabile — mai inventare.
2. **Finzione/goliardia:** banner `.banner-goliardia` + disclaimer; non fingere cronaca reale.
3. **Immagini:** 1 hero 19:9 WebP + ≥2 figure **nuove** per articolo; hash unico in `img/`; stile **fumetto surreale** quando generate da IA; didascalia «Immagine elaborata / scena di finzione» + `data-ai="generated"` + `.ai-badge`.
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
node tools/editorial-weekly.mjs run --generate    # solo coda + schedule (no LLM)
node tools/editorial-weekly.mjs run --publish     # dopo HTML+hero pronti
node tools/editorial-weekly.mjs run --autopilot   # trend + skin + LLM + immagini + publish (cron)
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

**Brief visivo:** Gino cartoon stropicciato ma dignitoso; palette scura sito; umorismo italiano; NO stock palestra identico; NO riuso hero altri articoli.

**IA:** `data-ai="generated"` + `.fig-credit` con `.ai-badge` + link `/trasparenza-ai/`.

Template banner: `templates/partials/banner-goliardia.html`

## Autopilot (cron venerdì — end-to-end)

Con `OPENAI_API_KEY` (secret GitHub) il cron genera e pubblica **senza intervento umano**:

1. **Trend** — `scripts/lib/trending-rss.mjs` legge RSS da `guardian/config/web-sources.yaml`
2. **Discovery** — merge trend + gap statici → `data/editorial-queue.json`
3. **Skin testo** — `data/editorial-skin.json` (voce, struttura, articoli riferimento)
4. **Skin immagini** — `data/editorial-image-skin.json` (fumetto JoJo, palette, disclosure)
5. **Generazione** — `tools/generate-diario-assets.mjs` → LLM JSON + DALL-E → WebP via ffmpeg
6. **Render** — `tools/render-diario-html.mjs` → HTML con banner goliardia + CTA newsletter
7. **Publish** — index diario, sitemap, llms.txt, GEO/AEO check
8. **Commit** — GitHub Actions push su `main`

Setup: `docs/EDITORIAL-AUTOPILOT-SETUP.md`

## Cron venerdì

- **05:00 UTC (07:00 CEST):** `.github/workflows/editorial-venerdi.yml` → `--autopilot` (default)
- **Manuale senza LLM:** workflow_dispatch con `autopilot: false` → `--generate`
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
