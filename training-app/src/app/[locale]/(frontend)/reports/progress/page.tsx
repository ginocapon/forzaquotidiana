import { redirect } from 'next/navigation'

import { loadProgressDashboard } from '@/modules/training/progress/server/load-progress-dashboard'

export default async function AthleteProgressReportPage() {
  const result = await loadProgressDashboard()

  if (!result.user) redirect('/login')

  redirect(`/api/reports/progress/${result.user.id}`)
}
