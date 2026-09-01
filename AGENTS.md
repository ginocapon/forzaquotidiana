# AGENTS.md — Forza Quotidiana (Cloud Agent / Cursor)

## Obiettivo sito

Crescita **newsletter** (PDF scheda gratuita) → audience per prodotti futuri. Sito statico su GitHub Pages. **Non** è un CRM immobiliare.

## Token — regola prioritaria

**Non caricare `SKILL.md` intero** se basta il router:

1. Leggi `.cursor/rules/skill-router.mdc` (sempre attivo).
2. Usa `docs/SKILL-INDEX.md` per sezioni e righe di `SKILL.md`.
3. Preferisci file modulari: `SKILL-PERFORMANCE.md`, `SKILL-VENERDI.md`, `SKILL-LANDING.md`, `guardian/skill/SKILL.md`.

## Comandi frequenti → cosa aprire

| Task | File |
|------|------|
| Nuova sessione allenamento | `SKILL-PERFORMANCE.md`, `.cursor/rules/sessione-guile-monitoraggio.mdc`, `docs/PROMPT-MONITORAGGIO-SPORTIVO.md` |
| **Foto Zepp caricate su GitHub** | `.cursor/rules/foto-sessione-upload.mdc` — WebP, identificazione visiva, TSB + riepilogo + grafico FC **solo a tutta larghezza**, card dati raggruppate |
| Articolo diario | `SKILL.md` §0c + §5b |
| Newsletter / iscritti | `SKILL.md` §5a, `SKILL-VENERDI.md` |
| Check salute / premortem | `node guardian/scripts/guardian.mjs run` → `guardian/reports/guardian-latest.md` |
| **Editoriale venerdì (3 articoli diario)** | Comando: *«Venerdì editoriale: genera e pubblica i 3 articoli»* → `SKILL-EDITORIAL.md` + `.cursor/commands/venerdi-editoriale.md` |
| Venerdì | `SKILL-VENERDI.md` |
| SEO nuova pagina | `SKILL.md` §8, `scripts/validate-page.js` |
| UI / hero | `SKILL-LANDING.md`, `SKILL.md` §0.1 |
| **App Personal trainer (Payload)** | `training-app/DEPLOY.md`, `data/supabase-forza-training.json`, `/personal-trainer/` |

## Guardian (entry point unico)

```bash
node guardian/scripts/guardian.mjs doctor
node guardian/scripts/guardian.mjs run
node guardian/scripts/guardian.mjs run --job daily_premortem
```

Cron CI: `.github/workflows/guardian-run.yml` (ogni 6h). Venerdì: `weekly_strategy` in `venerdi-forza-quotidiana.yml`.

## Stack

- Static HTML/CSS/JS, `data/*.json` pubblici
- Newsletter: Google Apps Script → Sheet Google (email **mai** in repo)
- Deploy: push su `main` → GitHub Pages
- Nessun GA4/GSC API/Supabase

## Trasparenza AI

Obbligatoria su immagini IA: `.cursor/rules/ai-trasparenza.mdc`.

## Branch e PR

Branch agent: `cursor/<descrizione>-f98b`. Base: `main`.
