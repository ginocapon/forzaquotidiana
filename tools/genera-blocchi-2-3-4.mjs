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
      { fase: "Transizione forza", settimane: "7-8", rir: "2", obiettivo: "5–6 rep sui *" },
      { fase: "Forza", settimane: "9-10", rir: "1-2", obiettivo: "5 rep sui * · kg in salita" },
      { fase: "Picco forza", settimane: "11-12", rir: "1-2", obiettivo: "**4 rep** sui * · carico massimo blocco (PI)" },
      { fase: "Deload", settimane: "13", rir: "4-5", obiettivo: "−40% volume" },
    ],
    regoleBlocco: {
      sett1_2: ["RIR 3-2 · 6–8 rep · rotazione esercizi vs Blocco 1", "Trova kg di lavoro post-deload"],
      sett3_6: ["RIR 2 · tensione meccanica 6–8 rep", "Progressione sui *"],
      sett7_8: ["RIR 2 · 5–6 rep sui *", "Recuperi 150–180 s sui fondamentali"],
      sett9_10: ["RIR 1-2 · **5 rep** sui *", "Aumenta kg se completi tutte le serie col RIR target"],
      sett11_12: ["RIR 1-2 · **4 rep** sui * (picco PI)", "Ultima serie * a RIR 0–1 se tecnica OK", "Carico massimo dell’anno sui fondamentali"],
      sett13: ["Deload −40% · RIR 4-5", "Obbligatorio prima di Fase 3 (rientro 8 rep)"],
    },
    guidaOperativa: {
      titolo: "Metodo Blocco 2 — tensione, forza, rotazione",
      sintesi:
        "Unico mesociclo annuale con carichi alti sui * (PI forza: rep ↓ kg ↑). Fondamentali *: 6–8 (sett. 1–6) → 5–6 (7–8) → 5 (9–10) → **4 rep** (11–12 picco). Accessori 6–8. Deload sett. 13.",
      periodizzazioneIntensita: [
        { settimane: "1-2", intensita: "RIR 3-2", volume: "100%", nota: "Adattamento 6–8" },
        { settimane: "3-6", intensita: "RIR 2", volume: "100%", nota: "Tensione 6–8" },
        { settimane: "7-8", intensita: "RIR 2", volume: "100%", nota: "Transizione 5–6" },
        { settimane: "9-10", intensita: "RIR 1-2", volume: "100%", nota: "Forza 5 rep" },
        { settimane: "11-12", intensita: "RIR 1-2", volume: "100%", nota: "Picco **4 rep** (PI)" },
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
      sett1_2: ["RIR 2 · **8 rep** sui * · carico moderato post-forza (PI)", "Inclinata bb, pressa, hip thrust — rotazione vs Fase 2"],
      sett3_5: ["RIR 2 · progressione rep e kg", "Isolamento: cedimento tecnico solo se forma OK"],
      sett6_8: ["RIR 1 · target scheda", "Fondamentali *: +kg se tetto rep ×2 sedute"],
      sett9: ["Scarico −25% serie", "RIR 2"],
      sett10_12: ["+1 serie sui multiarticolari *", "RIR 1"],
      sett13: ["Deload −40%", "RIR 4-5"],
    },
    guidaOperativa: {
      titolo: "Metodo Blocco 3 — ipertrofia II + rotazione",
      sintesi:
        "Post-forza (PI ipertrofia): rientro **8 rep** sui * e carico moderato — converti la forza in massa. Terzo schema ~30% nuovo. Sett. 10–12 +1 serie sui * (accumulo volume). Scarico sett. 9, deload sett. 13.",
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

const PERIODI_FORZA = [
  {
    id: "sett-1-6",
    label: "Tensione · sett. 1–6",
    settimane: "1-6",
    repFondamentali: "6-8",
    rir: "3-2 → 2 (da sett. 3)",
    sintesi:
      "Adattamento post Fase 1 e tensione meccanica. Fondamentali * a 6–8 rep, RIR 3–2 poi 2. Trova i kg di lavoro.",
    regoleKeys: ["sett1_2", "sett3_6"],
  },
  {
    id: "sett-7-8",
    label: "Transizione · sett. 7–8",
    settimane: "7-8",
    repFondamentali: "5-6",
    rir: "2",
    sintesi: "Passaggio verso la forza: fondamentali * a 5–6 rep, recuperi 150–180 s.",
    regoleKeys: ["sett7_8"],
  },
  {
    id: "sett-9-10",
    label: "Forza · sett. 9–10",
    settimane: "9-10",
    repFondamentali: "5",
    rir: "1-2",
    sintesi: "Forza intermedia: 5 rep sui * · aumenta kg se completi tutte le serie col RIR target.",
    regoleKeys: ["sett9_10"],
  },
  {
    id: "sett-11-12",
    label: "Picco forza · sett. 11–12",
    settimane: "11-12",
    repFondamentali: "4",
    rir: "1-2",
    sintesi: "Picco PI: **4 rep** sui * a carico massimo del blocco. Ultima serie * opz. RIR 0–1.",
    regoleKeys: ["sett11_12"],
  },
];

function stripWaveReps(raw) {
  const s = String(raw || "");
  if (!s.includes("→")) return s;
  const m = s.match(/^([^(→]+)/);
  return m ? m[1].trim() : s.split("→").pop().trim().replace(/\s·.*/, "").trim();
}

function cloneSessioniForPeriod(blocco, repStar) {
  const out = {};
  for (const key of ["a1", "b1", "a2", "b2"]) {
    const s = blocco.sessioni[key];
    if (!s) continue;
    out[key] = {
      codice: s.codice,
      nome: s.nome,
      priorita: s.priorita,
      esercizi: s.esercizi.map((ex) => ({
        ...ex,
        ripetizioni: ex.progressionePrincipale ? repStar : stripWaveReps(ex.ripetizioni),
      })),
      focusTecnico: s.focusTecnico,
      volumeSeduta: s.volumeSeduta,
      notaComplementare: s.notaComplementare,
    };
  }
  return out;
}

function buildPeriodiForza(blocco, regoleBlocco) {
  return PERIODI_FORZA.map((def) => {
    const regole = {};
    def.regoleKeys.forEach((k) => {
      if (regoleBlocco[k]) regole[k] = regoleBlocco[k];
    });
    return {
      id: def.id,
      label: def.label,
      settimane: def.settimane,
      repFondamentali: def.repFondamentali,
      rir: def.rir,
      sintesi: def.sintesi,
      regoleBlocco: regole,
      sessioni: cloneSessioniForPeriod(blocco, def.repFondamentali),
    };
  });
}

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

  if (faseSrc.id === "tensione-forza") {
    b.periodi = buildPeriodiForza(b, meta.regoleBlocco);
  }

  writeFileSync(join(ADMIN, meta.file), JSON.stringify(b, null, 2) + "\n");
  console.log("OK", meta.file, "←", faseSrc.id);
}
