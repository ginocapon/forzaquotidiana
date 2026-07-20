---
name: forzaquotidiana-venerdi
description: >-
  Checklist venerdì per forzaquotidiana.it: controllo sito, newsletter iscritti
  (Foglio Google), invio aggiornamenti, aggiornamento SKILL.md. Usare ogni venerdì
  o quando Gino chiede "cosa fare questa settimana" sul sito Forza Quotidiana.
---

# Forza Quotidiana — venerdì operativo

## Automazioni attive

| Cosa | Quando | Dove |
|------|--------|------|
| Issue GitHub checklist | Venerdì 09:00 CEST | `.github/workflows/venerdi-forza-quotidiana.yml` |
| Email riepilogo iscritti | Venerdì (opzionale) | Apps Script `riepilogoVenerdi()` — trigger orario su script.google.com |
| Lista iscritti + accessi scheda | Sempre | [Foglio Google](https://docs.google.com/spreadsheets/d/1i7QgrgJuO_OR076jnl2vN7KLbY_TdPHIrZXfSqjGDxA/edit) |

## Database iscritti — regola importante

**Le email NON vanno su GitHub** (repo pubblico = GDPR e privacy).

| Dato | Dove |
|------|------|
| Email, nome, consenso | Foglio **Iscritti** (Google) |
| Aperture/stampe scheda (anonime) | Foglio **Accessi scheda** (Google) |
| Solo conteggi aggregati | `data/site-stats.json` (opzionale, senza email) |

## Checklist venerdì (~30 min)

### 1. Newsletter e iscritti

1. Apri il [Foglio Google](https://docs.google.com/spreadsheets/d/1i7QgrgJuO_OR076jnl2vN7KLbY_TdPHIrZXfSqjGDxA/edit) → fogli **Iscritti** e **Accessi scheda**
2. Conta nuovi iscritti nella settimana
3. **Se hai pubblicato un articolo diario** questa settimana:
   - script.google.com → `inviaAggiornamentoATutti()` → modifica oggetto/corpo → **Esegui**
4. Rimuovi righe con risposta **DISISCRIVIMI**

### 2. Sito tecnico

- [ ] `sitemap.xml` — URL nuovi aggiunti?
- [ ] `llms.txt` — contenuti recenti?
- [ ] Link rotti: homepage → allenamenti → newsletter → scheda PDF
- [ ] Privacy/cookie coerenti se hai aggiunto form o tracking
- [ ] GitHub Pages deploy ok (ultimo push su `main`)

### 3. Contenuti settimana

- [ ] Nuova **sessione** in `/allenamenti/sessioni/`?
- [ ] Nuovo **articolo diario** (solo riflessioni, no log)?
- [ ] Statistiche trimestre aggiornate se c’è sessione nuova?

### 4. Scheda pesi A4

- [ ] `/allenamenti/schede-peso/` — esercizi allineati al trimestre?
- [ ] Stampa test: **1 foglio A4 orizzontale**, 4 quadranti leggibili

### 5. SKILL.md — migliorie

Ogni venerdì l’agente (o tu) può aggiungere in `SKILL.md` §5a o checklist:
- cosa ha funzionato
- una regola nuova appresa
- fix da ricordare

Non duplicare: una riga in **SKILL.md**, dettaglio in **NEWSLETTER-SETUP.md** se tecnico.

### 6. Aggiorna conteggio anonimo (opzionale)

In `data/site-stats.json` solo numeri, es.:
```json
{
  "iscritti_totali": 12,
  "accessi_scheda_settimana": 8,
  "ultimo_controllo": "2026-07-25"
}
```
Valori copiati manualmente dal Foglio Google — **mai email nel repo**.

## Formato risposta agente (venerdì)

```markdown
## Venerdì Forza Quotidiana — [data]

**Iscritti:** N totali (+M questa settimana) — vedi Foglio Google
**Accessi scheda:** X (7 gg)

**Da fare oggi**
- [ ] …

**Newsletter da inviare?**
- [ ] Sì — articolo: [titolo + URL]
- [ ] No — nessun contenuto nuovo

**Un solo focus se hai poco tempo**
- …
```

## Trigger Apps Script (setup una tantum)

Su script.google.com → **Trigger** (icona orologio) → Aggiungi:

| Funzione | Tipo | Giorno | Ora |
|----------|------|--------|-----|
| `riepilogoVenerdi` | Temporizzato | Venerdì | 09:00–10:00 |

Dopo ogni modifica a `google-apps-script.gs`: **Deploy → Gestisci distribuzioni → Modifica → Nuova versione**.

## Apps Script — nuove funzioni da incollare

Se il tuo script online è vecchio, aggiungi da repo `newsletter/google-apps-script.gs`:
- `doGet` — log accessi scheda
- `getAccessiSheet_` / `logAccesso_`
- `riepilogoVenerdi`
