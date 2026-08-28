'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import type { ProgramCatalogItem } from '@/modules/sales/server/load-program-catalog'

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100)
}

export function ProgramDetail({ product }: { product: ProgramCatalogItem }) {
  const t = useTranslations('programs')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productSlug: product.slug }),
      })

      const data = (await response.json()) as { url?: string; error?: string }

      if (!response.ok || !data.url) {
        throw new Error(data.error || t('checkoutError'))
      }

      window.location.href = data.url
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : t('checkoutError'))
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <Link href="/programmi" className="text-sm text-accent-warm hover:underline">
        ← {t('backToCatalog')}
      </Link>

      <div className="fq-panel-gold rounded-xl border border-ui-border-base bg-ui-bg-base/60 p-5 sm:p-6">
        <h1 className="text-2xl font-bold text-ui-fg-base">{product.title}</h1>
        {product.durationWeeks && (
          <p className="mt-1 text-sm text-ui-fg-muted">
            {t('durationWeeks', { count: product.durationWeeks })}
          </p>
        )}

        <p className="mt-4 text-3xl font-bold text-accent-warm">
          {formatPrice(product.priceCents, product.currency)}
        </p>

        {product.description && (
          <div className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-ui-fg-muted">
            {product.description}
          </div>
        )}

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleCheckout}
            disabled={loading}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-primary-dark transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
          >
            {loading ? t('checkoutLoading') : t('buyNow')}
          </button>
          <p className="text-xs text-ui-fg-muted">{t('checkoutHint')}</p>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  )
}
