# AGENTS.md

Guidance for AI agents working in this repository.

## Project overview

**La Forza Quotidiana** is a static Italian website (HTML/CSS/JS, no build step, no external CDNs). It is deployed to GitHub Pages via `.github/workflows/deploy-pages.yml`.

## Cursor Cloud specific instructions

### Local development server

The site **must** be served over HTTP. Do not open `index.html` via `file://` — assets and JSON use absolute paths (`/css/...`, `/data/...`) and will fail without a web server.

From the repo root:

```bash
python3 -m http.server 8765
```

Then open `http://127.0.0.1:8765/` (or use the Cloud Agent port preview for `:8765`).

Run the server in a **tmux** session so it stays up across commands.

### What to run (no root package manager)

| Task | Command |
|------|---------|
| Serve site | `python3 -m http.server 8765` (repo root) |
| Validate SEO on a page | `node scripts/validate-page.js --file path/to/index.html` |
| PDF tools (optional) | `cd tools && npm install && npm run pdf` |

There is no ESLint, TypeScript, or root-level `npm test`. CI only deploys static files to GitHub Pages.

### Optional internal tools (`tools/`)

Node scripts for PDF generation, TSB charts, macrociclo sync, etc. They are **not** required to preview the public site. Install only when running those scripts:

```bash
cd tools && npm install
```

`puppeteer-core` expects a local Chrome/Chromium for PDF generation.

### Admin area

`/admin/` loads JSON from `/admin/data/*.json` via `fetch`. If the dev server is running, the dashboard should replace "Caricamento…" with macrociclo session cards. A persistent "Caricamento…" usually means the server is not running or the page was opened as `file://`.

### Newsletter / Supabase

Newsletter signup uses Google Apps Script (see `NEWSLETTER-SETUP.md`). Demo access to schede works without backend configuration.
