/**
 * Newsletter Forza Quotidiana — Google Apps Script
 * Account: ginocapon@gmail.com
 *
 * Funzioni GDPR:
 * - Doppio opt-in: l'iscritto conferma via email prima di ricevere newsletter
 * - Disiscrizione a un click: link in ogni email
 * - Stato iscrizione tracciato nel foglio (da confermare / confermato / disiscritto)
 *
 * SETUP (una volta):
 * 1. script.google.com → incolla questo file
 * 2. SHEET_ID già impostato sotto
 * 3. Deploy → App web → Esegui come: io · Accesso: chiunque
 * 4. Copia URL /exec in allenamenti/newsletter/index.html (data-script-url)
 * Dopo ogni modifica: Deploy → Gestisci distribuzioni → Modifica → Nuova versione
 */

var SHEET_ID = '1i7QgrgJuO_OR076jnl2vN7KLbY_TdPHIrZXfSqjGDxA';
var SITE = 'https://forzaquotidiana.it';
var TitolareEmail = 'ginocapon@gmail.com';

// Scheda corrente: pagina online + PDF allegato alla mail di benvenuto.
// Ogni nuovo trimestre aggiorna queste due righe con la nuova cartella/PDF.
var SCHEDA_URL = SITE + '/allenamenti/schede-peso/trimestre-giugno-luglio-agosto-2026/';
var SCHEDA_PDF_URL = SITE + '/allenamenti/schede-peso/trimestre-giugno-luglio-agosto-2026/scheda-forza-quotidiana-q3-2026.pdf';
var SCHEDA_PDF_NOME = 'Scheda-ForzaQuotidiana-Q3-2026.pdf';

function selfUrl_() {
  return ScriptApp.getService().getUrl();
}

function token_(email) {
  var raw = String(email).toLowerCase() + '|forzaquotidiana|' + SHEET_ID;
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
  return Utilities.base64EncodeWebSafe(bytes).replace(/=+$/, '').slice(0, 22);
}

function getSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName('Iscritti');
  if (!sh) {
    sh = ss.insertSheet('Iscritti');
    sh.appendRow(['Data', 'Nome', 'Email', 'Consenso privacy', 'Origine', 'Stato', 'Token']);
    sh.getRange(1, 1, 1, 7).setFontWeight('bold');
  }
  return sh;
}

function getAccessiSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName('Accessi scheda');
  if (!sh) {
    sh = ss.insertSheet('Accessi scheda');
    sh.appendRow(['Data', 'Tipo', 'Note']);
    sh.getRange(1, 1, 1, 3).setFontWeight('bold');
  }
  return sh;
}

function logAccesso_(tipo) {
  getAccessiSheet_().appendRow([new Date(), tipo || 'scheda_apertura', '']);
}

function findRow_(sh, email) {
  var rows = sh.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][2]).toLowerCase() === email) return i + 1;
  }
  return 0;
}

/* ---------- POST: iscrizione dal form ---------- */

function doPost(e) {
  var p = e.parameter || {};
  if (p.website) {
    return redirectAfterSubscribe_(p.email, p.next);
  }

  var email = String(p.email || '').trim().toLowerCase();
  var nome = String(p.nome || '').trim();
  var next = sanitizeNext_(p.next);

  if (!email || email.indexOf('@') === -1) {
    return redirectError_('Email non valida');
  }

  var sh = getSheet_();
  var rowIdx = findRow_(sh, email);
  var tok = token_(email);

  if (!rowIdx) {
    sh.appendRow([
      new Date(), nome, email,
      p.privacy === 'yes' ? 'sì' : '—',
      p.from || 'sito',
      'da confermare', tok
    ]);
    inviaConferma_(email, nome, tok);
    GmailApp.sendEmail(TitolareEmail, 'Nuova iscrizione (da confermare) — ' + email,
      'Nome: ' + (nome || '—') + '\nEmail: ' + email + '\nData: ' + new Date());
  } else {
    var stato = String(sh.getRange(rowIdx, 6).getValue());
    if (stato !== 'confermato') {
      sh.getRange(rowIdx, 6).setValue('da confermare');
      sh.getRange(rowIdx, 7).setValue(tok);
      inviaConferma_(email, nome, tok);
    }
  }

  return redirectAfterSubscribe_(email, next);
}

/* ---------- GET: conferma, disiscrizione, log ---------- */

