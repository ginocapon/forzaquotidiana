import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { PageContainer } from '@/components/ui/page-container'
import { PageHeader } from '@/components/ui/page-header'

export default async function ProgramCheckoutSuccessPage() {
  const t = await getTranslations('programs')

  return (
    <PageContainer>
      <PageHeader
        className="mb-5"
        layout="stacked"
        title={t('successTitle')}
        subtitle={t('successSubtitle')}
      />
      <div className="fq-panel-gold rounded-xl border border-ui-border-base bg-ui-bg-base/60 p-5 text-sm text-ui-fg-muted">
        <p>{t('successBody')}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-lg border border-accent/30 bg-accent-soft px-3 py-1.5 font-medium text-accent-warm"
          >
            {t('goToLogin')}
          </Link>
          <Link href="/" className="rounded-lg px-3 py-1.5 text-ui-fg-base hover:underline">
            {t('goToTraining')}
          </Link>
        </div>
      </div>
    </PageContainer>
  )
}
