'use client'

import { useTranslations } from 'next-intl'
import React, { useMemo } from 'react'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { mutedTextClass } from '@/lib/class-names'
import { Surface } from '@/components/ui/surface'
import type { WorkoutTree } from '@/modules/training/plans'
import { computeWorkoutVerification } from '@/modules/training/verification'
import type { Trend } from '@/modules/training/verification'
import type { SetLog } from '@/payload-types'

const TrendIcon = ({ trend }: { trend: Trend }) => {
  if (trend === 'up') return <TrendingUp size={14} className="text-ui-tag-green-icon" />
  if (trend === 'down') return <TrendingDown size={14} className="text-ui-tag-red-icon" />
  if (trend === 'same') return <Minus size={14} className="text-ui-fg-muted" />
  return null
}

const completionTone = (pct: number) => {
  if (pct >= 92) return 'text-ui-tag-green-text'
  if (pct >= 75) return 'text-ui-tag-orange-text'
  return 'text-ui-tag-red-text'
}

export function WorkoutVerificationPanel({
  workout,
  sets,
}: {
  workout: WorkoutTree
  sets: SetLog[]
}) {
  const t = useTranslations('verification')
  const report = useMemo(() => computeWorkoutVerification(workout, sets), [workout, sets])

  if (sets.length === 0) return null

  const hasPlannedData = report.exercises.some((entry) => entry.plannedSets > 0)

  return (
    <Surface className="fq-panel-gold mt-4 space-y-4 p-4 sm:p-5">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-warm">
          {t('title')}
        </h2>
        <p className="mt-1 text-sm text-ui-fg-muted">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-ui-border-base bg-ui-bg-base/60 px-3 py-2.5">
          <p className={`text-2xl font-bold tabular-nums ${completionTone(report.completionPct)}`}>
            {report.completionPct}%
          </p>
          <p className="text-xs text-ui-fg-muted">{t('completion')}</p>
        </div>
        {hasPlannedData && (
          <>
            <div className="rounded-lg border border-ui-border-base bg-ui-bg-base/60 px-3 py-2.5">
              <p className="text-lg font-semibold tabular-nums text-ui-fg-base">
                {report.actualVolume}
                <span className={mutedTextClass}> / {report.plannedVolume}</span>
              </p>
              <p className="text-xs text-ui-fg-muted">{t('volumeKg')}</p>
            </div>
            <div className="rounded-lg border border-ui-border-base bg-ui-bg-base/60 px-3 py-2.5">
              <p className={`text-2xl font-bold tabular-nums ${completionTone(report.volumePct)}`}>
                {report.volumePct}%
              </p>
              <p className="text-xs text-ui-fg-muted">{t('volumePct')}</p>
            </div>
          </>
        )}
      </div>

      <p className="text-sm text-ui-fg-base">
        {t(`progression.${report.progression}`)}
      </p>

      {report.suggestions.length > 0 && (
        <ul className="space-y-2 text-sm">
          {report.suggestions.map((key) => (
            <li
              key={key}
              className="rounded-lg border border-accent/20 bg-accent-soft px-3 py-2 text-ui-fg-base"
            >
              {t(`suggestions.${key}`)}
            </li>
          ))}
        </ul>
      )}

      {hasPlannedData && (
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-ui-fg-interactive">
            {t('detailsToggle')}
          </summary>
          <ul className="mt-3 space-y-2 text-sm">
            {report.exercises
              .filter((entry) => entry.plannedSets > 0 || entry.actualSets > 0)
              .map((entry) => (
                <li
                  key={entry.exerciseRowId}
                  className="rounded-lg border border-ui-border-base bg-ui-bg-base/50 px-3 py-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium">{entry.name}</span>
                    <span className={`shrink-0 tabular-nums ${completionTone(entry.setsCompletionPct)}`}>
                      {entry.setsCompletionPct}%
                    </span>
                  </div>
                  <p className={`mt-1 text-xs ${mutedTextClass}`}>
                    {t('setsLine', { actual: entry.actualSets, planned: entry.plannedSets })}
                    {entry.plannedWeight != null && entry.avgActualWeight != null && (
                      <>
                        {' · '}
                        {t('weightLine', {
                          actual: Math.round(entry.avgActualWeight * 10) / 10,
                          planned: entry.plannedWeight,
                        })}
                      </>
                    )}
                  </p>
                  <div className="mt-1 flex gap-3 text-xs text-ui-fg-muted">
                    <span className="inline-flex items-center gap-1">
                      <TrendIcon trend={entry.weightTrend} />
                      {t('load')}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <TrendIcon trend={entry.repsTrend} />
                      {t('reps')}
                    </span>
                  </div>
                </li>
              ))}
          </ul>
        </details>
      )}
    </Surface>
  )
}
