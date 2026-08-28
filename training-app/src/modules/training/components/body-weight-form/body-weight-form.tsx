'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Surface } from '@/components/ui/surface'
import { sdk } from '@/lib/sdk'

export function BodyWeightForm({
  clientId,
  latestWeightKg,
}: {
  clientId: number | string
  latestWeightKg: number | null
}) {
  const t = useTranslations('progress')
  const router = useRouter()
  const [weightKg, setWeightKg] = useState(latestWeightKg != null ? String(latestWeightKg) : '')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    const parsed = Number(weightKg)
    if (!Number.isFinite(parsed) || parsed < 20 || parsed > 300) {
      setError(t('weightInvalid'))
      return
    }

    setLoading(true)
    try {
      await sdk.create({
        collection: 'body-weight-logs',
        data: {
          weightKg: parsed,
          recordedAt: new Date().toISOString(),
          note: note.trim() || undefined,
        },
      })
      await sdk.update({
        collection: 'clients',
        id: clientId,
        data: { weightKg: parsed },
      })
      router.refresh()
      setNote('')
    } catch {
      setError(t('weightSaveError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Surface as="form" variant="panel" className="fq-panel-gold p-4 sm:p-5" onSubmit={onSubmit}>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent-warm">
        {t('logWeight')}
      </h2>
      <div className="flex flex-wrap items-end gap-3">
        <Field label={t('weightKg')} htmlFor="weightKg" className="min-w-[8rem]">
          <Input
            id="weightKg"
            type="number"
            step="0.1"
            min={20}
            max={300}
            value={weightKg}
            onChange={(event) => setWeightKg(event.target.value)}
            required
          />
        </Field>
        <Field label={t('weightNote')} htmlFor="weightNote" className="min-w-[10rem] flex-1">
          <Input
            id="weightNote"
            type="text"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={t('weightNotePlaceholder')}
          />
        </Field>
        <Button type="submit" disabled={loading}>
          {loading ? '…' : t('saveWeight')}
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-ui-fg-error">{error}</p>}
    </Surface>
  )
}
