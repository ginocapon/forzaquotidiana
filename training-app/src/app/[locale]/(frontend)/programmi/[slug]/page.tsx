import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { PageContainer } from '@/components/ui/page-container'
import { ProgramDetail } from '@/modules/sales/components/program-detail/program-detail'
import { loadProgramProduct } from '@/modules/sales/server/load-program-catalog'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { slug } = await params
  const product = await loadProgramProduct(slug)

  if (!product) notFound()

  return (
    <PageContainer>
      <ProgramDetail product={product} />
    </PageContainer>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const product = await loadProgramProduct(slug)
  const t = await getTranslations('programs')

  if (!product) {
    return { title: t('catalogTitle') }
  }

  return {
    title: `${product.title} · ${t('catalogTitle')}`,
    description: product.shortDescription ?? product.description ?? undefined,
  }
}
