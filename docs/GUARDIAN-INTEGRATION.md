# Guardian Premortem — integrazione Forza Quotidiana

> Riferimento pacchetto: `Righetto_Premortem_Guardian_ONE_COMMAND/` (origine immobiliare Righetto).  
> Implementazione: `guardian/` (adattato a **forzaquotidiana.it** — newsletter, allenamenti, crescita seguaci).

## Obiettivo di business (fondamento corretto)

| Righetto (origine) | Forza Quotidiana (target) |
|--------------------|---------------------------|
| Lead immobiliari, CRM, annunci | **Iscritti newsletter** (PDF scheda gratuita) |
| Conversione visita → contatto agenzia | Conversione visita → **double opt-in** → community |
| Linda / chatbot immobiliare | **Nessun bot** — trasparenza AI su contenuti |
| Database immobili Supabase | **JSON statici** + Google Sheet (email fuori repo) |
| Revenue da vendite case | Revenue futuro: schede premium, status “primi 60”, prodotti ~1 anno |

**Sequenza cognitiva invariata:**

`CONTEXT → OBSERVE → VERIFY → ASSUMPTIONS → PREMORTEM → FAILURE MODES → PRIORITIZE → ACT → VERIFY AGAIN → LEARN → NEXT CHECK`

**Entry point unico:** `node guardian/scripts/guardian.mjs run`

---

## A. Mappa architettura attuale (forzaquotidiana.it)

```
┌─────────────────────────────────────────────────────────────┐
│  GitHub repo (main) → Actions deploy-pages → GitHub Pages   │
│  DNS Serverplan → forzaquotidiana.it                        │
└─────────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
  Static HTML/CSS/JS              Google Apps Script
  data/*.json (pubblici)          Sheet Iscritti + Accessi
  img/, sitemap, llms.txt         Gmail double opt-in
         │
         ▼
  tools/*.mjs (solo dev/CI, non deployati)
  SKILL.md, SKILL-VENERDI.md (playbook agente)
         │
         ▼
  venerdi-forza-quotidiana.yml (curl 4 URL + issue checklist)
```

| Componente | Esiste | Path / nota |
|------------|--------|-------------|
| Frontend | Sì | HTML vanilla, `css/styles.css`, `js/*.js` |
| Backend | Solo GAS | `newsletter/google-apps-script.gs` |
| Database | No SQL | `data/*.json`, Sheet Google per PII |
| Auth admin | No | `/admin/` noindex, no login |
| CRM | No | — |
| GA4 / GSC API | No | GSC verificato manualmente |
| Cron GitHub | Sì | Deploy on push; venerdì 07:00 UTC |
| Monitoring | Minimo | curl settimanale, issue checklist |
| AI on-site | No bot | Regole trasparenza AI Act |

---

## B. Cosa del Guardian è riutilizzabile

| Asset Righetto | Riutilizzo FQ |
|----------------|---------------|
| `sequences/master-sequence.md` | **100%** — sequenza universale |
| `policy/autonomy.yaml` | **100%** — GREEN/YELLOW/RED/BLACK |
| `AGENT.md` | **95%** — contratto agente |
| `config/cron-matrix.yaml` | **Adattato** — scope newsletter/content al posto di leads/immobili |
| `scripts/guardian.mjs` | **Esteso** — da stub a dispatcher + adapter |
| Struttura cognitive/operativa | **100%** |

---

## C. Cosa va adattato

| Elemento | Adattamento |
|----------|-------------|
| Nome / path | `righetto-premortem-guardian` → `guardian/` |
| `skill/SKILL.md` | Categorie: newsletter, sessioni, SEO, GAS, AI transparency |
| `config/guardian.yaml` | Obiettivo: crescita iscritti, integrità funnel PDF |
| Cron matrix | `leads` → `newsletter`; rimuovere `database`, `immobili` |
| Adapter | Probe URL, GAS, JSON, sitemap, validate-page — no CRM/GA4 |
| Report | `guardian/reports/guardian-latest.{json,md}` |

---

## D. Integrazioni reali disponibili

| Integrazione | Metodo | Autonomia |
|--------------|--------|-----------|
| HTTP availability | `fetch` URL produzione | GREEN (read) |
| Newsletter page / form markup | fetch + regex | GREEN |
| GAS endpoint | HEAD/GET anonimo | GREEN |
| `data/*.json` | parse + staleness | GREEN |
| `sitemap.xml` / `llms.txt` | filesystem + date | GREEN |
| `scripts/validate-page.js` | spawn node | GREEN |
| GitHub Actions status | API (se `GITHUB_TOKEN`) | GREEN in CI |
| Sheet iscritti count | **Mancante** — adapter stub + doc | YELLOW manuale |
| GA4 / GSC API | **Mancante** | — |
| Invio newsletter | GAS manuale | RED |

