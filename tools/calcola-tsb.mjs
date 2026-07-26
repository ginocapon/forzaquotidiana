/**
 * Calcola CTL / ATL / TSB da carico Zepp in performance-sessions.json.
 * Uso: node tools/calcola-tsb.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(__dirname);
const sessionsPath = join(REPO, "data", "performance-sessions.json");
const tsbPath = join(REPO, "data", "performance-tsb.json");

const CTL_DAYS = 42;
const ATL_DAYS = 7;

/** Ancoraggio da screenshot Zepp (24/07) — allinea valori assoluti al device. */
const ZEPP_ANCHOR = { date: "2026-07-24", ctl: 35, atl: 40 };

/** Analisi curate per sessione — incrociate con dati reali del log. */
const ANALISI = {
  "2026-07-16-scheda-1": {
    titolo: "Riavvio dopo la pausa",
    testo:
      "Prima sessione documentata del trimestre: carico 85, FC media 115 e zona intensiva al 48%. Il TSB è ancora in territorio neutro — stai ricostruendo la forma dopo il calo di inizio luglio visibile nel grafico. Buona base per le sessioni successive.",
  },
  "2026-07-17-scheda-2": {
    titolo: "Serale senza export completo",
    testo:
      "Sessione serale con solo zone FC parziali — il carico non è nel JSON, quindi il grafico sottostima leggermente lo stimolo di quel giorno. Il trend generale resta valido: stai rientrando in ritmo con allenamenti ravvicinati.",
  },
  "2026-07-20-scheda-1": {
    titolo: "Picco di carico della settimana",
    testo:
      "Carico device 163* (con possibile inflazione da orologio idle) — giornata che spinge l'affaticamento (ATL) verso l'alto. FC media contenuta (104) ma durata lunga e 24 gruppi: volume alto su petto-dorsali-spalle. Il TSB scende: fase di accumulo.",
  },
  "2026-07-21-scheda-2": {
    titolo: "Volume lungo, carico moderato",
    testo:
      "Quasi 90 minuti e 30 gruppi, ma carico Zepp solo 46 — sessione lunga con intensità distribuita (61% zona intensiva, FC max 138). L'ATL sale per il tempo in sala più che per il picco cardiaco. Recupero utile prima del mercoledì intenso.",
  },
  "2026-07-23-scheda-3": {
    titolo: "Giorno più stressante del blocco",
    testo:
      "Carico 146, FC media 118 e max 165 — picco reale della settimana. Cedimenti su spalle e dorsali, Clean Halo in chiusura. Effetto aerobico e anaerobico «Buono». È questa sessione che spinge di più l'ATL verso il venerdì.",
  },
  "2026-07-24-scheda-4": {
    titolo: "Bilanciato · perfettibile",
    testo:
      "TSB in zona «Bilanciato»: affaticamento (ATL) leggermente sopra la forma (CTL), coerente con 5 sessioni in 9 giorni. Carico device 69* più basso del mercoledì, ma gambe al cedimento e stacco omega contano nel volume. Tecnica radar alta — stimolo produttivo senza esagerare.",
  },
};

function zoneLabel(tsb) {
  if (tsb >= 15) return "Rilassato";
  if (tsb >= 5) return "Energetico";
  if (tsb >= -10) return "Bilanciato";
  return "Ottimale";
}

function addDays(iso, n) {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function dateRange(start, end) {
  const out = [];
  let cur = start;
  while (cur <= end) {
    out.push(cur);
    cur = addDays(cur, 1);
  }
  return out;
}

function ewma(prev, load, days) {
  const k = 1 / days;
  return prev + k * (load - prev);
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

const data = JSON.parse(readFileSync(sessionsPath, "utf8"));
const sessions = data.sessions.filter((s) => s.date);

const dailyLoad = {};
for (const s of sessions) {
  const load = s.carico != null && !s.partial ? s.carico : 0;
  dailyLoad[s.date] = (dailyLoad[s.date] || 0) + load;
}

const dates = sessions.map((s) => s.date).sort();
const first = dates[0];
const last = dates[dates.length - 1];
const rangeStart = addDays(first, -21);
const rangeEnd = addDays(last, 7);
const timeline = dateRange(rangeStart, rangeEnd);

let ctl = 0;
let atl = 0;
const series = [];

for (const date of timeline) {
  const load = dailyLoad[date] || 0;
  ctl = ewma(ctl, load, CTL_DAYS);
  atl = ewma(atl, load, ATL_DAYS);
  const tsb = ctl - atl;
  series.push({
    date,
    load,
    ctl: round1(ctl),
    atl: round1(atl),
    tsb: round1(tsb),
    zone: zoneLabel(tsb),
  });
}

const anchorRaw = series.find((p) => p.date === ZEPP_ANCHOR.date);
if (anchorRaw) {
  const offCtl = ZEPP_ANCHOR.ctl - anchorRaw.ctl;
  const offAtl = ZEPP_ANCHOR.atl - anchorRaw.atl;
  for (const p of series) {
    p.ctl = round1(p.ctl + offCtl);
    p.atl = round1(p.atl + offAtl);
    p.tsb = round1(p.ctl - p.atl);
    p.zone = zoneLabel(p.tsb);
  }
}

const byDate = Object.fromEntries(series.map((p) => [p.date, p]));

const sessionSnapshots = sessions.map((s) => {
  const snap = byDate[s.date] || null;
  const analisi = ANALISI[s.id] || {
    titolo: "Sessione registrata",
    testo: "Analisi TSB da completare al prossimo aggiornamento.",
  };
  return {
    id: s.id,
    date: s.date,
    scheda: s.scheda,
    partial: !!s.partial,
    carico: s.carico,
    ctl: snap ? snap.ctl : null,
    atl: snap ? snap.atl : null,
    tsb: snap ? snap.tsb : null,
    zone: snap ? snap.zone : null,
    titolo: analisi.titolo,
    analisi: analisi.testo,
  };
});

const anchorPoint = byDate[ZEPP_ANCHOR.date] || series[series.length - 1];
const fmtIt = (iso) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}`;
};
const sintesiTrimestre = {
  titolo: "Sintesi luglio 2026 — blocco di rientro",
  testo:
    "Dopo il calo di inizio luglio (poca attività registrata), il grafico mostra un cluster di sessioni dal 16 al 24: fitness (CTL) che risale gradualmente, affaticamento (ATL) che reagisce più in fretta. " +
    "Al " +
    fmtIt(anchorPoint.date) +
    " il TSB è " +
    anchorPoint.tsb +
    " («" +
    anchorPoint.zone +
    "»): fase produttiva, non overtraining. " +
    "Curve calibrate sul carico Zepp delle sessioni pubblicate e ancorate allo screenshot del 24/07; l'app include anche attività non loggate sul sito.",
  ctl: anchorPoint.ctl,
  atl: anchorPoint.atl,
  tsb: anchorPoint.tsb,
  zone: anchorPoint.zone,
};

const out = {
  _nota:
    "Generato da tools/calcola-tsb.mjs — CTL (42 gg) e ATL (7 gg) da carico Zepp; TSB = CTL − ATL. Ancoraggio valori assoluti su export Zepp 24/07.",
  anchor: ZEPP_ANCHOR,
  trimestre: data.trimestre,
  range: { start: rangeStart, end: rangeEnd },
  sintesi: sintesiTrimestre,
  series,
  sessions: sessionSnapshots,
};

writeFileSync(tsbPath, JSON.stringify(out, null, 2) + "\n");
console.log("OK ->", tsbPath);
