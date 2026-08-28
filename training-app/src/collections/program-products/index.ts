import type { CollectionConfig } from 'payload'

import { isAdmin, publicOrAdminRead } from './access'

export const ProgramProducts: CollectionConfig = {
  slug: 'program-products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'priceCents', 'published', 'updatedAt'],
    group: 'Sales',
  },
  access: {
    create: isAdmin,
    read: publicOrAdminRead,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'URL slug',
      admin: { description: 'Used in /programmi/[slug]' },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      label: 'Published',
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured',
      admin: { position: 'sidebar' },
    },
    {
      name: 'priceCents',
      type: 'number',
      required: true,
      min: 0,
      label: 'Price (cents)',
      admin: {
        position: 'sidebar',
        description: 'e.g. 4900 = €49.00',
      },
    },
    {
      name: 'currency',
      type: 'select',
      defaultValue: 'eur',
      label: 'Currency',
      options: [
        { label: 'EUR', value: 'eur' },
        { label: 'PLN', value: 'pln' },
        { label: 'USD', value: 'usd' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'stripePriceId',
      type: 'text',
      label: 'Stripe Price ID',
      admin: {
        position: 'sidebar',
        description: 'Optional — if set, checkout uses this Stripe price instead of ad-hoc amount',
      },
    },
    {
      name: 'templatePlan',
      type: 'relationship',
      relationTo: 'plans',
      required: true,
      label: 'Template plan',
      admin: {
        description: 'Plan cloned and assigned to the buyer after successful payment',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Short description',
      admin: { description: 'Shown on catalog cards' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Full description',
    },
    {
      name: 'durationWeeks',
      type: 'number',
      min: 1,
      label: 'Duration (weeks)',
      admin: { position: 'sidebar' },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover image',
      admin: { position: 'sidebar' },
    },
  ],
}
