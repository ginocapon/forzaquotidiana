'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

import type { ProgramCatalogItem } from '@/modules/sales/server/load-program-catalog'

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100)
}

export function ProgramCatalog({ products }: { products: ProgramCatalogItem[] }) {
  const t = useTranslations('programs')

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-ui-border-base bg-ui-bg-base/60 px-4 py-10 text-center text-sm text-ui-fg-muted">
        {t('emptyCatalog')}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {products.map((product) => (
        <article
          key={product.id}
          className="fq-panel-gold flex flex-col rounded-xl border border-ui-border-base bg-ui-bg-base/60 p-5"
        >
          {product.featured && (
            <span className="mb-2 inline-flex w-fit rounded-full border border-accent/40 bg-accent-soft px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent-warm">
              {t('featured')}
            </span>
          )}
          <h2 className="text-lg font-bold text-ui-fg-base">{product.title}</h2>
          {product.shortDescription && (
            <p className="mt-2 flex-1 text-sm text-ui-fg-muted">{product.shortDescription}</p>
          )}
          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xl font-bold text-accent-warm">
                {formatPrice(product.priceCents, product.currency)}
              </p>
              {product.durationWeeks && (
                <p className="text-xs text-ui-fg-muted">
                  {t('durationWeeks', { count: product.durationWeeks })}
                </p>
              )}
            </div>
            <Link
              href={`/programmi/${product.slug}`}
              className="rounded-lg border border-accent/30 bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent-warm transition-colors hover:bg-accent/20"
            >
              {t('viewProgram')}
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}
