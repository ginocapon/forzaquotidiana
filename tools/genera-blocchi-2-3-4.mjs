#!/usr/bin/env node
/**
 * Genera blocco-2/3/4 da fasi-2-3-4.json (rotazione esercizi) + parametri PI (da blocco-1).
 * NON tocca blocco-1.
 *
 * node tools/genera-blocchi-2-3-4.mjs
 * node tools/sync-blocco-macrociclo.mjs --all
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const ADMIN = join(REPO, "admin/data");
const BLOCCO1 = join(ADMIN, "blocco-1-fase1.json");
const FASI234 = join(ADMIN, "fasi-2-3-4.json");
const MACRO = join(ADMIN, "macrociclo-2026-2027.json");

const template = JSON.parse(readFileSync(BLOCCO1, "utf8"));
const fasiSrc = JSON.parse(readFileSync(FASI234, "utf8"));
const macro = JSON.parse(readFileSync(MACRO, "utf8"));

const FIGURA_BY_KEY = {
  panca: "fig-press-incl",
  "panca piana": "fig-press-flat",
  inclinata: "fig-press-incl",
  croci: "fig-croci",
  chest: "fig-chest",
  lento: "fig-lento",
  alzate: "fig-alzate",
  lat: "fig-lat",
  trazion: "fig-pullup",
  rematore: "fig-rematore",
  polpacci: "fig-polpacci",
  pressa: "fig-pressa",
  squat: "fig-squat",
  extension: "fig-legext",
  curl: "fig-legcurl",
  addutt: "fig-doktor",
  rumeno: "fig-rdl",
  scott: "fig-curl-scott",
  trap: "fig-trapbar",
  hip: "fig-hip",
  martello: "fig-curl-mart",
  halo: "fig-halo",
  reverse: "fig-reverse-pec",
  affond: "fig-lunge",
  plank: "fig-plank",
};

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function figuraFor(nome) {
  const n = nome.toLowerCase();
  for (const [k, v] of Object.entries(FIGURA_BY_KEY)) {
    if (n.includes(k)) return v;
  }
  return "fig-generic";
}

function defaultTempo(nome) {
  const n = nome.toLowerCase();
  if (n.includes("polpacci")) return "3-2-X-2";
  if (n.includes("alzate") || n.includes("croci")) return "2-1-3-1";
  if (n.includes("curl") || n.includes("extension")) return "2-1-2-1";
  return "3-1-X-1";
}

function macroExToBlocco(ex) {
  return {
    nome: ex.nome,
    gruppo: ex.gruppo,
    serie: ex.serie,
    ripetizioni: ex.ripetizioni,
    tempo: ex.tempo || defaultTempo(ex.nome),
    recupero: ex.recupero || "90 sec",
    progressione: ex.progressione === true ? "Progressione principale *" : ex.note?.split(" · ")[0] || "",
    rir: ex.rir || "1-2",
    figura: figuraFor(ex.nome),
    progressionePrincipale: ex.progressione === true,
    note: ex.note || "",
  };
}

function sessionsFromFase(fase) {
  const out = {};
  for (const key of ["a1", "b1", "a2", "b2"]) {
    const src = fase.sessioni[key];
    const tpl = template.sessioni[key];
    out[key] = {
      codice: tpl.codice,
      nome: src.nome.replace(/^[A-Z]\d\s*[·•]\s*/i, "").replace(/^\*\s*/g, ""),
      priorita: tpl.priorita,
      esercizi: src.esercizi.map(macroExToBlocco),
      focusTecnico: tpl.focusTecnico,
      volumeSeduta: tpl.volumeSeduta,
      notaComplementare: tpl.notaComplementare,
    };
  }
  return out;
}

