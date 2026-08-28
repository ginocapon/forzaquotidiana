import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import type Stripe from 'stripe'

import config from '@/payload.config'
import { getStripe, getStripeWebhookSecret, isStripeConfigured } from '@/lib/stripe'
import { fulfillProgramOrder } from '@/modules/sales/server/fulfill-program-order'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const body = await request.text()
  const stripe = getStripe()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, getStripeWebhookSecret())
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid webhook signature'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const productId = session.metadata?.productId
  const clientId = session.metadata?.clientId || undefined

  if (!productId || !session.id) {
    return NextResponse.json({ error: 'Missing checkout metadata' }, { status: 400 })
  }

  const email = session.customer_details?.email ?? session.customer_email
  if (!email) {
    return NextResponse.json({ error: 'Missing customer email' }, { status: 400 })
  }

  const payload = await getPayload({ config: await config })

  await fulfillProgramOrder(payload, {
    productId,
    email,
    clientId: clientId || undefined,
    stripeSessionId: session.id,
    stripePaymentIntentId:
      typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id,
    amountCents: session.amount_total ?? undefined,
    currency: session.currency ?? undefined,
  })

  return NextResponse.json({ received: true })
}
