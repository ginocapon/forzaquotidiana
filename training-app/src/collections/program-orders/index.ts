import type { CollectionConfig } from 'payload'

import { isAdmin } from '../../access'

export const ProgramOrders: CollectionConfig = {
  slug: 'program-orders',
  admin: {
    useAsTitle: 'stripeSessionId',
    defaultColumns: ['email', 'product', 'status', 'amountCents', 'createdAt'],
    group: 'Sales',
  },
  access: {
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'program-products',
      required: true,
      label: 'Product',
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      label: 'Client',
      admin: { position: 'sidebar' },
    },
    {
      name: 'assignedPlan',
      type: 'relationship',
      relationTo: 'plans',
      label: 'Assigned plan',
      admin: { position: 'sidebar' },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Buyer email',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'amountCents',
      type: 'number',
      label: 'Amount (cents)',
      admin: { position: 'sidebar' },
    },
    {
      name: 'currency',
      type: 'text',
      label: 'Currency',
      admin: { position: 'sidebar' },
    },
    {
      name: 'stripeSessionId',
      type: 'text',
      unique: true,
      index: true,
      label: 'Stripe session ID',
    },
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      label: 'Stripe payment intent',
    },
    {
      name: 'fulfillmentNote',
      type: 'textarea',
      label: 'Fulfillment note',
      admin: {
        description: 'e.g. temporary password for newly created client accounts',
      },
    },
  ],
}
