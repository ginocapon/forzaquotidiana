#!/usr/bin/env node
/**
 * Rigenera admin/data/macrociclo-2026-2027.json
 * 4 fasi macro da ~13 settimane ciascuna (modello trimestre Q3) —
 * natural 57 anni: niente micro-fasi da 4–6 settimane.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(__dirname);
const OUT = join(REPO, "admin/data/macrociclo-2026-2027.json");
const OLD = JSON.parse(readFileSync(OUT, "utf8"));

function getSessioni(id) {
  const f = OLD.fasi.find((x) => x.id === id);
  if (!f) throw new Error("Fase mancante nel JSON precedente: " + id);
  return JSON.parse(JSON.stringify(f.sessioni));
}

/** Preferisci id nuovo; fallback a id legacy se già migrato. */
function getSessioniAny(...ids) {
  for (const id of ids) {
    const f = OLD.fasi.find((x) => x.id === id);
    if (f) return JSON.parse(JSON.stringify(f.sessioni));
  }
  throw new Error("Nessuna fase trovata tra: " + ids.join(", "));
}

function addDays(iso, days) {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function endAfterWeeks(start, weeks) {
  return addDays(start, weeks * 7 - 1);
}

function mergeTensioneForza() {
  const t = OLD.fasi.find(
    (x) => x.id === "tensione-forza" || x.id === "ipertrofia-tensione-meccanica"
  );
  const f = OLD.fasi.find((x) => x.id === "forza" || x.id === "tensione-forza");
  const base = t || f;
  if (!base) throw new Error("Manca blocco tensione/forza nel JSON");
  const sessioni = JSON.parse(JSON.stringify(base.sessioni));
  const forzaSrc = OLD.fasi.find((x) => x.id === "forza");
  for (const key of ["a1", "b1", "a2", "b2"]) {
    sessioni[key].esercizi.forEach((ex, i) => {
      const fEx = forzaSrc?.sessioni?.[key]?.esercizi?.[i];
      if (ex.progressione) {
        if (fEx?.peso) ex.peso = fEx.peso;
        ex.ripetizioni = "6-8 (sett. 1–6) → 4-6 (sett. 7–12) · sett. 13 deload";
        ex.rir = "1-2 (sett. 13: RIR 4)";
        ex.note =
          (ex.note ? ex.note + " · " : "") +
          "Blocco 13 sett.: tensione → forza → settimana 13 scarico (−40% volume)";
      }
    });
  }
  return sessioni;
}

function bumpClassicaII(sessioni) {
  const s = JSON.parse(JSON.stringify(sessioni));
  const bumps = {
    "Panca inclinata con manubri": "22 kg/manubrio",
    "Rematore con bilanciere": "52 kg",
    "Doktor (affondo bulgaro guidato)": "62→52 kg",
    "Stacco omega (trap bar)": "62 kg",
    "Chest press alla macchina": "72 kg",
    "Squat al multipower": "62/57 kg",
  };
  for (const day of Object.values(s)) {
    day.esercizi.forEach((ex) => {
      if (bumps[ex.nome]) ex.peso = bumps[ex.nome];
      if (ex.progressione) {
        ex.note =
          (ex.note ? ex.note + " · " : "") +
          "Sett. 9–12: +1 serie sul multiarticolare (saturazione volume). Sett. 13: deload.";
      }
    });
  }
  return s;
}

function softStartIpertrofia(sessioni) {
  const s = JSON.parse(JSON.stringify(sessioni));
  for (const day of Object.values(s)) {
    day.esercizi.forEach((ex) => {
      if (ex.progressione) {
        ex.rir = "2-3 (sett. 1–2) → 1-2";
        ex.note =
          (ex.note ? ex.note + " · " : "") +
          "Avvio soft 2 sett. (adattamento anatomico interno). Sett. 13: deload (−40% volume).";
      }
    });
  }
  return s;
}

const START = "2026-09-01";
const W = 13;

const FASI = [
  {
    id: "ipertrofia-accumulo",
    nome: "Fase 1 · Ipertrofia accumulo",
    inizio: START,
    fine: endAfterWeeks(START, W),
    settimane: W,
    rir: "2-3 → 1-2",
    obiettivo:
      "13 settimane sullo stesso schema A1–B2 (modello trimestre Q3). Sett. 1–2 avvio soft RIR 2–3 (ex adattamento anatomico). Sett. 3–12 accumulo 8–12 rep. Sett. 13 deload (−40% volume). Un solo cambio schema a fine fase.",
    sessioni: softStartIpertrofia(getSessioniAny("ipertrofia-accumulo", "ipertrofia-classica")),
  },
  {
    id: "tensione-forza",
    nome: "Fase 2 · Tensione + Forza",
    inizio: addDays(endAfterWeeks(START, W), 1),
    fine: endAfterWeeks(addDays(endAfterWeeks(START, W), 1), W),
    settimane: W,
    rir: "1-2",
    obiettivo:
      "13 settimane: sett. 1–6 tensione meccanica (6–8 rep), sett. 7–12 forza (4–6 rep), sett. 13 deload. Stessi esercizi — cambia solo range reps e carico. Coerente con cambio schema ogni ~3 mesi.",
    sessioni: mergeTensioneForza(),
  },
];

const fase2Fine = FASI[1].fine;
const fase3Inizio = addDays(fase2Fine, 1);
const fase3Fine = endAfterWeeks(fase3Inizio, W);
const fase4Inizio = addDays(fase3Fine, 1);

FASI.push(
  {
    id: "ipertrofia-classica-ii",
    nome: "Fase 3 · Ipertrofia II",
    inizio: fase3Inizio,
    fine: fase3Fine,
    settimane: W,
    rir: "1-2",
    obiettivo:
      "Secondo blocco ipertrofico 13 settimane. Carichi +2,5 kg sui fondamentali vs Fase 1. Sett. 9–12 saturazione volume (+1 serie multiarticolari, ex alto volume). Sett. 13 deload pre-estate.",
    sessioni: bumpClassicaII(
      getSessioniAny("ipertrofia-classica-ii", "ipertrofia-classica")
    ),
  },
  {
    id: "ricondizionamento",
    nome: "Fase 4 · Ricondizionamento",
    inizio: fase4Inizio,
    fine: "2027-08-31",
    settimane: 13,
    rir: "2-3",
    obiettivo:
      "13 settimane di mantenimento estivo (fino a fine macrociclo 31/08). Carichi moderati, 10–12 rep, zero pressione sul SNC. Prepara il macrociclo successivo — niente nuovi schemi.",
    sessioni: getSessioniAny("ricondizionamento"),
  }
);

const totalWeeks = FASI.reduce((a, f) => a + f.settimane, 0);

const macrociclo = {
  macrociclo: {
    nome: "Macrociclo 2026–2027 · Gino Capon",
    inizio: "2026-09-01",
    fine: "2027-08-31",
    descrizione: `Periodizzazione annuale ${totalWeeks} settimane su split A1-B1-A2-B2 (4 sessioni/settimana). **4 fasi macro da ~13 settimane** (modello trimestre Q3) — niente micro-fasi da 4–6 sett. Deload = ultima settimana di ogni fase di lavoro. Pesi base da trimestre Q3 2026.`,
    pesoPartenza: 67,
    frequenza: "4 sessioni/settimana",
    lineeGuida:
      "4 fasi × ~13 sett. · Deload in sett. 13 di ogni fase di lavoro · Cambio schema ogni ~3 mesi · Natural 57 anni",
  },
  fasi: FASI,
};

writeFileSync(OUT, JSON.stringify(macrociclo, null, 2) + "\n");
console.log("OK:", OUT);
FASI.forEach((f, i) => {
  console.log(
    `  ${i + 1}. ${f.nome} · ${f.settimane} sett. · ${f.inizio} → ${f.fine}`
  );
});
console.log("Totale settimane dichiarate:", totalWeeks);
