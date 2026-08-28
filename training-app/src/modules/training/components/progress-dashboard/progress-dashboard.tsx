'use client'

import { useTranslations } from 'next-intl'
import { mutedTextClass } from '@/lib/class-names'
import { Surface } from '@/components/ui/surface'
import { BodyWeightForm } from '@/modules/training/components/body-weight-form'
import type { ProgressDashboardData } from '@/modules/training/progress'

function MiniBarChart({
  items,
  valueKey,
  labelKey,
  formatValue,
}: {
  items: Array<Record<string, string | number>>
  valueKey: string
  labelKey: string
  formatValue?: (value: number) => string
}) {
  if (items.length === 0) return null

  const values = items.map((item) => Number(item[valueKey]) || 0)
  const max = Math.max(...values, 1)

  return (
    <div className="flex h-36 items-end gap-1.5 sm:gap-2">
      {items.map((item, index) => {
        const value = Number(item[valueKey]) || 0
        const heightPct = Math.max(8, Math.round((value / max) * 100))
        return (
          <div key={`${item[labelKey]}-${index}`} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
            <span className="text-[10px] tabular-nums text-ui-fg-muted">
              {formatValue ? formatValue(value) : value}
            </span>
            <div
              className="w-full max-w-10 rounded-t-md bg-gradient-to-t from-primary-dark to-accent"
              style={{ height: `${heightPct}%` }}
              title={String(value)}
            />
            <span className="max-w-full truncate text-[10px] text-ui-fg-muted">{item[labelKey]}</span>
          </div>
        )
      })}
    </div>
  )
}

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-ui-border-base bg-ui-bg-base/60 px-3 py-2.5">
      <p className="text-xl font-bold tabular-nums text-ui-fg-base sm:text-2xl">{value}</p>
      <p className="text-xs text-ui-fg-muted">{label}</p>
      {hint && <p className={`mt-0.5 text-[11px] ${mutedTextClass}`}>{hint}</p>}
    </div>
  )
}

export function ProgressDashboard({
  data,
  clientId,
}: {
  data: ProgressDashboardData
  clientId: number | string
}) {
  const t = useTranslations('progress')
  const { summary } = data
  const hasSessions = summary.totalSessions > 0

  return (
    <div className="space-y-4">
      {hasSessions && (
        <div className="flex justify-end">
          <a
            href={`/api/reports/progress/${clientId}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-accent/30 bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent-warm transition-colors hover:bg-accent/20"
          >
            {t('exportReport')}
          </a>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label={t('stats.totalSessions')} value={String(summary.totalSessions)} />
        <StatCard label={t('stats.thisMonth')} value={String(summary.sessionsThisMonth)} />
        <StatCard
          label={t('stats.avgCompletion')}
          value={hasSessions ? `${summary.avgCompletionPct}%` : '—'}
        />
        <StatCard
          label={t('stats.totalVolume')}
          value={hasSessions ? summary.totalVolume.toLocaleString('it-IT') : '—'}
          hint={t('stats.volumeHint')}
        />
      </div>

      <BodyWeightForm clientId={clientId} latestWeightKg={data.latestWeightKg} />

      {data.bodyWeightTrend.length > 0 && (
        <Surface className="fq-panel-gold p-4 sm:p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent-warm">
            {t('bodyWeightTrend')}
          </h2>
          <MiniBarChart
            items={data.bodyWeightTrend.map((point) => ({
              label: new Date(point.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
              value: point.weightKg,
            }))}
            valueKey="value"
            labelKey="label"
            formatValue={(value) => `${value} kg`}
          />
        </Surface>
      )}

      {data.weeklyFrequency.length > 0 && (
        <Surface className="fq-panel-gold p-4 sm:p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent-warm">
            {t('weeklyFrequency')}
          </h2>
          <MiniBarChart
            items={data.weeklyFrequency.map((week) => ({
              label: week.weekLabel,
              value: week.count,
            }))}
            valueKey="value"
            labelKey="label"
          />
          <p className={`mt-2 text-xs ${mutedTextClass}`}>
            {t('activeWeeks', { count: summary.activeWeeks })}
          </p>
        </Surface>
      )}

      {data.volumeTrend.length > 0 && (
        <Surface className="fq-panel-gold p-4 sm:p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent-warm">
            {t('volumeTrend')}
          </h2>
          <MiniBarChart
            items={data.volumeTrend.map((point) => ({
              label: point.label,
              value: point.volume,
            }))}
            valueKey="value"
            labelKey="label"
          />
        </Surface>
      )}

      {data.personalRecords.length > 0 && (
        <Surface className="fq-panel-gold p-4 sm:p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent-warm">
            {t('personalRecords')}
          </h2>
          <ul className="space-y-2">
            {data.personalRecords.map((record) => (
              <li
                key={record.exerciseName}
                className="flex items-center justify-between gap-3 rounded-lg border border-ui-border-base bg-ui-bg-base/50 px-3 py-2 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{record.exerciseName}</p>
                  <p className={`text-xs ${mutedTextClass}`}>
                    {record.weightKg} kg × {record.reps} · e1RM ~{record.estimated1rm} kg
                  </p>
                </div>
                <span className={`shrink-0 text-xs ${mutedTextClass}`}>
                  {new Date(record.date).toLocaleDateString('it-IT')}
                </span>
              </li>
            ))}
          </ul>
        </Surface>
      )}

      {data.recentSessions.length > 0 ? (
        <Surface className="fq-panel-gold p-4 sm:p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent-warm">
            {t('recentSessions')}
          </h2>
          <ul className="space-y-2">
            {data.recentSessions.map((session) => (
              <li
                key={session.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-ui-border-base bg-ui-bg-base/50 px-3 py-2 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{session.workoutTitle}</p>
                  <p className={`text-xs ${mutedTextClass}`}>
                    {new Date(session.date).toLocaleDateString('it-IT', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                    {' · '}
                    {t('sessionVolume', { volume: session.volume })}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-semibold tabular-nums text-accent-warm">{session.completionPct}%</p>
                  <p className={`text-[11px] ${mutedTextClass}`}>{t('completionShort')}</p>
                </div>
              </li>
            ))}
          </ul>
        </Surface>
      ) : (
        <Surface className="fq-panel-gold py-10 text-center text-sm text-ui-fg-muted">
          {t('noSessionsYet')}
        </Surface>
      )}
    </div>
  )
}
