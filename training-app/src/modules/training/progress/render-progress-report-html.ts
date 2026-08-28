import type { ProgressDashboardData } from './types'

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

const formatShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

export function renderProgressReportHtml(
  clientName: string,
  data: ProgressDashboardData,
  options?: { generatedAt?: Date; autoPrint?: boolean },
): string {
  const generatedAt = options?.generatedAt ?? new Date()
  const { summary } = data

  const sessionsRows = data.recentSessions
    .map(
      (session) => `
        <tr>
          <td>${escapeHtml(session.workoutTitle)}</td>
          <td>${formatShortDate(session.date)}</td>
          <td>${session.completionPct}%</td>
          <td>${session.volume.toLocaleString('it-IT')}</td>
        </tr>`,
    )
    .join('')

  const prRows = data.personalRecords
    .map(
      (record) => `
        <tr>
          <td>${escapeHtml(record.exerciseName)}</td>
          <td>${record.weightKg} kg × ${record.reps}</td>
          <td>${record.estimated1rm} kg</td>
          <td>${formatShortDate(record.date)}</td>
        </tr>`,
    )
    .join('')

  const weightRows = [...data.bodyWeightTrend]
    .reverse()
    .slice(0, 10)
    .map(
      (point) => `
        <tr>
          <td>${formatShortDate(point.date)}</td>
          <td>${point.weightKg} kg</td>
        </tr>`,
    )
    .join('')

  const autoPrintScript = options?.autoPrint
    ? '<script>window.addEventListener("load", () => window.print())</script>'
    : ''

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <title>Report progressi — ${escapeHtml(clientName)}</title>
  <style>
    body { font-family: system-ui, sans-serif; color: #111; margin: 24px; line-height: 1.45; }
    h1 { font-size: 22px; margin: 0 0 4px; }
    .meta { color: #555; font-size: 13px; margin-bottom: 24px; }
    .stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin: 16px 0 24px; }
    .stat { border: 1px solid #ddd; border-radius: 8px; padding: 12px; }
    .stat strong { display: block; font-size: 20px; }
    .stat span { color: #666; font-size: 12px; }
    section { margin-bottom: 28px; }
    h2 { font-size: 16px; margin: 0 0 8px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { border-bottom: 1px solid #eee; padding: 8px 6px; text-align: left; }
    th { color: #666; font-size: 11px; text-transform: uppercase; }
    .footer { margin-top: 32px; color: #888; font-size: 11px; }
    @media print {
      body { margin: 12mm; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <button class="no-print" onclick="window.print()" style="margin-bottom:16px;padding:8px 14px;cursor:pointer;">Stampa / Salva PDF</button>
  <h1>Report progressi — ${escapeHtml(clientName)}</h1>
  <p class="meta">Generato il ${formatDate(generatedAt.toISOString())} · Forza Quotidiana</p>

  <section>
    <h2>Riepilogo</h2>
    <div class="stats">
      <div class="stat"><strong>${summary.totalSessions}</strong><span>Sessioni totali</span></div>
      <div class="stat"><strong>${summary.sessionsThisMonth}</strong><span>Questo mese</span></div>
      <div class="stat"><strong>${summary.totalSessions > 0 ? `${summary.avgCompletionPct}%` : '—'}</strong><span>Completamento medio</span></div>
      <div class="stat"><strong>${summary.totalSessions > 0 ? summary.totalVolume.toLocaleString('it-IT') : '—'}</strong><span>Volume cumulato</span></div>
      <div class="stat"><strong>${summary.activeWeeks}</strong><span>Settimane attive</span></div>
      <div class="stat"><strong>${data.latestWeightKg != null ? `${data.latestWeightKg} kg` : '—'}</strong><span>Ultimo peso</span></div>
    </div>
  </section>

  ${
    sessionsRows
      ? `<section><h2>Sessioni recenti</h2><table><thead><tr><th>Allenamento</th><th>Data</th><th>Completamento</th><th>Volume</th></tr></thead><tbody>${sessionsRows}</tbody></table></section>`
      : ''
  }

  ${
    prRows
      ? `<section><h2>Record personali (e1RM)</h2><table><thead><tr><th>Esercizio</th><th>Serie</th><th>e1RM</th><th>Data</th></tr></thead><tbody>${prRows}</tbody></table></section>`
      : ''
  }

  ${
    weightRows
      ? `<section><h2>Peso corporeo</h2><table><thead><tr><th>Data</th><th>Peso</th></tr></thead><tbody>${weightRows}</tbody></table></section>`
      : ''
  }

  <p class="footer">Documento generato automaticamente dall'app Forza Quotidiana.</p>
  ${autoPrintScript}
</body>
</html>`
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
