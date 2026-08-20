# Prompt riusabile — ciclo annuale per un amico (admin)

> **Uso:** copia il blocco «PROMPT DA INCOLLARE» in una chat Cursor sul repo `forzaquotidiana`.  
> **Guida obbligatoria:** `SKILL.md` §8 (Admin — Periodizzazione e macrociclo) + § PRIORITÀ PERMANENTE Trasparenza AI.  
> **Base già pronta:** [https://forzaquotidiana.it/admin/](https://forzaquotidiana.it/admin/) · hub [periodizzazione](https://forzaquotidiana.it/admin/prototipi/periodizzazione/) · PDF sessione A1–B2.

---

## Cosa fa già il sito (non reinventare)

| Cosa | Dove |
|------|------|
| Dashboard fasi A1–B2 | `/admin/` |
| Hub anno / fasi / PDF | `/admin/prototipi/periodizzazione/` |
| PDF stampabile **una sessione** (kg e note vuoti) | `/admin/sessione/pdf/?ciclo=<id>&sessione=a1` |
| PDF metodo Blocco 1 | `/admin/metodo-blocco1/pdf/` |
| Dati macrociclo | `admin/data/macrociclo-2026-2027.json` |
| Dettaglio Blocco 1 | `admin/data/blocco-1-fase1.json` |
| Catalogo + figure SVG esercizi | `admin/data/esercizi-catalogo.json` + `admin/img/esercizi-sprite.svg` |
| Mappa esercizi | `/admin/mappa-esercizi/` |

**Regola PDF amici (SKILL §8.8):** intestazione anonima («Scheda allenamento»), riga **Atleta: _______**, **kg: _______** vuoti, sidebar con **S1–Sn / note**, fascia **Osservazioni**, A4 verticale, margini stampa **8 mm**.

---

## PROMPT DA INCOLLARE

```
Contesto repo: forzaquotidiana (sito statico). Segui SEMPRE SKILL.md — in particolare:
- § PRIORITÀ PERMANENTE Trasparenza AI (AI Act UE)
- §8 Admin — Periodizzazione e macrociclo (intero)
- §5a solo se chiediamo anche scheda pubblica A4 / newsletter (di default NO: lavoro in /admin/)

OBIETTIVO
Preparare (o adattare) un CICLO ANNUALE di allenamento per un AMICO, partendo dalla base già esistente in /admin/ (modello Gino: 4 fasi × ~13 settimane, split A1–B1–A2–B2, deload in sett. 13 di ogni fase).
Poi, in base a cosa l’amico vorrà fare, personalizziamo esercizi / focus / date — senza rompere la gerarchia MACROCICLO → MESOCICLO → MICROCICLO.

BASE DA USARE (non inventare un altro sistema)
- Dashboard: https://forzaquotidiana.it/admin/
- Hub: /admin/prototipi/periodizzazione/
- JSON: admin/data/hub-periodizzazione.json + admin/data/macrociclo-*.json (+ blocco-1-fase1.json se Fase 1)
- PDF sessione stampabile: /admin/sessione/pdf/?ciclo=<id>&sessione=a1|b1|a2|b2
- Figure SVG: esercizi-catalogo.json + esercizi-sprite.svg (+ /admin/mappa-esercizi/)

INPUT AMICO (compila / chiedi se manca — non inventare dati clinici)
- Nome da mettere SOLO in campo compilabile stampa (PDF resta anonimo di default): ________
- Età: ________ · Anni di palestra: ________ · Livello: principiante / intermedio / avanzato maturo
- Obiettivo anno (1 frase): ________
- Giorni/settimana disponibili (target 4 se possibile): ________
- Attrezzatura: multipower / manubri / cavi / leg machines / kettlebell / altro: ________
- Limiti / infortuni / no-go (se presenti): ________
- Data inizio macrociclo: ________ · Preferenza mese cambio fase: ________
- Preferenze muscolari / priorità (es. dorsali, gambe, spalle): ________
- Vuole kettlebell finisher in chiusura? sì/no
- Tone immagini: cartoon/allegoria ironica (come diario Ken) OPPURE figure tecniche sobrie SVG — scegliere: ________

COSA DEVI CONSEGNARE (ordine)
1) Brief 10 righe: struttura anno (4 fasi, date, obiettivo per fase, split A1–B2).
2) Dati tecnici: aggiornare o clonare JSON macrociclo (nuovo id anno se serve) + hub-periodizzazione.json.
3) Quattro sessioni A1 B1 A2 B2 per la PRIMA fase (o tutte le fasi se richiesto), allineate al catalogo esercizi.
4) SCHEDE STAMPABILI: ogni sessione deve aprire PDF con:
   - spazi kg vuoti (kg: _______)
   - righe serie S1–Sn compilabili
   - Note per esercizio + Osservazioni sessione in alto
   - Atleta: _______
   - niente brand/nome atleta fisso in stampa (anonimo)
   - margini 8 mm, A4 verticale, bordo inferiore non tagliato
5) FOTO / FIGURE BEN DEFINITE (obbligatorie, legate alla scheda generata):
   Per OGNI esercizio della scheda, definire in una tabella:
   | id esercizio | nome | path SVG/symbol | path eventuale img/webp | brief visuale 1 riga | stile (SVG tecnico | cartoon) | data-ai se IA |
   Regole immagini:
   - Preferire SVG sprite già in admin/img/esercizi-sprite.svg; se manca → aggiungere symbol + voce in esercizi-catalogo.json
   - Se generi illustrazioni IA: WebP in cartella dedicata (es. admin/img/amico/<slug>/), data-ai + nota trasparenza se esposte fuori admin; in admin OK come asset tecnici ma brief chiaro
   - Niente foto realistica autocelebrativa: figure chiare, leggibili in stampa B/N o a colori
   - Ogni card PDF deve mostrare la figura corretta dell’esercizio (niente placeholder generici)
6) Checklist SKILL §8.9 (macrociclo) + verifica link dashboard /admin/ alle fasi A1–B2.
7) Istruzioni stampa per l’amico (3 bullet): aprire URL PDF → stampa browser → compilare kg/note a penna.

VINCOLI PERIODIZZAZIONE (non violare senza motivo esplicito)
- Mesociclo ~12–13 settimane (modello maturo), NON 3–6 sett. tipo advanced young
- Deload = ultima settimana di ogni fase (−40% volume) — obbligatorio
- Stessi esercizi per tutta la fase; cambiano serie/reps/RIR/peso
- Kettlebell sempre ULTIMO esercizio della sessione (finisher), mai in apertura
- ~55% volume lower (gambe+polpacci) se si ribilancia: tools/rebalance-macrociclo-55.mjs dopo genera-macrociclo
- Admin = prototipo/mappa: NON pubblicare in sitemap; NON linkare da hub pubblico /allenamenti/ salvo richiesta esplicita
- Log reale pubblico resta /allenamenti/sessioni/ (solo se l’amico diventa contenuto sito — di default NO)

FLUSSO A DUE STEP (come lavoriamo)
STEP A — BASE: clona/adatta il macrociclo esistente, PDF stampabili, figure complete, pesi vuoti.
STEP B — PERSONALIZZAZIONE: quando ti diciamo cosa vuole fare l’amico (esercizi, priorità, date), aggiorni SOLO JSON + catalogo/figure + verifica PDF, senza riscrivere l’architettura.

Alla fine elenca URL concreti da aprire (dashboard, ogni PDF A1–B2, mappa esercizi) e i file toccati.
```

---

## Mini-prompt STEP B (solo personalizzazione)

Quando la base c’è già, incolla questo:

```
Abbiamo già la base ciclo annuale in /admin/ (vedi SKILL.md §8 e admin/PROMPT-CICLO-ANNUALE-AMICO.md).
L’amico vuole questo cambiamento:
- [descrivi obiettivo / esercizi / priorità / limiti / date]
Aggiorna JSON + figure/SVG mancanti + verifica PDF stampabili (kg e note vuoti).
Non cambiare l’architettura a 4 fasi × ~13 sett. / split A1–B2 senza chiedermelo.
Elenca URL PDF aggiornati e file modificati.
```

---

## Checklist rapida prima di stampare

- [ ] `/admin/` mostra le fasi con link A1–B2
- [ ] PDF: Atleta _______ · kg _______ · Note · Osservazioni
- [ ] Ogni esercizio ha figura (SVG o WebP) coerente con la scheda
- [ ] Deload sett. 13 presente in ogni fase
- [ ] Nessun nome amico hardcodato nel PDF (campo compilabile)
- [ ] `noindex` admin intatto · niente voce sitemap
