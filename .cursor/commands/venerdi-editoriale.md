# Venerdì editoriale — 3 articoli goliardici

Genera e pubblica i **3 articoli del diario** della settimana. **Nessuna API OpenAI** — usa Cursor + skin del sito.

## Istruzioni per l'agente

1. Leggi `SKILL-EDITORIAL.md`, `data/editorial-skin.json`, `data/editorial-image-skin.json`
2. Esegui: `node tools/editorial-weekly.mjs run --friday`
3. Per **ogni** articolo in coda `scheduled` (max 3):
   - Scrivi `diario/{slug}/index.html` (template come articoli esistenti in `data/editorial-skin.json` → `reference_articles`)
   - Genera hero + 2 figure WebP in `img/diario/YYYY-MM-DD/` (stile fumetto JoJo, `data-ai="generated"`, marchio **Foto AI** sull'immagine, disclosure in figcaption)
   - **Indice diario:** ogni voce in `diario/index.html` deve avere miniatura `.diario-list__thumb` (fig1, 120×120) + `.diario-list__body` — come gli articoli del 16/08. Il publish automatico (`editorial-weekly.mjs`) lo fa se `paths.figures[0]` è in queue.
   - Rispetta: numeri solo da `data/my-stats.json`, banner goliardia, CTA newsletter
4. Esegui: `node tools/editorial-weekly.mjs run --publish`
5. Commit, push, PR se necessario

## Comando utente (copia-incolla)

```
Venerdì editoriale: genera e pubblica i 3 articoli goliardici del diario secondo la skin.
```
