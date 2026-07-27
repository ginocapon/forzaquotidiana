# Newsletter con Gmail (ginocapon@gmail.com)

Niente Formspree: iscrizioni e email passano da **Google Apps Script** sul tuo account Google, con **Gmail** e un **Foglio Google** per la lista iscritti.

## Come funziona (scheda ↔ mail ↔ newsletter)

| Cosa | Dove | Obbligo iscrizione? |
|------|------|---------------------|
| Scheda online + PDF | `/allenamenti/schede-peso/` | **No** — sempre pubblici |
| Newsletter | `/allenamenti/newsletter/` | Solo per ricevere avvisi email |
| PDF in allegato | Mail di benvenuto + lancio nuovo periodo | Solo per iscritti confermati |

La newsletter **non sblocca** il PDF: serve per **ricevere una mail** quando pubblichi un nuovo trimestre/ciclo o un articolo.

## Passo 1 — Foglio Google

1. Vai su [sheets.google.com](https://sheets.google.com) con **ginocapon@gmail.com**
2. Crea un foglio: **Newsletter Forza Quotidiana**
3. Nell'URL copia l'ID (la parte lunga tra `/d/` e `/edit`)

## Passo 2 — Apps Script

1. Vai su [script.google.com](https://script.google.com) → **Nuovo progetto**
2. Incolla tutto il file `newsletter/google-apps-script.gs` del repo
3. Verifica `SHEET_ID`
4. **Deploy** → **Nuova distribuzione** → tipo **App web**
   - Esegui come: **Me** (ginocapon@gmail.com)
   - Chi ha accesso: **Chiunque**
5. Copia l'URL che finisce con **`/exec`**

## Passo 3 — Collega al sito

In `allenamenti/newsletter/index.html` verifica `data-script-url` nel form.

## Cosa succede quando qualcuno si iscrive (doppio opt-in)

1. Compila il form sul sito
2. Apps Script salva email nel foglio **Iscritti** con stato **da confermare**
3. L'iscritto riceve email di **conferma**
4. Al click → stato **confermato** + email di **benvenuto** con PDF allegato (scheda attuale)
5. Tu ricevi notifica su **ginocapon@gmail.com**
6. La scheda PDF resta **sempre scaricabile** dal sito, anche senza iscrizione

> Dopo ogni modifica allo script: **Deploy → Gestisci distribuzioni → Modifica → Nuova versione**

## Pubblicare una nuova scheda (trimestre o ciclo)

1. Crea pagina scheda in `/allenamenti/schede-peso/<slug>/`
2. Genera PDF: `node tools/genera-pdf-scheda.mjs <slug> scheda-forza-quotidiana-<periodo>.pdf`
3. Aggiorna catalogo `/allenamenti/schede-peso/` e `data/schede-periodo.json`
4. In Apps Script aggiorna `SCHEDA_URL`, `SCHEDA_PDF_URL`, `SCHEDA_PDF_NOME`
5. Modifica titolo in `inviaNuovaSchedaATutti()` se serve
6. Menu **Esegui** → `inviaNuovaSchedaATutti` → invia PDF a tutti i **confermati**
7. Ripubblica lo script se hai cambiato il codice

## Inviare aggiornamento generico (articolo diario, ecc.)

1. Modifica testo in `inviaAggiornamentoATutti()`
2. Menu **Esegui** → `inviaAggiornamentoATutti`

**Limite Gmail:** ~500 destinatari al giorno con account personale.

## Disiscrizioni (automatica, un click)

Ogni email ha il link **Disiscriviti con un click** → stato **disiscritto**.

## Test

1. Sul sito live: `/allenamenti/newsletter/` → iscrizione con email secondaria
2. Verifica che `/allenamenti/schede-peso/trimestre-giugno-luglio-agosto-2026/` si apra **senza** redirect
3. Controlla foglio Google + mail benvenuto con allegato PDF

## Trigger venerdì (opzionale)

script.google.com → **Trigger** → `riepilogoVenerdi` → ogni venerdì ore 09:00.

## Reset test

### Foglio Google

Apps Script → **`resetTestIscritti`** → Esegui

### Verifica allegato PDF

Apps Script → **`testPdf`** → Registro: `PDF OK: … byte`

### Browser — stato newsletter locale

```js
localStorage.removeItem('fq_newsletter_ok');
```
