/**
 * Renderer statico modulo TSB — grafico SVG sempre visibile (no JS richiesto)
 */
export function statusId(label) {
  return String(label || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function formatTsb(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return "—";
  return n.toFixed(1);
}

export function formatItalianDate(iso) {
  const p = iso.split("-");
  if (p.length !== 3) return iso;
  return `${p[2]}/${p[1]}`;
}

export function sessionInterpretation(s) {
  if (s.status === "Rilassato") return "Recupero ampio — puoi spingere se la sessione lo richiede.";
  if (s.status === "Energetico") return "Buona freschezza — giornata adatta a carichi pieni.";
  if (s.status === "Bilanciato") return "Equilibrio tra fitness e fatica — sessione in linea con il carico programmato.";
  return "Fatica accumulata — utile per lo stimolo, ma monitora recupero e sonno.";
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

function sliceTimeline(timeline, focusDate, windowDays) {
  if (!focusDate) {
    return { points: timeline, focusIndex: -1, focusPoint: null };
  }
  let idx = timeline.findIndex((p) => p.date === focusDate);
  if (idx < 0) idx = timeline.length - 1;
  let start = Math.max(0, idx - Math.floor(windowDays / 2));
  let end = Math.min(timeline.length, start + windowDays);
  if (end - start < windowDays) start = Math.max(0, end - windowDays);
  const points = timeline.slice(start, end);
  const focusIndex = points.findIndex((p) => p.date === focusDate);
  return {
    points,
    focusIndex,
    focusPoint: focusIndex >= 0 ? points[focusIndex] : null,
  };
}

/** Vista mensile: mese calendario + ~14 gg prima per contesto (come Zepp) */
function sliceMonthTimeline(timeline, monthKey, sessions, overrides = {}, paddingDays = 14) {
  const [year, month] = monthKey.split("-").map(Number);
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);
  const windowStart = new Date(monthStart);
  windowStart.setDate(windowStart.getDate() - paddingDays);

  const pad = (n) => String(n).padStart(2, "0");
  const startIso = `${windowStart.getFullYear()}-${pad(windowStart.getMonth() + 1)}-${pad(windowStart.getDate())}`;
  const endIso = `${year}-${pad(month)}-${pad(monthEnd.getDate())}`;

  const points = timeline.filter((p) => p.date >= startIso && p.date <= endIso);
  if (!points.length) {
    return { points: [], focusIndex: -1, focusPoint: null, focusDate: null };
  }

  const monthPrefix = `${year}-${pad(month)}`;
  const sessionInMonth = (sessions || [])
    .filter((s) => s.date && s.date.startsWith(monthPrefix))
    .map((s) => s.date);
  const overrideInMonth = Object.keys(overrides)
    .filter((d) => d.startsWith(monthPrefix))
    .sort();
  const daysInMonth = points
    .filter((p) => p.date.startsWith(monthPrefix))
    .map((p) => p.date);

  let candidates = [...new Set([...overrideInMonth, ...sessionInMonth])].sort();
  if (!candidates.length) candidates = daysInMonth.sort();
  const focusDate = candidates.length
    ? candidates[candidates.length - 1]
    : points[points.length - 1].date;

  const focusIndex = points.findIndex((p) => p.date === focusDate);
  return {
    points,
    focusIndex,
    focusPoint: focusIndex >= 0 ? points[focusIndex] : null,
    focusDate,
  };
}

function parseMode(mode) {
  if (!mode || mode === "overview") return { type: "overview" };
  if (mode.startsWith("month-")) return { type: "month", monthKey: mode.slice(6) };
  if (/^\d{4}-\d{2}$/.test(mode)) return { type: "month", monthKey: mode };
  return { type: "date", focusDate: mode };
}

function linePath(points, key, xFn, yFn) {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"}${xFn(i)} ${yFn(p[key])}`)
    .join(" ");
}

function renderSvg(slice, focusDate, sessions, uid) {
  const points = slice.points;
  const w = 640;
  const h = 240;
  const padL = 8;
  const padR = 40;
  const padT = 14;
  const padB = 30;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;

  let maxLine = 0;
  let maxLoad = 0;
  points.forEach((p) => {
    maxLine = Math.max(maxLine, p.atl, p.ctl);
    maxLoad = Math.max(maxLoad, p.load || 0);
  });
  let maxVal = Math.ceil(maxLine / 5) * 5 + 5;
  if (maxVal < 45) maxVal = 45;

  const x = (i) => padL + (i / (points.length - 1 || 1)) * chartW;
  const y = (v) => padT + chartH - (v / maxVal) * chartH;
  const barMaxH = chartH * 0.32;

  const sessionDates = {};
  sessions.forEach((s) => {
    sessionDates[s.date] = true;
  });

  let svg = `<svg class="tsb-module__svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Grafico fitness CTL e fatica ATL">`;
  svg += `<defs><linearGradient id="tsbFill-${uid}" x1="0" y1="0" x2="0" y2="1">`;
  svg += '<stop offset="0%" stop-color="#e85d5d" stop-opacity="0.22"/>';
  svg += '<stop offset="100%" stop-color="#e85d5d" stop-opacity="0"/>';
  svg += "</linearGradient></defs>";

  points.forEach((p, i) => {
    if (!p.load) return;
    const barW = (chartW / points.length) * 0.55;
    const bx = x(i) - barW / 2;
    const bh = maxLoad ? (p.load / maxLoad) * barMaxH : 0;
    svg += `<rect class="tsb-bar" x="${bx}" y="${padT + chartH - bh}" width="${barW}" height="${bh}" rx="1"/>`;
  });

  if (slice.focusIndex >= 0) {
    const fp = points[slice.focusIndex];
    const fx = x(slice.focusIndex);
    const top = Math.min(y(fp.atl), y(fp.ctl));
    const bottom = Math.max(y(fp.atl), y(fp.ctl));
    svg += `<rect x="${fx - 18}" y="${top}" width="36" height="${bottom - top}" fill="url(#tsbFill-${uid})" opacity="0.6"/>`;
  }

  svg += `<path class="tsb-line tsb-line--atl" d="${linePath(points, "atl", x, y)}"/>`;
  svg += `<path class="tsb-line tsb-line--ctl" d="${linePath(points, "ctl", x, y)}"/>`;

  if (slice.focusIndex >= 0) {
    const fx = x(slice.focusIndex);
    const fp = points[slice.focusIndex];
    svg += `<line class="tsb-focus-line" x1="${fx}" y1="${padT}" x2="${fx}" y2="${padT + chartH}"/>`;
    svg += `<circle class="tsb-dot tsb-dot--atl" cx="${fx}" cy="${y(fp.atl)}" r="5"/>`;
    svg += `<circle class="tsb-dot tsb-dot--ctl" cx="${fx}" cy="${y(fp.ctl)}" r="5"/>`;
  }

  points.forEach((p, i) => {
    if (!sessionDates[p.date] && p.date !== focusDate) return;
    const cx = x(i);
    const cy = y(p.atl);
    const active = p.date === focusDate;
    svg += `<circle class="tsb-session-marker${active ? " is-active" : ""}" cx="${cx}" cy="${cy}" r="${active ? 5 : 3}"/>`;
  });

  for (let tick = 0; tick <= maxVal; tick += 15) {
    if (tick === 0) continue;
    const ty = y(tick);
    svg += `<text class="tsb-axis-y" x="${w - 8}" y="${ty}" text-anchor="end" dominant-baseline="middle">${tick}</text>`;
  }

  const labelStep = Math.max(1, Math.ceil(points.length / 8));
  points.forEach((p, i) => {
    if (i % labelStep !== 0 && i !== points.length - 1) return;
    svg += `<text class="tsb-axis-x" x="${x(i)}" y="${h - 8}" text-anchor="middle">${esc(p.label)}</text>`;
  });

  svg += "</svg>";
  return svg;
}

function kpi(label, value, cls) {
  return `<div class="tsb-module__kpi ${cls}"><dt>${esc(label)}</dt><dd>${esc(String(value))}</dd></div>`;
}

const MONTH_LABELS = {
  "01": "gennaio", "02": "febbraio", "03": "marzo", "04": "aprile",
  "05": "maggio", "06": "giugno", "07": "luglio", "08": "agosto",
  "09": "settembre", "10": "ottobre", "11": "novembre", "12": "dicembre",
};

function monthLabel(monthKey) {
  const [y, m] = monthKey.split("-");
  return `${MONTH_LABELS[m] || m} ${y}`;
}

/**
 * @param {object} data - training-load.json
 * @param {string|null} mode - "overview", "month-YYYY-MM", YYYY-MM-DD
 * @param {string} uid - id univoco per gradienti SVG
 */
export function renderTsbModule(data, mode, uid = "tsb0") {
  const parsed = parseMode(mode);
  const timeline = data.timeline || [];
  if (!timeline.length) return "<p class=\"tsb-module__fallback\"><small>Modulo TSB non disponibile.</small></p>";

  let slice;
  let focusDate = null;
  let chartFocusDate = null;

  if (parsed.type === "overview") {
    slice = sliceTimeline(timeline, null, timeline.length);
  } else if (parsed.type === "month") {
    slice = sliceMonthTimeline(timeline, parsed.monthKey, data.sessions || [], data.overrides || {});
    focusDate = slice.focusDate;
    chartFocusDate = focusDate;
  } else {
    focusDate = parsed.focusDate;
    slice = sliceTimeline(timeline, focusDate, 42);
    chartFocusDate = focusDate;
  }

  const snapshot = focusDate && data.snapshots[focusDate] ? data.snapshots[focusDate] : null;
  const display = snapshot || slice.focusPoint || slice.points[slice.points.length - 1];
  const statusClass = statusId(display.status);

  let html = '<div class="tsb-module__head">';
  html += '<div class="tsb-module__title-block">';
  html += `<h3 class="tsb-module__title">Modulo di allenamento <span class="tsb-module__abbr">(TSB)</span>`;
  if (parsed.type === "month") html += ` · ${esc(monthLabel(parsed.monthKey))}`;
  else if (focusDate) html += ` · ${esc(formatItalianDate(focusDate))}`;
  html += "</h3>";
  html += `<p class="tsb-module__status tsb-module__status--${statusClass}">`;
  html += `<strong>${esc(formatTsb(display.tsb))}</strong> ${esc(display.status)}`;
  html += "</p></div>";
  html += '<div class="tsb-module__kpis">';
  html += kpi("Livello di affaticamento (ATL)", display.atl, "tsb-kpi--fatigue");
  html += kpi("Livello di fitness (CTL)", display.ctl, "tsb-kpi--fitness");
  html += "</div></div>";

  html += '<div class="tsb-module__chart-wrap">';
  html += renderSvg(slice, chartFocusDate, data.sessions || [], uid);
  html += '<div class="tsb-module__zones" aria-hidden="true">';
  html += '<span class="tsb-zone__title">Da allenamenti</span>';
  data.zones.forEach((z) => {
    html += `<span class="tsb-zone tsb-zone--${z.id}">${esc(z.label)}</span>`;
  });
  html += "</div>";
  html += "</div>";

  html += '<p class="tsb-module__legend"><span class="tsb-legend tsb-legend--atl">● Fatica ATL</span> <span class="tsb-legend tsb-legend--ctl">● Fitness CTL</span> <span class="tsb-legend tsb-legend--bar">▮ Carico giornaliero</span></p>';

  if (parsed.type === "month" && focusDate) {
    html += '<p class="tsb-module__session-note">';
    html += `Riepilogo <strong>${esc(monthLabel(parsed.monthKey))}</strong> — valori al <strong>${esc(formatItalianDate(focusDate))}</strong>: `;
    html += `<strong>${esc(display.status)}</strong> (TSB ${esc(formatTsb(display.tsb))}). `;
    html += esc(sessionInterpretation(display));
    html += "</p>";
  } else if (focusDate && snapshot) {
    html += '<p class="tsb-module__session-note">';
    html += `Giudizio del <strong>${esc(formatItalianDate(focusDate))}</strong>: `;
    html += `<strong>${esc(display.status)}</strong> (TSB ${esc(formatTsb(display.tsb))}). `;
    html += esc(sessionInterpretation(display));
    html += "</p>";
  } else if (parsed.type === "overview") {
    html += '<p class="tsb-module__session-note">Panoramica trimestre — pallini = sessioni registrate. Grafico sempre visibile; valori da carico Zepp/Amazfit.</p>';
  }

  return html;
}

export function renderTsbPanel(mode, innerHtml, label = "Fitness · fatica · riposo") {
  const attr = mode === "overview" ? "overview" : mode;
  return `
    <section class="session-panel session-panel--tsb" aria-labelledby="tsb-modulo-${attr}">
      <span class="session-panel__label" id="tsb-modulo-${attr}">${label}</span>
      <div class="tsb-module tsb-module--static" data-training-load="${attr}" aria-live="polite">${innerHtml}</div>
    </section>
`;
}

export function renderTrimestreSchedaBlock(schedaNum, innerHtml) {
  return `
      <div class="tsb-module tsb-module--static tsb-module--trimestre" data-training-load="scheda-${schedaNum}" aria-label="Grafico TSB Scheda ${schedaNum}">
        ${innerHtml}
      </div>
`;
}
