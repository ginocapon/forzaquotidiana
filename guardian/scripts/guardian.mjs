#!/usr/bin/env node
/**
 * Forza Quotidiana Premortem Guardian — single entry point
 * node guardian/scripts/guardian.mjs run [--job NAME] [--force]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkAvailability } from "../adapters/availability.mjs";
import { checkNewsletter } from "../adapters/newsletter.mjs";
import { checkContent, checkDataIntegrity } from "../adapters/content.mjs";
import { checkSeo, checkAiTransparency } from "../adapters/seo.mjs";
import { checkEditorial } from "../adapters/editorial.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GUARDIAN_ROOT = path.join(__dirname, "..");
const REPO_ROOT = path.join(GUARDIAN_ROOT, "..");

function loadYamlLike(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const obj = { jobs: {} };
  let currentJob = null;
  for (const line of raw.split("\n")) {
    if (line.match(/^jobs:\s*$/)) {
      obj.jobs = {};
      currentJob = null;
      continue;
    }
    const jm = line.match(/^  (\w+):$/);
    if (jm) {
      currentJob = jm[1];
      obj.jobs[currentJob] = {};
      continue;
    }
    if (!currentJob) {
      const km = line.match(/^(\w+):\s*(.*)$/);
      if (km && !line.startsWith(" ")) {
        let v = km[2].replace(/^["']|["']$/g, "");
        if (v === "true") v = true;
        if (v === "false") v = false;
        if (v === "") continue;
        obj[km[1]] = v;
      }
      continue;
    }
    const sm = line.match(/^    (\w+):\s*(.*)$/);
    if (sm) {
      let v = sm[2].replace(/^["']|["']$/g, "");
      if (v === "true") v = true;
      else if (v === "false") v = false;
      else if (/^\d+$/.test(v)) v = Number(v);
      else if (typeof v === "string" && v.startsWith("[") && v.endsWith("]")) {
        v = v.slice(1, -1).split(",").map((s) => s.trim().replace(/^["']|["']$/g, ""));
      }
      obj.jobs[currentJob][sm[1]] = v;
    }
  }
  return obj;
}

function loadConfig() {
  const guardianYaml = path.join(GUARDIAN_ROOT, "config", "guardian.yaml");
  const raw = fs.readFileSync(guardianYaml, "utf8");
  const config = {
    probe_urls: [],
    newsletter: {},
    objective: "",
  };
  let section = null;
  for (const line of raw.split("\n")) {
    if (line.startsWith("probe_urls:")) section = "urls";
    else if (line.startsWith("newsletter:")) section = "newsletter";
    else if (line.startsWith("objective:")) {
      config.objective = line.replace("objective:", "").trim();
      section = "objective";
    } else if (section === "urls" && line.trim().startsWith("- ")) {
      config.probe_urls.push(line.trim().slice(2).trim());
    } else if (section === "newsletter") {
      const m = line.match(/^\s+(\w+):\s*(.+)/);
      if (m) config.newsletter[m[1]] = m[2].trim();
    } else if (section === "objective" && line.match(/^\s+\S/)) {
      config.objective += " " + line.trim();
    }
  }
  return config;
}

function ensureDirs() {
  fs.mkdirSync(path.join(GUARDIAN_ROOT, "memory"), { recursive: true });
  fs.mkdirSync(path.join(GUARDIAN_ROOT, "reports"), { recursive: true });
}

function now() { return new Date().toISOString(); }

function eventLog(type, data) {
  ensureDirs();
  fs.appendFileSync(
    path.join(GUARDIAN_ROOT, "memory", "events.jsonl"),
    JSON.stringify({ time: now(), type, ...data }) + "\n"
  );
}

function loadLastRuns() {
  const p = path.join(GUARDIAN_ROOT, "memory", "last-runs.json");
  if (!fs.existsSync(p)) return {};
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function saveLastRuns(runs) {
  ensureDirs();
  fs.writeFileSync(path.join(GUARDIAN_ROOT, "memory", "last-runs.json"), JSON.stringify(runs, null, 2));
}

function dueJobs(matrix, lastRuns, forceJob) {
  if (forceJob) return [forceJob];
  const due = [];
  const t = Date.now();
  const dow = new Date().getUTCDay();
  const hour = new Date().getUTCHours();

  for (const [name, job] of Object.entries(matrix.jobs || {})) {
    const last = lastRuns[name] ? new Date(lastRuns[name]).getTime() : 0;
    const every = (job.every_minutes || 1440) * 60 * 1000;
    if (job.cron_dow != null && job.cron_hour_utc != null) {
      if (dow === job.cron_dow && hour === job.cron_hour_utc && t - last > 3600000) {
        due.push(name);
      }
    } else if (t - last >= every) {
      due.push(name);
    }
  }
  if (!due.length) due.push("heartbeat");
  return [...new Set(due)];
}

function riskScore(fm) {
  const det = fm.detectability ?? 0.5;
  const ctrl = fm.controllability ?? 0.5;
  const detPen = 1 + (1 - det) * 0.5;
  const ctrlPen = 1 + (1 - ctrl) * 0.3;
  return (fm.probability ?? 0.5) * (fm.impact ?? 0.5) * detPen * ctrlPen;
}

function runPremortem(failureModes) {
  const scenarios = [
    "Il funnel newsletter si rompe e nessuno si iscrive per settimane",
    "GitHub Pages deploy fallisce silenziosamente",
    "GAS smette di inviare email di conferma",
    "Contenuti stagnanti — audience perde fiducia",
    "Violazione trasparenza AI su nuova immagine",
  ];
  return scenarios.map((s) => ({
    scenario: s,
    linked_failures: failureModes.filter((f) =>
      s.toLowerCase().includes(f.category) || f.event.toLowerCase().includes("newsletter")
    ).slice(0, 2),
  }));
}

async function runScopes(scopes, config) {
  const allObs = [];
  const allVerified = [];
  const allAssumptions = [];
  let allFailures = [];

  const scopeSet = scopes.includes("all")
    ? ["availability", "newsletter", "forms", "content", "seo", "performance_data", "ai_transparency", "business_growth", "security", "editorial"]
    : scopes;

  if (scopeSet.some((s) => ["availability", "deploy"].includes(s))) {
    const r = await checkAvailability(config);
    allObs.push(...(r.observations || []).map((o) => ({ scope: "availability", ...o })));
    allVerified.push(...(r.verified_facts || []));
    allFailures.push(...(r.failures || []));
  }
  if (scopeSet.some((s) => ["newsletter", "forms", "business_growth"].includes(s))) {
    const r = await checkNewsletter(config, REPO_ROOT);
    allObs.push(...(r.observations || []).map((o) => ({ scope: "newsletter", ...o })));
    allVerified.push(...(r.verified_facts || []));
    allAssumptions.push(...(r.assumptions || []));
    allFailures.push(...(r.failures || []));
  }
  if (scopeSet.some((s) => ["content", "business_growth"].includes(s))) {
    const r = checkContent(REPO_ROOT);
    allObs.push(...(r.observations || []).map((o) => ({ scope: "content", ...o })));
    allVerified.push(...(r.verified_facts || []));
    allAssumptions.push(...(r.assumptions || []));
    allFailures.push(...(r.failures || []));
  }
  if (scopeSet.includes("performance_data")) {
    const r = checkDataIntegrity(REPO_ROOT);
    allVerified.push(...(r.verified_facts || []));
    allFailures.push(...(r.failures || []));
  }
  if (scopeSet.some((s) => ["seo", "security"].includes(s))) {
    const r = checkSeo(REPO_ROOT);
    allVerified.push(...(r.verified_facts || []));
    allFailures.push(...(r.failures || []));
  }
  if (scopeSet.includes("ai_transparency")) {
    const r = checkAiTransparency(REPO_ROOT);
    allVerified.push(...(r.verified_facts || []));
    allFailures.push(...(r.failures || []));
  }
  if (scopeSet.includes("editorial")) {
    const r = checkEditorial(REPO_ROOT);
    allObs.push(...(r.observations || []).map((o) => ({ scope: "editorial", ...o })));
    allVerified.push(...(r.verified_facts || []));
    allAssumptions.push(...(r.assumptions || []));
    allFailures.push(...(r.failures || []));
  }

  allFailures = allFailures
    .map((f) => ({ ...f, risk_score: riskScore(f) }))
    .sort((a, b) => b.risk_score - a.risk_score);

  return { observations: allObs, verified_facts: allVerified, assumptions: allAssumptions, failure_modes: allFailures };
}

function buildReport(jobsRun, data, premortem) {
  const status = data.failure_modes.some((f) => f.impact >= 0.9 && f.probability >= 0.6)
    ? "critical"
    : data.failure_modes.length
      ? "warning"
      : "ok";

  const actions = data.failure_modes.map((f) => ({
    event: f.event,
    level: f.action_level,
    action: f.suggested_action,
    executed: f.action_level === "green" ? "report_only" : "pending_approval",
  }));

  return {
    status,
    timestamp: now(),
    site: "forzaquotidiana.it",
    objective: "Crescita newsletter e integrità sito allenamenti/diario",
    jobs_executed: jobsRun,
    sequence: [
      "context", "observe", "verify", "assumptions", "premortem",
      "failure_modes", "prioritize", "act", "verify_again", "learn", "next_check",
    ],
    observations: data.observations,
    verified_facts: data.verified_facts,
    assumptions: data.assumptions,
    premortem_scenarios: premortem,
    failure_modes: data.failure_modes,
    actions,
    verification: [{ check: "report_generated", ok: true }],
    learnings: data.failure_modes.length
      ? ["Registrare failure modes per estendere adapter in futuro"]
      : ["Nessuna anomalia critica nel run corrente"],
    next_checks: [
      { what: "newsletter Sheet conteggi", when: "venerdì", owner: "Gino", automation: "manual" },
      { what: "heartbeat URL", when: "prossimo run scheduler", owner: "guardian", automation: "green" },
    ],
    human_approval_required: actions.filter((a) => a.level !== "green").map((a) => a.event),
    integrations_missing: [
      "Google Sheets API (conteggi iscritti)",
      "GA4 property",
      "GSC API",
    ],
  };
}

function writeReports(report) {
  ensureDirs();
  const jsonPath = path.join(GUARDIAN_ROOT, "reports", "guardian-latest.json");
  const mdPath = path.join(GUARDIAN_ROOT, "reports", "guardian-latest.md");
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  let md = `# Guardian Report — Forza Quotidiana\n\n`;
  md += `- **Status:** ${report.status}\n`;
  md += `- **Time:** ${report.timestamp}\n`;
  md += `- **Jobs:** ${report.jobs_executed.join(", ")}\n\n`;
  md += `## Verified facts\n`;
  report.verified_facts.forEach((f) => { md += `- ${f}\n`; });
  if (report.failure_modes.length) {
    md += `\n## Failure modes (prioritized)\n`;
    report.failure_modes.slice(0, 10).forEach((f) => {
      md += `- **[${f.category}]** ${f.event} (risk ${f.risk_score.toFixed(2)}) → ${f.suggested_action}\n`;
    });
  }
  if (report.human_approval_required.length) {
    md += `\n## Richiede approvazione umana\n`;
    report.human_approval_required.forEach((e) => { md += `- ${e}\n`; });
  }
  md += `\n## Integrazioni mancanti\n`;
  report.integrations_missing.forEach((i) => { md += `- ${i}\n`; });
  fs.writeFileSync(mdPath, md);
  return { jsonPath, mdPath };
}

async function runCommand() {
  ensureDirs();
  const args = process.argv.slice(2);
  const forceJob = args.includes("--force") ? args[args.indexOf("--force") + 1] : null;
  const jobFlag = args.includes("--job") ? args[args.indexOf("--job") + 1] : null;

  const config = loadConfig();
  const matrix = loadYamlLike(path.join(GUARDIAN_ROOT, "config", "cron-matrix.yaml"));
  const lastRuns = loadLastRuns();
  const jobsRun = dueJobs(matrix, lastRuns, jobFlag || forceJob);

  let scopes = [];
  for (const j of jobsRun) {
    const job = matrix.jobs[j];
    if (job?.scope) scopes.push(...job.scope);
  }
  scopes = [...new Set(scopes)];

  const data = await runScopes(scopes, config);
  const premortem = jobsRun.some((j) => matrix.jobs[j]?.premortem)
    ? runPremortem(data.failure_modes)
    : [];

  const report = buildReport(jobsRun, data, premortem);
  const paths = writeReports(report);

  const updatedRuns = { ...lastRuns };
  jobsRun.forEach((j) => { updatedRuns[j] = now(); });
  saveLastRuns(updatedRuns);

  eventLog("guardian_run", { status: report.status, jobs: jobsRun, failures: report.failure_modes.length });
  console.log(`Guardian: ${report.status} — jobs: ${jobsRun.join(", ")}`);
  console.log(`Report: ${path.relative(REPO_ROOT, paths.mdPath)}`);
  process.exitCode = report.status === "critical" ? 1 : 0;
}

function doctor() {
  const required = [
    "README.md",
    "AGENT.md",
    "config/guardian.yaml",
    "config/cron-matrix.yaml",
    "policy/autonomy.yaml",
    "sequences/master-sequence.md",
    "skill/SKILL.md",
    "scripts/guardian.mjs",
    "adapters/availability.mjs",
    "adapters/newsletter.mjs",
    "adapters/content.mjs",
    "adapters/seo.mjs",
    "adapters/editorial.mjs",
  ];
  const missing = required.filter((f) => !fs.existsSync(path.join(GUARDIAN_ROOT, f)));
  console.log("FQ Guardian Doctor");
  if (missing.length) {
    console.log("FAIL");
    missing.forEach((m) => console.log(`- missing: ${m}`));
    process.exitCode = 1;
  } else {
    console.log("OK");
  }
}

function init() {
  ensureDirs();
  if (!fs.existsSync(path.join(GUARDIAN_ROOT, "memory", "last-runs.json"))) {
    fs.writeFileSync(path.join(GUARDIAN_ROOT, "memory", "last-runs.json"), "{}");
  }
  console.log("Guardian initialized at guardian/");
}

const cmd = process.argv[2] || "run";
if (cmd === "run") runCommand();
else if (cmd === "doctor") doctor();
else if (cmd === "init") init();
else {
  console.log("Usage: guardian.mjs [run|doctor|init] [--job NAME] [--force NAME]");
  process.exitCode = 1;
}
