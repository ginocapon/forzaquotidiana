#!/usr/bin/env node
/**
 * Batch editoriale venerdì 2026-09-04 — 2 tecnici + 1 goliardico
 * node tools/friday-2026-09-04-batch.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { REPO_ROOT, readJson, writeJson, todayISO } from "../scripts/lib/editorial-utils.mjs";
import { renderDiarioHtml } from "./render-diario-html.mjs";

const DATE = "2026-09-04";

const STATS = readJson("data/my-stats.json");
const AGE = STATS?.profile?.chronological_age ?? 57;
const TRAINING_YEARS = STATS?.profile?.training_years ?? 10;
const TRAINING_START = STATS?.profile?.training_start_year ?? 2016;
const CTL = STATS?.training_load?.ctl ?? 25;
const ATL = STATS?.training_load?.atl ?? 31;
const TSB = STATS?.training_load?.tsb ?? -6;
const LOAD_AS_OF = STATS?.training_load?.as_of ?? "2026-08-25";
const SESSIONS_DOC = STATS?.sessions?.documented_full ?? 15;

const QUEUE_ITEMS = [
  {
    slug: "volume-mass-phase-natural-57-anni",
    tone: "tecnico",
    fiction: false,
    cluster: "tecnico-natural",
    kw_primary: "mass phase volume natural",
    trending_title: "4 weeks into the mass phase",
    target_week: DATE,
    discovery_score: 0.82,
    intent: "Volume in mass phase per natural maturo — numeri verificati, zero bro-science",
    seeds: {
      hero: "img/diario/2026-08-26/gareggiare-natural-senza-farmaci-hero.webp",
      fig1: "img/diario/2026-08-26/gareggiare-natural-senza-farmaci-fig1.webp",
      fig2: "img/diario/2026-08-26/gareggiare-natural-senza-farmaci-fig2.webp",
    },
  },
  {
    slug: "blocco1-prime-settimane-settembre-57-anni",
    tone: "tecnico",
    fiction: false,
    cluster: "tecnico-natural",
    kw_primary: "blocco 1 ipertrofia settembre",
    target_week: DATE,
    discovery_score: 0.8,
    intent: "Prime settimane Blocco 1 ipertrofia accumulo — lettura carico e adattamento maturo",
    seeds: {
      hero: "img/diario/2026-07-30/blocco-1-periodizzazione-hero.webp",
      fig1: "img/diario/2026-08-16/overtraining-recupero-50-anni-fig1.webp",
      fig2: "img/diario/2026-08-16/overtraining-recupero-50-anni-fig2.webp",
    },
  },
  {
    slug: "weeks-into-mass-phase-57-anni",
    tone: "goliardico",
    fiction: true,
    cluster: "goliardia-allenamento",
    kw_primary: "weeks into mass phase",
    trending_title: "4 weeks into the mass phase",
    target_week: DATE,
    discovery_score: 0.85,
    intent: "Satira goliardica sul trend mass phase — pasta, divano, autoironia",
    seeds: {
      hero: "img/diario/2026-08-26/check-weeks-natural-viking-hero.webp",
      fig1: "img/diario/2026-08-26/check-weeks-natural-viking-fig1.webp",
      fig2: "img/diario/2026-08-26/check-weeks-natural-viking-fig2.webp",
    },
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
  };
}

async function copySeed(srcRel, destRel, hero = false) {
  const src = path.join(REPO_ROOT, srcRel);
  const dest = path.join(REPO_ROOT, destRel);
  if (!fs.existsSync(src)) {
    throw new Error(`Seed mancante: ${srcRel}`);
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  let pipe = sharp(src).rotate(hero ? 0.4 : 0.6).modulate({ brightness: 1.02, saturation: 1.04 });
  if (hero) {
    pipe = pipe.resize(1600, 760, { fit: "cover", position: "centre" });
  } else {
    pipe = pipe.resize(1200, null, { withoutEnlargement: false });
  }
  await pipe.webp({ quality: hero ? 60 : 64 }).toFile(dest);
}

async function copyImages(item, paths) {
  await copySeed(item.seeds.hero, paths.hero, true);
  await copySeed(item.seeds.fig1, paths.figures[0], false);
  await copySeed(item.seeds.fig2, paths.figures[1], false);
}

const ARTICLES = {
  "volume-mass-phase-natural-57-anni": {
    title: "Volume in mass phase natural a 57 anni | Gino",
    meta_description:
      "Mass phase e volume per natural maturo: Gino Capon 57 anni, CTL 25 ATL 31 TSB -6 al 25 agosto. Dieci anni dal 2016, sessioni documentate — riflessione tecnica, non coaching.",
    h1: "Volume in mass phase natural: cosa regolo a 57 anni senza farmaci",
    og_title: "Volume in mass phase natural — lettura carico a 57 anni",
    breadcrumb: "Volume mass phase natural",
    aeo_label: "Sintesi Articolo",
    aeo_lead: `<strong>Mass phase</strong> e <strong>volume natural</strong> non sono sinonimo di «mangiare tutto e alzare a caso»: a <strong>${AGE} anni</strong>, con <strong>${TRAINING_YEARS} anni di allenamento dal ${TRAINING_START}</strong>, regolo serie e frequenza guardando il carico Zepp (<strong>CTL ${CTL}, ATL ${ATL}, TSB ${TSB}</strong> al ${LOAD_AS_OF}). Questo pezzo del <a href="/diario/">Diario</a> spiega come leggo volume, surplus prudente e recupero — numeri verificabili in <a href="/allenamenti/">Allenamenti</a>, voce in <a href="/chi-sono/">Chi sono</a>.`,
    hero_alt:
      "Illustrazione editoriale: atleta maturo natural in fase di accumulo volume, bilanciere e grafico carico — mass phase senza farmaci",
    hero_caption: "Mass phase natural: volume e carico si misurano, non si indovinano al bar.",
    sections: [
      {
        h2: "Cosa intendo per mass phase da natural maturo",
        paragraphs: [
          `Mass phase, per me, è un blocco di mesi in cui accetto un surplus calorico moderato e aumento progressivamente volume e frequenza per costruire tessuto — senza farmaci, senza promesse da influencer. A ${AGE} anni il margine è più stretto che a trenta: tendini, sonno e stress lavorativo contano quanto le serie extra. Non uso percentuali body fat non misurate; documento sessioni e carico dove posso.`,
          `Il trend Reddit «4 weeks into the mass phase» descrive atleti che postano progressi, macro e pump. Io non copio quella liturgia: traduco il concetto in domande pratiche — quante serie in più sopra la maintenance, quanto recupero tra sessioni, quando ATL supera CTL in modo sostenibile. Il <a href="/diario/">Diario</a> resta testimonianza, non programma venduto.`,
          `Natural significa che ogni chilogrammo in più sul bilanciere costa recupero reale. Dieci anni dal ${TRAINING_START} mi hanno insegnato che volume utile ≠ volume massimo tollerabile per una settimana. La mass phase è maratona, non sprint da thread settimanale.`,
        ],
      },
      {
        h2: "Volume: serie, frequenza e RIR onesti",
        paragraphs: [
          `Volume lo conto in serie efficaci per gruppo muscolare a settimana, non in ore passate in sala. Nel Blocco 1 ipertrofia accumulo — descritto altrove nel <a href="/diario/">Diario</a> — ho priorità dorsali e polpacci con split A1-B1-A2-B2. In mass phase aggiungo incrementi piccoli: una serie in più su un movimento secondario, non raddoppiare tutto in quattro settimane.`,
          `RIR (Repetitions In Reserve) restano onesti: 1–2 sul composto principale, 2–3 sugli accessori. Cedimento sistematico ogni sessione in accumulo, a ${AGE} anni, è debito che paghi con ATL che sale e sonno che cede. Preferisco progressione lenta documentata in <a href="/allenamenti/">Allenamenti</a> piuttosto che numeri da reel.`,
          `Frequenza: quattro sessioni settimanali restano il mio tetto sostenibile con vita piena. Aggiungere un quinto giorno «perché sono in mass» senza dormire abbastanza è bro-science mascherata da disciplina.`,
        ],
      },
      {
        h2: "Come leggo CTL, ATL e TSB in fase di accumulo",
        paragraphs: [
          `CTL (${CTL} al ${LOAD_AS_OF}) è fitness cronico — quanto ho costruito nel tempo. ATL (${ATL}) è fatica recente. TSB (${TSB}) è la differenza: negativo indica accumulo di fatica oltre il fitness momentaneo. Non è diagnosi medica; è termometro sul modulo Zepp derivato dalle ${SESSIONS_DOC} sessioni documentate e oltre.`,
          `In mass phase ATL può salire leggermente sopra CTL per settimane brevi — è il punto dell'accumulo controllato. Se TSB resta molto negativo per un mese con sonno peggiorato e performance piatta, non aggiungo volume: valuto deload o surplus più prudente. I numeri del ${LOAD_AS_OF} mi dicono che sono in zona «fatica recente > fitness» — coerente con rientro post-estate, non con invito al volume massimo cieco.`,
          `Errore comune: ignorare TSB perché «in bulk devi soffrire». Soffrire senza adattamento è solo usura. Confronto i miei ${CTL}/${ATL} con i miei dati passati, non con il CTL di un ventenne su Reddit.`,
        ],
      },
      {
        h2: "Surplus calorico senza inventare macro",
        paragraphs: [
          `Non pubblico grammi esatti di proteine o calorie che non ho pesato con metodo ripetibile. Surplus prudente, per me, significa mangiare abbastanza per recuperare tra sessioni, non trasformare ogni pasto in competizione da food prep. A ${AGE} anni la sensibilità insulinica e la digestione non perdonano eccessi da «dirty bulk».`,
          `Segnali che il surplus è sufficiente: energia stabile pre-sessione, recupero entro 48–72 ore tra sessioni simili, peso che sale lentamente senza gonfiore cronico. Segnali che sto esagerando: sonno frammentato, performance che cala nonostante più cibo, TSB che crolla.`,
          `Integratori? Zero vendita qui. Acqua, cibo reale, caffè onesto. Per farmacologia e salute consulta medici — il mio percorso resta natural documentato in <a href="/chi-sono/">Chi sono</a>.`,
        ],
      },
      {
        h2: "Quattro settimane dentro la mass phase: cosa osservo",
        paragraphs: [
          `Il trend «4 weeks into the mass phase» celebra il mese di accumulo. Al quarto week non cerco specchi epici: cerco trend — stessi kg con RIR simili o migliori, carico ATL gestibile, nessun dolore articolare nuovo persistente. Pump e foto sono optional; dati e sensazioni guidano.`,
          `A quattro settimane valuto se l'incremento di volume dell'ultimo mesociclo è assimilato o se serve settimana più leggera prima di aggiungere altro. Con TSB ${TSB} al ${LOAD_AS_OF} non sono in deficit cronico estremo, ma non sono neanche in zona «rilassato» — prudenza prima del +10% serie.`,
          `Documento in <a href="/allenamenti/">Allenamenti</a> ciò che export Zepp consente; qui interpreto senza inventare kg non verificati. Ogni PR citato altrove nel sito deve comparire in log — qui restano principi.`,
        ],
      },
      {
        h2: "Recupero e sonno: il tetto invisibile del volume",
        paragraphs: [
          `Volume aggiuntivo senza sonno protetto è spreco. A ${AGE} anni proteggo finestra notturna come slot palestra: stessa ora quando possibile, niente sessioni eroiche tarde se il mattino è già pieno. WASO in aumento + TSB negativo persistente = domanda deload, non domanda integratore.`,
          `Giorni leggeri tra sessioni pesanti: cammino, mobilità, niente «cardio nascosto» che diventa allenamento. Recupero attivo sì; seconda sessione mascherata no.`,
          `Stress lavorativo e familiare non compare su CTL — ma accorcia RIR percepiti. Mass phase non annulla vita: la include nel calcolo.`,
        ],
      },
      {
        h2: "Errori che evito in mass phase da natural over 50",
        paragraphs: [
          `Primo errore: copiare volume da atleta pharmac-assisted o da ventenne senza lavoro. Secondo: aggiungere serie e cardio HIIT contemporaneamente. Terzo: ignorare articolazioni — fastidio tendineo che persiste chiede medico, non «più warmup».`,
          `Quarto: bulk emotivo dopo settimana storta — mangiare per consolazione non è mass phase. Quinto: non deloadare mai perché «in bulk non si molla». Settimana 13 del Blocco 1 esiste per questo: volume −40%, intensità moderata.`,
          `Sesto: confronto social. Il mio contesto — ${TRAINING_YEARS} anni, ${AGE} anni, ${SESSIONS_DOC} sessioni documentate — non compete con thread anonimi.`,
        ],
      },
      {
        h2: "Mass phase e percorso lungo: cosa lascio a Ginevra",
        paragraphs: [
          `Scrivo per lasciare traccia a Ginevra e a chi legge il <a href="/diario/">Diario</a>: mass phase natural a ${AGE} anni è costruzione lenta, non trasformazione estiva. Volume si regola con numeri verificabili (${CTL}, ${ATL}, ${TSB}), sensazioni e sonno — non con slogan.`,
          `Prossimi mesi: progressione piccola, deload rispettato, surplus prudente. Se i numeri peggiorano, riduco prima di aggiungere. Costanza batte entusiasmo da quattro settimane.`,
          `Per chi sono e perché documento: <a href="/chi-sono/">Chi sono</a>. Per log: <a href="/allenamenti/">Allenamenti</a>.`,
        ],
      },
    ],
    figures: [
      {
        alt: "Cartoon editoriale: grafico volume settimanale e bilanciere — mass phase natural maturo",
        caption: "Fig. 1 · Volume settimanale: progressione piccola, non scatto da thread Reddit",
      },
      {
        alt: "Illustrazione: atleta maturo tra piatto e bilanciere — surplus prudente senza eccessi",
        caption: "Fig. 2 · Surplus e allenamento: equilibrio, non guerra al divano",
      },
    ],
    faq: [
      {
        q: "Cosa significa mass phase per un natural a 57 anni?",
        a: `Fase di mesi con surplus calorico moderato e volume progressivo per costruire muscolo senza farmaci. A ${AGE} anni serve prudenza su recupero, sonno e carico (CTL ${CTL}, ATL ${ATL}, TSB ${TSB} al ${LOAD_AS_OF}). Non è consulenza nutrizionale: riflessione tecnica documentata nel Diario.`,
      },
      {
        q: "Quanto volume aggiungo in mass phase?",
        a: "Incrementi piccoli — una serie in più su movimenti secondari, non raddoppiare tutto in un mese. Quattro sessioni settimanali restano il tetto sostenibile. RIR 1–3, cedimento sistematico evitato. Dettagli scheda nel Blocco 1 descritto nel Diario.",
      },
      {
        q: "TSB negativo in mass phase è normale?",
        a: `TSB ${TSB} indica fatica recente sopra fitness momentaneo — tollerabile se breve e con sonno ok. Se persiste settimane con performance piatta, deload prima di aggiungere volume. Numeri Zepp al ${LOAD_AS_OF}, ${SESSIONS_DOC} sessioni documentate.`,
      },
      {
        q: "Devo contare ogni macro?",
        a: "Non pubblico macro non pesati con metodo ripetibile. Surplus prudente = energia sufficiente a recuperare, peso che sale lentamente, nessun eccesso cronico. Per piani nutrizionali personalizzati consulta professionisti.",
      },
      {
        q: "La Forza Quotidiana vende programmi mass phase?",
        a: "No. Diario personale di Gino Capon: testimonianza con numeri verificabili, link ad Allenamenti e Chi sono. Zero coaching commerciale, zero farmaci.",
      },
      {
        q: "Come collego questo pezzo al Blocco 1 settembre?",
        a: "Blocco 1 ipertrofia accumulo fornisce struttura A1-B1-A2-B2; questo articolo spiega come regolo volume e carico dentro quella struttura in fase di accumulo. Articolo dedicato alle prime settimane: blocco1-prime-settimane-settembre nel Diario.",
      },
    ],
  },

  "blocco1-prime-settimane-settembre-57-anni": {
    title: "Blocco 1: prime settimane di settembre a 57 | Gino",
    meta_description:
      "Prime settimane Blocco 1 ipertrofia settembre 2026: Gino 57 anni, split A1-B1-A2-B2, CTL 25 ATL 31 TSB -6. Adattamento maturo, sessioni documentate — diario tecnico.",
    h1: "Blocco 1, prime settimane di settembre: adattamento a 57 anni",
    og_title: "Blocco 1 settembre — prime settimane ipertrofia accumulo",
    breadcrumb: "Blocco 1 prime settimane settembre",
    aeo_label: "Sintesi Articolo",
    aeo_lead: `Settembre ${DATE.slice(0, 7)} apre le <strong>prime settimane del Blocco 1 ipertrofia accumulo</strong>: split <strong>A1-B1-A2-B2</strong>, progressione lenta, RIR onesti. A <strong>${AGE} anni</strong>, con <strong>${TRAINING_YEARS} anni dal ${TRAINING_START}</strong> e carico Zepp <strong>CTL ${CTL}, ATL ${ATL}, TSB ${TSB}</strong> (${LOAD_AS_OF}), racconto l'adattamento senza inventare kg — log in <a href="/allenamenti/">Allenamenti</a>, contesto in <a href="/chi-sono/">Chi sono</a> e archivio <a href="/diario/">Diario</a>.`,
    hero_alt:
      "Illustrazione editoriale: calendario settembre e schema periodizzazione Blocco 1 — ipertrofia accumulo atleta maturo",
    hero_caption: "Settembre 2026 · Blocco 1: prime settimane = fondamenta, non ego.",
    sections: [
      {
        h2: "Perché settembre segna l'inizio operativo del Blocco 1",
        paragraphs: [
          `Il Blocco 1 Ipertrofia accumulo — tredici settimane con deload finale — è stato annunciato a luglio nel <a href="/diario/">Diario</a>. Settembre è quando smetto di «prepararmi» e inizio a contare serie vere dopo rientro ferie. A ${AGE} anni l'adattamento tendini e volume richiede due-tre settimane prima di spingere carichi; le prime settimane sono investimento, non spreco.`,
          `Split A1-B1-A2-B2 resta invariato per tutto l'anno macro: quattro sessioni alternate upper/lower con priorità dorsali e polpacci. Cambiano serie, ripetizioni e carichi tra fasi — non la logica del movimento. Coerenza riduce errori da novità continua.`,
          `Non ripeto tutta la scheda qui: rimando al pezzo blocco-1-ipertrofia-accumulo-settembre-2026 per numeri di volume settimanale. Questo articolo è diario delle prime settimane — sensazioni, carico, errori evitati.`,
        ],
      },
      {
        h2: "Settimana 1–2: ritmo di entrata senza eroismo",
        paragraphs: [
          `Settimana 1: carichi conservativi, RIR 3–4 sui composti, focus tecnica e range completo. Il corpo maturo ricorda pattern ma non tollera salti da zero a cedimento. Sessioni documentate in <a href="/allenamenti/">Allenamenti</a> quando export Zepp disponibile.`,
          `Settimana 2: incremento minimo dove RIR scende naturalmente a 2–3. Nessun «salto del 20%» perché settembre è nuovo. Se articolazione protesta, mantengo kg e aggiungo serie solo su accessori leggeri.`,
          `Frequenza quattro volte resta sostenibile con lavoro e famiglia. Saltare una sessione e rincorrere il sabato con doppio volume è peggio che perdere un giorno.`,
        ],
      },
      {
        h2: "Lettura carico: CTL 25, ATL 31, TSB -6",
        paragraphs: [
          `Al ${LOAD_AS_OF} il modulo TSB mostra CTL ${CTL}, ATL ${ATL}, TSB ${TSB}. Fitness cronico moderato, fatica recente leggermente superiore — tipico di rientro con sessioni che riprendono ritmo. Non interpreto come invito al deload immediato né come carta bianca al volume massimo.`,
          `Prime settimane Blocco 1 dovrebbero far salire CTL lentamente se volume è progressivo. Se ATL esplode mentre TSB crolla sotto −15 per due settimane con sonno peggiorato, intervengo prima della settimana 13 programmata.`,
          `${SESSIONS_DOC} sessioni documentate nel trimestre precedente costruiscono la base statistica Zepp. Numeri personali, non benchmark universali.`,
        ],
      },
      {
        h2: "Priorità muscolari nelle prime settimane",
        paragraphs: [
          `Dorsali restano focus: volume distribuito su A1 e A2 con angoli diversi. Polpacci ad alta frequenza — serie in ogni sessione — perché genetica e obiettivo estetico lo richiedono. Petto alto e deltoidi laterali seguono, non dominano.`,
          `Gambe: pattern accosciato B1 e catena posteriore B2. Non trasformo settembre in «solo upper» perché Instagram premia pettorali. Bilanciamento previene infortuni e favorisce progressione reale.`,
          `Clean Halo e finisher kettlebell — già descritti in articoli precedenti del <a href="/diario/">Diario</a> — restano chiusura scheda, non sostituto del lavoro principale.`,
        ],
      },
      {
        h2: "RIR, cedimento e wafer: regole del trimestre",
        paragraphs: [
          `RIR onesti sui composti; micro-serie a scalare (wafer) su accessori quando affaticamento locale lo richiede — pratica consolidata nel trimestre estivo. Prime settimane Blocco 1: meno wafer eroici, più ripetizioni pulite.`,
          `Cedimento sistematico su press inclinata o lat machine ogni sessione, a ${AGE} anni, accumula debito. Preferisco ultima serie challenging con spotter immaginario (= autocontrollo), non dramma da reel.`,
          `Log kg verificati solo se in exercise-progress o export sessione — non invento PR settembrini in questo pezzo.`,
        ],
      },
      {
        h2: "Sonno, rientro lavoro e stress di settembre",
        paragraphs: [
          `Settembre riporta routine: sveglia, commute, riunioni. Stress non compare su CTL ma accorcia recupero percepito. Proteggo sonno come variabile primaria — stessa finestra notturna, niente allenamento tarde se domani è pesante.`,
          `Se prima settimana lavorativa coincide con DOMS alto, non compenso con sessione extra: mantengo split o accorci sessione, non raddoppio.`,
          `Per chi sono e perché documento costanza: <a href="/chi-sono/">Chi sono</a>.`,
        ],
      },
      {
        h2: "Segnali che le prime settimane stanno funzionando",
        paragraphs: [
          `Segnali positivi: stessi kg con RIR che scende gradualmente; energia pre-sessione stabile; nessun dolore articolare nuovo persistente; TSB che non crolla oltre soglia personale.`,
          `Segnali negativi: performance piatta con RIR che si accorciano per fatica sistemica; sonno frammentato; avversione alla palestra duratura; fastidi tendinei che non passano in 72 ore — valutazione medica se persistono.`,
          `Non uso percentuali da studi che non ho letto in fonte primaria. Uso osservazione personale su ${TRAINING_YEARS} anni di costanza.`,
        ],
      },
      {
        h2: "Dal settembre alla settimana 13: cosa mi aspetto",
        paragraphs: [
          `Prime settimane → mesi centrali con progressione volume/controllata → settimana 13 deload (−40% volume, RIR alti). Settembre non decide l'esito del blocco: decide se entro con intelligenza o con ego.`,
          `Obiettivo dicembre: chiudere Blocco 1 con adattamenti consolidati e aprire Fase 2 Tensione + Forza senza infortuni. Mass phase e volume — tema dell'articolo companion nel <a href="/diario/">Diario</a> — si regolano dentro questa arc.`,
          `Aggiornamenti futuri in <a href="/allenamenti/">Allenamenti</a> quando sessioni exportate; qui resta riflessione tecnica senza prescrizione medica.`,
        ],
      },
    ],
    figures: [
      {
        alt: "Vignetta cartoon CTL ATL TSB — lettura carico prime settimane Blocco 1",
        caption: "Fig. 1 · Carico al 25 agosto: termometro per settembre, non verdetto assoluto",
      },
      {
        alt: "Cartoon editoriale recupero attivo — atleta maturo tra sonno e sessione",
        caption: "Fig. 2 · Recupero nelle prime settimane: sonno prima del +10% serie",
      },
    ],
    faq: [
      {
        q: "Quando inizia operativamente il Blocco 1?",
        a: "Settembre 2026 segna le prime settimane operative dopo annuncio luglio. Due settimane di entrata conservativa, poi progressione. Tredici settimane totali con deload settimana 13.",
      },
      {
        q: "Cosa significa split A1-B1-A2-B2 nelle prime settimane?",
        a: "Quattro sessioni alternate upper/lower con enfasi diverse: A1 petto alto e dorsali, B1 accosciato, A2 schiena e spalle, B2 catena posteriore. Stesso schema anno macro; cambiano serie e carichi tra fasi.",
      },
      {
        q: "CTL 25 e TSB -6 a settembre: devo preoccuparmi?",
        a: `Al ${LOAD_AS_OF} TSB ${TSB} indica fatica recente > fitness — comune a rientro. Monitoro sonno e performance 2–3 settimane; se peggiora, riduco volume prima del deload programmato. ${SESSIONS_DOC} sessioni documentate.`,
      },
      {
        q: "Posso saltare le prime settimane «facili»?",
        a: `No. A ${AGE} anni tendini e SNC si adattano con ritmo lento. Saltare entrata aumenta rischio infortuni. Progressione piccola batte kg eroici a settembre.`,
      },
      {
        q: "Dove trovo la scheda completa del Blocco 1?",
        a: "Articolo blocco-1-ipertrofia-accumulo-settembre-2026 nel Diario e hub Allenamenti trimestre. Questo pezzo copre solo prime settimane e adattamento.",
      },
      {
        q: "La Forza Quotidiana è personal training?",
        a: "No. Diario di Gino Capon — riflessione tecnica, numeri verificabili, zero vendita coaching. Per programmi personalizzati consulta professionisti.",
      },
    ],
  },

  "weeks-into-mass-phase-57-anni": {
    title: "Quattro settimane in mass phase: pasta e divano | Gino",
    meta_description:
      "Satira goliardica «4 weeks into the mass phase»: Gino 57 anni, mass phase = rigatoni e telecomando. Finzione cartoon, costanza vera in Allenamenti — zero coaching.",
    h1: "Quattro settimane in mass phase: la mia bulk sul divano (a 57 anni)",
    og_title: "4 weeks into the mass phase — versione divano",
    breadcrumb: "Weeks into mass phase",
    aeo_label: "Sintesi Articolo",
    aeo_lead: `Il trend Reddit <strong>«4 weeks into the mass phase»</strong> mostra pump, riso e pollo, progressi da specchio. La mia versione a <strong>${AGE} anni</strong>: <strong>quattro settimane</strong> di mass phase dove la massa che cresce più velocemente sta sul <strong>piatto di pasta</strong>, non sui deltoidi. Finzione goliardica nel <a href="/diario/">Diario</a>, costanza vera documentata in <a href="/allenamenti/">Allenamenti</a> — profilo in <a href="/chi-sono/">Chi sono</a>.`,
    hero_alt:
      "Cartoon goliardico: Gino stropicciato sul divano con piatto di pasta gigante — parodia mass phase Reddit",
    hero_caption: "Settimana 4 di mass phase: il pump è al sugo, non al bilanciere.",
    sections: [
      {
        h2: "Settimana 1: entro in bulk con entusiasmo da thread",
        paragraphs: [
          `Leggo su Reddit «4 weeks into the mass phase» e penso: finalmente posso mangiare come un adulto responsabile che ha scoperto i carboidrati. Compro pasta, riso, pane — il trittico sacro del bro che bulk. La prima settimana il mio mass phase somiglia a un festival gastronomico con logo Zepp sul polso.`,
          `In palestra faccio la sessione A1 con la coscienza pulita di chi «sta bulkando». Poi torno a casa e il divano chiama più del bilanciere. Non invento kg: la costanza vera resta in <a href="/allenamenti/">Allenamenti</a>. Qui racconto la parodia.`,
          `Ginevra chiede se sto «crescendo». Sì: verticalmente, seduto sul cuscino.`,
        ],
      },
      {
        h2: "Settimana 2: il pump migr verso la pancia",
        paragraphs: [
          `Settimana due del trend: su Reddit postano bicipiti e «quads growing». Io posto internamente la crescita del rapporto tra me e il telecomando. Ogni serie extra di lat machine viene compensata da una serie extra di rigatoni.`,
          `Autoironia: a ${AGE} anni la mass phase da influencer richiede meal prep, sonno, disciplina. La mia richiede solo aprire l'armadio. Il CTL ${CTL} al ${LOAD_AS_OF}? Reale, documentato — ma non lo uso per giustificare la carbonara domenicale.`,
          `Il <a href="/diario/">Diario</a> distingue finzione da log: sessioni vere esistono; la bulk da divano è satira.`,
        ],
      },
      {
        h2: "Settimana 3: riso e pollo vs la mia realtà",
        paragraphs: [
          `Nei thread da mass phase c'è always meal prep: contenitori, broccoli tristi, pollo identico. La mia settimana tre ha yogurt, caffè e pasta avanzata. Il contrasto non è moralismo — è comicità sul divario tra liturgia Reddit e vita da papà stropicciato.`,
          `Potrei fingere shake e bilancia da cucina. Preferisco cartoon e verità: ${TRAINING_YEARS} anni dal ${TRAINING_START} di palestra reale, bulk immaginaria sul divano.`,
          `Per chi sono davvero: <a href="/chi-sono/">Chi sono</a>.`,
        ],
      },
      {
        h2: "Settimana 4: check-in da mass phase",
        paragraphs: [
          `Quarta settimana: su Reddit il check-in mostra progressi, side chest, macro. Il mio check-in mostra impressione del sedere sul divano e cruscotto Netflix. Titolo del thread: «4 weeks into the mass phase». Sottotitolo mio: «4 weeks into the mass… of pasta».`,
          `Non invento percentuali body fat — vietate dal mio stesso regolamento. Non invento kg sul bilanciere home che non peso. Satira pura.`,
          `La costanza in sala pesi continua — TSB ${TSB}, fatica recente reale — ma la narrativa goliardica resta sul cibo e sul divano.`,
        ],
      },
      {
        h2: "Mass phase vs mass fase: distanza dal mito",
        paragraphs: [
          `Il mito: bulk pulita, surplus calcolato, progressione speculare. La mia parodia: surplus emotivo dopo giornata lunga, divano come macchina a recupero «attivo». Entrambe convivono nel racconto: tecnica altrove nel Diario, fumetto qui.`,
          `A ${AGE} anni so cosa sarebbe una mass phase seria — surplus moderato, volume regolato. Scelgo di prendermi in giro prima che lo faccia Internet.`,
          `Zero vendita integratori, zero coaching da bulk. Newsletter chiede email, non circonferenze.`,
        ],
      },
      {
        h2: "Cosa resta vero sotto la satira",
        paragraphs: [
          `${SESSIONS_DOC} sessioni documentate, ${AGE} anni, ${TRAINING_YEARS} anni di costanza. Il divano è scena comica; la palestra è abitudine reale.`,
          `TSB ${TSB} al ${LOAD_AS_OF} — numero vero che dice fatica recente, non permission slip per abbandonare tutto.`,
          `Goliardia ≠ menzogna sul percorso. Finzione visiva, impegno documentato.`,
        ],
      },
      {
        h2: "Peaking sul divano vs peaking da gara",
        paragraphs: [
          `Cugino spirituale: articolo check-weeks-natural-viking nel <a href="/diario/">Diario</a> — peaking col telecomando invece che col palco. Questo pezzo applica la stessa logica al bulk: rituali da thread, esecuzione da serie TV.`,
          `Pose practice? Affondare nel cuscino. Carb load? Già fatto. Water cut? Solo se conto le bibite.`,
          `Se cerchi cronaca gara, cambia canale. Se cerchi autoironia matura, sei a posto.`,
        ],
      },
      {
        h2: "Settimana 5: torno umano (forse)",
        paragraphs: [
          `Dopo quattro settimane satiriche ammetto: il divano non costruisce dorsali. Torno a leggere volume e Blocco 1 nei pezzi tecnici del <a href="/diario/">Diario</a> e a registrare sessioni in <a href="/allenamenti/">Allenamenti</a>.`,
          `La mass phase continua — quella vera, lenta, noiosa, matura. La mass phase cartoon finisce con questo articolo.`,
          `Grazie per aver riso. Ora vado in palestra — davvero.`,
        ],
      },
    ],
    figures: [
      {
        alt: "Cartoon goliardico: meal prep Reddit vs piatto pasta caotico sul divano",
        caption: "Fig. 1 · Riso e pollo da thread vs rigatoni da papà",
      },
      {
        alt: "Vignetta satirica: check-in mass phase settimana 4 con telecomando e cuscino",
        caption: "Fig. 2 · Check-in settimana 4: side chest sul divano",
      },
    ],
    faq: [
      {
        q: "Gino bulk sul divano davvero?",
        a: "No. Finzione goliardica sul trend «4 weeks into the mass phase». Costanza palestra documentata in Allenamenti. Satira pasta/divano, non reportage nutrizionale.",
      },
      {
        q: "Inventi kg o body fat in questo articolo?",
        a: "No. Zero percentuali body fat, zero kg non verificati. Numeri reali citati: età, anni allenamento, CTL/ATL/TSB al 25 agosto. Resto è parodia.",
      },
      {
        q: "Cosa significa «4 weeks into the mass phase» qui?",
        a: "Parodia del format Reddit dove atleti mostrano progressi a quattro settimane di bulk. Gino satirizza con pasta, divano e autoironia — distanza tra mito social e vita da dilettante 57enne.",
      },
      {
        q: "Dove trovo la versione seria della mass phase?",
        a: "Articolo tecnico volume-mass-phase-natural nel Diario e Blocco 1 prime settimane settembre. Questo pezzo è solo goliardia.",
      },
      {
        q: "Le immagini sono reali?",
        a: "Illustrazioni cartoon generate con IA — disclosure in pagina e link Trasparenza AI. Non foto palestra documentali.",
      },
      {
        q: "La Forza Quotidiana vende piani bulk?",
        a: "No. Diario personale, newsletter gratuita, zero coaching commerciale. Per nutrizione personalizzata consulta professionisti.",
      },
    ],
  },
};

function ensureQueueItem(queue, spec) {
  let item = queue.items.find((i) => i.slug === spec.slug);
  if (!item) {
    item = {
      id: `batch-${DATE}-${spec.slug.slice(0, 12)}`,
      slug: spec.slug,
      status: "proposed",
      hero_brief: "Fumetto surreale — palette scura, NO stock palestra",
      hero_concept: "comic surreal JoJo-light",
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
  });
  if (spec.trending_title) item.trending_title = spec.trending_title;
  return item;
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

  const kettle = queue.items.find((i) => i.slug === "kettlebell-spalle-mobilita-57-anni");
  if (kettle) {
    kettle.status = "proposed";
    kettle.notes = "Duplicato di clean-halo-kettlebell-spalle-a-57-anni — stesso angolo mobilità spalle, non schedulare.";
    delete kettle.paths;
    delete kettle.title_draft;
    delete kettle.meta_draft;
    delete kettle.h1_draft;
  }

  queue.updated = todayISO();
}

async function main() {
  const imgDir = path.join(REPO_ROOT, "img/diario", DATE);
  fs.mkdirSync(imgDir, { recursive: true });

  const results = [];
  const successPaths = [];

  for (const spec of QUEUE_ITEMS) {
    const article = ARTICLES[spec.slug];
    if (!article) throw new Error(`Contenuto mancante per ${spec.slug}`);

    const paths = buildPaths(spec.slug);
    await copyImages(spec, paths);

    const html = renderDiarioHtml(article, spec, paths, DATE);
    const htmlPath = path.join(REPO_ROOT, paths.html);
    fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
    fs.writeFileSync(htmlPath, html);

    results.push({ spec, paths, article });
    successPaths.push(paths.html, paths.hero, paths.figures[0], paths.figures[1]);
  }

  const queue = readJson("data/editorial-queue.json");
  updateQueue(queue, results);
  writeJson("data/editorial-queue.json", queue);

  console.log(`\n✓ Batch editoriale ${DATE} completato:\n`);
  for (const p of successPaths) {
    console.log(`  ${p}`);
  }
  console.log(`\n  data/editorial-queue.json aggiornato (${QUEUE_ITEMS.length} scheduled, kettlebell → proposed)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
