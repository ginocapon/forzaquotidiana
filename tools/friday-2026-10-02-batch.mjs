#!/usr/bin/env node
/**
 * Batch editoriale venerdì 2026-10-02 — 2 tecnici + 1 riflessione
 * Tono caldo, simpatico, professionale. Niente ironia.
 * node tools/friday-2026-10-02-batch.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT, readJson, writeJson, todayISO } from "../scripts/lib/editorial-utils.mjs";
import { renderDiarioHtml } from "./render-diario-html.mjs";

const DATE = "2026-10-02";
const AGE = 57;
const TRAINING_YEARS = 10;
const TRAINING_START = 2016;

const QUEUE_ITEMS = [
  {
    slug: "cardio-tapis-riposo-attivo-57-anni",
    tone: "tecnico",
    fiction: false,
    cluster: "tecnico-cardio",
    kw_primary: "cardio tapis giorni riposo natural",
    trending_title: "Cardio tapis come riposo attivo",
    target_week: DATE,
    discovery_score: 0.99,
    intent: "Primo slot tapis: zone FC, passo, recupero attivo dopo i pesi",
  },
  {
    slug: "sonno-corto-allenamento-maturo-57-anni",
    tone: "tecnico",
    fiction: false,
    cluster: "tecnico-recupero",
    kw_primary: "sonno corto allenamento over 50",
    trending_title: "Sonno corto e carico maturo",
    target_week: DATE,
    discovery_score: 0.98,
    intent: "Come regolare il carico dopo una notte breve, numeri Zepp 1 ottobre",
  },
  {
    slug: "camminare-giorni-senza-pesi-57-anni",
    tone: "riflessione",
    fiction: false,
    cluster: "riflessione-vita",
    kw_primary: "camminata giorni riposo palestra",
    trending_title: "Camminare nei giorni senza pesi",
    target_week: DATE,
    discovery_score: 0.97,
    intent: "Rituale caldo e professionale nei giorni off",
  },
];

function buildPaths(slug) {
  const base = slug.replace(/-57-anni$/, "");
  return {
    html: `diario/${slug}/index.html`,
    hero: `img/diario/${DATE}/${base}-hero.webp`,
    figures: [
      `img/diario/${DATE}/${base}-fig1.webp`,
      `img/diario/${DATE}/${base}-fig2.webp`,
    ],
    realistic: `img/diario/${DATE}/${base}-realistic.webp`,
  };
}

const ARTICLES = {
  "cardio-tapis-riposo-attivo-57-anni": {
    title: "Cardio tapis nei giorni di riposo | Gino",
    meta_description:
      "Il 1 ottobre 2026 Gino (57) ha fatto 1,30 km sul tapis in 21': FC 123/135, zona aerobica 76%, carico 55. Riposo attivo, non corsa da record.",
    h1: "Riposo attivo sul tapis: zone, passo e perché conta",
    og_title: "Cardio tapis nei giorni di riposo — natural 57 anni",
    breadcrumb: "Cardio tapis riposo attivo",
    aeo_label: "Sintesi Articolo",
    aeo_lead: `Il <strong>1 ottobre 2026</strong> ho fatto il primo slot cardio sul tapis: <strong>1,30 km in 21:00</strong>, frequenza <strong>123/135</strong>, zona aerobica <strong>76%</strong> (16 minuti), carico allenamento <strong>55</strong>. Non è una corsa da record: è movimento gentile il giorno dopo i pesi. Dati in <a href="/allenamenti/">Allenamenti</a>, contesto in <a href="/chi-sono/">Chi sono</a> e nel <a href="/diario/">Diario</a>.`,
    realistic_alt: "Gino Capon, 57 anni, cammina sul tapis in palestra — foto editoriale fotorealistica",
    realistic_caption: "Tapis · Riposo attivo · Natural 57 anni",
    hero_alt: "Illustrazione tecnica: tapis, zone di frequenza e passo aerobico per atleta maturo",
    hero_caption: "Il tapis come appuntamento col cuore, non come esame di velocità.",
    sections: [
      {
        h2: "Perché un tapis dopo i pesi non è un ripiego",
        paragraphs: [
          `Il 30 settembre ho chiuso una B1. Il 1 ottobre, alle 20:01, non ho aperto un’altra scheda pesi: ho acceso il tapis. A ${AGE} anni questo non è «non aver voglia di allenarsi». È una scelta di <strong>riposo attivo</strong>: il corpo si muove, il cuore lavora in zona comoda, le gambe non ricevono un altro carico di forza.`,
          `Nel <a href="/diario/">Diario</a> scrivo spesso di costanza. Costanza non significa ogni giorno lo stesso stimolo. Significa presentarsi. Il tapis, in un giorno senza bilanciere, è un modo rispettoso di presentarsi: non eroico, non teatrale, utile. Chi vuole i log delle sessioni li trova in <a href="/allenamenti/">Allenamenti</a>; qui spiego come li leggo.`,
          `Dieci anni dal ${TRAINING_START} mi hanno insegnato una cosa semplice: il muscolo cresce anche quando il cuore fa un lavoro pulito e il sistema nervoso non viene spremuto due sere di fila. Il tapis, usato così, è un alleato — non un piano B.`,
        ],
      },
      {
        h2: "Cosa dicono i numeri del 1 ottobre",
        paragraphs: [
          `Durata <strong>21:00</strong>, distanza <strong>1,30 km</strong>, passo medio <strong>16:02/km</strong>. Frequenza media <strong>123</strong>, massima <strong>135</strong>. Calorie <strong>190</strong>. Carico della sessione <strong>55</strong> (lo sforzo del giorno sul modulo Zepp era 25: due numeri diversi, non da mescolare).`,
          `Zone: aerobica <strong>76%</strong> per 16:00, intensiva 13% per 2:52, anaerobica 10% per 2:06, VO2max 0. Effetto aerobico 2,4 (Medio), anaerobico 0,2 (nessun effetto). TSB <strong>−4 Bilanciato</strong>, CTL 37, ATL 41.`,
          `Questi numeri non sono un voto. Sono un ritratto. Dicono: hai camminato, hai tenuto il cuore in una zona che si può ripetere, non hai costruito un debito anaerobico. Per un dilettante natural a ${AGE} anni è esattamente il ritratto che cercavo.`,
        ],
      },
      {
        h2: "Passo 13'40\" vs media 16'02\": due storie nello stesso file",
        paragraphs: [
          `Il primo chilometro è uscito a <strong>13:40</strong> con FC 125. Gli ultimi 300 metri a circa <strong>23:42</strong> con FC 122. La media 16:02 mescola un tratto di cammino deciso e un raffreddamento lento. Se guardassi solo la media, penserei di essere stato «lento». Se guardo gli split, capisco di aver fatto un km onesto e poi di aver lasciato andare.`,
          `È una lezione utile per chi si allena dopo i cinquanta: il file Zepp racconta una storia se lo leggi per intero. Il passo best 11:45/km esiste nel report, ma non è il passo della sessione. Il passo vero del lavoro è il primo km. Il resto è uscita gentile dal tapis.`,
          `Non inseguo il passo da runner. Inseguo un cuore che resta in zona aerobica e un gesto che posso ripetere la settimana dopo senza sporcare il recupero dei pesi. Il profilo è in <a href="/chi-sono/">Chi sono</a>: dilettante autentico, non atleta da gara su strada.`,
        ],
      },
      {
        h2: "Zone FC: il 76% aerobico è il punto, non il compromesso",
        paragraphs: [
          `Sedici minuti su ventuno in zona aerobica. Zero VO2max. Effetto anaerobico nullo. Se l’obiettivo fosse «farsi male», il file sarebbe un fallimento. L’obiettivo era il contrario: stimolo cardiaco pulito, senza copiare l’intensità di una B1.`,
          `A ${AGE} anni la zona aerobica è un terreno di lavoro, non un parcheggio. Aiuta il recupero, tiene il gesto delle gambe vivo, ricorda al sistema che il movimento esiste anche senza manubri. Lo stesso diario, nel pezzo <a href="/diario/overtraining-recupero-50-anni-57-anni/">overtraining e recupero</a>, insiste su questo equilibrio.`,
          `Cadenza media 92, massima 141. Tempo di contatto al suolo 403 ms. Sono dati da cammino, non da corsa. Li lascio lì: servono a non confondere questo slot con un interval training. Il tapis qui è un tappeto, non una pista.`,
        ],
      },
      {
        h2: "Carico 55 e TSB −4: dove sta il riposo attivo",
        paragraphs: [
          `Carico 55 è il lavoro della sessione. TSB −4 con etichetta Bilanciato dice che fatica recente e forma cronica sono vicine, senza allarme. CTL 37 e ATL 41 descrivono un atleta che si allena con regolarità, non un atleta fresco da vacanza né uno in debito profondo.`,
          `Riposo attivo, per me, significa: muoversi abbastanza da favorire circolazione e umore, poco abbastanza da non copiare il volume dei pesi. Il tapis di 21 minuti sta in quella fascia. Non sostituisce un deload. Non sostituisce una notte di sonno. Completa la settimana.`,
          `Chi legge i log in <a href="/allenamenti/">Allenamenti</a> vede la sequenza: B1 il 30 settembre, cardio la sera del 1 ottobre. Due stimoli diversi in due giorni. Questa è periodizzazione casalinga, non un programma da vendere.`,
        ],
      },
      {
        h2: "FC media 123: simile ai pesi, massima più bassa",
        paragraphs: [
          `La media 123 non è lontana da molte sessioni di forza. La differenza sta nella massima: 135. Sui pesi, quando una serie è seria, la punta sale di più. Sul tapis di quel giovedì la curva è rimasta stretta. Il cuore ha lavorato, non ha picchiato.`,
          `È un dettaglio che mi piace. Significa che posso usare il cardio come igiene, non come secondo allenamento pesante mascherato. Se la massima salisse verso zone alte per venti minuti, starei facendo un altro sport — e dovrei trattarlo come tale, con recupero dedicato.`,
          `Non invento soglie da laboratorio. Leggo lo schermo Zepp e confronto me stesso. Dieci anni di palestra dal ${TRAINING_START} mi hanno dato un occhio: so quando sto costruendo e quando sto solo accumulando rumore.`,
        ],
      },
      {
        h2: "Cosa non chiedo al tapis a 57 anni",
        paragraphs: [
          `Non chiedo un record sul km. Non chiedo di «bruciare» il giorno dopo i pesi. Non chiedo di copiare i thread di chi fa 40 minuti di incline walk tutti i giorni in prep da gara. Io non gareggio. Cammino.`,
          `Non chiedo al tapis di sostituire il sonno. Quella sera arrivavo da una notte corta — ne parlo nel pezzo companion di questa settimana. Il cardio non ripara una notte. Può però tenermi nella routine: slot, gesto, chiusura della giornata con qualcosa di buono.`,
          `Non chiedo numeri da vendere. Questo sito cresce con la newsletter e con articoli utili, non con promesse. Se un lettore over 50 cerca un modo gentile di muoversi nei giorni off, il tapis a passo da cammino è una risposta onesta. Se cerca una scheda da copiare al grammo, meglio partire da <a href="/allenamenti/">Allenamenti</a> e da <a href="/chi-sono/">Chi sono</a>.`,
        ],
      },
      {
        h2: "Calorie 190: un dato, non un obiettivo",
        paragraphs: [
          `Il report segna <strong>190 kcal</strong>. Lo riporto perché è sul file, non perché stia cacciando calorie. A ${AGE} anni inseguire il tapis per «bruciare» è il modo più rapido per odiare il cardio e per sporcare il recupero dei pesi. Il cibo e il sonno decidono il peso più di ventun minuti sul nastro.`,
          `Uso le calorie come controllo di realtà: 190 in zona aerobica è un lavoro piccolo e ripetibile. Se un giorno vedessi 400 kcal con massima a 160, saprei di aver fatto un altro mestiere. Quel giovedì no. Cuore a 123, punta a 135, zona pulita.`,
          `Nel <a href="/diario/">Diario</a> non vendo deficit. Racconto un dilettante che preferisce un file noioso e sostenibile a un file spettacolare e irripetibile. Chi cerca schede e log va in <a href="/allenamenti/">Allenamenti</a>; chi vuole il perché resta qui.`,
        ],
      },
      {
        h2: "Come leggere Zepp senza diventare ossessivi",
        paragraphs: [
          `Apro il report, copio i numeri verificati, chiudo. Non rincorro ogni centimetro di oscillazione (6,0 cm in quel file) né ogni millisecondo di contatto al suolo. Servono se un giorno il gesto diventa strano. Non servono per giudicare una serata di cammino.`,
          `La regola che mi tengo: tre sguardi. Zone, frequenza, come mi sono sentito. Se i tre si parlano, ok. Se il file è «bello» e io sono distrutto, ascolto me. Se io sto bene e il file è spento, ascolto il file e non aggiungo volume per orgoglio.`,
          `Dieci anni dal ${TRAINING_START} mi hanno tolto l’urgenza di trasformare ogni sessione in contenuto. Questo articolo esiste perché il primo slot tapis merita una spiegazione chiara, non perché ogni tapis futuro diventi un saggio. Il prossimo può restare un rigo nei log.`,
        ],
      },
      {
        h2: "Come lo inserisco nella settimana",
        paragraphs: [
          `Regola personale, non prescrizione: dopo una lower, il giorno successivo può essere tapis o cammino, non un’altra lower «perché mi sento bene». Se TSB resta intorno allo zero e il sonno è decente, il tapis resta corto e aerobico. Se il sonno è un disastro e le gambe sono pesanti, accorcio ancora — o cammino in casa.`,
          `Il mix di questa settimana nel <a href="/diario/">Diario</a> sta qui: un pezzo sul tapis, uno sul sonno corto, uno sul camminare quando non sollevo. Tre angoli dello stesso rispetto per il corpo maturo. Nessuna lezione dall’alto. Un racconto con numeri veri.`,
          `Prossimo passo operativo: tenere lo slot cardio come appuntamento, non come punizione. Ventun minuti bastano, se sono puliti. Il resto della forza resta sulle schede. Il resto della vita resta fuori dalla sala — e va benissimo così.`,
        ],
      },
    ],
    figures: [
      { alt: "Diagramma tecnico: zone di frequenza sul tapis, prevalenza aerobica", caption: "Fig. 1 · Zona aerobica 76%: il lavoro vero di quella sera" },
      { alt: "Illustrazione: split del km e raffreddamento sugli ultimi 300 metri", caption: "Fig. 2 · Due passi nello stesso file: 13'40\" e poi il rallentare" },
    ],
    faq: [
      { q: "Il cardio sul tapis sostituisce i pesi?", a: "No. Per Gino è riposo attivo: 21 minuti aerobici il giorno dopo una B1. I pesi restano il lavoro di forza, documentato in Allenamenti." },
      { q: "Perché il passo medio è 16:02 se il primo km è 13:40?", a: "La media include il raffreddamento: gli ultimi 300 metri sono usciti a circa 23:42. Il lavoro del km è 13:40; la media racconta tutta la sessione." },
      { q: "Cosa significa carico 55 e sforzo del giorno 25?", a: "Sono due metriche Zepp diverse. 55 è il carico della sessione tapis; 25 è lo sforzo complessivo del giorno sul modulo. Non vanno sommati né confusi." },
      { q: "TSB −4 è un allarme?", a: "No. Al 1 ottobre 2026 Zepp lo etichetta Bilanciato (CTL 37, ATL 41). Indica fatica recente vicina alla forma cronica, non un crollo." },
      { q: "Devo copiare questi 21 minuti?", a: "No. È il diario di un dilettante 57enne. Se vuoi introdurre cammino o tapis, parti piano e chiedi consiglio a un professionista se hai dubbi di salute." },
      { q: "La Forza Quotidiana vende programmi cardio?", a: "No. Diario personale, newsletter gratuita, zero coaching commerciale." },
    ],
  },

  "sonno-corto-allenamento-maturo-57-anni": {
    title: "Sonno corto e allenamento maturo | Gino",
    meta_description:
      "Notte da 1:38 (score 42) il 1 ottobre 2026: HRV 38, HybridCharge 26→5. Gino 57 anni regola il carico con cardio leggero, non con i pesi pesanti.",
    h1: "Quando la notte è corta: come regolare il carico",
    og_title: "Sonno corto e allenamento dopo i 50 — numeri Zepp",
    breadcrumb: "Sonno corto allenamento maturo",
    aeo_label: "Sintesi Articolo",
    aeo_lead: `La notte prima del tapis è durata <strong>1:38</strong> (score 42, «fai attenzione»). HRV <strong>38</strong> su baseline 42, HybridCharge dal risveglio <strong>26</strong> poi <strong>5</strong> dopo il movimento. A <strong>${AGE} anni</strong> non ho aperto una scheda pesante: ho camminato. Spiego i numeri in <a href="/allenamenti/">Allenamenti</a>, il contesto in <a href="/chi-sono/">Chi sono</a> e nel <a href="/diario/">Diario</a>.`,
    realistic_alt: "Gino Capon, 57 anni, in una stanza in penombra: recupero e sonno, fotorealistico",
    realistic_caption: "Sonno · Recupero · Natural maturo",
    hero_alt: "Illustrazione tecnica: ciclo sonno breve, HRV e regolazione del carico allenante",
    hero_caption: "Una notte corta non cancella l’allenamento: chiede di cambiarne il volume.",
    sections: [
      {
        h2: "Una notte da 1 ora e 38 minuti",
        paragraphs: [
          `Zepp, mattina del 1 ottobre 2026: sonno <strong>1:38</strong>, score 42, etichetta «fai attenzione». Profondo 0:32, REM 0:35, risvegli 0. Orario di addormentamento 01:27, risveglio 03:05. Non è una notte da manuale. È una notte da vita vera — lavoro, famiglia, testa che non stacca.`,
          `A ${AGE} anni fingere che «si tira avanti» come a trent’anni è poco rispettoso verso il corpo. Il margine è più stretto. Lo scrivo anche in <a href="/diario/overtraining-recupero-50-anni-57-anni/">overtraining e recupero</a>: il sonno è infrastruttura, non optional. Quel file lo conferma senza drammi.`,
          `Non racconto questa notte per fare la vittima. La racconto perché molti over 50 si allenano dopo notti simili e poi si chiedono perché la serie pesa di più. Il diario serve a mettere i numeri sul tavolo, con calma.`,
        ],
      },
      {
        h2: "HRV 38 su 42: un calo piccolo, un segnale utile",
        paragraphs: [
          `HRV <strong>38</strong>, etichetta «Buono», baseline <strong>42</strong>. Non è un crollo. È un filo sotto la linea. Frequenza a riposo 55, in linea con la notte. Il messaggio non è «stai fermo per una settimana». È «oggi non è il giorno del record».`,
          `Uso l’HRV come termometro, non come giudice. Un punto sotto la baseline dopo 1:38 di sonno è coerente. Se restasse bassa per giorni con TSB in picchiata, cambierei musica. Un dato isolato chiede rispetto, non panico.`,
          `Chi vuole i log grezzi va in <a href="/allenamenti/">Allenamenti</a>. Qui traduco: HRV buona ma sotto baseline + sonno cortissimo = scegli uno stimolo che non mangi il sistema nervoso. Per me, quel giorno, è stato il tapis.`,
        ],
      },
      {
        h2: "HybridCharge 26 poi 5: energia che si spende",
        paragraphs: [
          `HybridCharge al risveglio <strong>26 basso</strong>. Dopo la sessione <strong>5</strong>. Lo sforzo del giorno 56 su un obiettivo 27. Il modulo dice: sei partito già scarico e il movimento ha speso quel poco che c’era. Non è una sorpresa dopo 1:38 di sonno.`,
          `La lettura gentile è: il corpo ha comunque accettato 21 minuti aerobici. La lettura prudente è: non aggiungere una panca pesante sopra questo quadro. A ${AGE} anni la prudenza non è paura. È mestiere.`,
          `Non tratto HybridCharge come oracolo. Lo tratto come un promemoria visivo. Se al mattino è basso, la giornata si costruisce intorno al recupero: cibo, luce, cammino, lavoro — e uno slot di movimento che non pretenda l’impossibile.`,
        ],
      },
      {
        h2: "Due pisolini non fanno una notte",
        paragraphs: [
          `Nel report ci sono anche due sonnellini: <strong>0:19</strong> e <strong>0:49</strong>. Aiutano. Non sostituiscono un ciclo notturno. Score 42 resta «fai attenzione» anche con i pisolini. Regularity 50%. Ipnea stimata 0,6 h, frequenza respiratoria 11: li registro, non li interpreto da medico.`,
          `La tentazione, dopo una notte spezzata, è «recuperare» dormendo in poltrona e poi allenarsi comunque al massimo. Io ho scelto il mezzo: un po’ di riposo diurno, movimento leggero la sera, niente eroismo. Non è una formula magica. È un compromesso da adulto.`,
          `Nel <a href="/diario/sport-lavoro-famiglia-a-57-anni/">pezzo su sport, lavoro e famiglia</a> ho già scritto che l’equilibrio è settimanale, non giornaliero. Una notte orribile non rovina il trimestre. Rovinare il trimestre è pretendere il massimo ogni giorno dopo notti orribili.`,
        ],
      },
      {
        h2: "Cardio leggero vs pesi pesanti dopo poco sonno",
        paragraphs: [
          `La sera del 1 ottobre, alle 20:01, ho scelto il tapis: 1,30 km, FC 123/135, zona aerobica 76%, carico 55. Non una lower, non una upper. Il giorno prima c’era già stata la B1. Il corpo aveva avuto i pesi; la notte no.`,
          `Pesi pesanti dopo 1:38 di sonno, per me, sono un rischio inutile: tecnica meno pulita, umore più corto, recupero che si allunga. Il cardio aerobico corto è un altro mestiere. Tiene la routine, muove il sangue, non chiede al sistema nervoso lo stesso conto.`,
          `Non è una regola universale. È la mia, a ${AGE} anni, con ${TRAINING_YEARS} anni di palestra alle spalle. Un ventenne in palestra da tre mesi potrebbe leggere lo stesso file in modo diverso. Questo diario parla da dove sono, non da un manuale.`,
        ],
      },
      {
        h2: "TSB −4 e sonno corto: due termometri diversi",
        paragraphs: [
          `TSB <strong>−4 Bilanciato</strong> (CTL 37, ATL 41) descrive il carico delle settimane. Il sonno 1:38 descrive le ultime ore. Si possono avere un TSB accettabile e una notte disastrosa. Si possono avere TSB basso e una notte ottima. Leggerli insieme è il lavoro vero.`,
          `Se avessi visto solo TSB −4, avrei potuto dire «bilanciato, via coi pesi». Se avessi visto solo 1:38, avrei potuto dire «divano». Insieme dicono: movimento sì, intensità no. È la frase più utile di questa pagina.`,
          `Il modulo Zepp non sostituisce il medico. Se il sonno spezzato diventa la norma, la domanda non è «quale scheda». È una visita. Il <a href="/diario/">Diario</a> non è un ambulatorio; è un taccuino onesto.`,
        ],
      },
      {
        h2: "Cosa proteggo il giorno dopo",
        paragraphs: [
          `Proteggo l’ora di andare a letto, per quanto la vita lo permetta. Proteggo il cibo: niente eroismi da digiuno sopra una notte corta. Proteggo il tono: non uso la palestra come sfogo nervoso. Uso la palestra, quando posso, come struttura.`,
          `Proteggo anche l’umore di chi vive con me. Una notte breve rende più facile essere secchi. Allenarsi pesanti sopra quella seccatura non aiuta nessuno. Un tapis di 21 minuti, a passo da persona, a volte aiuta più di una serie al limite.`,
          `Chi sono lo racconto in <a href="/chi-sono/">Chi sono</a>: papà di Ginevra, dilettante, lavoro e famiglia. Il sonno non è un accessorio da atleta. È la condizione per essere presenti. L’allenamento, quando la notte manca, deve stare al servizio di quella presenza — non il contrario.`,
        ],
      },
      {
        h2: "Lo slot delle 20:01 dopo una notte spezzata",
        paragraphs: [
          `Molti dilettanti, me compreso, allenano la sera. Alle 20:01 il giorno è già passato: lavoro, spostamenti, eventualmente famiglia. Una notte da 1:38 rende quella fascia oraria più fragile. Non ho spostato lo slot all’alba: non ne avevo una. Ho tenuto l’orario e ho cambiato il contenuto.`,
          `Tenere lo slot è salute mentale tanto quanto salute fisica. Saltare del tutto, a volte, è giusto. Saltare sempre perché «non ho dormito abbastanza» diventa un buco nella settimana. Il compromesso di quel giovedì — stesso orario, stimolo più leggero — è il compromesso che voglio ricordare.`,
          `In <a href="/chi-sono/">Chi sono</a> non mi presento come un atleta da digiuno e da 22:00 in sala. Mi presento come uno che protegge un appuntamento. L’appuntamento, quella sera, era col cammino. I log restano in <a href="/allenamenti/">Allenamenti</a>.`,
        ],
      },
      {
        h2: "La prossima volta che la notte è corta",
        paragraphs: [
          `Farò le stesse tre domande. Come sto in piedi, non sul divano? C’è dolore o solo stanchezza? I pesi di ieri erano una lower pesante? Se sto in piedi, non ho dolore, e ieri ho già sollevato, il tapis corto resta la prima risposta. Se c’è malanno o un giunto che protesta, resto a casa.`,
          `Non alzerò i carichi «per dimostrare». Non userò il caffè come licenza. Non copierò un influencer che allena dopo tre ore di sonno e chiama tutto mentalità. A ${AGE} anni la mentalità è regolare il volume e arrivare a venerdì intero, non arrivare a venerdì rotto.`,
          `Se la notte corta si ripete tre volte nella stessa settimana, la domanda diventa medica e organizzativa, non di scheda. Il <a href="/diario/">Diario</a> può raccontare una notte. Non può curarne dieci. Quella distinzione, per me, è professione: sapere dove finisce il taccuino e dove inizia una visita.`,
        ],
      },
      {
        h2: "Cosa non è questo articolo",
        paragraphs: [
          `Non è consulenza sul sonno. Non è terapia per insonnia. Non è un protocollo di deload. È il racconto di una notte misurata da un orologio e di una scelta di carico presa da un uomo di ${AGE} anni che si allena da ${TRAINING_YEARS} anni.`,
          `I numeri sono solo quelli Zepp del 1 ottobre 2026. Non invento ore «recuperate», non invento percentuali di recupero, non vendo integratori per dormire. Se dormi male in modo persistente, parla con un professionista. Poi, se ti va, torna a leggere il <a href="/diario/">Diario</a>.`,
          `La lezione che tengo per me: dopo una notte da 1:38, il coraggio non è sollevare lo stesso. Il coraggio è regolare. Il tapis di quella sera è stata la forma più concreta di rispetto — verso il corpo, verso il giorno dopo, verso le persone che mi stanno intorno.`,
        ],
      },
    ],
    figures: [
      { alt: "Diagramma: sonno breve, HRV e scelta tra pesi e cardio leggero", caption: "Fig. 1 · Due termometri: TSB della settimana e ore della notte" },
      { alt: "Illustrazione tecnica: HybridCharge basso e sessione aerobica corta", caption: "Fig. 2 · Energia scarsa: si muove, non si spreme" },
    ],
    faq: [
      { q: "Gino si allena dopo una notte di 1 ora e 38?", a: "Il 1 ottobre 2026 ha scelto un tapis aerobico di 21 minuti, non una seduta di pesi. Non è un invito a copiare: è un diario personale." },
      { q: "HRV 38 è un valore preoccupante?", a: "Nel report Zepp di quel giorno è etichettato «Buono», con baseline 42. Un calo piccolo dopo una notte corta. Non è diagnosi." },
      { q: "I pisolini recuperano il sonno notturno?", a: "Aiutano un po’. Non sostituiscono un ciclo notturno. Lo score 42 è rimasto «fai attenzione» anche con 19 e 49 minuti di sonnellino." },
      { q: "Quando conviene saltare del tutto l’allenamento?", a: "Se ci sono malattia, dolore, sonno cronicamente distrutto o un consiglio medico, si salta. Gino quel giorno ha scelto movimento leggero. Non è una regola clinica." },
      { q: "Questo articolo è consiglio medico sul sonno?", a: "No. Riflessione tecnica con numeri Zepp verificati. Per disturbi del sonno serve un professionista." },
      { q: "Dove trovo i dati della sessione?", a: "Nell’hub Allenamenti. Qui restano il racconto e i numeri citati, senza link alle singole pagine sessione." },
    ],
  },

  "camminare-giorni-senza-pesi-57-anni": {
    title: "Camminare nei giorni senza pesi | Gino",
    meta_description:
      "Gino 57 anni: i giorni senza bilanciere non sono vuoti. Dopo la B1 del 30 settembre, il 1 ottobre ha camminato sul tapis. Rituale gentile, non punizione.",
    h1: "I giorni senza bilanciere non sono giorni vuoti",
    og_title: "Camminare nei giorni senza pesi — diario a 57 anni",
    breadcrumb: "Camminare giorni senza pesi",
    aeo_label: "Sintesi Articolo",
    aeo_lead: `Dopo la <strong>B1 del 30 settembre</strong>, il <strong>1 ottobre</strong> non ho sollevato: ho camminato. Ventun minuti sul tapis, passo da persona, cuore in zona comoda. A <strong>${AGE} anni</strong> i giorni senza pesi sono parte dell’allenamento, non una buca. Vita in <a href="/chi-sono/">Chi sono</a>, log in <a href="/allenamenti/">Allenamenti</a>, parole nel <a href="/diario/">Diario</a>.`,
    realistic_alt: "Gino Capon, 57 anni, cammina con calma — ritratto fotorealistico fuori dalla sala pesi",
    realistic_caption: "Cammino · Giorni off · Presenza",
    hero_alt: "Illustrazione editoriale: uomo maturo che cammina, giorni senza pesi come rituale",
    hero_caption: "Il cammino tiene insieme i giorni in cui il bilanciere resta al suo posto.",
    sections: [
      {
        h2: "I giorni senza bilanciere esistono",
        paragraphs: [
          `Esistono, e per fortuna. Se ogni giorno fosse una scheda, a ${AGE} anni non durerei dieci anni. Ne ho già fatti ${TRAINING_YEARS}, dal ${TRAINING_START}. La durata non arriva dalla fame di ogni sera. Arriva dal sapere quando la sala pesi è chiusa — e la vita no.`,
          `Il 30 settembre ho fatto la B1. Il 1 ottobre il bilanciere poteva aspettare. Non è pigrizia. È rispetto per le gambe, per il sonno corto di quella notte, per il lavoro del giorno dopo. Nel <a href="/diario/">Diario</a> voglio che Ginevra legga anche questo: papà non è forte perché non si ferma mai. È presente perché sa fermarsi.`,
          `Molti uomini della mia età vivono il giorno off come una colpa. Io sto imparando a viverlo come un appuntamento diverso. Stesso rispetto, altro gesto. Non è un discorso da palestra da copertina: è un discorso da adulto che vuole ancora sollevare tra cinque anni, e per farlo deve anche camminare oggi.`,
        ],
      },
      {
        h2: "Camminare è un appuntamento, non un riempitivo",
        paragraphs: [
          `Camminare non è «meglio di niente». È qualcosa. Ha un inizio, una durata, una fine. Quel giovedì: 20:01, 21 minuti, 1,30 km. Non ho girato in tondo per noia. Ho messo un slot, come metto uno slot per i pesi.`,
          `La differenza è il tono. I pesi chiedono attenzione al carico. Il cammino chiede attenzione al fiato e alla postura. Entrambi chiedono di esserci. Se tratto il tapis come un riempitivo, diventa noioso. Se lo tratto come un appuntamento, diventa un pezzo della settimana che mi piace.`,
          `Non serve un bosco e un tramonto. Serve un nastro che gira e venti minuti in cui nessuno chiede una mail. Per un papà e un lavoratore, quello è già un lusso gentile. Se un giorno il tapis non c’è, va bene anche il marciapiede sotto casa: l’appuntamento è col movimento, non con la macchina.`,
        ],
      },
      {
        h2: "Dopo una lower le gambe chiedono movimento, non eroismo",
        paragraphs: [
          `Il giorno dopo una B1 le gambe hanno memoria. Possono camminare. Fanno fatica a fingere di essere fresche per un’altra lower. Il tapis di quella sera è stato un modo di dire: vi muovo, non vi piego.`,
          `È lo stesso spirito del pezzo <a href="/diario/10-giorni-riposo-forza-57-anni/">dieci giorni di riposo</a>: il riposo programmato non cancella un decennio. Lo rende possibile. Un singolo giorno off, con un cammino, è la versione piccola di quella lezione.`,
          `Chi vuole i dettagli della B1 e del tapis li trova in <a href="/allenamenti/">Allenamenti</a>. Qui resta il senso: il corpo maturo gradisce la continuità del gesto più dell’intensità di ogni sera.`,
        ],
      },
      {
        h2: "Cosa insegna un tapis senza record",
        paragraphs: [
          `Insegna la modestia utile. Passo medio 16:02, primo km 13:40, cuore a 123. Nessun applauso. Nessuna classifica. Solo il rumore del nastro e la certezza di aver fatto ciò che avevo detto di fare.`,
          `A ${AGE} anni ho bisogno di questo tipo di vittorie più che di foto da spogliatoio. Le foto, quando ci sono, stanno nel diario con etichetta onesta. Il cammino non ha bisogno di posa. Ha bisogno di scarpe e di un orario.`,
          `Insegna anche a non confondere fatica e valore. Si può uscire dal tapis poco sudati e aver fatto la cosa giusta. Si può uscire distrutti da una seduta e aver sbagliato giorno. Il valore sta nella scelta, non nel grado di sfinimento.`,
        ],
      },
      {
        h2: "Ginevra, il lavoro, e lo slot che resta",
        paragraphs: [
          `Questo diario è un lascito. Voglio che mia figlia veda un uomo che si allena e un uomo che cammina, che lavora e che sta a tavola. Non un personaggio inchiodato alla palestra. Il profilo è in <a href="/chi-sono/">Chi sono</a>: dilettante autentico, papà, imprenditore.`,
          `I giorni senza pesi sono i giorni in cui la vita entra senza chiedere permesso. Una notte corta, una riunione, una cena. Se l’unica identità è «quello della scheda», quei giorni sembrano fallimenti. Se l’identità è «quello che si prende cura», il cammino entra nella cura.`,
          `Lo slot che resta — venti minuti, mezz’ora — è un filo. Non tiene su una carriera da atleta. Tiene su un umore. Per me basta, e avanza.`,
        ],
      },
      {
        h2: "Riposo attivo senza sentirsi in colpa",
        paragraphs: [
          `La colpa è una pessima coach. Ti spinge ad aggiungere serie quando servirebbe una passeggiata. Ti fa odiare il divano anche quando il divano è giusto. Io voglio un riposo attivo senza processo: mi muovo perché mi fa bene, non per ispurgarmi di una giornata «persa».`,
          `Il 1 ottobre non ho «pagato» la notte corta con il tapis. Ho scelto un gesto compatibile. C’è una differenza enorme. Il primo è punizione. Il secondo è intelligenza. Nel <a href="/diario/">Diario</a> voglio la seconda.`,
          `Se un lettore over 50 si riconosce, la proposta è semplice: nei giorni senza pesi, metti un cammino in agenda come metti una riunione. Poi onoralo. Se un giorno non ce la fai, non processarti. Riprova il giorno dopo.`,
        ],
      },
      {
        h2: "Dieci anni di costanza non sono dieci anni di eroismo",
        paragraphs: [
          `Dal ${TRAINING_START} a oggi la cosa che ha tenuto non è la seduta perfetta. È tornare. Tornare dopo le ferie, dopo le notti corte, dopo le settimane di lavoro. Il tapis e il marciapiede fanno parte di quel tornare.`,
          `La costanza visibile sta nei log. La costanza invisibile sta nei giorni in cui non c’è nulla da pubblicare e ti muovi lo stesso. Questo articolo è un piccolo faro su quei giorni. Non per mitizzarli. Per dar loro dignità.`,
          `Chi arriva qui da una ricerca sul cammino e la palestra over 50 troverà numeri veri nel pezzo tecnico sul tapis e nel pezzo sul sonno. Qui trova il tono: siamo adulti, possiamo essere bravi con noi stessi senza diventare solenni.`,
        ],
      },
      {
        h2: "La stessa persona: quella dei pesi e quella del marciapiede",
        paragraphs: [
          `Mi è capitato di pensare ai giorni off come a una versione minore di me. Quasi un sotto-Gino, in attesa del vero Gino con la scheda. È un pensiero stanco, e non voglio lasciarlo a Ginevra. La persona che cammina è la stessa che poggia i manubri. Stessa età, stessa storia, stesso rispetto.`,
          `Se spezzo quelle due identità, i giorni senza pesi diventano un corridoio da attraversare in fretta. Se le tengo insieme, il cammino ha lo stesso tono della panca: presenza, non spettacolo. A ${AGE} anni ho bisogno di un tono unico, non di un personaggio da sala e uno da strada.`,
          `Per questo nel <a href="/diario/">Diario</a> di questa settimana il tapis, il sonno e il cammino stanno vicini. Non sono tre hobby. Sono tre modi della stessa cura, raccontati senza ironia e senza predica. I numeri restano in <a href="/allenamenti/">Allenamenti</a>; il senso resta qui.`,
        ],
      },
      {
        h2: "Cosa lascio a chi ha i miei anni",
        paragraphs: [
          `Se hai tra i cinquanta e i sessanta e ti alleni sul serio, ti lascio un invito pratico: dai un nome al giorno senza pesi prima che arrivi. Scrivilo. «Giovedì: cammino». Quando arriva, non negoziare con la colpa. Onora il nome che gli hai dato, anche se durano venti minuti.`,
          `Ti lascio anche un limite: il cammino non è un modo per farti perdonare il gelato, né un modo per copiare la prep di chi sale sul palco. È un gesto civile verso articolazioni, umore e sonno. Se fa questo, ha funzionato. Se diventa un secondo lavoro, ha sbagliato mestiere.`,
          `Infine ti lascio il mio numero vero, non un slogan: ${TRAINING_YEARS} anni dal ${TRAINING_START}, ${AGE} anni oggi, un tapis di 21 minuti il 1 ottobre 2026. Basta così. Il resto è vita — e la vita, per me, è il motivo per cui mi alleno, non un ostacolo da sconfiggere.`,
        ],
      },
      {
        h2: "Un invito gentile, non una lezione",
        paragraphs: [
          `Se ti alleni sul serio e hai i tuoi anni, prova a dare un nome ai giorni senza pesi. Chiamali cammino. Chiamali tapis. Chiamali aria. Non chiamarli «giorni persi». Il corpo maturo capisce il rispetto più degli slogan.`,
          `Io continuerò a sollevare. Continuerò anche a camminare. I numeri del 1 ottobre restano lì, verificati, senza trucco. La frase che tengo è più piccola dei numeri: i giorni senza bilanciere non sono vuoti. Sono pieni di un altro tipo di forza — quella quotidiana, appunto.`,
          `Se vuoi seguirmi, c’è la newsletter e c’è il <a href="/diario/">Diario</a>. Se vuoi i log, <a href="/allenamenti/">Allenamenti</a>. Se vuoi sapere chi c’è dietro, <a href="/chi-sono/">Chi sono</a>. Nessuna vendita. Un uomo di ${AGE} anni che cammina, quando è il momento di camminare.`,
        ],
      },
    ],
    figures: [
      { alt: "Illustrazione: calendario della settimana con un giorno di solo cammino", caption: "Fig. 1 · Il giorno off ha un rito: si cammina" },
      { alt: "Illustrazione editoriale: passo calmo, palestra sullo sfondo, vita in primo piano", caption: "Fig. 2 · La sala pesi aspetta; la vita no" },
    ],
    faq: [
      { q: "Camminare nei giorni off serve all’ipertrofia?", a: "Aiuta il recupero, l’umore e la costanza. Non sostituisce i pesi. Gino lo usa come riposo attivo, non come secondo allenamento." },
      { q: "Quanto ha camminato Gino il 1 ottobre 2026?", a: "1,30 km in 21 minuti sul tapis, dopo la B1 del giorno prima. Dati Zepp, non stime." },
      { q: "Devo sentirmi in colpa se un giorno non sollevo?", a: "No. Questo diario tratta i giorni senza pesi come parte del percorso. La colpa è una pessima guida." },
      { q: "Meglio tapis o cammino all’aperto?", a: "Quello che riesci a mettere in agenda. Gino quel giorno ha usato il tapis in palestra. L’appuntamento conta più dello scenario." },
      { q: "Questo è un programma da personal trainer?", a: "No. Riflessione personale di Gino Capon, 57 anni. Per programmi individuali serve un professionista." },
    ],
  },
};

function ensureQueueItem(queue, spec) {
  let item = queue.items.find((i) => i.slug === spec.slug);
  if (!item) {
    item = {
      id: `batch-${DATE}-${spec.slug.slice(0, 14)}`,
      slug: spec.slug,
      status: "proposed",
    };
    queue.items.push(item);
  }
  Object.assign(item, {
    tone: spec.tone,
    fiction: spec.fiction,
    cluster: spec.cluster,
    kw_primary: spec.kw_primary,
    target_week: spec.target_week,
    discovery_score: spec.discovery_score,
    intent: spec.intent,
    hero_brief: "Illustrazione editoriale professionale, palette scura, niente fumetto",
    hero_concept: spec.tone === "tecnico" ? "technical sports science diagram" : "warm professional fitness editorial",
  });
  if (spec.trending_title) item.trending_title = spec.trending_title;
  return item;
}

function archiveGoliardicProposed(queue) {
  let n = 0;
  for (const item of queue.items) {
    if ((item.status === "proposed" || item.status === "needs_generation") && (item.tone === "goliardico" || item.fiction === true)) {
      item.status = "archived";
      item.archived_reason = "Mix dal 2026-10-02: niente goliardia/ironia sui pezzi nuovi";
      n += 1;
    }
  }
  return n;
}

function updateQueue(queue, results) {
  for (const { spec, paths, article } of results) {
    const item = ensureQueueItem(queue, spec);
    item.status = "scheduled";
    item.paths = paths;
    item.title_draft = article.title.replace(/\s*\|\s*Gino\s*$/i, "").trim();
    item.meta_draft = article.meta_description;
    item.h1_draft = article.h1;
  }
  queue.updated = todayISO();
}

function countWords(article) {
  const parts = [];
  for (const sec of article.sections || []) {
    for (const p of sec.paragraphs || []) parts.push(p.replace(/<[^>]+>/g, " "));
  }
  for (const f of article.faq || []) parts.push(f.q, f.a);
  return parts.join(" ").split(/\s+/).filter(Boolean).length;
}

async function main() {
  const results = [];
  const successPaths = [];

  for (const spec of QUEUE_ITEMS) {
    const article = ARTICLES[spec.slug];
    if (!article) throw new Error(`Contenuto mancante per ${spec.slug}`);
    if (article.title.length > 60) throw new Error(`Title lungo ${article.title.length}: ${spec.slug}`);
    if (article.meta_description.length > 160) throw new Error(`Meta lunga ${article.meta_description.length}: ${spec.slug}`);
    const words = countWords(article);
    if (words < 1400) console.warn(`WARN parole ${words} < 1400: ${spec.slug}`);
    else console.log(`${spec.slug}: title ${article.title.length} · meta ${article.meta_description.length} · ~${words} parole`);

    const paths = buildPaths(spec.slug);
    for (const rel of [paths.hero, ...paths.figures, paths.realistic]) {
      const full = path.join(REPO_ROOT, rel);
      if (!fs.existsSync(full)) throw new Error(`Asset mancante: ${rel}`);
    }
    const html = renderDiarioHtml(article, spec, paths, DATE);
    const htmlPath = path.join(REPO_ROOT, paths.html);
    fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
    fs.writeFileSync(htmlPath, html);
    results.push({ spec, paths, article });
    successPaths.push(paths.html, paths.hero, paths.figures[0], paths.figures[1], paths.realistic);
  }

  const queue = readJson("data/editorial-queue.json");
  const archived = archiveGoliardicProposed(queue);
  updateQueue(queue, results);
  writeJson("data/editorial-queue.json", queue);

  console.log(`\n✓ Batch editoriale ${DATE} completato (archiviati ${archived} proposed goliardici):\n`);
  for (const p of successPaths) console.log(`  ${p}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
