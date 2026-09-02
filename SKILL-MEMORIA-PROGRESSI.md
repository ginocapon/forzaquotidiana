# Memoria progressi — Forza Quotidiana

> **Scopo:** cronostoria decisionale per non ripartire da zero. Leggere **prima** di rispondere a «cosa fare per migliorare il sito», «audit», «venerdì», «priorità SEO», **venerdì editoriale**.
>
> **Aggiornare:** a ogni publish significativo (sessione, batch diario, fix funnel), deploy SEO o sprint completato — 1 riga in §Log + eventuale modifica §Stato / §Prossimi passi.
>
> **Collegamenti:** `data/site-stats.json` · `data/editorial-queue.json` · `data/editorial-memory.json` · `data/performance-sessions.json` · `guardian/reports/guardian-latest.md`

---

## Trigger agente

| Utente scrive | Azione |
|---------------|--------|
| **`"FQ"`** | Piano venerdì: §Prossimi passi + `SKILL-VENERDI.md` + coda editoriale + 1 fix repo |
| **Venerdì editoriale** | `SKILL-EDITORIAL.md` + memoria + `node tools/build-editorial-memory.mjs` |
| **«Cosa fare questa settimana?»** | Rispondi da §Prossimi passi, **non** lista generica |

Dopo ogni publish diario: `node tools/build-editorial-memory.mjs` · opz. `--check eq-XXX` prima di scrivere.

---

## Stato sintetico (ultimo aggiornamento: 2 settembre 2026)

| KPI | Valore | Target | Note |
|-----|--------|--------|------|
| Guardian site_integrity | **ok** | ok | Report 26/08 |
| Sessioni documentate | **21** | +1/sett. allenamento | Include A1 31/08, B1 01/09 Blocco 1 |
| Articoli diario (catalogo) | **~23** | 3/sett. (2 tecnici + 1 goliardico) | Mix 2+1 dal 29/08 |
| Newsletter iscritti | **n/d in repo** | crescita | Foglio Google — email **mai** in repo |
| GA4 / GSC API | **assenti** | futuro | Stub Guardian — screenshot manuali |
| Obiettivo business | newsletter → prodotti | ~12 mesi | PDF scheda gratuita oggi |

---

## Linea conduttrice (sempre valida)

### Cosa fare — ordine di priorità

0. **Trigger `"FQ"`** → §Prossimi passi + `SKILL-VENERDI.md` + `editorial-queue.json`
0b. **Editoriale venerdì** → mix **2 tecnici + 1 goliardico** · leggi `data/editorial-memory.json` per saturazione cluster
1. **SOSTENERE** (futuro con GSC) — refresh pagina con impressioni alte prima di nuovo articolo simile
2. **1 modifica concreta/settimana** nel repo — mai solo teoria
3. **Sessione allenamento** — foto Zepp → WebP → pagina pro v3 (regola upload permanente)
4. **Newsletter** — conteggi da Foglio Google, mai email in repo

### Cosa NON fare (errori già commessi / tempo perso)

- Non inventare **kg, PR, FC, TSB** — solo `data/my-stats.json`, JSON performance o foto Zepp
- Non lasciare **JPEG WhatsApp** nel repo — `processa-foto-upload.mjs` + elimina upload
- Non etichettare Scheda sbagliata per rotazione saltata — chiedere/confermare A1/B1 vs S1–S4
- Non 3 articoli goliardici/settimana — max **1** goliardico; **2 tecnici** obbligatori
- Non ripetere cluster saturo (creatina + proteine + altro meme integratori) — vedi `editorial-memory.json` → `risks`
- Non push/commit senza richiesta esplicita di Gino
- Non confondere Forza Quotidiana con Righetto/index (immobiliare)

### Quando fare cosa

| Frequenza | Azione | Dove |
|-----------|--------|------|
| **Post allenamento** | Sessione + JSON performance | `SKILL-PERFORMANCE.md` |
| **Venerdì mattina** | 3 articoli diario (2+1) | `SKILL-EDITORIAL.md`, comando venerdi-editoriale |
| **Venerdì ~30 min** | Checklist newsletter + sito | `SKILL-VENERDI.md` |
| **Dopo publish diario** | `build-editorial-memory.mjs` | `data/editorial-memory.json` |
| **Ogni 6 h** | Guardian heartbeat | CI `guardian-run.yml` |
| **1° e 16° mese** | Promemoria + sync stats | Apps Script + `sync-newsletter-stats.mjs` |

