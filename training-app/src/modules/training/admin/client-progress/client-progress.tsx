import 'server-only'

import type { Payload } from 'payload'
import React from 'react'

import { loadClientProgressData } from '@/modules/training/progress/server/load-client-progress-data'
import type { ProgressDashboardData, SessionSummary } from '@/modules/training/progress/types'

const panelStyle: React.CSSProperties = {
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: 8,
  marginTop: 8,
  padding: 16,
}

const statGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  gap: 12,
  marginTop: 12,
}

const statCardStyle: React.CSSProperties = {
  background: 'var(--theme-elevation-50)',
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: 8,
  padding: '10px 12px',
}

const tableStyle: React.CSSProperties = {
  borderCollapse: 'collapse',
  fontSize: 13,
  marginTop: 12,
  width: '100%',
}

const thStyle: React.CSSProperties = {
  borderBottom: '1px solid var(--theme-elevation-150)',
  color: 'var(--theme-elevation-500)',
  fontSize: 11,
  fontWeight: 600,
  padding: '8px 6px',
  textAlign: 'left',
  textTransform: 'uppercase',
}

const tdStyle: React.CSSProperties = {
  borderBottom: '1px solid var(--theme-elevation-100)',
  padding: '8px 6px',
  verticalAlign: 'top',
}

const linkStyle: React.CSSProperties = {
  color: 'var(--theme-success-500)',
  textDecoration: 'none',
}

const warnStyle: React.CSSProperties = {
  background: '#fff7ed',
  border: '1px solid #fdba74',
  borderRadius: 8,
  color: '#9a3412',
  fontSize: 12,
  marginTop: 12,
  padding: '8px 12px',
}

const completionColor = (pct: number) => {
  if (pct >= 92) return '#15803d'
  if (pct >= 75) return '#c2410c'
  return '#b91c1c'
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={statCardStyle}>
      <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{value}</div>
      <div style={{ color: 'var(--theme-elevation-500)', fontSize: 11, marginTop: 4 }}>{label}</div>
    </div>
  )
}

