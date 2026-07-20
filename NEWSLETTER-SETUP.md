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
9. Copia l’URL che finisce con **`/exec`** (es. `https://script.google.com/macros/s/AKfycb.../exec`)

## Passo 3 — Collega al sito

Apri `allenamenti/newsletter/index.html` e sostituisci `YOUR_SCRIPT_ID` nell’attributo:

```html
data-script-url="https://script.google.com/macros/s/TUO_ID_QUI/exec"
```

Fai commit + push su GitHub → il sito si aggiorna in pochi minuti.

## Cosa succede quando qualcuno si iscrive

1. Compila il form sul sito
2. Apps Script salva email nel foglio **Iscritti**
3. L’iscritto riceve email di **benvenuto** da Gmail (con link scheda PDF)
4. Tu ricevi notifica su **ginocapon@gmail.com**
5. Il visitatore torna al sito con la scheda PDF sbloccata

## Inviare aggiornamenti (nuova scheda / articolo)

1. Apri lo script su script.google.com
2. Modifica testo in `inviaAggiornamentoATutti()` (oggetto + corpo HTML)
3. Menu **Esegui** → `inviaAggiornamentoATutti`
4. Lo script manda una mail a ogni riga del foglio (pausa 1,2 s tra un invio e l’altro per limiti Gmail)

**Limite Gmail:** ~500 destinatari al giorno con account personale — più che sufficiente all’inizio.

## Disiscrizioni

L’iscritto risponde **DISISCRIVIMI** alla newsletter. Tu elimini la riga dal foglio Google manualmente.

## Test

1. Sul sito live: `/allenamenti/newsletter/` → iscrizione con una tua email secondaria
2. Controlla foglio Google + casella di benvenuto
3. Verifica redirect a `/allenamenti/schede-peso/` e stampa PDF

**Demo senza script:** pulsante *accesso demo scheda* in fondo alla pagina newsletter.

## Reset test (browser)

```js
localStorage.removeItem('fq_newsletter_ok');
```
