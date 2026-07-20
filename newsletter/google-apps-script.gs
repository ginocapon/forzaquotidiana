/**
 * Newsletter Forza Quotidiana — Google Apps Script
 * Account: ginocapon@gmail.com
 *
 * SETUP (una volta):
 * 1. script.google.com → Nuovo progetto → incolla questo file
 * 2. Crea foglio Google "Newsletter Forza Quotidiana" → copia ID dall'URL
 * 3. Sostituisci SHEET_ID sotto
 * 4. Deploy → App web → Esegui come: io · Chi può accedere: chiunque
 * 5. Copia URL /exec in allenamenti/newsletter/index.html (data-script-url)
 */

var SHEET_ID = '1i7QgrgJuO_OR076jnl2vN7KLbY_TdPHIrZXfSqjGDxA';
var SITE = 'https://forzaquotidiana.it';
var TitolareEmail = 'ginocapon@gmail.com';

function getSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName('Iscritti');
  if (!sh) {
    sh = ss.insertSheet('Iscritti');
    sh.appendRow(['Data', 'Nome', 'Email', 'Consenso privacy', 'Origine']);
    sh.getRange(1, 1, 1, 5).setFontWeight('bold');
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

function doGet(e) {
  var p = e.parameter || {};
  if (p.action === 'log') {
    logAccesso_(p.tipo || 'scheda_apertura');
    return ContentService.createTextOutput('ok').setMimeType(ContentService.MimeType.TEXT);
  }
  return ContentService.createTextOutput('Forza Quotidiana newsletter API').setMimeType(ContentService.MimeType.TEXT);
}

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
  var rows = sh.getDataRange().getValues();
  var exists = false;
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][2]).toLowerCase() === email) {
      exists = true;
      break;
    }
  }

  if (!exists) {
    sh.appendRow([
      new Date(),
      nome,
      email,
      p.privacy === 'yes' ? 'sì' : '—',
      p.from || 'sito'
    ]);
    inviaBenvenuto_(email, nome);
    GmailApp.sendEmail(
      TitolareEmail,
      'Nuova iscrizione newsletter — ' + email,
      'Nome: ' + (nome || '—') + '\nEmail: ' + email + '\nData: ' + new Date()
    );
  }

  logAccesso_('iscrizione');
  return redirectAfterSubscribe_(email, next);
}

function sanitizeNext_(next) {
  var path = String(next || '/allenamenti/schede-peso/').trim();
  if (path.indexOf('/allenamenti/') !== 0) {
    return '/allenamenti/schede-peso/';
  }
  return path;
}

function redirectAfterSubscribe_(email, next) {
  var path = sanitizeNext_(next);
  var url = SITE + path + '?sub=1&e=' + encodeURIComponent(email || '');
  return HtmlService.createHtmlOutput(
    '<!DOCTYPE html><html lang="it"><head><meta charset="utf-8">' +
    '<meta http-equiv="refresh" content="0;url=' + url + '">' +
    '<title>Iscrizione ok</title></head><body>' +
    '<p>Iscrizione registrata. Reindirizzamento…</p>' +
    '<p><a href="' + url + '">Clicca qui se non vieni reindirizzato</a></p></body></html>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function redirectError_(msg) {
  var url = SITE + '/allenamenti/newsletter/?err=' + encodeURIComponent(msg);
  return HtmlService.createHtmlOutput(
    '<meta http-equiv="refresh" content="0;url=' + url + '">'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function inviaBenvenuto_(email, nome) {
  var saluto = nome ? 'Ciao ' + nome + ',' : 'Ciao,';
  var html =
    '<div style="font-family:Georgia,serif;max-width:560px;color:#222">' +
    '<p>' + saluto + '</p>' +
    '<p>Grazie per esserti iscritto alla newsletter de <strong>La Forza Quotidiana</strong>.</p>' +
    '<p>Puoi subito scaricare la scheda pesi PDF (4 giornate, spazio per kg e note):</p>' +
    '<p><a href="' + SITE + '/allenamenti/schede-peso/">Apri scheda pesi →</a></p>' +
    '<p>Ti scriverò solo quando pubblico nuove schede trimestrali o articoli sul sito — niente spam.</p>' +
    '<p>Per disiscriverti rispondi a questa email con oggetto <strong>DISISCRIVIMI</strong>.</p>' +
    '<p style="color:#666;font-size:12px">Gino Capon · forzaquotidiana.it</p></div>';

  GmailApp.sendEmail(email, 'Benvenuto — scheda pesi + aggiornamenti Forza Quotidiana', '', {
    htmlBody: html,
    name: 'La Forza Quotidiana'
  });
}

/** Invio manuale newsletter a tutti gli iscritti — Esegui da editor script */
function inviaAggiornamentoATutti() {
  var oggetto = 'Forza Quotidiana — novità sul sito';
  var corpoHtml =
    '<p>Ciao,</p><p>Ho pubblicato qualcosa di nuovo su forzaquotidiana.it.</p>' +
    '<p><a href="' + SITE + '/allenamenti/">Vai agli allenamenti →</a></p>' +
    '<p style="font-size:12px;color:#666">Per disiscriverti rispondi DISISCRIVIMI.</p>';

  var sh = getSheet_();
  var rows = sh.getDataRange().getValues();
  var inviati = 0;

  for (var i = 1; i < rows.length; i++) {
    var email = String(rows[i][2]).trim();
    if (!email || email.indexOf('@') === -1) continue;
    GmailApp.sendEmail(email, oggetto, '', {
      htmlBody: corpoHtml,
      name: 'La Forza Quotidiana'
    });
    inviati++;
    Utilities.sleep(1200);
  }

  Logger.log('Email inviate: ' + inviati);
}

/** Ogni venerdì — Esegui manualmente o da trigger. Invia riepilogo a Gino. */
function riepilogoVenerdi() {
  var iscritti = getSheet_().getDataRange().getValues();
  var nIscritti = Math.max(0, iscritti.length - 1);

  var accessi = getAccessiSheet_().getDataRange().getValues();
  var nAccessiSett = 0;
  var now = new Date();
  var weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  for (var i = 1; i < accessi.length; i++) {
    var d = accessi[i][0];
    if (d instanceof Date && d >= weekAgo) nAccessiSett++;
  }

  var body =
    'Riepilogo venerdì Forza Quotidiana\n\n' +
    'Iscritti newsletter (totale): ' + nIscritti + '\n' +
    'Accessi/stampe scheda (ultimi 7 gg): ' + nAccessiSett + '\n\n' +
    'Foglio iscritti:\n' +
    'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit\n\n' +
    'Checklist:\n' +
    '- Nuovo articolo diario questa settimana? → inviaAggiornamentoATutti()\n' +
    '- Nuova sessione allenamento? → pagina in /allenamenti/sessioni/\n' +
    '- Aggiorna sitemap.xml e llms.txt\n';

  GmailApp.sendEmail(TitolareEmail, 'Forza Quotidiana — riepilogo venerdì', body);
}
