import 'server-only'

import type { Payload } from 'payload'

import { loadPlanTree } from '@/modules/training/plans/server/load-plan-tree'

import { buildProgressDashboard } from '../compute-progress-dashboard'
import type { ProgressDashboardData } from '../types'

const DEFAULT_LABELS = {
  seriesPrefix: 'Sets',
  durationPrefix: 'Time',
  restPrefix: 'Rest(s)',
}

export async function loadClientProgressData(
  payload: Payload,
  clientId: number | string,
  overrideAccess = true,
): Promise<ProgressDashboardData> {
  const [plansResult, sessionsResult, bodyWeightResult] = await Promise.all([
    payload.find({
      collection: 'plans',
      where: { client: { equals: clientId } },
      sort: '-createdAt',
      depth: 0,
      limit: 100,
      overrideAccess,
    }),
    payload.find({
      collection: 'workout-logs',
      where: { client: { equals: clientId } },
      sort: '-updatedAt',
      depth: 0,
      limit: 100,
      overrideAccess,
    }),
    payload.find({
      collection: 'body-weight-logs',
      where: { client: { equals: clientId } },
      sort: 'recordedAt',
      depth: 0,
      limit: 100,
      overrideAccess,
    }),
  ])

  const planIds = plansResult.docs.map((plan) => plan.id)
  const plans = await loadPlanTree(payload, planIds, DEFAULT_LABELS, overrideAccess)

  const sessionIds = sessionsResult.docs.map((session) => session.id)
  const setsResult =
    sessionIds.length > 0
      ? await payload.find({
          collection: 'set-logs',
          where: { session: { in: sessionIds } },
          limit: 5000,
          depth: 0,
          sort: 'setNumber',
          overrideAccess,
        })
      : { docs: [] }

  return buildProgressDashboard({
    plans,
    sessions: sessionsResult.docs,
    sets: setsResult.docs,
    bodyWeightLogs: bodyWeightResult.docs,
  })
}
