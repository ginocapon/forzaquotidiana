# SKILL — Landing Premium · Architettura · Colori · Hero Copy

> **Quando caricare:** redesign home/hub, nuova sezione marketing, hero copy, palette UI, audit estetica conversione.
>
> **Origine:** framework operativo a 3 pagine (Architetto · Designer Colori · Copy Hero) adattato a **La Forza Quotidiana** — brand personale, non SaaS commerciale.

---

## PRIORITÀ PERMANENTE — Trasparenza AI (AI Act UE)

Prima di pubblicare hero, card o visual marketing: se l’immagine è generata/abbellita con IA → etichetta `.ai-media-note` + `data-ai` + link `/trasparenza-ai/`. Notice footer obbligatorio su ogni pagina. Vedi `SKILL.md` § PRIORITÀ PERMANENTE e `.cursor/rules/ai-trasparenza.mdc`.

---

## 0. Contesto brand (non negoziabile)

| Campo | Valore |
|-------|--------|
| **Prodotto** | La Forza Quotidiana — diario + log allenamento reale |
| **Problema** | Uomini 40–65 con lavoro e famiglia: poco tempo, troppi coach da vetrina, bisogno di autenticità |
| **Pubblico** | Uomini maturi Italia, vita impegnata, sport come struttura — non bodybuilding competitivo |
| **Conversione** | Lettura diario · esplorazione allenamenti · iscrizione newsletter/scheda PDF (gratis) |
| **Tono** | Papà presente, dilettante autentico, lascito per **Ginevra** — mai hype commerciale |

**Regola:** il framework conversione si adatta al **lascito editoriale**, non a funnel e-commerce. «Prezzi» → offerta gratuita (newsletter + scheda PDF). «Social proof» → dati reali sessioni Amazfit, non recensioni inventate.

---

## 1/ L'ARCHITETTO DELLA LANDING PAGE

### Obiettivo

Ogni pagina hub (`/`, `/allenamenti/`, `/diario/`, `/chi-sono/`) deve scorrere come un'unica storia dall'alto verso il basso — ogni sezione prepara la successiva.

### Architettura obbligatoria — Home `/`

| # | Sezione | Classe CSS | Scopo | Transizione verso |
|---|---------|------------|-------|-------------------|
| 1 | **Hero** | `.hero` + `.hero__trust` | Headline ≤8 parole, CTA primario, elemento fiducia | Pain point |
| 2 | **Pain point** | `.landing-pain` | 3 frustrazioni del pubblico target | Soluzione |
| 3 | **Soluzione** | `.landing-solution` | Svelamento «La Forza Quotidiana» come risposta | Benefici |
| 4 | **Funzionalità → benefici** | `.landing-benefits` + `.benefit-card` | Diario / Allenamenti / Chi sono come valore, non feature | Prova sociale |
| 5 | **Prova sociale** | `.landing-proof` + `.proof-stat` | Numeri verificabili (sessioni, anni, articoli) | Offerta |
| 6 | **Offerta** | `.landing-offer` + `.newsletter-cta` | Newsletter + scheda PDF trimestre (gratis) | CTA finale |
| 7 | **CTA finale** | `.landing-cta-final` | Chiusura emotiva + doppio pulsante | Footer |

### Architettura ridotta — Hub secondari

| Pagina | Sezioni minime |
|--------|----------------|
| `/allenamenti/` | Hero hub → 3 blocchi hub-card → galleria foto → scheda PDF → newsletter |
| `/diario/` | Hero portrait → intro Ginevra → elenco `.diario-list` (miniatura + titolo) |
| `/chi-sono/` | Hero portrait → dedicatio → storia → CTA diario/allenamenti |

### Regole scroll irresistibile

1. **Ogni H2** risponde a una domanda implicita del visitatore («Perché dovrei restare?», «Cosa ottengo?», «Perché crederti?»).
2. **Alternanza densità:** hero arioso → pain compatto → solution con citazione → griglia benefici → stats in riga → box offerta → CTA finale scuro.
3. **Un solo CTA primario per viewport** — non competere con 3 pulsanti uguali.
4. **Dedicatio Ginevra** resta nel flusso (dopo pain o dentro solution) — è il differenziatore emotivo.
5. **Separazione mondi:** Diario ≠ Allenamenti sempre visibile nelle benefit-card.

### Markup home (scheletro)

