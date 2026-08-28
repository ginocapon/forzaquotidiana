import { getTranslations } from 'next-intl/server'

import { PageContainer } from '@/components/ui/page-container'
import { PageHeader } from '@/components/ui/page-header'
import { ProgramCatalog } from '@/modules/sales/components/program-catalog/program-catalog'
import { loadProgramCatalog } from '@/modules/sales/server/load-program-catalog'

export default async function ProgrammiPage() {
  const t = await getTranslations('programs')
  const products = await loadProgramCatalog()

  return (
    <PageContainer>
      <PageHeader
        className="mb-5"
        layout="stacked"
        title={t('catalogTitle')}
        subtitle={t('catalogSubtitle')}
      />
      <ProgramCatalog products={products} />
    </PageContainer>
  )
}
