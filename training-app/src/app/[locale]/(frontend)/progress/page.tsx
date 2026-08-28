import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { AppNav } from '@/components/common/app-nav'
import { LogoutButton } from '@/components/common/logout-button'
import { PageContainer } from '@/components/ui/page-container'
import { PageHeader } from '@/components/ui/page-header'
import { ProgressDashboard } from '@/modules/training/components/progress-dashboard'
import { loadProgressDashboard } from '@/modules/training/progress/server/load-progress-dashboard'

export default async function ProgressPage() {
  const t = await getTranslations('progress')
  const result = await loadProgressDashboard()

  if (!result.user) redirect('/login')

  return (
    <PageContainer>
      <PageHeader
        className="mb-4 sm:mb-5"
        layout="stacked"
        title={t('title')}
        subtitle={t('subtitle')}
        right={<LogoutButton />}
      />

      <AppNav active="progress" />
      <ProgressDashboard data={result.data} clientId={result.user.id} />
    </PageContainer>
  )
}
