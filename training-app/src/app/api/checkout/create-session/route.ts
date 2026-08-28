import { headers as getHeaders } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { getBaseUrl, getStripe, isStripeConfigured } from '@/lib/stripe'

type CheckoutBody = {
  productSlug?: string
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'Stripe is not configured on this server.' },
      { status: 503 },
    )
  }

  let body: CheckoutBody
  try {
    body = (await request.json()) as CheckoutBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body.productSlug) {
    return NextResponse.json({ error: 'productSlug is required' }, { status: 400 })
  }

  const headers = await getHeaders()
  const payload = await getPayload({ config: await config })
  const { user } = await payload.auth({ headers })

  const products = await payload.find({
    collection: 'program-products',
    where: {
      and: [{ slug: { equals: body.productSlug } }, { published: { equals: true } }],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const product = products.docs[0]
  if (!product) {
    return NextResponse.json({ error: 'Program not found' }, { status: 404 })
  }

  const baseUrl = getBaseUrl()
  const stripe = getStripe()
  const clientId = user?.collection === 'clients' ? String(user.id) : undefined
  const customerEmail = user?.collection === 'clients' ? user.email : undefined

  const lineItems = product.stripePriceId
    ? [{ price: product.stripePriceId, quantity: 1 }]
    : [
        {
          price_data: {
            currency: product.currency ?? 'eur',
            product_data: {
              name: product.title,
              description: product.shortDescription ?? undefined,
            },
            unit_amount: product.priceCents,
          },
          quantity: 1,
        },
      ]

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    success_url: `${baseUrl}/programmi/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/programmi/${product.slug}`,
    customer_email: customerEmail ?? undefined,
    metadata: {
      productId: String(product.id),
      clientId: clientId ?? '',
    },
  })

  const clientRef = clientId != null ? Number(clientId) : undefined

  await payload.create({
    collection: 'program-orders',
    data: {
      product: product.id,
      client: Number.isFinite(clientRef) ? clientRef : undefined,
      email: customerEmail ?? `checkout+${session.id}@pending.local`,
      status: 'pending',
      amountCents: product.priceCents,
      currency: product.currency ?? 'eur',
      stripeSessionId: session.id,
    },
    overrideAccess: true,
  })

  if (!session.url) {
    return NextResponse.json({ error: 'Unable to create checkout session' }, { status: 500 })
  }

  return NextResponse.json({ url: session.url })
}
