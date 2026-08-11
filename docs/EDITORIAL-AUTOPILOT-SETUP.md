# Setup autopilot editoriale (opzionale — API a consumo)

> **Modalità consigliata oggi:** venerdì mattina dai il comando all’agente Cursor (nessuna API). Vedi `SKILL-EDITORIAL.md` § «Venerdì mattina».

Questa guida serve **solo** se in futuro vuoi il cron GitHub che genera tutto da solo con OpenAI (`--autopilot`).

Pipeline **end-to-end con API**: trend RSS → keyword → 3 articoli + immagini → publish → commit.

## Cosa fa il cron

Ogni **venerdì 07:00 CEST** (05:00 UTC) il workflow `.github/workflows/editorial-venerdi.yml` esegue:

```bash
node tools/editorial-weekly.mjs run --autopilot
```

1. **Discovery** — `scripts/web-keyword-discovery.mjs` + trend da Reddit RSS (`scripts/lib/trending-rss.mjs`)
2. **Skin** — voce e struttura da `data/editorial-skin.json`; immagini da `data/editorial-image-skin.json`
3. **Generazione** — LLM (OpenAI) + DALL-E per hero e 2 figure inline
4. **Render** — `tools/render-diario-html.mjs` → `diario/<slug>/index.html`
5. **Publish** — index diario, sitemap, llms.txt, stato coda `published`
6. **Commit** — push su `main` (GitHub Actions)

## Secret obbligatorio

In **Settings → Secrets and variables → Actions**:

| Secret | Descrizione |
|--------|-------------|
| `OPENAI_API_KEY` | Chiave API OpenAI (chat + immagini) |

Alternativa: `EDITORIAL_API_KEY` (stesso valore, nome dedicato).

## Variabili opzionali (repository Variables)

| Variable | Default | Uso |
|----------|---------|-----|
| `EDITORIAL_MODEL` | `gpt-4o-mini` | Modello testo |
| `EDITORIAL_IMAGE_MODEL` | `dall-e-3` | Modello immagini |

## Esecuzione locale

```bash
export OPENAI_API_KEY=sk-...
node tools/editorial-weekly.mjs run --autopilot
```

Solo generazione coda (senza LLM):

```bash
node tools/editorial-weekly.mjs run --generate
```

Singolo articolo:

```bash
node tools/generate-diario-assets.mjs <slug>
```

## Skin (Fede)

- **Testo:** `data/editorial-skin.json` — tono goliardico, struttura H2, CTA newsletter, divieti
- **Immagini:** `data/editorial-image-skin.json` — fumetto surreale, palette JoJo, WebP 1200px
- **Riferimenti:** slug in `referenceArticles` nel file skin

Modifiche alla skin = modifiche al output automatico senza toccare il codice.

## Guardian

Il job `weekly_editorial` in `guardian/config/cron-matrix.yaml` continua a verificare prerequisiti (coda, skill, workflow). L’autopilot **pubblica**; Guardian **controlla** salute e segnala YELLOW/RED.

## Troubleshooting

| Problema | Azione |
|----------|--------|
| Workflow fallisce su API | Verificare secret `OPENAI_API_KEY` |
| Articolo senza immagini | Controllare log DALL-E; `node scripts/verify-article-hero.mjs diario/<slug>/index.html` |
| Doppioni | `node scripts/check-doppioni.mjs` |
| Trend vuoti | RSS Reddit temporaneamente down; gap statici in `web-sources.yaml` |

## Costi indicativi (OpenAI)

~3 articoli/settimana: ~15k token testo + 9 immagini DALL-E 3 standard → ordine di **$2–5/settimana** (tariffe 2026, variabili).
