import type { Handler } from '@netlify/functions'
import Stripe from 'stripe'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-10-28.acacia',
})

// Init Firebase Admin (only once)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore()

function getPlanFromPriceId(priceId: string): 'pro' | 'business' | 'free' {
  const proPriceIds = [process.env.STRIPE_PRO_PRICE_ID, 'price_pro_monthly'].filter(Boolean)
  const businessPriceIds = [process.env.STRIPE_BUSINESS_PRICE_ID, 'price_business_monthly'].filter(Boolean)

  if (proPriceIds.includes(priceId)) return 'pro'
  if (businessPriceIds.includes(priceId)) return 'business'
  return 'free'
}

export const handler: Handler = async (event) => {
  const sig = event.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret) {
    return { statusCode: 400, body: 'Missing Stripe signature or webhook secret' }
  }

  let stripeEvent: Stripe.Event

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body ?? '',
      sig,
      webhookSecret
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed'
    console.error('Webhook signature error:', message)
    return { statusCode: 400, body: `Webhook Error: ${message}` }
  }

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.firebaseUserId

        if (!userId) break

        // Retrieve the subscription to get the price
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          const priceId = subscription.items.data[0]?.price.id
          const plan = getPlanFromPriceId(priceId)

          await db.collection('proofstack_users').doc(userId).update({
            plan,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            updatedAt: FieldValue.serverTimestamp(),
          })

          console.log(`Updated user ${userId} to plan: ${plan}`)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = stripeEvent.data.object as Stripe.Subscription
        const userId = subscription.metadata?.firebaseUserId

        if (!userId) break

        const priceId = subscription.items.data[0]?.price.id
        const plan = getPlanFromPriceId(priceId)
        const isActive = subscription.status === 'active' || subscription.status === 'trialing'

        await db.collection('proofstack_users').doc(userId).update({
          plan: isActive ? plan : 'free',
          stripeSubscriptionId: subscription.id,
          updatedAt: FieldValue.serverTimestamp(),
        })

        console.log(`Subscription updated for user ${userId}: ${plan} (${subscription.status})`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object as Stripe.Subscription
        const userId = subscription.metadata?.firebaseUserId

        if (!userId) break

        await db.collection('proofstack_users').doc(userId).update({
          plan: 'free',
          stripeSubscriptionId: FieldValue.delete(),
          updatedAt: FieldValue.serverTimestamp(),
        })

        console.log(`Subscription cancelled for user ${userId}, reverted to free`)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = stripeEvent.data.object as Stripe.Invoice
        console.warn(`Payment failed for customer ${invoice.customer}`)
        // Could send email notification here
        break
      }

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`)
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Handler error'
    console.error('Webhook handler error:', message)
    return { statusCode: 500, body: message }
  }
}
