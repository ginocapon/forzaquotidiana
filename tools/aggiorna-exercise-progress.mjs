/**
 * Valida data/exercise-progress.json
 * Uso: node tools/aggiorna-exercise-progress.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(ROOT);
const PATH = join(REPO, "data/exercise-progress.json");

const data = JSON.parse(readFileSync(PATH, "utf8"));
let entries = 0;
for (const ex of data.exercises || []) {
  entries += (ex.entries || []).length;
}
console.log(`OK exercise-progress.json — ${data.exercises.length} esercizi, ${entries} voci`);