function SessionsTable({ sessions }: { sessions: SessionSummary[] }) {
  if (sessions.length === 0) {
    return <p style={{ color: 'var(--theme-elevation-500)', fontSize: 13, marginTop: 12 }}>No logged sessions yet.</p>
  }

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>Workout</th>
          <th style={thStyle}>Date</th>
          <th style={thStyle}>Completion</th>
          <th style={thStyle}>Volume</th>
          <th style={thStyle}></th>
        </tr>
      </thead>
      <tbody>
        {sessions.map((session) => (
          <tr key={session.id}>
            <td style={tdStyle}>{session.workoutTitle}</td>
            <td style={tdStyle}>
              {new Date(session.date).toLocaleDateString('it-IT', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </td>
            <td style={{ ...tdStyle, color: completionColor(session.completionPct), fontWeight: 600 }}>
              {session.completionPct}%
            </td>
            <td style={tdStyle}>{session.volume.toLocaleString('it-IT')}</td>
            <td style={tdStyle}>
              <a href={`/admin/collections/workout-logs/${session.id}`} style={linkStyle}>
                Open
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const clientFilter = (clientId: number | string, collection: string) =>
  `/admin/collections/${collection}?limit=25&where[client][equals]=${clientId}`

function CoachProgressContent({
  clientId,
  clientName,
  data,
}: {
  clientId: number | string
  clientName: string
  data: ProgressDashboardData
}) {
  const { summary } = data
  const lowSessions = data.recentSessions.filter((session) => session.completionPct < 85)
  const needsAttention = lowSessions.length > 0

  return (
    <div style={{ maxWidth: 960, padding: '8px 0 24px' }}>
      <div style={{ marginBottom: 8 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Progress — {clientName}</h2>
        <p style={{ color: 'var(--theme-elevation-500)', fontSize: 13, margin: '4px 0 0' }}>
          Planned vs executed analysis for coach review
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        <a href={clientFilter(clientId, 'plans')} style={linkStyle}>
          Plans for this client
        </a>
        <span style={{ color: 'var(--theme-elevation-300)' }}>·</span>
        <a href={clientFilter(clientId, 'workout-logs')} style={linkStyle}>
          Workout logs (filtered)
        </a>
        <span style={{ color: 'var(--theme-elevation-300)' }}>·</span>
        <a href={`/admin/collections/clients/${clientId}`} style={linkStyle}>
          Client profile
        </a>
        <span style={{ color: 'var(--theme-elevation-300)' }}>·</span>
        <a
          href={`/api/reports/progress/${clientId}`}
          style={linkStyle}
          target="_blank"
          rel="noreferrer"
        >
          Export report (PDF)
        </a>
      </div>

      {needsAttention && (
        <div style={warnStyle}>
          <strong>{lowSessions.length} recent session(s) below 85% completion.</strong>
          <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
            {lowSessions.map((session) => (
              <li key={session.id}>
                {session.workoutTitle} — {session.completionPct}% (
                {new Date(session.date).toLocaleDateString('it-IT')}){' '}
                <a href={`/admin/collections/workout-logs/${session.id}`} style={linkStyle}>
                  open log
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <section style={panelStyle}>
        <strong style={{ fontSize: 14 }}>Summary</strong>
        <div style={statGridStyle}>
          <StatCard label="Total sessions" value={String(summary.totalSessions)} />
          <StatCard label="This month" value={String(summary.sessionsThisMonth)} />
          <StatCard
            label="Avg completion"
            value={summary.totalSessions > 0 ? `${summary.avgCompletionPct}%` : '—'}
          />
          <StatCard
            label="Total volume"
            value={summary.totalSessions > 0 ? summary.totalVolume.toLocaleString('it-IT') : '—'}
          />
          <StatCard label="Active weeks" value={String(summary.activeWeeks)} />
          <StatCard
            label="Latest weight"
            value={data.latestWeightKg != null ? `${data.latestWeightKg} kg` : '—'}
          />
        </div>
      </section>

      <section style={panelStyle}>
        <strong style={{ fontSize: 14 }}>Recent sessions</strong>
        <SessionsTable sessions={data.recentSessions} />
      </section>

      {data.personalRecords.length > 0 && (
        <section style={panelStyle}>
          <strong style={{ fontSize: 14 }}>Personal records (est. 1RM)</strong>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Exercise</th>
                <th style={thStyle}>Best set</th>
                <th style={thStyle}>e1RM</th>
                <th style={thStyle}>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.personalRecords.map((record) => (
                <tr key={record.exerciseName}>
                  <td style={tdStyle}>{record.exerciseName}</td>
                  <td style={tdStyle}>
                    {record.weightKg} kg × {record.reps}
                  </td>
                  <td style={tdStyle}>{record.estimated1rm} kg</td>
                  <td style={tdStyle}>
                    {new Date(record.date).toLocaleDateString('it-IT')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {data.bodyWeightTrend.length > 0 && (
        <section style={panelStyle}>
          <strong style={{ fontSize: 14 }}>Body weight log</strong>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Weight</th>
              </tr>
            </thead>
            <tbody>
              {[...data.bodyWeightTrend].reverse().slice(0, 10).map((point) => (
                <tr key={point.date}>
                  <td style={tdStyle}>
                    {new Date(point.date).toLocaleDateString('it-IT')}
                  </td>
                  <td style={tdStyle}>{point.weightKg} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {data.weeklyFrequency.length > 0 && (
        <section style={panelStyle}>
          <strong style={{ fontSize: 14 }}>Weekly frequency</strong>
          <div style={{ ...statGridStyle, marginTop: 12 }}>
            {data.weeklyFrequency.map((week) => (
              <StatCard key={week.weekKey} label={week.weekLabel} value={String(week.count)} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

type ClientProgressProps = {
  id?: number | string
  payload?: Payload
}

async function loadClientContext(payload: Payload, id: number | string) {
  const client = await payload.findByID({
    collection: 'clients',
    id,
    depth: 0,
    overrideAccess: true,
  })
  const data = await loadClientProgressData(payload, id, true)
  return { client, data }
}

export async function ClientProgressView({ id, payload }: ClientProgressProps) {
  if (!id || id === 'create' || !payload) {
    return (
      <div style={{ color: 'var(--theme-elevation-500)', fontSize: 14, padding: 16 }}>
        Save the client first to view progress analytics.
      </div>
    )
  }

  const { client, data } = await loadClientContext(payload, id)
  return (
    <CoachProgressContent
      clientId={id}
      clientName={client.name || client.email || `Client #${id}`}
      data={data}
    />
  )
}

export async function ClientProgressSummary({ id, payload }: ClientProgressProps) {
  if (!id || id === 'create' || !payload) return null

  const { client, data } = await loadClientContext(payload, id)
  const { summary } = data

  if (summary.totalSessions === 0) {
    return (
      <div style={{ ...panelStyle, color: 'var(--theme-elevation-500)', fontSize: 13 }}>
        No training sessions logged yet. Open the <strong>Progress</strong> tab after the first workout.
      </div>
    )
  }

  return (
    <div style={panelStyle}>
      <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <strong style={{ fontSize: 13 }}>Quick progress snapshot</strong>
        <a href={`/admin/collections/clients/${id}/progress`} style={{ ...linkStyle, fontSize: 12 }}>
          Full progress view →
        </a>
      </div>
      <div style={{ ...statGridStyle, gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        <StatCard label="Sessions" value={String(summary.totalSessions)} />
        <StatCard label="Avg completion" value={`${summary.avgCompletionPct}%`} />
        <StatCard label="Volume total" value={summary.totalVolume.toLocaleString('it-IT')} />
        <StatCard
          label="Weight"
          value={data.latestWeightKg != null ? `${data.latestWeightKg} kg` : '—'}
        />
      </div>
      <p style={{ color: 'var(--theme-elevation-500)', fontSize: 11, margin: '8px 0 0' }}>
        {client.name || client.email} · {summary.sessionsThisMonth} session(s) this month
      </p>
    </div>
  )
}
