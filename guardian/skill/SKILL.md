---
name: forzaquotidiana-premortem-guardian
description: >-
  Sistema premortem per forzaquotidiana.it — crescita newsletter, integrità
  tecnica, SEO, contenuti allenamento/diario. Sequenza unica OBSERVE→VERIFY→
  PREMORTEM→PRIORITIZE→ACT→VERIFY→LEARN→NEXT CHECK.
---

# Forza Quotidiana Premortem Guardian

## Obiettivo di business

**Primario:** acquisire iscritti newsletter (PDF scheda gratuita, double opt-in).  
**Secondario:** documentare allenamenti e diario per autorevolezza.  
**Orizzonte ~1 anno:** audience sufficiente per prodotti (schede premium, status community).

Non è un CRM immobiliare. Non inventare lead case o annunci.

## Quando usarlo

- controlli settimanali (venerdì) e heartbeat;
- prima/dopo pubblicazione sessione o articolo diario;
- verifica funnel newsletter e GAS;
- SEO (sitemap, llms.txt, meta);
- freschezza `data/*.json` e `site-stats.json`;
- trasparenza AI su nuove immagini;
- incidenti deploy GitHub Pages;
- **venerdì editoriale:** `weekly_editorial` job + `SKILL-EDITORIAL.md`.

## Sequenza obbligatoria

Segui `../sequences/master-sequence.md`.

## Categorie FQ (non Righetto)

| Categoria | Cosa controlla |
|-----------|----------------|
| availability | URL produzione HTTP 200 |
| newsletter | GAS `/exec`, form newsletter, funnel PDF |
| forms | honeypot, privacy checkbox, data-script-url |
| content | sessioni, diario, sitemap vs ultima sessione |
| seo | title/description, sitemap, llms.txt, robots |
| performance_data | JSON Amazfit/Zepp parseable |
| ai_transparency | pagine con `data-ai` senza badge |
| analytics | stub — GA4 non installato |
| security | admin noindex, nessun segreto in repo |
| deploy | ultimo workflow Pages (in CI) |
| business_growth | site-stats stale, iscritti_totali null |
| editorial | coda articoli, my-stats, weekly report |

## Regole

1. fatti separati da ipotesi;
2. niente dati inventati (no GA4 finto);
3. email iscritti **mai** in repo;
4. GREEN = report/alert; YELLOW = proposta; RED = approvazione umana;
5. un solo entry point: `node guardian/scripts/guardian.mjs run`.

## Integrazione esistente

- Riusa probe concettuali da `venerdi-forza-quotidiana.yml`
- Riusa `scripts/validate-page.js` per SEO head
- Riusa `SKILL-VENERDI.md` per azioni umane Sheet Google
- Dettaglio: `docs/GUARDIAN-INTEGRATION.md`
- Editoriale: `SKILL-EDITORIAL.md`, `tools/editorial-weekly.mjs`, `docs/EDITORIAL-AUTOPILOT-SETUP.md`
