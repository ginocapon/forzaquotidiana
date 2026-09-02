# Venerdì editoriale — 2 tecnici + 1 goliardico

Genera e pubblica i **3 articoli del diario** della settimana da trend **RSS r/bodybuilding**. **Nessuna API OpenAI** — usa Cursor + skin del sito.

## Mix obbligatorio

| # | Tipo | Immagini |
|---|------|----------|
| 1–2 | **Tecnico** — italiano, serio, zero parodia | Illustrazioni performance bodybuilding (`style_serio`) |
| 3 | **Goliardico** — parodia, schema attuale | Fumetto JoJo (`style_goliardico`) |

## Istruzioni per l'agente

1. Leggi `SKILL-EDITORIAL.md`, `SKILL-MEMORIA-PROGRESSI.md`, `data/editorial-memory.json`, `data/editorial-skin.json`, `data/editorial-image-skin.json`
2. Esegui: `node tools/editorial-weekly.mjs run --friday`
3. Per **ogni** articolo in coda `scheduled` (max 3):
   - **Tecnico:** badge `Tecnico`, NO banner goliardia, trend RSS tradotto/adattato in italiano
   - **Goliardico:** badge `Goliardia`, banner `.banner-goliardia`, satira sullo stesso trend pool
   - Scrivi `diario/{slug}/index.html` (template da `reference_articles` in skin)
   - Genera hero + 2 figure WebP in `img/diario/YYYY-MM-DD/` con skin corretta
   - Sintesi Articolo: 2–3 frasi dirette · numeri solo da `data/my-stats.json`
   - **Indice diario:** card con thumb 120×120 a sinistra
4. Esegui: `node tools/editorial-weekly.mjs run --publish`
5. Esegui: `node tools/build-editorial-memory.mjs` — aggiorna saturazione cluster
6. Commit e push (solo se Gino lo chiede)

## Comando utente (copia-incolla)

```
Venerdì editoriale: genera e pubblica i 3 articoli del diario (2 tecnici + 1 goliardico) secondo la skin RSS bodybuilding.
```

Trigger piano settimanale (senza publish): scrivi **`"FQ"`** → legge `SKILL-MEMORIA-PROGRESSI.md` + checklist venerdì.

## Prova singola (fuori venerdì)

```
Editoriale prova: 1 articolo tecnico da trend RSS bodybuilding — solo serio, italiano, immagini performance.
```