---

## E. Dati / API mancanti

1. **Google Sheets API** — conteggi iscritti senza esporre email in repo  
2. **GA4** — nessuna property installata  
3. **GSC API** — solo verifica manuale in SKILL  
4. **Webhook** — nessuna infrastruttura  
5. **Test E2E** — nessun Playwright CI  

Per ciascuno: `adapters/*.mjs` espone `available: false` + istruzioni in report.

---

## F. Rischi implementazione

| Rischio | Mitigazione |
|---------|-------------|
| Cron duplicati con venerdì.yml | Un solo workflow `guardian-run.yml`; venerdì chiama `run --job weekly_strategy` |
| Loop automatici (issue spam) | Dedup issue come oggi; nessuna auto-publish |
| Falsi positivi GAS | Verifica solo HTTP + body minimo, non subscribe reale |
| Segreti in repo | Mai Sheet API key in git; solo `GITHUB_TOKEN` in Actions |
| Path Righetto vs guardian | Doctor verifica path `guardian/` |
| Over-engineering | Adapter minimali; report prima di remediation auto |

---

## G. PREMORTEM integrazione Guardian

> *"Tra 3 mesi l'integrazione Guardian è fallita. Perché?"*

| Causa | Segnale precoce | Controllo | Azione |
|-------|-----------------|-----------|--------|
| Guardian ignorato (troppo rumore) | Report sempre `ok` | Failure modes con severity | Soglie realistiche, report settimanale sintetico |
| Cron non parte | Nessun report in artifact | `guardian-run.yml` failed | Alert issue se 2 run falliscono |
| Duplica venerdì | Due issue venerdì | Issue title dedup | Un workflow orchestratore |
| Adapter inventa dati | Report con metriche GA4 | `verified_facts` vs `assumptions` | Policy anti-allucinazione in AGENT.md |
| Auto-fix rompe sito | Deploy rosso post-act | Solo GREEN in CI | YELLOW = PR/issue, mai push main |
| Sheet non integrato | `iscritti_totali` sempre null | Campo site-stats stale | Documentare input manuale venerdì |

---

## Architettura Guardian proposta

```
guardian/scripts/guardian.mjs run
        │
        ▼
  cron dispatcher (legge cron-matrix + last-runs.json)
        │
        ├── heartbeat → adapters.availability
        ├── transaction_sentinel → adapters.newsletter
        ├── site_integrity → adapters.seo
        ├── content_freshness → adapters.content
        ├── daily_premortem → tutti + premortem engine
        └── weekly_strategy → report esteso + issue hook (CI)
        │
        ▼
  master sequence → reports/guardian-latest.{json,md}
                 → memory/events.jsonl
```

---

## File modificati / nuovi

| Azione | Path |
|--------|------|
| **Nuovo** | `guardian/**` (config, scripts, adapters, sequences, policy, skill) |
| **Nuovo** | `docs/GUARDIAN-INTEGRATION.md` |
| **Nuovo** | `.github/workflows/guardian-run.yml` |
| **Modifica** | `.github/workflows/venerdi-forza-quotidiana.yml` — usa Guardian probe |
| **Modifica** | `SKILL.md` — § Guardian + obiettivo newsletter |
| **Modifica** | `.gitignore` — `guardian/reports/`, `guardian/memory/events.jsonl` |
| **Mantieni** | `deploy-pages.yml` |
| **Non toccare** | Contenuti sessioni, CSS pubblico, GAS live |

---

## Cron: mantenuti vs unificati

| Prima | Dopo |
|-------|------|
| `deploy-pages.yml` on push | **Invariato** |
| `venerdi-forza-quotidiana.yml` curl inline | **Probe delegato a Guardian**; issue checklist **mantenuta** |
| (nessuno) | `guardian-run.yml` — schedule orario, `guardian.mjs run` |

---

## Piano implementazione (fasi)

1. **Fase 1** — Scaffold `guardian/` + doctor + dispatcher stub ✅  
2. **Fase 2** — Adapter reali (availability, newsletter, content, seo, data)  
3. **Fase 3** — Premortem engine + prioritization + report  
4. **Fase 4** — GitHub Actions + integrazione venerdì  
5. **Fase 5** — Test, run, premortem post-implementazione, report finale  

Autonomia: solo **GREEN** in automazione (report, alert, issue). **YELLOW** = suggerimenti in report. **RED/BLACK** = mai automatici.