---

## Allenamento — stato Blocco 1 (set 2026)

| Data | Codice | Note |
|------|--------|------|
| 28 ago | S3 trimestre | Ultima del trimestre giu-lug-ago |
| **31 ago** | **A1** | Upper — sessione saltata la settimana prima |
| **1 set** | **B1** | Lower — inizio Blocco 1 ipertrofia |

**Regole Guile:** ≥3 img/sessione, ≥1 fotorealistica con volto Gino, esercizio coerente con scheda.

---

## Editoriale — saturazione attuale

Generato da `node tools/build-editorial-memory.mjs` → **`data/editorial-memory.json`**.

Snapshot 2 set 2026 (ultimi 8 in catalogo):

| Cluster | Count / 8 | Azione |
|---------|-----------|--------|
| goliardia-culturismo | **4** | ⚠ saturo — preferire tecnico o riflessione |
| goliardia-nutrizione | **1** | ok — evitare terzo meme integratori |
| tecnico-natural | **1** | ok — priorità 2 tecnici al venerdì |
| riflessione-vita | **2** | ⚠ al limite — non aggiungere altro riflessione senza motivo |

**Proposte in coda** (`editorial-queue.json`): molte goliardiche Reddit — filtrare con memoria prima di schedulare.

---

## Automazioni e gap noti

| Sistema | Stato |
|---------|--------|
| Guardian premortem | ✅ |
| Coda editoriale JSON | ✅ |
| Memoria editoriale | ✅ (da set 2026) |
| Editorial autopilot OpenAI | ⚠️ opzionale — agente Cursor preferito |
| GA4 | ❌ |
| GSC export JSON | ❌ — screenshot manuali futuri |
| SKIMM risks in catalogo | ⚠️ parziale — estendere `build-skimm.mjs` |
| Macrociclo business 12 sett. | ☐ da pianificare |

---

## Log cronologico

| Data | Cosa | Esito |
|------|------|-------|
| 11/08/2026 | Batch goliardia iniziale (proteine, leg day, specchio) | 3 articoli cartoon |
| 16/08/2026 | Mix overtraining tecnico + trend Reddit goliardici | Coda editorial-queue |
| 26/08/2026 | Batch 26 ago: creatina dossier, Viking check-in, meme anni | + articoli tecnici/riflessione |
| 29/08/2026 | Regola **2 tecnici + 1 goliardico** in SKILL-EDITORIAL | Mix venerdì bloccante |
| 31/08/2026 | Sessione **A1** (non Scheda 4) — rotazione saltata | URL `/2026-08-31-a1/` |
| 01/09/2026 | Sessione **B1** Blocco 1 lower | Guile realistic + arcade |
| 02/09/2026 | **SKILL-MEMORIA-PROGRESSI.md** + `editorial-memory.json` + build script | Memoria da index/Righetto |

---

## Prossimi passi (per l'agente)

1. **Prossimo venerdì editoriale:** 2 articoli **tecnici** (natural 50+, periodizzazione/ipertrofia) + 1 goliardico — cluster **non** goliardia-culturismo
2. **`build-editorial-memory.mjs`** dopo ogni publish
3. **Sessioni:** mantenere ritmo Blocco 1 (A1/B1 alternati)
4. **Newsletter:** Gino aggiorna Foglio → `sync-newsletter-stats.mjs` quando chiede publish stats
5. **Futuro Q4:** `gsc-keywords-priority.json` quando GSC attivo; macrociclo 12 settimane business

---

## Appuntamento verifica

```
1. Leggi §Stato sintetico + §Prossimi passi + data/editorial-memory.json
2. Se utente chiede «cosa fare» → rispondi da §Prossimi passi
3. Dopo ogni task significativo → aggiorna Log + rigenera editorial-memory
4. Venerdì editoriale → SKILL-EDITORIAL + memoria + anti-doppioni
```
