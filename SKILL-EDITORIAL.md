---
name: forzaquotidiana-editorial
description: >-
  Pipeline editoriale settimanale — venerdì: 2 articoli tecnici + 1 riflessione.
  Tono caldo, simpatico e professionale. Niente ironia, parodia, goliardia.
---

# SKILL-EDITORIAL — Venerdì: 2 tecnici + 1 riflessione

> **Quando caricare:** generazione articoli diario, venerdì editoriale, discovery RSS bodybuilding, immagini.
>
> **Entry point:** `node tools/editorial-weekly.mjs run [--friday|--generate|--publish|--autopilot]`

## Obiettivo unico

- Aumentare **visite organiche** e **iscrizioni newsletter**
- **ZERO** vendita, prodotti, funnel aggressivo, sponsor integratori

## Mix settimanale (BLOCCANTE — dal 2/10/2026)

Ogni venerdì, da **RSS r/bodybuilding** (+ r/Fitness fallback) **e** dalla settimana reale di Gino:

| # | Tipo | Quantità | Lingua | Tono | Immagini |
|---|------|----------|--------|------|----------|
| 1–2 | **Tecnico** | 2 | Italiano | Chiaro, utile, accogliente, **zero ironia** | `style_serio` + 1 fotoreal |
| 3 | **Riflessione** | 1 | Italiano | Caldo, simpatico, professionale — **non sarcastico** | `style_serio` / fotoreal — **niente fumetto JoJo** |

**Tono unico (tutti e 3):** carino, simpatico, rispettoso del lettore. Si può sorridere. **Non** si prende in giro il lettore, Reddit, i pro, i farmaci, l’età. Niente università immaginaria, niente meme, niente parodia.

- Badge tecnico: `entry__type--tec` → **Tecnico**
- Badge riflessione: `entry__type--rif` → **Riflessione**
- **Niente** `.banner-goliardia` sui nuovi articoli
- Escludere Daily Discussion / Newbie Tuesday / megathread

## Regole bloccanti

1. **Numeri** (kg, PR, FC, TSB): solo da `data/my-stats.json`, JSON performance o screenshot Zepp.
2. **Finzione:** vietata nei nuovi pezzi. Gli articoli goliardici già pubblicati restano in archivio.
3. **Immagini:** 1 hero 19:9 WebP + ≥2 figure **nuove**; **≥1 fotoreal** (`*-realistic.webp`, viso Gino se è lui). Marchio **Foto AI** + `data-ai` + `/trasparenza-ai/`.
4. **Anti-doppioni:** `node scripts/check-doppioni.mjs` prima di pubblicare.
5. **CTA:** solo newsletter (`from=articolo-{slug}`).
6. **Continuità:** `SKILL-MEMORIA-PROGRESSI.md` + `data/editorial-memory.json` prima di scrivere.

## Sequenza

`CONTEXT → OBSERVE → VERIFY → CONTINUITÀ → PRIORITIZE (max 3) → ACT → PUBLISH → LEARN`

```bash
node tools/sync-my-stats.mjs
node tools/editorial-weekly.mjs run --friday
node tools/editorial-weekly.mjs run --publish
node tools/build-editorial-memory.mjs
```

## FASE 5 — ACT contenuto

- 1500–2500 parole utili
- Title ≤60, meta ≤160, H1 ≠ title
- 8–12 H2/H3; box «Sintesi Articolo» 2–3 frasi dirette
- FAQ 4–6 + JSON-LD
- Internal links min 3: `/diario/`, `/allenamenti/`, `/chi-sono/`
- Path: `diario/{slug}/index.html`
- **Vietato:** ironia, affiliazioni, «Trasparenza totale», parentesi difensive nei titoli

## Indice diario

Card con thumb a sinistra (come dal 11 agosto). `run --publish` via `addToDiarioIndex()`.

## Immagini

| Tono | Skin | Stile |
|------|------|-------|
| tecnico / riflessione | `style_serio` | Editoriale performance, **NO fumetto** |
| Mix obbligatorio | `style_fotoreal` | ≥1 fotoreal per articolo |

Template banner goliardia: **non usare** sui pezzi nuovi.

## Venerdì — comando utente

```
Venerdì editoriale: genera e pubblica i 3 articoli del diario (2 tecnici + 1 riflessione). Tono caldo, professionale, niente ironia.
```

Nessuna API OpenAI. Autopilot resta opzionale (`docs/EDITORIAL-AUTOPILOT-SETUP.md`).
