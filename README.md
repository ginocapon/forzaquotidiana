# Forza Quotidiana — sito statico Gino Capon

## Stack
- HTML/CSS/JS vanilla (no CDN esterni)
- Hosting: Serverplan + deploy da GitHub (Pages o rsync)
- Supabase: fase 2 (newsletter / richieste)

## Locale
```bash
cd forzaquotidiana
python -m http.server 8765
# http://localhost:8765/
```

## Validazione pagine
```bash
node scripts/validate-page.js --file index.html
```

## GitHub (nuovo repo consigliato)
```bash
git init
git remote add origin git@github.com:TUOUSER/forzaquotidiana.git
git add .
git commit -m "Sito iniziale La Forza Quotidiana"
git push -u origin main
```

## DNS Serverplan
- **Non modificare** record MX/cPanel senza conferma esplicita
- Punta `www.forzaquotidiana.it` al hosting scelto (GitHub Pages IP o Serverplan)
- File `CNAME` presente se usi GitHub Pages con dominio custom

## Diario — due voci
1. **Riflessione** — testo poetico / esistenziale
2. **Allenamento** — foto polaroid, pesi, misure

Alternare nel feed `/diario/` — mai un unico blocco freddo.

## Piano editoriale
Vedi piano 12 mesi concordato (mese 13 = vendita schede PDF).
