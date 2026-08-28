import 'server-only'

import crypto from 'node:crypto'

import type { Payload } from 'payload'

import { clonePlanForClient } from '@/modules/training/plans/server/clone-plan'

type FulfillProgramOrderInput = {
  productId: number | string
  email: string
  clientId?: number | string
  stripeSessionId: string
  stripePaymentIntentId?: string | null
  amountCents?: number | null
  currency?: string | null
}

export async function fulfillProgramOrder(
  payload: Payload,
  input: FulfillProgramOrderInput,
): Promise<{ orderId: number | string; clientId: number | string; planId: number | string }> {
  const existingOrder = await payload.find({
    collection: 'program-orders',
    where: { stripeSessionId: { equals: input.stripeSessionId } },
    limit: 1,
    overrideAccess: true,
  })

  if (existingOrder.docs[0]?.status === 'paid') {
    const order = existingOrder.docs[0]
    return {
      orderId: order.id,
      clientId:
        typeof order.client === 'object' ? order.client!.id : (order.client as number | string),
      planId:
        typeof order.assignedPlan === 'object'
          ? order.assignedPlan!.id
          : (order.assignedPlan as number | string),
    }
  }

  const product = await payload.findByID({
    collection: 'program-products',
    id: input.productId,
    depth: 1,
    overrideAccess: true,
  })

  const templatePlanId =
    typeof product.templatePlan === 'object' ? product.templatePlan.id : product.templatePlan

  let clientId = input.clientId
  let fulfillmentNote: string | undefined

  if (!clientId) {
    const existingClient = await payload.find({
      collection: 'clients',
      where: { email: { equals: input.email } },
      limit: 1,
      overrideAccess: true,
    })

    if (existingClient.docs[0]) {
      clientId = existingClient.docs[0].id
    } else {
      const tempPassword = crypto.randomBytes(6).toString('base64url')
      const createdClient = await payload.create({
        collection: 'clients',
        data: {
          email: input.email,
          password: tempPassword,
          name: input.email.split('@')[0],
        },
        overrideAccess: true,
      })
      clientId = createdClient.id
      fulfillmentNote = `New client account created. Temporary password: ${tempPassword} — share securely with the athlete.`
    }
  } else {
    await payload.findByID({
      collection: 'clients',
      id: clientId,
      depth: 0,
      overrideAccess: true,
    })
  }

  const { planId } = await clonePlanForClient(payload, templatePlanId, {
    title: product.title,
    clientId,
    sourceProductId: product.id,
  })

  let orderId: number | string

  const numericClientId = Number(clientId)
  const numericPlanId = Number(planId)

  if (existingOrder.docs[0]) {
    orderId = existingOrder.docs[0].id
  } else {
    const createdOrder = await payload.create({
      collection: 'program-orders',
      data: {
        product: product.id,
        client: Number.isFinite(numericClientId) ? numericClientId : undefined,
        assignedPlan: Number.isFinite(numericPlanId) ? numericPlanId : undefined,
        email: input.email,
        status: 'pending',
        amountCents: input.amountCents ?? product.priceCents,
        currency: input.currency ?? product.currency ?? 'eur',
        stripeSessionId: input.stripeSessionId,
        stripePaymentIntentId: input.stripePaymentIntentId ?? undefined,
      },
      overrideAccess: true,
    })
    orderId = createdOrder.id
  }

  await payload.update({
    collection: 'program-orders',
    id: orderId,
    data: {
      status: 'paid',
      client: Number.isFinite(numericClientId) ? numericClientId : undefined,
      assignedPlan: Number.isFinite(numericPlanId) ? numericPlanId : undefined,
      email: input.email,
      stripePaymentIntentId: input.stripePaymentIntentId ?? undefined,
      fulfillmentNote,
    },
    overrideAccess: true,
  })

  return { orderId, clientId: clientId!, planId }
}
