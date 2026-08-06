# Newsletter con Gmail (ginocapon@gmail.com)

Niente Formspree: iscrizioni e email passano da **Google Apps Script** sul tuo account Google, con **Gmail** e un **Foglio Google** per la lista iscritti.

## Passo 1 — Foglio Google

1. Vai su [sheets.google.com](https://sheets.google.com) con **ginocapon@gmail.com**
2. Crea un foglio: **Newsletter Forza Quotidiana**
3. Nell’URL copia l’ID (la parte lunga tra `/d/` e `/edit`):
   ```
   https://docs.google.com/spreadsheets/d/QUESTO_E_L_ID/edit
   ```

## Passo 2 — Apps Script

1. Vai su [script.google.com](https://script.google.com) → **Nuovo progetto**
2. Rinomina il progetto: `Forza Quotidiana Newsletter`
3. Cancella il codice di default e incolla tutto il file `newsletter/google-apps-script.gs` del repo
4. Sostituisci la riga:
   ```javascript
   var SHEET_ID = 'INCOLLA_QUI_ID_FOGLIO_GOOGLE';
   ```
   con l’ID del foglio del passo 1
5. **Salva** (Ctrl+S)
6. Menu **Esegui** → seleziona `getSheet_` non serve — prima esecuzione: run `doPost` no, better run nothing first
7. **Deploy** → **Nuova distribuzione** → tipo **App web**
   - Esegui come: **Me** (ginocapon@gmail.com)
   - Chi ha accesso: **Chiunque**
8. **Autorizza** l’app quando Google lo chiede (permessi Gmail + Fogli)
9. Copia l’URL che finisce con **`/exec`** e incollalo in:
   - `allenamenti/newsletter/index.html` → `data-script-url`
   - `allenamenti/schede-peso/trimestre-giugno-luglio-agosto-2026/index.html` → `data-script-url` sul `<body>`

   URL attivo (agosto 2026):
   `https://script.google.com/macros/s/AKfycbzHT-A41ZDrZcA8bEHnp8OOI-I66hIvnCP7YLx2Cr0X0zuTsPJo76-auKZnXXbQSBPjww/exec`

## Passo 3 — Collega al sito

Apri `allenamenti/newsletter/index.html` e sostituisci `YOUR_SCRIPT_ID` nell’attributo:

```html
data-script-url="https://script.google.com/macros/s/TUO_ID_QUI/exec"
```

Fai commit + push su GitHub → il sito si aggiorna in pochi minuti.

## Cosa succede quando qualcuno si iscrive (doppio opt-in)

1. Compila il form sul sito
2. Apps Script salva email nel foglio **Iscritti** con stato **da confermare**
3. L’iscritto riceve email di **conferma** con pulsante *Conferma iscrizione*
4. Al click → stato **confermato** + email di **benvenuto** (con link scheda PDF)
5. Tu ricevi notifica su **ginocapon@gmail.com**
6. Il visitatore può già scaricare la scheda; la newsletter però arriva **solo ai confermati**

> IMPORTANTE: dopo aver incollato la nuova versione dello script rifai **Deploy → Gestisci distribuzioni → Modifica → Nuova versione**, altrimenti conferma e disiscrizione non funzionano.

## Inviare aggiornamenti (nuova scheda / articolo)

1. Apri lo script su script.google.com
2. Modifica testo in `inviaAggiornamentoATutti()` (oggetto + corpo HTML)
3. Menu **Esegui** → `inviaAggiornamentoATutti`
4. Lo script manda una mail a ogni riga del foglio (pausa 1,2 s tra un invio e l’altro per limiti Gmail)

**Limite Gmail:** ~500 destinatari al giorno con account personale — più che sufficiente all’inizio.

## Disiscrizioni (automatica, un click)

Ogni email ha in fondo il link **Disiscriviti con un click**: al click lo script imposta lo stato **disiscritto** e quell’indirizzo non riceve più nulla. Nessuna azione manuale richiesta.

## Troubleshooting

### Errore `Cannot read properties of undefined (reading 'parameter')`

Se clicchi **▶ Esegui** su `doPost` nell’editor Apps Script, fallisce sempre — `doPost` riceve dati solo dal form web. Per testare dall’editor usa **`testSubscribe`** (menu funzioni → testSubscribe → Esegui).

### Il form sul sito non funziona

1. Verifica che `data-script-url` nel sito coincida con l’URL **Attivo** in Deploy → Gestisci distribuzioni (copia con «Copia»).
2. Dopo ogni modifica al codice: **Deploy → Gestisci distribuzioni → Modifica → Nuova versione** (non basta Salva).
3. Deploy: **Esegui come: Me** · **Chi ha accesso: Chiunque**.
4. Sul sito: `/allenamenti/newsletter/` → iscrizione con email reale → controlla mail di conferma.

## Test

1. Apri in una **finestra anonima** l’URL `/exec` dello script: deve mostrare la pagina scura «La Forza Quotidiana / Servizio newsletter attivo» **senza** chiedere login Google.
2. Sul sito live: `/allenamenti/newsletter/` → iscrizione con una tua email secondaria
3. Controlla foglio Google + casella di conferma
4. Verifica redirect a `/allenamenti/schede-peso/…/?sub=1` — da lì scarichi il PDF

## Errore: «Impossibile aprire il file in questo momento»

Succede quando la **distribuzione App web** non è pubblica (o è stata revocata). Il form posta a Google e Google risponde 401.

**Fix (account ginocapon@gmail.com):**

1. Vai su [script.google.com](https://script.google.com) → progetto **Forza Quotidiana Newsletter**
2. Incolla/aggiorna il codice da `newsletter/google-apps-script.gs` del repo → **Salva**
3. **Deploy** → **Gestisci distribuzioni**
   - Se esiste già un’App web: **Modifica** (matita) → **Versione: Nuova versione** → **Esegui come: Me** → **Chi ha accesso: Chiunque** → **Distribuisci**
   - Se non esiste: **Nuova distribuzione** → tipo **App web** con le stesse opzioni
4. Se Google chiede autorizzazioni → **Consenti** (Gmail + Fogli + servizi esterni)
5. Copia l’URL che finisce con **`/exec`**
6. Se l’URL è **cambiato** rispetto a quello nel sito, aggiorna `data-script-url` in:
   - `allenamenti/newsletter/index.html`
   - `allenamenti/schede-peso/trimestre-giugno-luglio-agosto-2026/index.html`
   poi commit + push
7. Ritesta l’URL `/exec` in finestra anonima (passo Test §1)

> Non basta «Salva» nello script: senza **Nuova versione** della distribuzione il sito continua a usare il vecchio deploy rotto.

## Trigger venerdì (opzionale)

script.google.com → **Trigger** → `riepilogoVenerdi` → ogni venerdì ore 09:00.

Vedi `SKILL-VENERDI.md` e issue GitHub automatica ogni venerdì.

**Demo senza script:** pulsante *accesso demo scheda* in fondo alla pagina newsletter.

## Reset test (ripartire da zero)

### Foglio Google — cancella tutte le iscrizioni

1. Apps Script → menu funzioni → **`resetTestIscritti`** → **▶ Esegui**
2. Controlla **Registro esecuzioni**: deve dire *Reset OK*
3. Nel [Foglio Google](https://docs.google.com/spreadsheets/d/1i7QgrgJuO_OR076jnl2vN7KLbY_TdPHIrZXfSqjGDxA/edit) restano solo le righe di intestazione (Iscritti + Accessi scheda)

### Verifica allegato PDF (prima di testare le mail)

1. Menu funzioni → **`testPdf`** → **▶ Esegui**
2. Se chiede permessi → **Consenti** (servizio esterno)
3. Registro: **`PDF OK: 84999 byte`** (circa) → l’allegato funzionerà

### Browser — sblocco scheda locale

```js
localStorage.removeItem('fq_newsletter_ok');
```

