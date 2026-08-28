import 'server-only'

import type { Payload } from 'payload'
import React from 'react'

import { computeCoachAlerts } from '@/modules/training/progress/compute-coach-alerts'

const bannerStyle: React.CSSProperties = {
  background: '#fff7ed',
  border: '1px solid #fdba74',
  borderRadius: 8,
  marginBottom: 16,
  padding: '12px 16px',
}

const linkStyle: React.CSSProperties = {
  color: 'var(--theme-success-500)',
  textDecoration: 'none',
}

const tableStyle: React.CSSProperties = {
  borderCollapse: 'collapse',
  fontSize: 13,
  marginTop: 10,
  width: '100%',
}

const thStyle: React.CSSProperties = {
  borderBottom: '1px solid #fdba74',
  color: '#9a3412',
  fontSize: 11,
  fontWeight: 600,
  padding: '6px 4px',
  textAlign: 'left',
  textTransform: 'uppercase',
}

const tdStyle: React.CSSProperties = {
  borderBottom: '1px solid #ffedd5',
  padding: '6px 4px',
  verticalAlign: 'top',
}

type CoachAlertsListProps = {
  payload?: Payload
}

export async function CoachAlertsList({ payload }: CoachAlertsListProps) {
  if (!payload) return null

  const { alerts, clientsNeedingAttention } = await computeCoachAlerts(payload)

  if (alerts.length === 0) {
    return (
      <div
        style={{
          ...bannerStyle,
          background: '#f0fdf4',
          borderColor: '#86efac',
          color: '#166534',
          fontSize: 13,
        }}
      >
        Nessun alert: tutte le sessioni recenti sono sopra l&apos;85% di completamento.
      </div>
    )
  }

  return (
    <div style={bannerStyle}>
      <strong style={{ color: '#9a3412', fontSize: 14 }}>
        {clientsNeedingAttention} atleta/i con sessioni sotto l&apos;85% di completamento
      </strong>
      <p style={{ color: '#9a3412', fontSize: 12, margin: '4px 0 0' }}>
        Ultime sessioni da rivedere — apri il profilo o il log per i dettagli.
      </p>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Atleta</th>
            <th style={thStyle}>Sessione</th>
            <th style={thStyle}>Data</th>
            <th style={thStyle}>Complet.</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <tr key={`${alert.clientId}-${alert.sessionId}`}>
              <td style={tdStyle}>{alert.clientName}</td>
              <td style={tdStyle}>{alert.sessionTitle}</td>
              <td style={tdStyle}>
                {new Date(alert.date).toLocaleDateString('it-IT', {
                  day: 'numeric',
                  month: 'short',
                })}
              </td>
              <td style={{ ...tdStyle, color: '#b91c1c', fontWeight: 600 }}>
                {alert.completionPct}%
              </td>
              <td style={tdStyle}>
                <a href={`/admin/collections/clients/${alert.clientId}/progress`} style={linkStyle}>
                  Progress
                </a>
                {' · '}
                <a
                  href={`/admin/collections/workout-logs/${alert.sessionId}`}
                  style={linkStyle}
                >
                  Log
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
