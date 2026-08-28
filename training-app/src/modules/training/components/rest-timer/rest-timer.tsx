'use client'

import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import { Timer, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function RestTimer({
  seconds,
  label,
  onDismiss,
}: {
  seconds: number
  label?: string
  onDismiss: () => void
}) {
  const t = useTranslations('restTimer')
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    setRemaining(seconds)
  }, [seconds])

  useEffect(() => {
    if (remaining <= 0) {
      onDismiss()
      return
    }
    const id = window.setInterval(() => {
      setRemaining((prev) => prev - 1)
    }, 1000)
    return () => window.clearInterval(id)
  }, [remaining, onDismiss])

  const pct = Math.max(0, Math.min(100, (remaining / seconds) * 100))

  return (
    <div className="fq-panel-gold mt-3 overflow-hidden rounded-xl">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Timer size={18} className="shrink-0 text-accent" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ui-fg-base">{t('title')}</p>
            {label && <p className="truncate text-xs text-ui-fg-muted">{label}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="tabular-nums text-2xl font-bold text-accent-warm">{remaining}s</span>
          <Button variant="icon" aria-label={t('skip')} onClick={onDismiss}>
            <X size={16} />
          </Button>
        </div>
      </div>
      <div className="h-1 bg-ui-bg-base">
        <div
          className="h-full bg-accent transition-[width] duration-1000 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