```html
<main class="home-main">
  <section class="hero">… + <p class="hero__trust">…</p></section>
  <section class="landing-pain page-veiled-band">…</section>
  <section class="landing-solution page-veiled-band">…</section>
  <section class="landing-benefits page-veiled-band">…</section>
  <section class="landing-proof page-veiled-band">…</section>
  <section class="landing-offer page-veiled-band">…</section>
  <section class="landing-cta-final">…</section>
</main>
```

---

## 2/ IL DESIGNER DEI COLORI

### Sistema colori premium — La Forza Quotidiana

Palette scura con accento ambra/cobre: **fiducia** (blu notte CTA), **desiderio** (ambra calda), **urgenza sobria** (cobre su sfondo nero).

| Token | Hex / valore | Ruolo | Psicologia |
|-------|--------------|-------|------------|
| `--color-primary` | `#c9783a` | Accento brand, tagline, link caldi | Calore, maturità, forza senza aggressività |
| `--color-accent-warm` | `#f0c090` | Highlight testo hero, hover link | Desiderio, aspirazione accessibile |
| `--color-accent-trust` | `#1e3a52` | CTA primario, pulsanti azione | Autorità, stabilità, serietà |
| `--color-bg` | `#0c0c0c` | Sfondo pagina | Premium, focus, contrasto |
| `--color-surface` | `#161616` | Superfici secondarie | Profondità senza rumore |
| **Testo primario** | `#f4efe6` (`--text`) | H1, body principale | Leggibilità calda su scuro |
| **Testo secondario** | `#ddd5c9` | Lead, paragrafi sezione | Gerarchia morbida |
| **Testo muted** | `#a39a90` (`--muted`) | Meta, caption, label | Informazione di supporto |

### Gradiente hero

```css
--hero-gradient: linear-gradient(
  to top,
  rgba(12, 12, 12, 0.96) 8%,
  rgba(12, 12, 12, 0.42) 48%,
  rgba(201, 120, 58, 0.12) 72%,
  rgba(12, 12, 12, 0.55) 100%
);
```

Direzione **dal basso verso l'alto**: testo leggibile in basso, alone ambrato al centro (desiderio), scuro in alto (mistero/premium).

### Gerarchia testo (obbligatoria)

| Livello | Uso | Stile |
|---------|-----|-------|
| H1 hero | Headline conversione | `clamp(1.75rem, 5vw, 2.75rem)`, peso 800, max 16ch |
| H2 sezione | Titolo blocco landing | `clamp(1.35rem, 3vw, 1.85rem)` |
| Lead | Sottotitolo hero | max 42ch, `#ddd5c9` |
| Tagline | Sopra H1 | `--color-primary`, uppercase, letter-spacing 0.12em |
| Trust | Sotto CTA hero | `.hero__trust`, muted, icona check opzionale |

### Panel Relief (già in `SKILL.md` §0.1)

Tutti i riquadri landing usano il sistema **Panel Relief 3D dorato** — mai bordi piatti `1px solid var(--line)`.

Classi landing che estendono il rilievo: `.benefit-card`, `.proof-stat`, `.landing-offer .newsletter-cta`.

### Regole agente colore

1. CTA primario → `--cta-bg` / `--color-accent-trust` (blu notte).
2. Accento caldo → link, tagline, bordi highlight — mai per body lungo.
3. Contrasto WCAG AA: testo su `--bg` ≥ 4.5:1; CTA bianco su blu notte ≥ 4.5:1.
4. Sezione CTA finale → sfondo più scuro + gradiente ambra laterale (`.landing-cta-final`).

---

## 3/ IL COPY DELLA HERO

### Vincoli numerici (BLOCCANTI)

| Elemento | Max parole | Note |
|----------|------------|------|
| **Headline** | 8 | Beneficio o outcome, non descrizione prodotto |
| **Sottotitolo** | 20 | Pubblico + differenziatore |
| **CTA bottone** | 4 | Verbo imperativo |
| **Trust element** | — | Nome · età · prova sociale verificabile |

### 5 varianti hero — Home (ordinate per conversione prevista)

#### Variante 1 — **Vincitrice prevista** ⭐

| Campo | Testo |
|-------|-------|
| Headline | **Forza in palestra. Forza nella vita.** (6) |
| Sottotitolo | Diario reale per uomini maturi: equilibrio tra lavoro, famiglia e sport — senza coach da vetrina. (16) |
| CTA | Leggi il Diario (3) |
| Trust | Gino Capon · 57 anni · 10+ anni di palestra |

**Perché vince:** doppio parallelismo mnemonico (palestra/vita), outcome immediato, filtra il pubblico (uomini maturi), trust concreto senza hype.

