'use client'

import { useTranslations } from 'next-intl'
import { Surface } from '@/components/ui/surface'
import { mutedTextClass } from '@/lib/class-names'
import {
  experienceLevelLabel,
  trainingFocusLabel,
} from '@/modules/training/clients/constants'
import type { ClientProfile } from '@/modules/training/clients/types'

function calcAge(birthDate?: string | null): number | null {
  if (!birthDate) return null
  const born = new Date(birthDate)
  if (Number.isNaN(born.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - born.getFullYear()
  const monthDiff = today.getMonth() - born.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < born.getDate())) age -= 1
  return age >= 0 ? age : null
}

export function AthleteProfileCard({ profile }: { profile: ClientProfile }) {
  const t = useTranslations('home')
  const age = calcAge(profile.birthDate)
  const focusLabels = (profile.trainingFocus ?? []).map(trainingFocusLabel)
  const hasContent =
    age != null ||
    profile.weightKg != null ||
    profile.heightCm != null ||
    profile.experienceLevel ||
    focusLabels.length > 0 ||
    profile.goals

  if (!hasContent) return null

  return (
    <Surface className="fq-panel-gold p-4 sm:p-5">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent-warm">
        {t('profileTitle')}
      </h2>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
        {age != null && (
          <div>
            <dt className={mutedTextClass}>{t('profileAge')}</dt>
            <dd className="font-medium text-ui-fg-base">{t('yearsOld', { age })}</dd>
          </div>
        )}
        {profile.weightKg != null && (
          <div>
            <dt className={mutedTextClass}>{t('profileWeight')}</dt>
            <dd className="font-medium text-ui-fg-base">{t('kgUnit', { value: profile.weightKg })}</dd>
          </div>
        )}
        {profile.heightCm != null && (
          <div>
            <dt className={mutedTextClass}>{t('profileHeight')}</dt>
            <dd className="font-medium text-ui-fg-base">{t('cmUnit', { value: profile.heightCm })}</dd>
          </div>
        )}
        {profile.experienceLevel && (
          <div>
            <dt className={mutedTextClass}>{t('profileExperience')}</dt>
            <dd className="font-medium text-ui-fg-base">{experienceLevelLabel(profile.experienceLevel)}</dd>
          </div>
        )}
        {focusLabels.length > 0 && (
          <div className="col-span-2 sm:col-span-3">
            <dt className={mutedTextClass}>{t('profileFocus')}</dt>
            <dd className="mt-1 flex flex-wrap gap-1.5">
              {focusLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-accent/30 bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent-warm"
                >
                  {label}
                </span>
              ))}
            </dd>
          </div>
        )}
        {profile.goals && (
          <div className="col-span-2 sm:col-span-3">
            <dt className={mutedTextClass}>{t('profileGoals')}</dt>
            <dd className="mt-0.5 text-ui-fg-base">{profile.goals}</dd>
          </div>
        )}
      </dl>
    </Surface>
  )
}
