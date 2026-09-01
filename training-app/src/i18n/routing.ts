import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['it', 'pl', 'en'],
  defaultLocale: 'it',
  localePrefix: 'as-needed',
})
