import type { CollectionConfig } from 'payload'
import { adminOrOwnByClient } from '../../access'

export const BodyWeightLogs: CollectionConfig = {
  slug: 'body-weight-logs',
  admin: {
    useAsTitle: 'recordedAt',
    defaultColumns: ['recordedAt', 'weightKg', 'client'],
    group: 'Training log',
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: adminOrOwnByClient,
    update: adminOrOwnByClient,
    delete: adminOrOwnByClient,
  },
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        if (req.user?.collection === 'clients') {
          data.client = req.user.id
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      label: 'Client',
      defaultValue: ({ user }) => (user?.collection === 'clients' ? user.id : undefined),
    },
    {
      name: 'recordedAt',
      type: 'date',
      label: 'Date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'weightKg',
      type: 'number',
      label: 'Weight (kg)',
      required: true,
      min: 20,
      max: 300,
    },
    {
      name: 'note',
      type: 'text',
      label: 'Note',
    },
  ],
}
