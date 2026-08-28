import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { loadClientProgressData } from '@/modules/training/progress/server/load-client-progress-data'
import { renderProgressReportHtml } from '@/modules/training/progress/render-progress-report-html'

type RouteContext = {
  params: Promise<{ clientId: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { clientId } = await context.params
  const headers = await getHeaders()
  const payload = await getPayload({ config: await config })
  const { user } = await payload.auth({ headers })

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const isCoach = user.collection === 'users'
  const isOwnProfile = user.collection === 'clients' && String(user.id) === clientId

  if (!isCoach && !isOwnProfile) {
    return new Response('Forbidden', { status: 403 })
  }

  const client = await payload.findByID({
    collection: 'clients',
    id: clientId,
    depth: 0,
    overrideAccess: true,
  })

  const data = await loadClientProgressData(payload, clientId, true)
  const html = renderProgressReportHtml(
    client.name || client.email || `Client #${clientId}`,
    data,
    { autoPrint: false },
  )

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
