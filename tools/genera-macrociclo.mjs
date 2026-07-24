#!/usr/bin/env node
/**
 * Rigenera admin/data/macrociclo-2026-2027.json
 * Linee guida: mesocicli lunghi (6-10 sett.) per Gino Capon, natural 57 anni.
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
  if (!f) throw new Error("Fase mancante: " + id);
  return JSON.parse(JSON.stringify(f.sessioni));
}

function mergeTensioneForza() {
  const t = OLD.fasi.find((x) => x.id === "ipertrofia-tensione-meccanica");
  const f = OLD.fasi.find((x) => x.id === "forza");
  const sessioni = JSON.parse(JSON.stringify(t.sessioni));
  for (const key of ["a1", "b1", "a2", "b2"]) {
    sessioni[key].esercizi.forEach((ex, i) => {
      const fEx = f.sessioni[key].esercizi[i];
      if (!fEx) return;
      if (ex.progressione) {
        ex.ripetizioni = "6-8 (settimane 1-4) → 4-6 (settimane 5-8)";
        ex.peso = fEx.peso;
        ex.rir = "1-2";
        ex.note = (ex.note || "") + " · Blocco 8 sett.: tensione meccanica → forza";
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
    });
  }
  return s;
}

const FASI = [
  {
    id: "adattamento-anatomico",
    nome: "Adattamento anatomico",
    inizio: "2026-09-01",
    fine: "2026-09-28",
    settimane: 4,
    rir: "2-3",
    obiettivo:
      "Transizione dal trimestre Q3 2026. Tessuti, articolazioni e pattern motori con carichi conservativi. Stessi esercizi, RIR generoso — non cambiare scheda ogni settimana.",
    sessioni: getSessioni("adattamento-anatomico"),
  },
  {
    id: "ipertrofia-classica",
    nome: "Ipertrofia classica",
    inizio: "2026-09-29",
    fine: "2026-12-06",
    settimane: 10,
    rir: "1-2",
    obiettivo:
      "Blocco principale di accumulo ipertrofico (8-12 rep). 10 settimane sullo stesso schema — coerente con Nippard/Israetel per intermedi che progrediscono. Progressione a carico fisso sui movimenti *.",
    sessioni: getSessioni("ipertrofia-classica"),
  },
  {
    id: "deload",
    nome: "Deload",
    inizio: "2026-12-07",
    fine: "2026-12-13",
    settimane: 1,
    rir: "4",
    obiettivo:
      "Scarico fatica dopo 10 settimane di ipertrofia. Volume −40%, stessi esercizi, recupero completo.",
    sessioni: getSessioni("deload"),
  },
  {
    id: "tensione-forza",
    nome: "Tensione meccanica + Forza",
    inizio: "2026-12-14",
    fine: "2027-02-07",
    settimane: 8,
    rir: "1-2",
    obiettivo:
      "Blocco unico 8 settimane: prime 4 settimane tensione meccanica (6-8 rep, carichi più alti), ultime 4 forza (4-6 rep). Evita cambi schema ogni mese.",
    sessioni: mergeTensioneForza(),
  },
  {
    id: "deload-2",
    nome: "Deload",
    inizio: "2027-02-08",
    fine: "2027-02-14",
    settimane: 1,
    rir: "4",
    obiettivo: "Recupero post-blocco forza. Una settimana leggera prima del secondo accumulo ipertrofico.",
    sessioni: getSessioni("deload"),
  },
  {
    id: "ipertrofia-classica-ii",
    nome: "Ipertrofia classica II",
    inizio: "2027-02-15",
    fine: "2027-04-25",
    settimane: 10,
    rir: "1-2",
    obiettivo:
      "Secondo blocco ipertrofico 10 settimane. Carichi +2,5 kg sui fondamentali rispetto al primo blocco. Stessa struttura A1-B2.",
    sessioni: bumpClassicaII(getSessioni("ipertrofia-classica-ii")),
  },
  {
    id: "ipertrofia-alto-volume",
    nome: "Ipertrofia ad alto volume",
    inizio: "2027-04-26",
    fine: "2027-06-06",
    settimane: 6,
    rir: "1-2",
    obiettivo:
      "6 settimane di saturazione volume (+1 serie sui multiarticolari). Ultimo push ipertrofico prima dello scarico estivo.",
    sessioni: getSessioni("ipertrofia-alto-volume"),
  },
  {
    id: "deload-3",
    nome: "Deload",
    inizio: "2027-06-07",
    fine: "2027-06-13",
    settimane: 1,
    rir: "4",
    obiettivo: "Deload pre-estate. Volume minimo, tecnica pulita.",
    sessioni: getSessioni("deload"),
  },
  {
    id: "ricondizionamento",
    nome: "Ricondizionamento",
    inizio: "2027-06-14",
    fine: "2027-08-31",
    settimane: 11,
    rir: "2-3",
    obiettivo:
      "11 settimane di mantenimento e transizione fine macrociclo. Carichi moderati, 10-12 rep, zero pressione sul SNC. Prepara il macrociclo successivo.",
    sessioni: getSessioni("ricondizionamento"),
  },
];

const totalWeeks = FASI.reduce((a, f) => a + f.settimane, 0);

const macrociclo = {
  macrociclo: {
    nome: "Macrociclo 2026–2027 · Gino Capon",
    inizio: "2026-09-01",
    fine: "2027-08-31",
    descrizione: `Periodizzazione annuale ${totalWeeks} settimane su split A1-B1-A2-B2 (4 sessioni/settimana). Mesocicli lunghi (6-10 sett. ipertrofia) secondo linee guida Israetel, Helms e Nippard adattate a natural 57 anni. Pesi base da trimestre Q3 2026. ${FASI.length} fasi totali (inclusi 3 deload).`,
    pesoPartenza: 67,
    frequenza: "4 sessioni/settimana",
    lineeGuida:
      "Mesocicli ipertrofia 8-10 sett. · Deload ogni 10-11 sett. accumulo · Cambio schema ogni 2-3 mesi, non ogni mese",
  },
  fasi: FASI,
};

writeFileSync(OUT, JSON.stringify(macrociclo, null, 2) + "\n");
console.log("OK:", OUT, "—", FASI.length, "fasi,", totalWeeks, "settimane");
