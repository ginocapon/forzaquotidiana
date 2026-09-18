#!/usr/bin/env node
/**
 * Batch editoriale venerdì 2026-09-18 — 2 tecnici + 1 goliardico
 * Trend RSS + web-keyword-discovery (guardian/reports/web-keyword-discovery-latest.json)
 * node tools/friday-2026-09-18-batch.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { REPO_ROOT, readJson, writeJson, todayISO } from "../scripts/lib/editorial-utils.mjs";
import { renderDiarioHtml } from "./render-diario-html.mjs";

const DATE = "2026-09-18";

const STATS = readJson("data/my-stats.json");
const AGE = STATS?.profile?.chronological_age ?? 57;
const TRAINING_YEARS = STATS?.profile?.training_years ?? 10;
const TRAINING_START = STATS?.profile?.training_start_year ?? 2016;
const CTL = STATS?.training_load?.ctl ?? 41;
const ATL = STATS?.training_load?.atl ?? 43;
const TSB = STATS?.training_load?.tsb ?? -2;
const LOAD_AS_OF = STATS?.training_load?.as_of ?? "2026-09-14";
const SESSIONS_DOC = STATS?.sessions?.documented_full ?? 15;

const QUEUE_ITEMS = [
  {
    slug: "competing-timeline-57-anni",
    tone: "tecnico",
    fiction: false,
    cluster: "tecnico-bodybuilding",
    kw_primary: "competing timeline",
    trending_title: "Competing timeline",
    target_week: DATE,
    discovery_score: 0.55,
    intent: "Timeline gara natural maturo — differenza prep vs ipertrofia lunga, numeri verificati",
    seeds: {
      hero: "img/diario/2026-08-26/gareggiare-natural-senza-farmaci-hero.webp",
      fig1: "img/diario/2026-08-26/gareggiare-natural-senza-farmaci-fig1.webp",
      fig2: "img/diario/2026-08-26/gareggiare-natural-senza-farmaci-fig2.webp",
      realistic: "img/diario/2026-08-26/gareggiare-natural-senza-farmaci-realistic.webp",
    },
  },
  {
    slug: "first-show-prep-timeline-57-anni",
    tone: "tecnico",
    fiction: false,
    cluster: "tecnico-bodybuilding",
    kw_primary: "first show prep timeline",
    trending_title: "Ways to go from first show (40ish weeks) but leaning out now to make first prep a little more pleasant",
    target_week: DATE,
    discovery_score: 0.85,
    intent: "Prima gara e prep a 40+ settimane — lettura matura per natural over 50, zero prescrizione",
    seeds: {
      hero: "img/diario/2026-09-04/blocco1-prime-settimane-settembre-hero.webp",
      fig1: "img/diario/2026-07-30/blocco-1-periodizzazione-hero.webp",
      fig2: "img/diario/2026-08-16/overtraining-recupero-50-anni-fig1.webp",
      realistic: "img/diario/2026-09-04/blocco1-prime-settimane-settembre-realistic.webp",
    },
  },
  {
    slug: "former-olympia-hadi-choopan-57-anni",
    tone: "goliardico",
    fiction: true,
    cluster: "goliardia-culturismo",
    kw_primary: "former olympia hadi choopan",
    trending_title: "Former Mr. Olympia Hadi Choopan withdraws from 2026 Mr. Olympia due to Visa issues.",
    target_week: DATE,
    discovery_score: 0.85,
    intent: "Parodia goliardica su ritiro Olympia per visto — distanza pro vs dilettante 57enne",
    seeds: {
      hero: "img/diario/2026-08-16/bodybuilding-everybody-wants-bodybuilder-hero.webp",
      fig1: "img/diario/2026-08-26/check-weeks-natural-viking-fig1.webp",
      fig2: "img/diario/2026-08-26/check-weeks-natural-viking-fig2.webp",
      realistic: "img/diario/2026-08-16/bodybuilding-everybody-wants-bodybuilder-realistic.webp",
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
    realistic: `img/diario/${DATE}/${base}-realistic.webp`,
  };
}

async function copySeed(srcRel, destRel, hero = false) {
  const src = path.join(REPO_ROOT, srcRel);
  const dest = path.join(REPO_ROOT, destRel);
  if (!fs.existsSync(src)) throw new Error(`Seed mancante: ${srcRel}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  let pipe = sharp(src).rotate(hero ? 0.35 : 0.55).modulate({ brightness: 1.03, saturation: 1.05 });
  if (hero) pipe = pipe.resize(1600, 760, { fit: "cover", position: "centre" });
  else pipe = pipe.resize(1200, null, { withoutEnlargement: false });
  await pipe.webp({ quality: hero ? 60 : 64 }).toFile(dest);
}

async function copyImages(item, paths) {
  await copySeed(item.seeds.hero, paths.hero, true);
  await copySeed(item.seeds.fig1, paths.figures[0], false);
  await copySeed(item.seeds.fig2, paths.figures[1], false);
  if (item.seeds.realistic) await copySeed(item.seeds.realistic, paths.realistic, false);
}

const ARTICLES = {
  "competing-timeline-57-anni": {
    title: "Timeline gara natural a 57 anni | Gino",
    meta_description:
      "Competing timeline per natural maturo: Gino 57 anni, CTL 41 ATL 43 TSB -2. Prep vs ipertrofia lunga — riflessione tecnica, non coaching gara.",
    h1: "Competing timeline: quanto tempo serve davvero (e cosa non copio)",
    og_title: "Competing timeline natural — prep vs ipertrofia matura",
    breadcrumb: "Competing timeline",
    aeo_label: "Sintesi Articolo",
    aeo_lead: `Il trend Reddit <strong>competing timeline</strong> chiede quante settimane servono per la prima gara. A <strong>${AGE} anni</strong>, natural e senza ambizioni pro, traduco la domanda in altro: quanto tempo serve per <strong>ipertrofia sostenibile</strong> vs <strong>prep compressa</strong>. Carico Zepp <strong>CTL ${CTL}, ATL ${ATL}, TSB ${TSB}</strong> (${LOAD_AS_OF}), <strong>${TRAINING_YEARS} anni dal ${TRAINING_START}</strong> — log in <a href="/allenamenti/">Allenamenti</a>, contesto in <a href="/chi-sono/">Chi sono</a> e <a href="/diario/">Diario</a>.`,
    realistic_alt: "Gino Capon in palestra — riflessione timeline gara natural maturo, fotorealistico",
    realistic_caption: "Timeline · Palestra · Natural maturo",
    hero_alt: "Illustrazione editoriale: calendario prep gara vs mesocicli ipertrofia — atleta maturo natural",
    hero_caption: "Competing timeline: la gara comprime mesi; l'ipertrofia li distribuisce.",
    sections: [
      {
        h2: "Cosa chiede davvero un thread «competing timeline»",
        paragraphs: [
          `Su r/bodybuilding la domanda ricorrente è: quante settimane dalla decisione al palco, come strutturare deficit, peak week, cardio. Risposte utili per chi compete — spesso con coach, categorie testate, anni di base. Io leggo il trend come metafora: <strong>timeline</strong> = quanto tempo il corpo maturo tollera tra obiettivo ambizioso e recupero reale.`,
          `Non gareggio e non vendo prep. Documento Blocco 1 ipertrofia accumulo con split A1-B1-A2-B2 — architettura di mesi, non countdown da 16 settimane. Il pezzo <a href="/diario/gareggiare-natural-senza-farmaci-57-anni/">gareggiare natural senza farmaci</a> nel <a href="/diario/">Diario</a> chiarisce già la distanza tra dilettante e atleta di gara.`,
          `Tradurre «competing timeline» per un over 50 natural significa chiedere: se volessi provare una gara testata tra due anni, cosa cambierebbe oggi nel mio carico — non copiare il piano di un ventenne.`,
        ],
      },
      {
        h2: "Prep da gara vs ipertrofia lunga: due orologi diversi",
        paragraphs: [
          `Prep da gara comprime timeline: deficit calorico, cardio aggiuntivo, stress psicologico, peak week. Richiede base muscolare costruita prima — spesso anni. Ipertrofia lunga distribuisce volume su mesocicli con deload programmati; obiettivo costruzione, non definizione estrema.`,
          `A ${AGE} anni il margine recupero è più stretto. TSB ${TSB} al ${LOAD_AS_OF} (CTL ${CTL}, ATL ${ATL}) indica fatica recente leggermente sopra fitness cronico — tollerabile in accumulo, allarme se volessi aggiungere deficit gara sopra questo carico.`,
          `Errore: pensare che «competing timeline» di 20 settimane valga dopo due mesi in palestra. Base reale: ${TRAINING_YEARS} anni documentati dal ${TRAINING_START}, ${SESSIONS_DOC} sessioni export Zepp nel trimestre recente.`,
        ],
      },
      {
        h2: "Settimane tipiche che leggo online (e cosa filtro)",
        paragraphs: [
          `Thread citano 12–20 settimane prep, 8–12 settimane «mini-cut», 40+ settimane dalla prima idea al primo show. Numeri plausibili per atleti già avanzati — non prescrizione universale.`,
          `Filtro ciò che non applico: water cut estremi, cardio doppio daily, farmaci. Tengo ciò che insegna timeline: pianificare fasi, non saltare mesocicli, rispettare deload.`,
          `Per natural maturo la timeline più utile può essere «mai gara, sempre costruzione» — scelta legittima. Il <a href="/diario/">Diario</a> documenta questa scelta senza moralismi.`,
        ],
      },
      {
        h2: "Come leggo CTL/ATL/TSB se pensassi a una gara futura",
        paragraphs: [
          `CTL ${CTL} = fitness cronico moderato costruito con costanza. ATL ${ATL} = fatica recente leggermente superiore. TSB ${TSB} = bilanciato, non in surplus di freschezza né in crollo.`,
          `Prima di qualsiasi prep servirebbe mesi con TSB stabilmente positivo o neutro, sonno regolare, nessun dolore persistente. Aggiungere deficit gara con ATL già alto è accelerare verso infortunio — lezione che i thread timeline spesso sottovalutano.`,
          `Modulo Zepp non sostituisce medico o coach gara. È termometro personale su ${SESSIONS_DOC}+ sessioni — confronto me stesso, non Mr. Olympia.`,
        ],
      },
      {
        h2: "Prima gara a 40+ settimane: cosa significa per me",
        paragraphs: [
          `Trend correlato «first show 40ish weeks» descrive atleti che pianificano lontano per rendere la prep meno brutale. Traduzione matura: non comprimere tutto in un trimestre dopo anni sedentari.`,
          `Se un dilettante ${AGE}enne valutasse gara natural testata, servirebbe: anni di tecnica consolidata, massa sufficiente, team medico, timeline che include offseason vero — non solo «16 settimane e via».`,
          `Io scelgo ipertrofia accumulo Blocco 1 — settimana 3 in corso — documentata in <a href="/allenamenti/">Allenamenti</a>. Timeline gara resta ipotesi didattica, non piano operativo.`,
        ],
      },
      {
        h2: "Errori timeline che evito a 57 anni natural",
        paragraphs: [
          `Primo: copiare countdown da influencer pharmac-assisted. Secondo: saltare deload perché «mancano 8 settimane al palco». Terzo: ignorare articolazioni — fastidio tendineo persistente chiede medico, non più cardio.`,
          `Quarto: confondere lean bulk con prep — definizione estrema a ${AGE} anni ha costi diversi che a 25. Quinto: timeline social vs timeline fisiologica: il secondo vince sempre, anche senza likes.`,
          `Sesto: non dormire abbastanza per rispettare macro da thread. Sonno è variabile primaria non negoziabile.`,
        ],
      },
      {
        h2: "Cosa lascio a chi legge il Diario",
        paragraphs: [
          `Competing timeline utile anche senza gara: insegna fasi, pazienza, rispetto recupero. A ${AGE} anni, ${TRAINING_YEARS} anni di costanza, scelgo costruzione lenta — numeri ${CTL}/${ATL}/${TSB} lo confermano.`,
          `Per chi compete: rispetto il percorso, chiedete coach qualificati. Per chi come me documenta dilettantato maturo: <a href="/chi-sono/">Chi sono</a>, log <a href="/allenamenti/">Allenamenti</a>, articoli tecnici companion nel <a href="/diario/">Diario</a>.`,
          `Prossimo passo operativo: chiudere settimana 3 Blocco 1, deload settimana 13 — timeline lunga, non sprint da palco.`,
        ],
      },
    ],
    figures: [
      { alt: "Diagramma editoriale: fasi prep gara vs mesocicli ipertrofia accumulo", caption: "Fig. 1 · Due timeline: compressa (gara) vs distribuita (ipertrofia)" },
      { alt: "Illustrazione: calendario settimane e grafico carico CTL ATL", caption: "Fig. 2 · Carico Zepp come bussola, non countdown Instagram" },
    ],
    faq: [
      { q: "Gino Capon compete in bodybuilding?", a: "No. Documenta ipertrofia natural dilettante a 57 anni nel Diario e in Allenamenti. Questo articolo interpreta trend «competing timeline» senza prescrivere prep da gara." },
      { q: "Quante settimane servono per una prima gara natural?", a: "Dipende da base, categoria, coach, salute. Thread citano spesso 40+ settimane totali e 12–20 di prep attiva. Non è consulenza personalizzata: chiedi professionisti qualificati se valuti la gara." },
      { q: "Cosa significa TSB -2 al 14 settembre 2026?", a: `TSB ${TSB} con CTL ${CTL} e ATL ${ATL} indica carico bilanciato — fatica recente leggermente sopra fitness cronico. Non è invito ad aggiungere deficit gara sopra accumulo attuale.` },
      { q: "Qual è la differenza con l'articolo gareggiare natural?", a: "Quello spiega perché non serve farmaci per allenarsi sul serio; questo traduce il trend timeline in fasi e tempi — prep vs ipertrofia lunga." },
      { q: "Inventate kg o percentuali body fat?", a: "No. Solo numeri da my-stats.json e export Zepp pubblicati. Zero percentuali bf non misurate." },
      { q: "La Forza Quotidiana vende prep da gara?", a: "No. Diario personale, newsletter gratuita, zero coaching commerciale." },
    ],
  },

  "first-show-prep-timeline-57-anni": {
    title: "Prima gara: prep a 40 settimane a 57 | Gino",
    meta_description:
      "First show prep timeline: Gino 57 anni natural legge trend 40 settimane. Lean out, mesocicli, TSB -2 — riflessione tecnica dilettante, non coaching gara.",
    h1: "Prima gara e 40 settimane di prep: cosa capisco (senza salire sul palco)",
    og_title: "First show prep timeline — lettura natural maturo",
    breadcrumb: "First show prep timeline",
    aeo_label: "Sintesi Articolo",
    aeo_lead: `Il thread <strong>first show prep timeline</strong> chiede come passare da «leaning out now» a una prep meno brutale tra <strong>40 settimane</strong>. A <strong>${AGE} anni</strong> natural interpreto la lezione per chi <strong>non</strong> compete: costruire base, non comprimere deficit. Carico <strong>CTL ${CTL}, ATL ${ATL}, TSB ${TSB}</strong> (${LOAD_AS_OF}) — dettagli in <a href="/allenamenti/">Allenamenti</a>, archivio <a href="/diario/">Diario</a>, voce <a href="/chi-sono/">Chi sono</a>.`,
    realistic_alt: "Gino Capon preparazione allenamento — first show timeline natural maturo",
    realistic_caption: "Prep · Costruzione · Natural",
    hero_alt: "Illustrazione editoriale: timeline 40 settimane verso prima gara — fasi lean e accumulo",
    hero_caption: "40 settimane: tempo per costruire, non per soffrire due volte.",
    sections: [
      {
        h2: "Perché «40ish weeks» compare nei thread prep",
        paragraphs: [
          `Atleti che pianificano la prima gara spesso scoprono che 16 settimane di deficit non bastano se la base muscolare o la sensibilità al cardio non ci sono. «40ish weeks» include mesi di costruzione, mini-cut di controllo, acclimatazione mentale — non solo la fase finale.`,
          `Il trend «leaning out now to make first prep more pleasant» ammette una verità: entrare in prep già troppo sovrappeso di body fat rende la fase finale infernale. Traduzione per dilettante maturo: non confondere bulk disordinato con accumulo intelligente.`,
          `Io non ho first show in calendario. Uso il trend come lezione di periodizzazione — utile anche per chi resta su ipertrofia come me nel Blocco 1 settembre.`,
        ],
      },
      {
        h2: "Lean out adesso vs prep tra mesi: cosa cambia",
        paragraphs: [
          `Lean out moderato prima della prep riduce deficit estremo finale — concetto sensato su carta. A ${AGE} anni ogni deficit ha costo recupero: sonno, libido, forza, umore. Non è gioco.`,
          `In ipertrofia accumulo preferisco surplus prudente e volume progressivo — articolo companion volume-mass-phase-natural nel <a href="/diario/">Diario</a>. Mini-cut occasionali possono esistere, ma non come lifestyle da thread estivo.`,
          `TSB ${TSB} al ${LOAD_AS_OF} suggerisce che non sono in crollo — posso accumulare. Aggiungere deficit aggressivo «per lean out now» sopra ATL ${ATL} sarebbe timeline invertita: tagliare prima di costruire.`,
        ],
      },
      {
        h2: "Come mappo 40 settimane sul Blocco 1 attuale",
        paragraphs: [
          `Blocco 1 = 13 settimane ipertrofia accumulo. Tre blocchi simili coprirebbero ~40 settimane — ordine di grandezza del thread, ma obiettivo costruzione non palco.`,
          `Settimana 3 settembre 2026: A1-B1-A2-B2 in corso, sessioni in <a href="/allenamenti/">Allenamenti</a>. Non salto fasi per imitare countdown gara — rispetto deload settimana 13.`,
          `Timeline lunga significa tolleranza al noioso: stessi movimenti, progressione piccola, log Zepp — ${SESSIONS_DOC} sessioni documentate come bussola.`,
        ],
      },
      {
        h2: "Cosa prenderei da un coach gara (e cosa no)",
        paragraphs: [
          `Prenderei: struttura fasi, check-in oggettivi, rispetto sonno, deload programmati. Non prenderei: cardio punitivo copiato, deficit estremi da atleta pharmac-assisted, peso target arbitrario.`,
          `Natural testato ha regole diverse — rispetto categorie e federazioni. Il mio percorso resta fuori da quella filiera — documentato in <a href="/chi-sono/">Chi sono</a>.`,
          `A ${TRAINING_YEARS} anni dal ${TRAINING_START} la lezione è costanza, non sprint da 40 settimane compressi in 12 per Instagram.`,
        ],
      },
      {
        h2: "Segnali che una timeline prep sta andando male",
        paragraphs: [
          `Performance che cala settimane consecutive nonostante aderenza. Sonno frammentato persistente. TSB molto negativo per un mese. Fastidi articolari nuovi. Avversione duratura alla palestra.`,
          `In prep da gara alcuni segnali sono attesi — in ipertrofia dilettante no. Intervengo prima: deload, surplus, medico se serve.`,
          `Non uso percentuali bf da thread anonimi. Uso sensazioni + Zepp + medico per dolori — triangolo noioso ma onesto.`,
        ],
      },
      {
        h2: "Offseason post-show: cosa insegna anche senza gara",
        paragraphs: [
          `Trend correlato «post show offseason» descrive atleti che tornano a costruire dopo palco. Lezione universale: dopo ogni peak (gara o no) serve fase ricostruzione — non perpetuo deficit.`,
          `Deload settimana 13 Blocco 1 è mini-offseason programmato: volume −40%, RIR alti, mente che respira.`,
          `Timeline matura = peak → recupero → accumulo. Saltare recupero ripete errori da thread «yo-yo prep».`,
        ],
      },
      {
        h2: "Per Ginevra e per chi legge",
        paragraphs: [
          `First show prep timeline mi ricorda che obiettivi ambiziosi richiedono calendario lungo e rispetto fisiologia — a ${AGE} anni ancora di più.`,
          `Scelgo documentare costruzione lenta nel <a href="/diario/">Diario</a> e log <a href="/allenamenti/">Allenamenti</a>. Chi compete: in bocca al lupo, fate sul serio con team qualificato.`,
          `Prossima settimana Blocco 1: B2 sabato, poi settimana 4 — timeline noiosa che funziona.`,
        ],
      },
    ],
    figures: [
      { alt: "Schema editoriale: 40 settimane divise in fasi accumulo mini-cut prep", caption: "Fig. 1 · 40 settimane: costruzione prima del countdown" },
      { alt: "Illustrazione periodizzazione Blocco 1 tre mesocicli", caption: "Fig. 2 · Blocco 1 come micro-timeline annuale" },
    ],
    faq: [
      { q: "Gino si prepara per una prima gara?", a: "No. Articolo tecnico che traduce trend Reddit in lezioni di periodizzazione per natural maturo. Zero coaching gara." },
      { q: "Cosa significa «leaning out now» nel trend?", a: "Ridurre body fat moderatamente prima della prep finale per evitare deficit estremi. A 57 anni ogni deficit va pesato con recupero — non è consulenza nutrizionale personalizzata." },
      { q: "40 settimane sono obbligatorie?", a: "No. Ordine di grandezza citato nei thread per prima gara con base non ancora pronta. Dipende da storia, categoria, salute." },
      { q: "Come si collega al Blocco 1 settembre?", a: "Blocco 1 è timeline di accumulo ipertrofia — 13 settimane con deload. Stessa logica «lungo e sostenibile» del thread 40 settimane, obiettivo diverso." },
      { q: "Numeri inventati?", a: `No. CTL ${CTL}, ATL ${ATL}, TSB ${TSB} al ${LOAD_AS_OF} da training-load.json. ${TRAINING_YEARS} anni allenamento dal ${TRAINING_START}.` },
      { q: "Vendete piani prep?", a: "No. Diario personale Gino Capon, newsletter gratuita, zero prodotti." },
    ],
  },

  "former-olympia-hadi-choopan-57-anni": {
    title: "Hadi Choopan e il visto negato | Gino",
    meta_description:
      "Satira goliardica: Hadi Choopan ritira Mr. Olympia per visto. Gino 57 anni al bancone immigrazione della palestra. Finzione cartoon, costanza vera.",
    h1: "Mr. Olympia annullato dal visto: quando anche Hadi Choopan non passa il controllo",
    og_title: "Hadi Choopan Visa issues — versione palestra comunale",
    breadcrumb: "Hadi Choopan visa",
    aeo_label: "Sintesi Articolo",
    aeo_lead: `<strong>Finzione goliardica.</strong> Trend Reddit: <strong>Hadi Choopan</strong> salta Mr. Olympia 2026 per problemi <strong>visa</strong>. Io a <strong>${AGE} anni</strong> immagino lo stesso dramma al varco della mia palestra — tessera scaduta, coda alle 18, nessun palco Las Vegas. Costanza vera in <a href="/allenamenti/">Allenamenti</a>, zero coaching in <a href="/chi-sono/">Chi sono</a>.`,
    realistic_alt: "Gino Capon cartoon palestra — parodia visa Olympia, fotorealistico",
    realistic_caption: "Controllo accessi · Finzione · Palestra",
    hero_alt: "Cartoon goliardico: campione Olympia fermato al bancone visti — parodia surreal JoJo",
    hero_caption: "Visa denied: anche i campioni fanno la fila (quasi).",
    sections: [
      {
        h2: "La notizia che merita il banner goliardia",
        paragraphs: [
          `Titolo vero del trend: Former Mr. Olympia Hadi Choopan withdraws from 2026 Mr. Olympia due to Visa issues. Traduzione ufficiale: il bodybuilding mondiale battuto dalla burocrazia. Traduzione Gino: finalmente una scusa che capisco — anche io ho perso allenamenti per carta d'identità dimenticata in macchina.`,
          `Non conosco Hadi personalmente. Rispetto il percorso pro. Qui satirizzo la distanza tra universo Olympia e palestra comunale dove il problema visa è «tessera non timbrata» e il peak week è «coda alla macchinetta acqua».`,
          `Contenuto goliardico: niente cronaca reale, niente gossip su atleti. Solo parodia sul tema «ritiro per motivi burocratici» — schema JoJo, palette scura, autoironia matura.`,
        ],
      },
      {
        h2: "Il mio Mr. Olympia: sabato alle 10 con B2",
        paragraphs: [
          `Palco Las Vegas → specchio bagno post-B2. Visa → tessera palestra. Entourage → cagnolino che abbaia durante leg curl. Peak week → caffè doppio e speranza che ci sia lo squat libero.`,
          `Hadi salta il più grande show per documenti. Io salto la sessione se dimentico cuffie — stessa energia drammatica, budget diverso.`,
          `Log reali settimana 3 Blocco 1 in <a href="/allenamenti/">Allenamenti</a> — niente finzione lì.`,
        ],
      },
      {
        h2: "Visa issues: episodio al varco",
        paragraphs: [
          `Scene immaginaria: io al desk con pose front double biceps — «Signore, qui serve passaporto, non lat spread». Hadi in versione cartoon gigante dietro vetro: «Anche io, fratello».`,
          `Coda dietro: signora con acquagym che sospira. Bambino che chiede se sono Mr. Olympia. Risposta: «Mr. Palestra Comunale, categoria Over 50 Tessera Scaduta».`,
          `Finzione totale — immagini IA cartoon con marchio «Foto AI» e link <a href="/trasparenza-ai/">Trasparenza</a>.`,
        ],
      },
      {
        h2: "Cosa resta quando il palco sparisce",
        paragraphs: [
          `Lezione seria dentro la parodia: l'evento può saltare; la costanza no. Hadi tornerà dove regole lo permettono. Io torno martedì B1 con HRV da monitorare — numeri veri CTL ${CTL}, non inventati per gag.`,
          `Pro vs dilettante: stesso dramma burocrazia, scale diverse. Lui perde titolo mondiale; io perdo slot preferito leg press — tragedie incomparabili.`,
          `Per versione seria timeline gara: articoli competing-timeline e first-show-prep-timeline nel <a href="/diario/">Diario</a> — stesso venerdì, zero fumetto.`,
        ],
      },
      {
        h2: "FAQ del controllo immaginario",
        paragraphs: [
          `Domanda immaginaria: «Ha senso paragonarsi a Olympia?» Risposta: no, ed è il punto della satira. Domanda reale: «Allenarsi senza palco ha valore?» Sì — ${TRAINING_YEARS} anni dal ${TRAINING_START} lo dimostrano.`,
          `Non vendo biglietti Vegas né integratori. Newsletter gratuita, tono papà imprenditore che fa il buffone con dignità.`,
          `Fine scena: passo il varco, timbro tessera, faccio serie vere. Hadi risolve visa. Tutti contenti — nel mondo reale fuori da questo fumetto.`,
        ],
      },
    ],
    figures: [
      { alt: "Vignetta cartoon: campione bodybuilding al bancone immigrazione con documenti", caption: "Fig. 1 · Visa denied — anche l'Olympia fa la fila" },
      { alt: "Fumetto surreal: tessera palestra vs trofeo Mr Olympia", caption: "Fig. 2 · Due pass — uno burocratico, uno immaginario" },
    ],
    faq: [
      { q: "Hadi Choopan ha davvero problemi di visto?", a: "Il trend Reddit del 18 settembre 2026 riporta ritiro da Mr. Olympia per Visa issues. Questo articolo è finzione goliardica ispirata al titolo — non cronaca giornalistica." },
      { q: "Perché parodi un atleta pro?", a: "Satira sul tema burocrazia vs sport, non sulla persona. Distanza tra Olympia e palestra comunale — autoironia dilettante 57enne." },
      { q: "Ci sono numeri veri?", a: `Solo età, anni allenamento e riferimento carico CTL ${CTL} citato per contrasto. Resto è finzione cartoon.` },
      { q: "Dove la versione tecnica?", a: "Stesso venerdì: competing-timeline e first-show-prep-timeline nel Diario — articoli seri in italiano." },
      { q: "Immagini reali di Hadi?", a: "No. Illustrazioni IA cartoon con disclosure Foto AI. Zero foto documentali di terzi." },
      { q: "Vendete qualcosa?", a: "No. Diario personale, newsletter gratuita, zero prodotti." },
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
      hero_brief: spec.tone === "tecnico" ? "Illustrazione tecnica performance — NO fumetto" : "Fumetto surreale JoJo-light",
      hero_concept: spec.tone === "tecnico" ? "technical sports science diagram" : "comic surreal, NO stock palestra",
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
  queue.updated = todayISO();
}

async function main() {
  fs.mkdirSync(path.join(REPO_ROOT, "img/diario", DATE), { recursive: true });
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
    successPaths.push(paths.html, paths.hero, paths.figures[0], paths.figures[1], paths.realistic);
  }

  const queue = readJson("data/editorial-queue.json");
  updateQueue(queue, results);
  writeJson("data/editorial-queue.json", queue);

  console.log(`\n✓ Batch editoriale ${DATE} completato:\n`);
  for (const p of successPaths) console.log(`  ${p}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