function doGet(e) {
  var p = e.parameter || {};
  var email = String(p.e || '').trim().toLowerCase();

  if (p.action === 'log') {
    logAccesso_(p.tipo || 'scheda_apertura');
    return ContentService.createTextOutput('ok').setMimeType(ContentService.MimeType.TEXT);
  }

  if (p.action === 'confirm' && email && p.t === token_(email)) {
    var sh = getSheet_();
    var r = findRow_(sh, email);
    if (r) {
      sh.getRange(r, 6).setValue('confermato');
      inviaBenvenuto_(email, String(sh.getRange(r, 2).getValue()));
    }
    return htmlPage_('Iscrizione confermata',
      'Grazie! La tua iscrizione è attiva. Ti ho inviato la scheda in PDF via email. Riceverai una mail solo per nuove schede o articoli.',
      SCHEDA_URL + '?sub=1', 'Apri la scheda online');
  }

  if (p.action === 'unsub' && email && p.t === token_(email)) {
    var sh2 = getSheet_();
    var r2 = findRow_(sh2, email);
    if (r2) sh2.getRange(r2, 6).setValue('disiscritto');
    return htmlPage_('Disiscrizione completata',
      'Sei stato rimosso dalla newsletter. Non riceverai più email. Puoi reiscriverti quando vuoi.',
      SITE + '/', 'Torna al sito');
  }

  return htmlPage_('La Forza Quotidiana', 'Servizio newsletter attivo.', SITE + '/', 'Vai al sito');
}

/* ---------- Email ---------- */

function inviaConferma_(email, nome, tok) {
  var saluto = nome ? 'Ciao ' + nome + ',' : 'Ciao,';
  var confirmUrl = selfUrl_() + '?action=confirm&e=' + encodeURIComponent(email) + '&t=' + tok;
  var html =
    '<div style="font-family:Georgia,serif;max-width:560px;color:#222">' +
    '<p>' + saluto + '</p>' +
    '<p>Conferma la tua iscrizione alla newsletter de <strong>La Forza Quotidiana</strong> con un click:</p>' +
    '<p><a href="' + confirmUrl + '" style="background:#c9783a;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">Conferma iscrizione</a></p>' +
    '<p>Se non hai richiesto tu l\'iscrizione, ignora questa email: senza conferma non riceverai nulla.</p>' +
    '<p style="color:#666;font-size:12px">Gino Capon · forzaquotidiana.it</p></div>';
  GmailApp.sendEmail(email, 'Conferma la tua iscrizione — La Forza Quotidiana', '',
    { htmlBody: html, name: 'La Forza Quotidiana' });
}

function inviaBenvenuto_(email, nome) {
  var saluto = nome ? 'Ciao ' + nome + ',' : 'Ciao,';
  var unsubUrl = selfUrl_() + '?action=unsub&e=' + encodeURIComponent(email) + '&t=' + token_(email);
  var html =
    '<div style="font-family:Georgia,serif;max-width:560px;color:#222">' +
    '<p>' + saluto + '</p>' +
    '<p>Iscrizione confermata. Grazie per esserti unito a <strong>La Forza Quotidiana</strong>.</p>' +
    '<p>Trovi la <strong>scheda pesi in PDF</strong> qui allegata (4 giornate, spazio per kg e note): stampala o compilala dal telefono.</p>' +
    '<p>Preferisci usarla online? <a href="' + SCHEDA_URL + '?sub=1">Aprila qui →</a></p>' +
    '<p>Ti scriverò solo per nuove schede o articoli — niente spam.</p>' +
    footerUnsub_(unsubUrl) + '</div>';

  var options = { htmlBody: html, name: 'La Forza Quotidiana' };
  var pdf = fetchSchedaPdf_();
  if (pdf) options.attachments = [pdf];

  GmailApp.sendEmail(email, 'Benvenuto + scheda pesi PDF — La Forza Quotidiana', '', options);
}

function fetchSchedaPdf_() {
  try {
    var resp = UrlFetchApp.fetch(SCHEDA_PDF_URL, { muteHttpExceptions: true });
    if (resp.getResponseCode() === 200) {
      return resp.getBlob().setName(SCHEDA_PDF_NOME);
    }
  } catch (e) { /* PDF non ancora caricato: invio mail senza allegato */ }
  return null;
}

function footerUnsub_(unsubUrl) {
  return '<hr style="border:none;border-top:1px solid #ddd;margin:16px 0">' +
    '<p style="color:#888;font-size:12px">Gino Capon · forzaquotidiana.it<br>' +
    'Non vuoi più ricevere queste email? <a href="' + unsubUrl + '">Disiscriviti con un click</a>.</p>';
}

