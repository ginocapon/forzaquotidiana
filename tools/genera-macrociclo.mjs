#!/usr/bin/env node
/**
 * Rigenera admin/data/macrociclo-2026-2027.json
 * Fase 1: blocco-1-fase1.json (invariata)
 * Fasi 2–4: admin/data/fasi-2-3-4.json (rotazione esercizi ~25–35% per fase)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(__dirname);
const OUT = join(REPO, "admin/data/macrociclo-2026-2027.json");
const BLOCCO1 = join(REPO, "admin/data/blocco-1-fase1.json");
const FASI234 = join(REPO, "admin/data/fasi-2-3-4.json");

function addDays(iso, days) {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function endAfterWeeks(start, weeks) {
  return addDays(start, weeks * 7 - 1);
}

function blocco1ToMacroEx(ex) {
  return {
    nome: ex.nome,
    gruppo: ex.gruppo,
    serie: ex.serie,
    ripetizioni: ex.ripetizioni,
    peso: "—",
    recupero: ex.recupero,
    rir: ex.rir || "vedi regole blocco",
    tempo: ex.tempo,
    progressione: ex.progressionePrincipale || false,
    note: [ex.progressione, ex.note].filter(Boolean).join(" · ") || null,
  };
}

function buildFase1(blocco) {
  const sessioni = {};
  for (const key of ["a1", "b1", "a2", "b2"]) {
    const s = blocco.sessioni[key];
    sessioni[key] = {
      nome: s.codice + " · " + s.nome,
      esercizi: s.esercizi.map(blocco1ToMacroEx),
    };
  }
  return {
    id: blocco.id,
    nome: blocco.nome,
    inizio: blocco.inizio,
    fine: blocco.fine,
    settimane: blocco.settimane,
    rir: "sett. 6–8: RIR 1 (vedi Metodo Blocco 1)",
    obiettivo: blocco.schedaIntro,
    guida: blocco.guida,
    schedaIntro: blocco.schedaIntro,
    sessioni,
  };
}

function buildFase234(fase, inizio) {
  const sessioni = JSON.parse(JSON.stringify(fase.sessioni));
  for (const day of Object.values(sessioni)) {
    day.esercizi = day.esercizi.map((ex) => ({
      ...ex,
      peso: ex.peso ?? "—",
      tecnica: ex.tecnica ?? null,
    }));
  }
  return {
    id: fase.id,
    nome: fase.nome,
    inizio,
    fine: endAfterWeeks(inizio, fase.settimane),
    settimane: fase.settimane,
    rir: fase.rir,
    obiettivo: fase.obiettivo,
    guida: fase.guida,
    schedaIntro: fase.schedaIntro,
    rotazione: fase.rotazioneDaFase1 || fase.rotazioneDaFase2 || fase.rotazioneDaFase3 || undefined,
    sessioni,
  };
}

const blocco = JSON.parse(readFileSync(BLOCCO1, "utf8"));
const fasi234 = JSON.parse(readFileSync(FASI234, "utf8"));

const START = "2026-09-01";
const W = 13;

const fase1 = buildFase1(blocco);
const fase2Inizio = addDays(fase1.fine, 1);
const fase2 = buildFase234(
  fasi234.fasi.find((f) => f.id === "tensione-forza"),
  fase2Inizio
);
const fase3Inizio = addDays(fase2.fine, 1);
const fase3 = buildFase234(
  fasi234.fasi.find((f) => f.id === "ipertrofia-classica-ii"),
  fase3Inizio
);
const fase4Inizio = addDays(fase3.fine, 1);
const fase4 = buildFase234(
  fasi234.fasi.find((f) => f.id === "ricondizionamento"),
  fase4Inizio
);
fase4.fine = "2027-08-31";

const FASI = [fase1, fase2, fase3, fase4];
const totalWeeks = FASI.reduce((a, f) => a + f.settimane, 0);

const macrociclo = {
  macrociclo: {
    nome: "Macrociclo annuale · Upper/Lower A1–B2",
    inizio: "2026-09-01",
    fine: "2027-08-31",
    descrizione: `Periodizzazione annuale ${totalWeeks} settimane su split A1-B1-A2-B2 (4 sessioni/settimana). **4 fasi macro da ~13 settimane**. Focus ~55% volume serie su gambe+polpacci. Deload = ultima settimana di ogni fase. **Rotazione esercizi** a ogni cambio fase (~25–35% nuovi movimenti). Pesi da definire dopo test massimali.`,
    frequenza: "4 sessioni/settimana",
    lineeGuida:
      "4 fasi × ~13 sett. · ~55% serie lower · Deload sett. 13 · **Nuovo schema esercizi ogni ~3 mesi** · Pesi blank fino a 1RM/serie",
  },
  fasi: FASI,
};

writeFileSync(OUT, JSON.stringify(macrociclo, null, 2) + "\n");
console.log("OK:", OUT);
console.log("Nota: dopo genera-macrociclo esegui anche node tools/rebalance-macrociclo-55.mjs");
FASI.forEach((f, i) => {
  console.log(`  ${i + 1}. ${f.nome} · ${f.settimane} sett. · ${f.inizio} → ${f.fine}`);
});
console.log("Totale settimane dichiarate:", totalWeeks);
