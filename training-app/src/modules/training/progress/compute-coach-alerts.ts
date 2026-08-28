import 'server-only'

import type { Payload } from 'payload'

import { loadClientProgressData } from './server/load-client-progress-data'

export type CoachAlert = {
  clientId: number | string
  clientName: string
  clientEmail?: string | null
  sessionId: number
  sessionTitle: string
  completionPct: number
  date: string
}

export type CoachAlertsSummary = {
  alerts: CoachAlert[]
  clientsNeedingAttention: number
}

const COMPLETION_THRESHOLD = 85
const LOOKBACK_DAYS = 21

export async function computeCoachAlerts(payload: Payload): Promise<CoachAlertsSummary> {
  const since = new Date()
  since.setDate(since.getDate() - LOOKBACK_DAYS)

  const recentLogs = await payload.find({
    collection: 'workout-logs',
    where: { updatedAt: { greater_than: since.toISOString() } },
    limit: 500,
    depth: 0,
    overrideAccess: true,
  })

  const clientIds = [
    ...new Set(
      recentLogs.docs
        .map((log) => (typeof log.client === 'object' ? log.client?.id : log.client))
        .filter(Boolean),
    ),
  ] as (number | string)[]

  if (clientIds.length === 0) {
    return { alerts: [], clientsNeedingAttention: 0 }
  }

  const clientsResult = await payload.find({
    collection: 'clients',
    where: { id: { in: clientIds } },
    limit: clientIds.length,
    depth: 0,
    overrideAccess: true,
  })

  const clientById = new Map<number | string, (typeof clientsResult.docs)[number]>(
    clientsResult.docs.map((client) => [client.id, client]),
  )
  const alerts: CoachAlert[] = []

  for (const clientId of clientIds) {
    const client = clientById.get(clientId)
    if (!client) continue

    const data = await loadClientProgressData(payload, clientId, true)
    for (const session of data.recentSessions) {
      if (session.completionPct >= COMPLETION_THRESHOLD) continue
      alerts.push({
        clientId,
        clientName: client.name || client.email || `Client #${clientId}`,
        clientEmail: client.email,
        sessionId: session.id,
        sessionTitle: session.workoutTitle,
        completionPct: session.completionPct,
        date: session.date,
      })
    }
  }

  alerts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const clientsNeedingAttention = new Set(alerts.map((alert) => alert.clientId)).size

  return { alerts: alerts.slice(0, 20), clientsNeedingAttention }
}
