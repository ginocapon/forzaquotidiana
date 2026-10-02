# Venerdì editoriale — 2 tecnici + 1 riflessione

Genera e pubblica i **3 articoli del diario** della settimana. **Nessuna API OpenAI**. Tono **caldo, simpatico, professionale** — **niente ironia, parodia, goliardia**.

## Mix obbligatorio

| # | Tipo | Immagini |
|---|------|----------|
| 1–2 | **Tecnico** — italiano, chiaro, zero ironia | `style_serio` + 1 fotoreal |
| 3 | **Riflessione** — caldo, rispettoso | `style_serio` / fotoreal — no JoJo |

## Istruzioni per l'agente

1. Leggi `SKILL-EDITORIAL.md`, `SKILL-MEMORIA-PROGRESSI.md`, `data/editorial-memory.json`, `data/editorial-skin.json`, `data/editorial-image-skin.json`
2. Esegui: `node tools/editorial-weekly.mjs run --friday`
3. Per **ogni** articolo in coda `scheduled` (max 3):
   - Tecnico: badge `Tecnico` · Riflessione: badge `Riflessione`
   - **NO** banner goliardia, **NO** satira
   - Scrivi `diario/{slug}/index.html`
   - Genera hero + 2 figure + 1 fotoreal in `img/diario/YYYY-MM-DD/`
   - Sintesi Articolo: 2–3 frasi · numeri da `data/my-stats.json` o Zepp
   - Indice diario: card con thumb 120×120
4. `node tools/editorial-weekly.mjs run --publish`
5. `node tools/build-editorial-memory.mjs`
6. Commit e push solo se Gino lo chiede (o se chiede di creare/pubblicare il crono)

## Comando utente

```
Venerdì editoriale: genera e pubblica i 3 articoli del diario (2 tecnici + 1 riflessione). Tono caldo, professionale, niente ironia.
```
