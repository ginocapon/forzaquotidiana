import 'server-only'

import { headers as getHeaders } from 'next/headers.js'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'

import config from '@/payload.config'

import type { ProgressDashboardOutput } from '../types'
import { loadClientProgressData } from './load-client-progress-data'

export async function loadProgressDashboard(): Promise<ProgressDashboardOutput> {
  const headers = await getHeaders()
  const payload = await getPayload({ config: await config })
  const { user } = await payload.auth({ headers })

  if (!user || user.collection !== 'clients') {
    return { user: null }
  }

  const data = await loadClientProgressData(payload, user.id, true)

  return {
    user: { id: user.id, name: user.name ?? null, email: user.email ?? null },
    data,
  }
}

export { loadClientProgressData } from './load-client-progress-data'