function htmlPage_(titolo, testo, url, cta) {
  return HtmlService.createHtmlOutput(
    '<!DOCTYPE html><html lang="it"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + titolo + '</title></head>' +
    '<body style="font-family:system-ui,Arial;background:#0c0c0c;color:#f4efe6;text-align:center;padding:3rem 1rem">' +
    '<h1 style="color:#c9783a">' + titolo + '</h1><p>' + testo + '</p>' +
    '<p><a href="' + url + '" style="color:#c9783a">' + cta + ' →</a></p></body></html>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/* ---------- Redirect dopo submit form ---------- */

function sanitizeNext_(next) {
  var path = String(next || '/allenamenti/schede-peso/').trim();
  if (path.indexOf('/allenamenti/') !== 0) return '/allenamenti/schede-peso/';
  return path;
}

function redirectAfterSubscribe_(email, next) {
  var url = SITE + sanitizeNext_(next) + '?sub=1&e=' + encodeURIComponent(email || '');
  return HtmlService.createHtmlOutput(
    '<!DOCTYPE html><html lang="it"><head><meta charset="utf-8">' +
    '<meta http-equiv="refresh" content="0;url=' + url + '"></head><body>' +
    '<p>Controlla la tua email per confermare. Reindirizzamento…</p>' +
    '<p><a href="' + url + '">Continua</a></p></body></html>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function redirectError_(msg) {
  var url = SITE + '/allenamenti/newsletter/?err=' + encodeURIComponent(msg);
  return HtmlService.createHtmlOutput('<meta http-equiv="refresh" content="0;url=' + url + '">')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/* ---------- Invio newsletter (solo confermati) ---------- */

function inviaAggiornamentoATutti() {
  var oggetto = 'Forza Quotidiana — novità sul sito';
  var sh = getSheet_();
  var rows = sh.getDataRange().getValues();
  var inviati = 0;

  for (var i = 1; i < rows.length; i++) {
    var email = String(rows[i][2]).trim();
    var stato = String(rows[i][5]);
    if (!email || email.indexOf('@') === -1 || stato !== 'confermato') continue;
    var unsubUrl = selfUrl_() + '?action=unsub&e=' + encodeURIComponent(email) + '&t=' + token_(email);
    var html =
      '<div style="font-family:Georgia,serif;max-width:560px;color:#222">' +
      '<p>Ciao,</p><p>Ho pubblicato qualcosa di nuovo su forzaquotidiana.it.</p>' +
      '<p><a href="' + SITE + '/allenamenti/">Vai agli allenamenti →</a></p>' +
      footerUnsub_(unsubUrl) + '</div>';
    GmailApp.sendEmail(email, oggetto, '', { htmlBody: html, name: 'La Forza Quotidiana' });
    inviati++;
    Utilities.sleep(1200);
  }
  Logger.log('Email inviate: ' + inviati);
}

/* ---------- Riepilogo venerdì ---------- */

function riepilogoVenerdi() {
  var rows = getSheet_().getDataRange().getValues();
  var confermati = 0, daConfermare = 0, disiscritti = 0;
  for (var i = 1; i < rows.length; i++) {
    var s = String(rows[i][5]);
    if (s === 'confermato') confermati++;
    else if (s === 'da confermare') daConfermare++;
    else if (s === 'disiscritto') disiscritti++;
  }

  var accessi = getAccessiSheet_().getDataRange().getValues();
  var weekAgo = new Date(Date.now() - 7 * 864e5);
  var nAccessi = 0;
  for (var j = 1; j < accessi.length; j++) {
    if (accessi[j][0] instanceof Date && accessi[j][0] >= weekAgo) nAccessi++;
  }

  var body =
    'Riepilogo venerdì Forza Quotidiana\n\n' +
    'Iscritti confermati: ' + confermati + '\n' +
    'Da confermare: ' + daConfermare + '\n' +
    'Disiscritti: ' + disiscritti + '\n' +
    'Accessi/stampe scheda (7 gg): ' + nAccessi + '\n\n' +
    'Foglio: https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit\n\n' +
    'Checklist: nuovo articolo? → inviaAggiornamentoATutti() · aggiorna sitemap.xml e llms.txt';

  GmailApp.sendEmail(TitolareEmail, 'Forza Quotidiana — riepilogo venerdì', body);
}

/* ---------- Test / reset (solo da editor Apps Script) ---------- */

/** Svuota iscrizioni e log accessi per ripartire da zero con i test. Esegui manualmente dall'editor. */
function resetTestIscritti() {
  var sh = getSheet_();
  var last = sh.getLastRow();
  if (last > 1) sh.deleteRows(2, last - 1);

  var acc = getAccessiSheet_();
  var lastAcc = acc.getLastRow();
  if (lastAcc > 1) acc.deleteRows(2, lastAcc - 1);

  Logger.log('Reset OK: fogli Iscritti e Accessi scheda svuotati (restano solo le intestazioni).');
}

/** Verifica download PDF + permesso UrlFetch. Registro deve dire "PDF OK: … byte". */
function testPdf() {
  var pdf = fetchSchedaPdf_();
  Logger.log(pdf ? ('PDF OK: ' + pdf.getBytes().length + ' byte') : 'PDF NON scaricato — autorizza permesso servizio esterno');
}
