'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { joinClasses } from '@/lib/class-names'

export function AppNav({ active }: { active: 'training' | 'progress' }) {
  const t = useTranslations('nav')

  const linkClass = (isActive: boolean) =>
    joinClasses(
      'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
      isActive
        ? 'bg-accent-soft text-accent-warm border border-accent/30'
        : 'text-ui-fg-muted hover:bg-ui-bg-subtle hover:text-ui-fg-base',
    )

  return (
    <nav className="mb-5 flex gap-2" aria-label={t('mainNav')}>
      <Link href="/" className={linkClass(active === 'training')}>
        {t('training')}
      </Link>
      <Link href="/progress" className={linkClass(active === 'progress')}>
        {t('progress')}
      </Link>
    </nav>
  )
}