#### Variante 2

| Campo | Testo |
|-------|-------|
| Headline | Allenarsi per essere forti nella vita (6) |
| Sottotitolo | Un papà di 57 anni documenta costanza, sacrificio e equilibrio — per sé e per Ginevra. (15) |
| CTA | Scopri di più (3) |
| Trust | Percorso reale · non coaching commerciale |

**Psicologia:** identificazione con la figura paterna; meno punch della #1.

#### Variante 3

| Campo | Testo |
|-------|-------|
| Headline | Niente vetrina. Solo disciplina reale. (5) |
| Sottotitolo | Log allenamento, riflessioni e dati Amazfit — documentati giorno per giorno da un dilettante autentico. (14) |
| CTA | Vai agli Allenamenti (3) |
| Trust | 6+ sessioni documentate con export Zepp |

**Psicologia:** contrasto anti-hype forte; CTA spinge allenamenti, non diario.

#### Variante 4

| Campo | Testo |
|-------|-------|
| Headline | Il tuo equilibrio inizia qui (5) |
| Sottotitolo | Sport, lavoro e famiglia: un diario onesto per chi non ha tempo per fuffa motivazionale. (15) |
| CTA | Apri il Diario (3) |
| Trust | Dedicato a Ginevra — lascito di un papà presente |

**Psicologia:** invito soft; meno specifico sul fitness.

#### Variante 5

| Campo | Testo |
|-------|-------|
| Headline | Costruisci forza. Ogni singolo giorno. (5) |
| Sottotitolo | Diario e allenamenti di Gino Capon: dieci anni in palestra, zero promesse estetiche. (14) |
| CTA | Inizia ora (2) |
| Trust | forzaquotidiana.it · dal 2026 |

**Psicologia:** ritmo ternario; «Inizia ora» generico per brand non commerciale.

### Hero per pagine secondarie

| Pagina | Headline | CTA |
|--------|----------|-----|
| `/allenamenti/` | Tre blocchi, tutto chiaro (4) | Apri trimestre (2) |
| `/diario/` | Pensieri e vita (3) | — (scroll elenco) |
| `/chi-sono/` | Chi sono (2) | Apri il Diario (3) |

### Regole copy agente

1. H1 home = variante #1 salvo A/B test esplicito.
2. Mai headline oltre 8 parole — spostare il dettaglio nel sottotitolo.
3. CTA primario = Diario (cuore editoriale); secondario = Chi sono o Allenamenti.
4. Trust sempre con **dati verificabili** — aggiornare quando cambiano sessioni/articoli.
5. **Ginevra** nel copy emotivo (dedicatio, variante 2/4), non necessariamente in headline.

---

## 4. Checklist implementazione

### Nuova pagina hub

- [ ] Architettura §1 rispettata (7 sezioni home / ridotta hub)
- [ ] Palette §2 — token CSS, gradiente hero, Panel Relief
- [ ] Hero copy §3 — limiti parole, trust element
- [ ] Mobile-first 375px — una colonna, CTA full-width su mobile
- [ ] `styles.css?v=N` bump su **tutte** le pagine
- [ ] Nessun claim commerciale non verificabile

### Audit estetica periodico

- [ ] Ogni sezione ha H2 distintivo
- [ ] Flusso scroll: pain → solution → benefit → proof → offer → CTA
- [ ] Hub-card e benefit-card con hover Panel Relief
- [ ] Contrasto Lighthouse ≥ 4.5:1 su link e CTA

---

## 5. File correlati

| File | Ruolo |
|------|-------|
| `css/styles.css` | Token colore, classi `.landing-*`, `.hero__trust`, `.benefit-card`, `.proof-stat` |
| `index.html` | Implementazione completa architettura §1 |
| `allenamenti/index.html` | Hub ridotto + offerta newsletter |
| `SKILL.md` §0 | Anima brand, Panel Relief, cometa hero |
| `SKILL-SEO-GEO.md` | Title/meta, non duplicare H1 in title |

---

## 6. Cosa NON fare

| Errore | Motivo |
|--------|--------|
| Headline da 15+ parole | Abbatte conversione mobile, viola §3 |
| Sezione «prezzi» commerciale | Non è un prodotto a pagamento |
| Testimonial inventati | Solo dati reali Gino / sessioni loggate |
| Colori fuori palette | Rompe coerenza premium scura |
| Card piatte senza Panel Relief | Violare `SKILL.md` §0.1 |
| CTA competizione (3 primari uguali) | Un focus per viewport |