const META = {
  "tensione-forza": {
    file: "blocco-2-fase2.json",
    codice: "BLOCCO 2",
    tipo: "TENSIONE • FORZA",
    durataSeduta: "80-90 minuti",
    periodizzazione: [
      { fase: "Adattamento", settimane: "1-2", rir: "3-2", obiettivo: "Transizione post-deload Fase 1" },
      { fase: "Tensione meccanica", settimane: "3-6", rir: "2", obiettivo: "6–8 rep · progressione kg" },
      { fase: "Transizione forza", settimane: "7-8", rir: "2", obiettivo: "5–6 rep" },
      { fase: "Forza", settimane: "9-12", rir: "1-2", obiettivo: "4–6 rep sui * · ultima serie opz. RIR 0–1" },
      { fase: "Deload", settimane: "13", rir: "4-5", obiettivo: "−40% volume" },
    ],
    regoleBlocco: {
      sett1_2: ["RIR 3-2 · 6–8 rep · rotazione esercizi vs Blocco 1", "Trova kg di lavoro post-deload"],
      sett3_6: ["RIR 2 · tensione meccanica 6–8 rep", "Progressione sui *"],
      sett7_10: ["RIR 2 · transizione 5–6 rep poi 4–6 sui *", "Recuperi 150–180 s sui fondamentali"],
      sett10_12: ["RIR 1-2 · forza 4–6 rep", "Ultima serie * a RIR 0–1 se tecnica OK"],
      sett13: ["Deload −40% · RIR 4-5", "Obbligatorio prima di Fase 3"],
    },
    guidaOperativa: {
      titolo: "Metodo Blocco 2 — tensione, forza, rotazione",
      sintesi:
        "Schema A1–B2 con ~30% esercizi diversi dal Blocco 1 (panca piana, squat mp, trazioni…). Stessi movimenti per 13 settimane; cambiano rep, RIR e kg. Parametri Project Invictus: deload sett. 13.",
      periodizzazioneIntensita: [
        { settimane: "1-2", intensita: "RIR 3-2", volume: "100%", nota: "Adattamento" },
        { settimane: "3-6", intensita: "RIR 2", volume: "100%", nota: "Tensione 6–8" },
        { settimane: "7-8", intensita: "RIR 2", volume: "100%", nota: "Transizione" },
        { settimane: "9-12", intensita: "RIR 1-2", volume: "100%", nota: "Forza 4–6" },
        { settimane: "13", intensita: "RIR 4-5", volume: "−40%", nota: "Deload" },
      ],
    },
  },
  "ipertrofia-classica-ii": {
    file: "blocco-3-fase3.json",
    codice: "BLOCCO 3",
    tipo: "IPERTROFIA II • ACCUMULO",
    durataSeduta: "85-95 minuti",
    periodizzazione: [
      { fase: "Reintroduzione", settimane: "1-2", rir: "2", obiettivo: "8–10 rep · terzo schema esercizi" },
      { fase: "Accumulo", settimane: "3-5", rir: "2", obiettivo: "Volume stabile" },
      { fase: "Accumulo intenso", settimane: "6-8", rir: "1", obiettivo: "Stimolo massimo sostenibile" },
      { fase: "Scarico parziale", settimane: "9", rir: "2", obiettivo: "−25% volume" },
      { fase: "Saturazione", settimane: "10-12", rir: "1", obiettivo: "+1 serie sui *" },
      { fase: "Deload", settimane: "13", rir: "4-5", obiettivo: "−40% pre-estate" },
    ],
    regoleBlocco: {
      sett1_2: ["RIR 2 · 8–10 rep · inclinata bb, pressa, hip thrust (rotazione vs Fase 2)", "Partenza +2,5 kg sui * vs fine Fase 1 se possibile"],
      sett3_5: ["RIR 2 · progressione rep e kg", "Isolamento: cedimento tecnico solo se forma OK"],
      sett6_8: ["RIR 1 · target scheda", "Fondamentali *: +kg se tetto rep ×2 sedute"],
      sett9: ["Scarico −25% serie", "RIR 2"],
      sett10_12: ["+1 serie sui multiarticolari *", "RIR 1"],
      sett13: ["Deload −40%", "RIR 4-5"],
    },
    guidaOperativa: {
      titolo: "Metodo Blocco 3 — ipertrofia II + rotazione",
      sintesi:
        "Terzo schema annuale (~30% esercizi nuovi). Riconverti la forza in volume 8–12 rep. Sett. 10–12 saturazione (+1 serie sui *). Project Invictus: scarico sett. 9, deload sett. 13.",
      periodizzazioneIntensita: [
        { settimane: "1-2", intensita: "RIR 2", volume: "100%", nota: "Reintroduzione" },
        { settimane: "3-5", intensita: "RIR 2", volume: "100%", nota: "Accumulo" },
        { settimane: "6-8", intensita: "RIR 1", volume: "100%", nota: "Intenso" },
        { settimane: "9", intensita: "RIR 2", volume: "−25%", nota: "Scarico parziale" },
        { settimane: "10-12", intensita: "RIR 1", volume: "110% sui *", nota: "Saturazione" },
        { settimane: "13", intensita: "RIR 4-5", volume: "−40%", nota: "Deload" },
      ],
    },
  },
  ricondizionamento: {
    file: "blocco-4-fase4.json",
    codice: "BLOCCO 4",
    tipo: "RICONDIZIONAMENTO • ESTIVO",
    durataSeduta: "70-80 minuti",
    periodizzazione: [
      { fase: "Mantenimento", settimane: "1-8", rir: "2-3", obiettivo: "10–12 rep · macchine guidate" },
      { fase: "Mantenimento attivo", settimane: "9-12", rir: "2-3", obiettivo: "Flessibilità calendario estivo" },
      { fase: "Transizione", settimane: "13", rir: "3", obiettivo: "Settimana leggera pre nuovo macrociclo" },
    ],
    regoleBlocco: {
      sett1_2: ["RIR 3 · 10–12 rep · quarto schema (chest press, affondi, plank…)", "Frequenza > intensità"],
      sett3_6: ["RIR 2-3 · mantieni kg", "Volume già ridotto in scheda"],
      sett7_10: ["RIR 2-3 · zero peaking", "Riprendi ordine A1→B2 se salti sedute"],
      sett11_12: ["RIR 2-3", "Opzionale −1 serie se caldo/fatica"],
      sett13: ["Transizione leggera · RIR 3", "Preparazione nuovo anno"],
    },
    guidaOperativa: {
      titolo: "Metodo Blocco 4 — ricondizionamento estivo",
      sintesi:
        "Quarto schema con macchine guidate e volume moderato. Mantieni abitudine al lavoro senza pressione da PR. Project Invictus: RIR generosi, deload leggero sett. 13.",
      periodizzazioneIntensita: [
        { settimane: "1-8", intensita: "RIR 2-3", volume: "~85%", nota: "Mantenimento" },
        { settimane: "9-12", intensita: "RIR 2-3", volume: "~85%", nota: "Estivo" },
        { settimane: "13", intensita: "RIR 3", volume: "−20% opz.", nota: "Transizione" },
      ],
    },
  },
};

for (const faseSrc of fasiSrc.fasi) {
  const meta = META[faseSrc.id];
  if (!meta) continue;
  const dates = macro.fasi.find((f) => f.id === faseSrc.id);

  const b = {
    id: faseSrc.id,
    codice: meta.codice,
    tipo: meta.tipo,
    nome: faseSrc.nome,
    inizio: dates.inizio,
    fine: dates.fine,
    settimane: faseSrc.settimane || 13,
    frequenza: template.frequenza,
    durataSeduta: meta.durataSeduta,
    guida: faseSrc.guida,
    schedaIntro: faseSrc.schedaIntro,
    rotazioneDaFase1: faseSrc.rotazioneDaFase1 || faseSrc.rotazione || null,
    periodizzazione: meta.periodizzazione,
    recuperi: template.recuperi,
    regoleBlocco: meta.regoleBlocco,
    valutazioneProgramma: template.valutazioneProgramma,
    guidaOperativa: {
      ...clone(template.guidaOperativa),
      ...meta.guidaOperativa,
    },
    sessioni: sessionsFromFase(faseSrc),
  };

  writeFileSync(join(ADMIN, meta.file), JSON.stringify(b, null, 2) + "\n");
  console.log("OK", meta.file, "←", faseSrc.id);
}
