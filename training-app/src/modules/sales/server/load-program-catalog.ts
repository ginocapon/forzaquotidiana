import 'server-only'

import { getPayload } from 'payload'

import config from '@/payload.config'

export type ProgramCatalogItem = {
  id: number | string
  slug: string
  title: string
  shortDescription?: string | null
  description?: string | null
  priceCents: number
  currency: string
  durationWeeks?: number | null
  featured?: boolean | null
}

export async function loadProgramCatalog(): Promise<ProgramCatalogItem[]> {
  const payload = await getPayload({ config: await config })

  const result = await payload.find({
    collection: 'program-products',
    where: { published: { equals: true } },
    sort: '-featured,-updatedAt',
    depth: 0,
    limit: 50,
    overrideAccess: true,
  })

  return result.docs.map((product) => ({
    id: product.id,
    slug: product.slug,
    title: product.title,
    shortDescription: product.shortDescription,
    description: product.description,
    priceCents: product.priceCents,
    currency: product.currency ?? 'eur',
    durationWeeks: product.durationWeeks,
    featured: product.featured,
  }))
}

export async function loadProgramProduct(slug: string): Promise<ProgramCatalogItem | null> {
  const payload = await getPayload({ config: await config })

  const result = await payload.find({
    collection: 'program-products',
    where: {
      and: [{ slug: { equals: slug } }, { published: { equals: true } }],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const product = result.docs[0]
  if (!product) return null

  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    shortDescription: product.shortDescription,
    description: product.description,
    priceCents: product.priceCents,
    currency: product.currency ?? 'eur',
    durationWeeks: product.durationWeeks,
    featured: product.featured,
  }
}
