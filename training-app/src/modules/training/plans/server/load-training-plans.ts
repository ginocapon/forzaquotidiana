import 'server-only'

import { headers as getHeaders } from 'next/headers.js'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { LoadTrainingPlansOutput } from '@/modules/training/plans'
import type { ClientProfile } from '@/modules/training/clients/types'
import type { Client } from '@/payload-types'

import { loadPlanTree } from './load-plan-tree'

const toClientProfile = (user: Client): ClientProfile => ({
  birthDate: user.birthDate ?? null,
  weightKg: user.weightKg ?? null,
  heightCm: user.heightCm ?? null,
  experienceLevel: user.experienceLevel ?? null,
  trainingFocus: user.trainingFocus ?? null,
  goals: user.goals ?? null,
})

export async function loadTrainingPlans(): Promise<LoadTrainingPlansOutput> {
  const headers = await getHeaders()
  const payload = await getPayload({ config: await config })
  const { user } = await payload.auth({ headers })

  if (!user || user.collection !== 'clients') {
    return { user: null }
  }

  const t = await getTranslations('home')

  const plans = await payload.find({
    collection: 'plans',
    where: { client: { equals: user.id } },
    sort: '-createdAt',
    depth: 0,
    limit: 100,
  })

  const planIds = plans.docs.map((plan) => plan.id)

  const planTree = await loadPlanTree(
    payload,
    planIds,
    {
      seriesPrefix: t('seriesPrefix'),
      durationPrefix: t('durationPrefix'),
      restPrefix: t('restPrefix'),
    },
    true,
  )

  return {
    user: { id: user.id, name: user.name ?? null, email: user.email ?? null },
    profile: toClientProfile(user),
    plans: planTree,
  }
}
