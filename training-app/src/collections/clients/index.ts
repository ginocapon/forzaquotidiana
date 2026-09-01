import type { CollectionConfig } from 'payload'
import { isAdmin, adminOrSelf, isAdminField } from '../../access'
import { validatePassword } from '../../lib/validate-password'
import {
  EXPERIENCE_LEVEL_OPTIONS,
  TRAINING_FOCUS_OPTIONS,
} from '@/modules/training/clients/constants'

export const Clients: CollectionConfig = {
  slug: 'clients',
  auth: {
    tokenExpiration: 60 * 60 * 2,
    maxLoginAttempts: 5,
    lockTime: 1000 * 60 * 10,
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'experienceLevel', 'weightKg'],
    group: 'Accounts',
    components: {
      beforeList: [
        {
          path: '@/modules/training/admin/coach-alerts/coach-alerts',
          exportName: 'CoachAlertsList',
        },
      ],
      views: {
        edit: {
          progress: {
            Component: {
              path: '@/modules/training/admin/client-progress/client-progress',
              exportName: 'ClientProgressView',
            },
            path: '/progress',
            tab: {
              label: 'Progress',
              href: '/progress',
            },
          },
        },
      },
    },
  },
  access: {
    create: isAdmin,
    read: adminOrSelf,
    update: adminOrSelf,
    delete: isAdmin,
    admin: () => false,
  },
  hooks: {
    beforeValidate: [validatePassword],
  },
  versions: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full name',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'birthDate',
          type: 'date',
          label: 'Date of birth',
          admin: {
            width: '33%',
            date: { pickerAppearance: 'dayOnly' },
            description: 'Used to calculate age in the athlete app',
          },
          access: {
            update: isAdminField,
          },
        },
        {
          name: 'weightKg',
          type: 'number',
          label: 'Weight (kg)',
          min: 20,
          max: 300,
          admin: { width: '33%' },
        },
        {
          name: 'heightCm',
          type: 'number',
          label: 'Height (cm)',
          min: 100,
          max: 250,
          admin: { width: '34%' },
          access: {
            update: isAdminField,
          },
        },
      ],
    },
    {
      name: 'experienceLevel',
      type: 'select',
      label: 'Experience level',
      options: [...EXPERIENCE_LEVEL_OPTIONS],
      admin: { position: 'sidebar' },
      access: {
        update: isAdminField,
      },
    },
    {
      name: 'trainingFocus',
      type: 'select',
      hasMany: true,
      label: 'Training focus',
      options: [...TRAINING_FOCUS_OPTIONS],
      admin: {
        position: 'sidebar',
        description: 'Primary training goals for program design',
      },
      access: {
        update: isAdminField,
      },
    },
    {
      name: 'goals',
      type: 'textarea',
      label: 'Goals',
      admin: {
        description: 'Free-text goals visible to the athlete',
      },
      access: {
        update: isAdminField,
      },
    },
    {
      name: 'plans',
      type: 'join',
      collection: 'plans',
      on: 'client',
      label: "Client's plans",
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Trainer notes',
      access: {
        read: isAdminField,
        update: isAdminField,
      },
    },
    {
      name: 'progressSummary',
      type: 'ui',
      label: 'Progress snapshot',
      admin: {
        components: {
          Field: {
            path: '@/modules/training/admin/client-progress/client-progress',
            exportName: 'ClientProgressSummary',
          },
        },
      },
    },
  ],
}
